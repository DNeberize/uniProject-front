import { useState } from 'react'

type SortBy = 'date' | 'likes'

const OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'date', label: 'უახლესი' },
  { value: 'likes', label: 'ყველაზე მოწონებული' },
]

export default function SortToggle() {
  const [sortBy, setSortBy] = useState<SortBy>('date')

  return (
    <div role="radiogroup" aria-label="სორტირება" className="flex items-center gap-space-xs">
      {OPTIONS.map((option) => {
        const active = sortBy === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSortBy(option.value)}
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
