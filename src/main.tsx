import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from './router.tsx'

// Faces used on first paint. The sample text makes the browser fetch the right
// unicode-range subset (Latin vs Georgian) instead of only the first one.
const FONTS: [font: string, sample: string][] = [
  ['400 16px Geist', 'Aa'],
  ['600 16px Geist', 'Aa'],
  ['400 16px "Geist Mono"', 'A0'],
  ['400 16px "Noto Sans Georgian"', 'აბ'],
  ['600 16px "Noto Sans Georgian"', 'აბ'],
  ['600 16px "Noto Serif Georgian"', 'აბ'],
  ['700 16px "Noto Serif Georgian"', 'აბ'],
  ['500 16px Caveat', 'Aa'],
  ['24px "Material Symbols Outlined"', 'search'],
]

const loadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })

// Wait for fonts and the logo before the first render so nothing reflows on load.
// Capped so a slow or offline font CDN never keeps the page blank.
async function assetsReady(timeoutMs = 3000) {
  const assets = Promise.allSettled([
    ...FONTS.map(([font, sample]) => document.fonts.load(font, sample)),
    loadImage('/logo.png'),
  ])
  await Promise.race([assets, new Promise((resolve) => setTimeout(resolve, timeoutMs))])
}

assetsReady().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
