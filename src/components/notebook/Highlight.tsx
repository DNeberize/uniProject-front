import type { ReactNode } from 'react'

/** Yellow highlighter swipe behind inline text. */
export default function Highlight({ children }: { children: ReactNode }) {
  return <mark className="highlight">{children}</mark>
}
