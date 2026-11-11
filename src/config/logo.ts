// The header logo is shown 32px tall (36px from `sm`), so the browser picks the WebP that matches the
// screen's pixel density instead of the 144px PNG (17 KB). Keep in sync with the preload in index.html.
export const LOGO = {
  src: '/logo-72.webp',
  srcSet: '/logo-36.webp 36w, /logo-72.webp 72w, /logo-108.webp 108w',
  sizes: '(min-width: 640px) 36px, 32px',
}
