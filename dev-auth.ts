import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'

// Dev-only: lets `npm run dev` on localhost talk to the protected backend.
//
// In production nginx and the Spring gateway send you through Keycloak and the
// gateway sets an HttpOnly `SESSION` cookie on `.chemilabi.trade`, which a page on
// localhost can never receive. Instead, Vite proxies `/api` to the backend and
// this plugin attaches a valid session to every proxied request, either by
// signing in to Keycloak itself (DEV_AUTH_USERNAME / DEV_AUTH_PASSWORD) or by using

export interface DevAuthOptions {
  backendUrl: string
  username?: string
  password?: string
  session?: string
}

type Cookie = { name: string; value: string; domain: string }

// Just enough of a cookie jar for the Keycloak redirect dance
class CookieJar {
  private cookies: Cookie[] = []

  store(url: URL, response: Response) {
    for (const header of response.headers.getSetCookie()) {
      const [pair, ...attributes] = header.split(';')
      const separator = pair.indexOf('=')
      const name = pair.slice(0, separator).trim()
      const value = pair.slice(separator + 1).trim()
      const domainAttr = attributes.map((a) => a.trim()).find((a) => /^domain=/i.test(a))
      const domain = domainAttr ? domainAttr.slice(7).replace(/^\./, '') : url.hostname
      this.cookies = this.cookies.filter((c) => !(c.name === name && c.domain === domain))
      if (value) this.cookies.push({ name, value, domain })
    }
  }

  header(url: URL) {
    return this.cookies
      .filter((c) => url.hostname === c.domain || url.hostname.endsWith(`.${c.domain}`))
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')
  }

  get(name: string) {
    return this.cookies.find((c) => c.name === name)?.value
  }
}

// Fetches `url`, following redirects by hand so cookies set along the way are kept
async function follow(jar: CookieJar, url: URL, init: RequestInit = {}, maxHops = 10) {
  let response: Response
  for (let hop = 0; ; hop++) {
    response = await fetch(url, {
      ...init,
      redirect: 'manual',
      headers: { ...init.headers, cookie: jar.header(url) },
    })
    jar.store(url, response)
    const location = response.headers.get('location')
    if (response.status < 300 || response.status >= 400 || !location || hop >= maxHops) break
    url = new URL(location, url)
    init = {}
  }
  return { response, url }
}

const decodeHtml = (s: string) => s.replace(/&amp;/g, '&')

async function signIn({ backendUrl, username, password }: DevAuthOptions) {
  const jar = new CookieJar()

  // 1. Start the gateway's OAuth flow; it lands on the Keycloak login page
  const login = await follow(jar, new URL('/oauth2/authorization/keycloak', backendUrl))
  const html = await login.response.text()
  const action = html.match(/<form[^>]*id="kc-form-login"[^>]*action="([^"]+)"/)?.[1]
  if (!action) throw new Error(`no Keycloak login form at ${login.url}`)

  // 2. Submit credentials; Keycloak redirects back to the gateway, which sets SESSION
  const result = await follow(jar, new URL(decodeHtml(action)), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: username!, password: password!, credentialId: '' }),
  })
  if (result.url.hostname === new URL(action).hostname && result.response.status === 200) {
    throw new Error('Keycloak rejected the credentials (or asked for an extra step)')
  }

  const session = jar.get('SESSION')
  if (!session) throw new Error('signed in, but the gateway did not set a SESSION cookie')
  return session
}

export function devAuth(options: DevAuthOptions): Plugin {
  const canSignIn = Boolean(options.username && options.password)
  let session: Promise<string> | undefined = options.session
    ? Promise.resolve(options.session)
    : undefined

  const getSession = () => {
    if (!session) {
      session = signIn(options).then(
        (value) => {
          console.log('[dev-auth] signed in to Keycloak as', options.username)
          return value
        },
        (error: unknown) => {
          session = undefined
          throw error
        },
      )
    }
    return session
  }

  return {
    name: 'dev-auth',
    apply: 'serve',

    config: () => ({
      server: {
        proxy: {
          '/api': {
            target: options.backendUrl,
            changeOrigin: true,
            configure: (proxy) => {
              // An expired session comes back as 401: drop it so the next call signs in again
              proxy.on('proxyRes', (res) => {
                if (res.statusCode === 401 && canSignIn) session = undefined
              })
            },
          },
        },
      },
    }),

    // Runs before Vite's own middlewares, so headers are set before the proxy forwards them
    configureServer(server) {
      if (!canSignIn && !options.session) {
        console.warn('[dev-auth] no credentials in .env.local, /api calls will get 401. See .env.example')
        return
      }

      server.middlewares.use(async (req: IncomingMessage, res, next) => {
        if (!req.url?.startsWith('/api')) return next()
        try {
          req.headers.cookie = `SESSION=${await getSession()}`
          // Spring rejects requests from origins it doesn't know; to the backend this is server-to-server
          delete req.headers.origin
          delete req.headers.referer
          next()
        } catch (error) {
          console.error('[dev-auth] sign-in failed:', error instanceof Error ? error.message : error)
          res.statusCode = 502
          res.end('dev-auth: could not sign in to Keycloak, see the Vite terminal')
        }
      })
    },
  }
}
