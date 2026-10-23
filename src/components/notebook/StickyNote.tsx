import type { ReactNode } from 'react'
import Tape from './Tape.tsx'

type StickyNoteProps = {
  children: ReactNode
  title?: string
  /** Rotation and size, e.g. "rotate-3 w-56". */
  className?: string
}

/** A yellow sticky note, taped at the top. Good for hints, reminders and empty states. */
export default function StickyNote({ children, title, className = 'rotate-2' }: StickyNoteProps) {
  return (
    <div className={`sticky-note px-space-md pb-space-md pt-7 hover:rotate-0 hover:-translate-y-0.5 ${className}`}>
      <Tape variant="clear" className="-top-3 left-1/2 w-20 -translate-x-1/2 -rotate-3" />
      {title && <p className="mb-2.5 font-label text-[15px] font-semibold">{title}</p>}
      <div className="text-body-md">{children}</div>
    </div>
  )
}
