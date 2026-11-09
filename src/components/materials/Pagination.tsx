type PaginationProps = {
  /** Zero-based, like the API */
  page: number
  totalPages: number
  onChange: (page: number) => void
}

/** "← page 2 / 5 →" pager, styled like the page turner on the material details sheet. */
export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const go = (next: number) => {
    onChange(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const arrowClass =
    'grid h-9 w-9 cursor-pointer place-items-center rounded border border-outline bg-surface-container-lowest text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline'

  return (
    <nav aria-label="გვერდები" className="mt-space-xl flex items-center justify-center gap-space-md">
      <button type="button" className={arrowClass} disabled={page <= 0} onClick={() => go(page - 1)} aria-label="წინა გვერდი">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      </button>
      <span className="font-code text-code-sm text-on-surface-variant">
        გვერდი <span className="font-semibold text-ink">{page + 1}</span> / {totalPages}
      </span>
      <button
        type="button"
        className={arrowClass}
        disabled={page >= totalPages - 1}
        onClick={() => go(page + 1)}
        aria-label="შემდეგი გვერდი"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </button>
    </nav>
  )
}
