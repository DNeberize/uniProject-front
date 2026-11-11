import { useEffect, useState } from 'react'

/**
 * Resolves once the page has had its first contentful paint (immediately if it already happened, after 1s at most).
 * Used to start downloads the first screen does not need to draw (pdf.js, avatar photos from S3)
 * only after it is on screen, so they don't compete with it.
 */
export const afterFirstPaint: Promise<void> = new Promise((resolve) => {
  if (!('PerformanceObserver' in window) || !PerformanceObserver.supportedEntryTypes?.includes('paint')) return resolve()
  const observer = new PerformanceObserver((list) => {
    if (list.getEntriesByName('first-contentful-paint').length) done()
  })
  const timer = setTimeout(() => done(), 1000)
  const done = () => {
    observer.disconnect()
    clearTimeout(timer)
    resolve()
  }
  observer.observe({ type: 'paint', buffered: true })
})

let painted = false
void afterFirstPaint.then(() => (painted = true))

/** false until the first contentful paint, then true */
export function useAfterFirstPaint() {
  const [done, setDone] = useState(painted)
  useEffect(() => {
    if (done) return
    let active = true
    void afterFirstPaint.then(() => active && setDone(true))
    return () => {
      active = false
    }
  }, [done])
  return done
}
