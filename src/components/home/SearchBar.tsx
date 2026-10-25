import type { FormEvent } from 'react'

export default function SearchBar() {
  const onSubmit = (event: FormEvent) => event.preventDefault()

  return (
    <form role="search" onSubmit={onSubmit} className="sheet flex items-center gap-space-sm p-1.5 pl-space-md">
      <span className="material-symbols-outlined text-[22px] text-secondary">search</span>
      <input
        type="search"
        name="q"
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
