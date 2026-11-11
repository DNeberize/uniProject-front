type NamedUser = { firstName?: string; lastName?: string; email?: string }

const firstChar = (text: string | undefined) => Array.from(text?.trim() ?? '')[0] ?? ''

/** First letters of first and last name, uppercase ("Davit Neberidze" -> "DN"); falls back to the email's first letter. */
export function userInitials(user: NamedUser) {
  const letters = firstChar(user.firstName) + firstChar(user.lastName) || firstChar(user.email) || '?'
  return letters.toLocaleUpperCase()
}

const DIGIT_COUNT = 8

// hsl -> [r, g, b] in 0..1
function hslToRgb(hue: number, saturation: number, lightness: number) {
  const a = saturation * Math.min(lightness, 1 - lightness)
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12
    return lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [channel(0), channel(8), channel(4)]
}

const toHex = (value: number) =>
  Math.round(value * 255)
    .toString(16)
    .padStart(2, '0')

// FNV-1a over the text, then murmur3's fmix32 so the low bits (used for the hue) are well mixed too:
// without it, short strings that differ in a few digits land on neighbouring hues
function hash(text: string) {
  let value = 0x811c9dc5
  for (const char of text) {
    value ^= char.charCodeAt(0)
    value = Math.imul(value, 0x01000193)
  }
  value ^= value >>> 16
  value = Math.imul(value, 0x85ebca6b)
  value ^= value >>> 13
  value = Math.imul(value, 0xc2b2ae35)
  value ^= value >>> 16
  return value >>> 0
}

const SATURATIONS = [0.5, 0.6, 0.7]
const LIGHTNESSES = [0.36, 0.44, 0.52]

/**
 * A stable colour per user, decided only by the keycloak id: 8 digits picked from its end,
 * last one first ("…-675f93bf5445" -> "54453976"), are hashed, and the hash picks a hue (360 options)
 * plus one of three saturations and three lightnesses, so similar ids still get clearly different
 * colours. Missing digits are 5s. Returns a CSS #RRGGBB colour (no alpha).
 */
export function avatarBackground(keycloakId: string | undefined) {
  const digits = (keycloakId?.match(/\d/g) ?? []).reverse().slice(0, DIGIT_COUNT)
  while (digits.length < DIGIT_COUNT) digits.push('5')
  const value = hash(digits.join(''))
  const hue = value % 360
  const saturation = SATURATIONS[Math.floor(value / 360) % SATURATIONS.length]
  const lightness = LIGHTNESSES[Math.floor(value / 1080) % LIGHTNESSES.length]
  return `#${hslToRgb(hue, saturation, lightness).map(toHex).join('')}`
}

/**
 * Inline style for an initials avatar. The letters are always white; the `avatar-initials` class
 * gives them a dark outline and the circle a sticker-like inner ring, so they stay readable on any colour.
 */
export const avatarColors = (keycloakId: string | undefined) => ({ backgroundColor: avatarBackground(keycloakId) })
