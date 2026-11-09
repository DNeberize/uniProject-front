type TagFilterProps = {
  tags: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  const toggle = (tag: string) =>
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag])

  const chipClass = (active: boolean) =>
    [
      'cursor-pointer rounded-full border px-space-md py-1.5 font-label text-label-md transition-[background-color,border-color,color,rotate]',
      active
        ? 'border-ink bg-sticky text-on-sticky -rotate-2'
        : 'border-outline bg-surface-container-lowest text-on-surface-variant hover:-rotate-1 hover:border-ink hover:text-ink',
    ].join(' ')

  return (
    <div className="flex flex-wrap items-center gap-space-sm" role="group" aria-label="თაგები">
      <span className="mr-space-xs font-hand text-[22px] text-pen">თაგები:</span>
      <button type="button" aria-pressed={selected.length === 0} onClick={() => onChange([])} className={chipClass(selected.length === 0)}>
        ყველა
      </button>
      {tags.map((tag) => (
        <button key={tag} type="button" aria-pressed={selected.includes(tag)} onClick={() => toggle(tag)} className={chipClass(selected.includes(tag))}>
          #{tag}
        </button>
      ))}
    </div>
  )
}
