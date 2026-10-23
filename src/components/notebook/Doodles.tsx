/*
 * Hand-drawn pen doodles. Each path has pathLength="1" so the `.doodle` CSS
 * can draw it in on mount. Colour follows `currentColor` (text-pen, text-primary...).
 * All are decorative and hidden from screen readers.
 */
import type { CSSProperties } from 'react'

type DoodleProps = {
  className?: string
  /** Delay before the stroke starts drawing, in seconds. */
  delay?: number
}

const delayStyle = (delay = 0) => ({ '--draw-delay': `${delay}s` }) as CSSProperties

/** Wobbly red-pen underline. Stretch it under a heading with absolute positioning. */
export function Underline({ className = '', delay = 0.3 }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className={`doodle ${className}`}
      style={{ ...delayStyle(delay), strokeWidth: 3 }}
    >
      <path pathLength={1} d="M3 9c30-5 70-7 110-5 30 1.5 55 4 84-1" />
    </svg>
  )
}

export function Star({ className = '', delay = 0 }: DoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 44 44" className={`doodle ${className}`} style={delayStyle(delay)}>
      <path pathLength={1} d="M22 3l5.5 12.5L41 17l-10 9 3 14-12-7-12 7 3-14-10-9 13.5-1.5z" />
    </svg>
  )
}

export function Bulb({ className = '', delay = 0 }: DoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 92" className={`doodle ${className}`} style={delayStyle(delay)}>
      <path pathLength={1} d="M40 18c-12 0-21 9-21 20 0 8 4 12 8 17 3 3 4 6 4 10h18c0-4 1-7 4-10 4-5 8-9 8-17 0-11-9-20-21-20z" />
      <path pathLength={1} d="M32 72h17M33 79h14M37 86h7" />
      <path pathLength={1} d="M40 64V48m-6-7 6 7 6-7" />
      <path pathLength={1} d="M40 3v8M12 14l6 6M68 14l-6 6M3 40h8M69 40h8" />
    </svg>
  )
}

/** Curved arrow pointing right. Flip with `-scale-x-100` to point left. */
export function Arrow({ className = '', delay = 0 }: DoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 120" className={`doodle ${className}`} style={delayStyle(delay)}>
      <path pathLength={1} d="M8 4c-4 34 10 66 46 84 36 18 86 16 136 0" />
      <path pathLength={1} d="M174 76l17 12-15 14" />
    </svg>
  )
}

/** Hand-drawn checkbox; `checked` draws a tick through it. */
export function Check({ checked = false, className = '', delay = 0 }: DoodleProps & { checked?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className={`doodle ${className}`} style={delayStyle(delay)}>
      <rect x="1.5" y="2" width="14" height="14" rx="2" className="stroke-on-sticky/55" strokeWidth={1.4} />
      {checked && <path pathLength={1} d="M4 9.5l3.5 3.5L16.5 1.5" className="stroke-pen" strokeWidth={2.4} />}
    </svg>
  )
}
