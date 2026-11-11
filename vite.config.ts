import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { devAuth } from './dev-auth.ts'

/**
 * Puts the entry stylesheet straight into index.html (build only). It's small (~16 KB gzipped) and
 * every page needs it before it can paint, so a separate render-blocking request only adds a round trip.
 * Asset URLs inside it (fonts) are absolute, so they still resolve from the inlined copy.
 */
function inlineEntryCss(): Plugin {
  return {
    name: 'inline-entry-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        return html.replace(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g, (tag, fileName: string) => {
          const asset = bundle[fileName]
          if (asset?.type !== 'asset') return tag
          delete bundle[fileName] // nothing else references it
          return `<style>${String(asset.source)}</style>`
        })
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix: also load the non-VITE_ dev secrets, they stay on the dev server and never reach the bundle
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      inlineEntryCss(),
      devAuth({
        backendUrl: env.BACKEND_URL || 'https://backend.chemilabi.trade',
        username: env.DEV_AUTH_USERNAME,
        password: env.DEV_AUTH_PASSWORD,
      }),
    ],
  }
})
