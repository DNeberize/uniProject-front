import type { Area } from 'react-easy-crop'

/** Output edge in px: plenty for an 80px avatar on retina screens, and keeps uploads small */
const OUTPUT_SIZE = 512

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('could not load the image to crop'))
    image.src = src
  })
}

/** Cuts `area` (in source-image pixels, as react-easy-crop reports it) out of `src` as a square JPEG file. */
export async function cropToSquare(src: string, area: Area, name = 'avatar.jpg') {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = Math.min(OUTPUT_SIZE, Math.round(area.width))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas 2d context unavailable')

  // JPEG has no transparency: give see-through PNGs a white background instead of black
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
  if (!blob) throw new Error('could not encode the cropped image')
  return new File([blob], name, { type: 'image/jpeg' })
}
