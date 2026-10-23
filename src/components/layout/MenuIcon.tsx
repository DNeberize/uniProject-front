/** Three-line burger icon that folds into an X when `open`. The lines are drawn in currentColor. */
export default function MenuIcon({ open }: { open: boolean }) {
  const line = 'absolute left-0.5 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out'

  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
      <span className={`${line} top-[5px] ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
      <span className={`${line} top-[11px] ${open ? 'scale-x-0 opacity-0' : ''}`} />
      <span className={`${line} top-[17px] ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
    </span>
  )
}
