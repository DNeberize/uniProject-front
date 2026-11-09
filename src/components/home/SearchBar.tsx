import { useState, type FormEvent } from 'react'

type SearchBarProps = {
  /** The active query (from the URL); the input resets to it when it changes from outside */
  value: string
  onSearch: (query: string) => void
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [draft, setDraft] = useState(value)
  const [synced, setSynced] = useState(value)

  // The query changed from outside (back button, "clear filters"): show it in the field
  if (value !== synced) {
    setSynced(value)
    setDraft(value)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(draft.trim())
  }

  return (
    <form role="search" onSubmit={onSubmit} className="sheet flex items-center gap-space-sm p-1.5 pl-space-md">
      <span className="material-symbols-outlined text-[22px] text-secondary">search</span>
      <input
        type="search"
        name="q"
        value={draft}
        maxLength={100}
        onChange={(event) => {
          setDraft(event.target.value)
          // Clearing the field (or pressing the native ✕) drops the search right away
          if (!event.target.value && value) onSearch('')
        }}
        aria-label="მასალების ძებნა"
        placeholder="მოძებნე სათაურით ან შინაარსით…"
        className="min-w-0 flex-1 bg-transparent py-2 text-body-lg text-ink placeholder:text-secondary focus:outline-none"
      />
      <button
        type="submit"
        className="btn-press cursor-pointer rounded bg-primary px-space-md py-2 font-label text-label-md font-semibold text-on-primary sm:px-space-lg"
      >
        ძებნა
      </button>
    </form>
  )
}
