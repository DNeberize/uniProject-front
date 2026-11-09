import type { MaterialSort } from '../../api/materials.ts'

const OPTIONS: { value: MaterialSort; label: string }[] = [
  { value: 'NEWEST', label: 'უახლესი' },
  { value: 'LIKES', label: 'ყველაზე მოწონებული' },
]

type SortToggleProps = {
  value: MaterialSort
  onChange: (value: MaterialSort) => void
}

export default function SortToggle({ value, onChange }: SortToggleProps) {
  return (
    <div role="radiogroup" aria-label="სორტირება" className="flex items-center gap-space-xs">
      {OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded px-space-sm py-1 font-label text-label-md transition-colors ${
              active ? 'font-semibold text-ink' : 'text-secondary hover:text-ink'
            }`}
          >
            {active ? <mark className="highlight">{option.label}</mark> : option.label}
          </button>
        )
      })}
    </div>
  )
}
