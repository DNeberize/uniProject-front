import { useState } from 'react'
import { MATERIAL_TAGS, type MaterialTag } from '../../mocks/materials.ts'

export default function TagFilter() {
  const [selected, setSelected] = useState<MaterialTag[]>([])

  const toggle = (tag: MaterialTag) =>
    setSelected((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]))

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
      <button type="button" aria-pressed={selected.length === 0} onClick={() => setSelected([])} className={chipClass(selected.length === 0)}>
        ყველა
      </button>
      {MATERIAL_TAGS.map((tag) => (
        <button key={tag} type="button" aria-pressed={selected.includes(tag)} onClick={() => toggle(tag)} className={chipClass(selected.includes(tag))}>
          #{tag}
        </button>
      ))}
    </div>
  )
}
