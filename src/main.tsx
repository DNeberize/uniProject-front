import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { prefetchGet } from './api/client.ts'
import { homeSearch, searchMaterialsPath } from './api/materials.ts'
import { loadCurrentUser } from './auth/useCurrentUser.ts'
import { LOGO } from './config/logo.ts'
import { ROUTES } from './config/routes.ts'
import { prefetchPages, router } from './router.tsx'

// Faces used on first paint. The sample text makes the browser fetch the right
// unicode-range subset (Latin vs Georgian) instead of only the first one.
const FONTS: [font: string, sample: string][] = [
  ['400 16px "Noto Sans Georgian"', 'აბ'],
  ['600 16px "Noto Sans Georgian"', 'აბ'],
  // Latin text (names, emails, numbers) in the main font: its own subset file
  ['400 16px "Noto Sans Georgian"', 'Aa'],
  ['600 16px "Noto Sans Georgian"', 'Aa'],
  ['600 16px "Noto Serif Georgian"', 'აბ'],
  ['700 16px "Noto Serif Georgian"', 'აბ'],
  // Latin in the serif face ("SANGU NoteBase" in the header): its own subset file
  ['700 16px "Noto Serif Georgian"', 'Aa'],
  ['500 16px Caveat', 'Aa'],
]

// Symbol characters (✓ ★ ⏳ → …) live in two extra subsets that would otherwise only load after the first render
// and shift the layout when they arrive. Only pages that show them on their first screen wait for them,
// so other pages don't download them up front.
const SYMBOL_FONTS: [font: string, sample: string][] = [['400 16px "Noto Sans Georgian"', '✓→']]
const PAGES_WITH_SYMBOLS: string[] = [ROUTES.profile]

const ICON_FONT = '24px "Material Symbols Outlined"'

// Start the landing page's API requests now, in parallel with the fonts, instead of after the first render.
// The pages' own calls pick these responses up (prefetchGet), so the data shows up sooner and nothing is fetched twice.
function prefetchLandingData() {
  const { pathname, search } = window.location
  if (pathname === ROUTES.home) {
    prefetchGet('/tags')
    prefetchGet(searchMaterialsPath(homeSearch(new URLSearchParams(search))))
  }
  const material = /^\/materials\/(\d+)\/?$/.exec(pathname)
  if (material) prefetchGet(`/materials/${material[1]}`)
}
prefetchLandingData()

// Start loading the signed-in user now. Only the profile page waits for it before the first render: there
// the profile card would otherwise grow from a skeleton and push the page down. Elsewhere the user only
// fills the fixed header's chip, which moves nothing, so those pages paint without waiting on the API.
const USER_WAIT_MS = 1500
const PAGES_NEEDING_USER: string[] = [ROUTES.profile]
const user = loadCurrentUser().catch(() => {}) // not signed in: the header shows that itself
const userReady = PAGES_NEEDING_USER.includes(window.location.pathname)
  ? Promise.race([user, new Promise((resolve) => setTimeout(resolve, USER_WAIT_MS))])
  : undefined

// Reveal icons only once their font is in, even if that happens after the first render
document.fonts.load(ICON_FONT, 'search').then(
  () => document.documentElement.classList.add('icons-ready'),
  () => {},
)

// Same srcset/sizes as the header, so the browser waits for (and caches) the exact file the header shows
const loadImage = ({ src, srcSet, sizes }: { src: string; srcSet?: string; sizes?: string }) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    if (sizes) img.sizes = sizes
    if (srcSet) img.srcset = srcSet
    img.src = src
  })

// Wait for fonts, the logo (and on the profile page the user) before the first render so nothing reflows on load.
// Capped so a slow or offline network never keeps the page blank.
async function assetsReady(timeoutMs = 3000) {
  const fonts = PAGES_WITH_SYMBOLS.includes(window.location.pathname) ? [...FONTS, ...SYMBOL_FONTS] : FONTS
  const assets = Promise.allSettled([
    ...fonts.map(([font, sample]) => document.fonts.load(font, sample)),
    document.fonts.load(ICON_FONT, 'search'),
    loadImage(LOGO),
    userReady,
  ])
  await Promise.race([assets, new Promise((resolve) => setTimeout(resolve, timeoutMs))])
}

assetsReady().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
  prefetchPages()
})
