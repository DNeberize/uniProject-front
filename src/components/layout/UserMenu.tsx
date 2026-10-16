import { MOCK_CURRENT_USER } from '../../mocks/currentUser.ts'

export default function UserMenu() {
  const user = MOCK_CURRENT_USER

  return (
    <div className="flex shrink-0 items-center gap-space-sm">
      <div className="flex items-center gap-space-sm bg-surface-container-low p-1.5 pl-space-sm">
        <div className="hidden flex-col text-right md:flex">
          <span className="font-label text-label-md text-on-surface">{user.email}</span>
          <div className="flex items-center justify-end gap-1">
            <span className="font-label text-label-sm uppercase text-tertiary">{user.roleLabel}</span>
            <span className="font-code text-code-sm text-secondary">({user.group})</span>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
        </div>
      </div>

      <form method="post" action="/logout">
        <button
          type="submit"
          aria-label="გასვლა"
          title="გასვლა"
          className="flex items-center p-2 text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </form>
    </div>
  )
}
