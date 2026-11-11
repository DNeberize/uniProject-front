import { createBrowserRouter } from 'react-router'
import { ROUTES } from './config/routes.ts'
import MainLayout from './layouts/MainLayout.tsx'

// Each page is its own chunk, so the first visit only downloads the page it lands on.
// The router loads a route's chunk before switching to it, so the current page stays on screen meanwhile.
const PAGES = {
  home: () => import('./pages/HomePage.tsx'),
  login: () => import('./pages/LoginPage.tsx'),
  register: () => import('./pages/RegisterPage.tsx'),
  materialDetails: () => import('./pages/MaterialDetailsPage.tsx'),
  upload: () => import('./pages/UploadPage.tsx'),
  favorites: () => import('./pages/FavoritesPage.tsx'),
  moderation: () => import('./pages/ModerationPage.tsx'),
  admin: () => import('./pages/AdminPage.tsx'),
  profile: () => import('./pages/ProfilePage.tsx'),
  notFound: () => import('./pages/NotFoundPage.tsx'),
}

const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    // main.tsx renders once fonts are in, by which time the landing page's chunk has normally arrived too
    HydrateFallback: () => null,
    children: [
      { path: ROUTES.home, lazy: page(PAGES.home) },
      { path: ROUTES.login, lazy: page(PAGES.login) },
      { path: ROUTES.register, lazy: page(PAGES.register) },
      { path: ROUTES.materialDetails, lazy: page(PAGES.materialDetails) },
      { path: ROUTES.upload, lazy: page(PAGES.upload) },
      { path: ROUTES.favorites, lazy: page(PAGES.favorites) },
      { path: ROUTES.moderation, lazy: page(PAGES.moderation) },
      { path: ROUTES.admin, lazy: page(PAGES.admin) },
      { path: ROUTES.profile, lazy: page(PAGES.profile) },
      { path: '*', lazy: page(PAGES.notFound) },
    ],
  },
])

/**
 * Warms up every page chunk after the page has loaded and the browser is idle, so navigating later is as
 * instant as before splitting, without competing with what the first screen needs.
 */
export function prefetchPages() {
  const run = () => Object.values(PAGES).forEach((load) => void load().catch(() => {}))
  const whenIdle = () =>
    setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 4000 }) : run()), 1000)
  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
}
