import type { MaterialStatus } from '../../mocks/profile.ts'

export type StatusFilterValue = MaterialStatus | 'ALL'

type StatusFilterProps = {
  value: StatusFilterValue
  counts: Record<StatusFilterValue, number>
  onChange: (value: StatusFilterValue) => void
}

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'ALL', label: 'ყველა' },
  { value: 'APPROVED', label: 'დამტკიცებული' },
  { value: 'PENDING', label: 'მოლოდინში' },
  { value: 'REJECTED', label: 'უარყოფილი' },
]

/** Chips that filter the user's uploads by moderation status. Styled like the upload form's tag chips. */
export default function StatusFilter({ value, counts, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-space-sm">
      <span className="mr-1 font-hand text-[20px] font-bold text-pen">ფილტრი:</span>
      {OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-full border px-3 py-1 font-label text-label-md transition-[background-color,border-color,color,rotate] ${
              active
                ? '-rotate-1 border-primary bg-sticky text-on-sticky'
                : 'border-outline bg-surface-container-low text-on-surface-variant hover:-rotate-1 hover:border-ink hover:text-ink'
            }`}
          >
            {option.label} ({counts[option.value]})
          </button>
        )
      })}
    </div>
  )
}
