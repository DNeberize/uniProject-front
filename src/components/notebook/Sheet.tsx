import type { ReactNode } from 'react'
import Tape from './Tape.tsx'

type SheetProps = {
  children: ReactNode
  /** Tape the two top corners onto the page. */
  taped?: boolean
  className?: string
}

/** A white sheet of paper lying on the dot-grid page. Use it for cards, panels and forms. */
export default function Sheet({ children, taped = false, className = '' }: SheetProps) {
  return (
    <div className={`sheet rise ${className}`}>
      {taped && (
        <>
          <Tape className="-top-3 left-6 -rotate-6" />
          <Tape variant="striped" className="-top-2.5 right-6 w-20 rotate-6" />
        </>
      )}
      {children}
    </div>
  )
}
