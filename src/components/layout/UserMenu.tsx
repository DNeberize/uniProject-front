import type { UserRole } from '../../api/user.ts'
import { useCurrentUser } from '../../auth/useCurrentUser.ts'

const ROLE_LABELS: Record<UserRole, string> = {
  USER: 'სტუდენტი',
  MODERATOR: 'მოდერატორი',
  ADMIN: 'ადმინისტრატორი',
}

export default function UserMenu() {
  const { status, user } = useCurrentUser()

  return (
    <div className="flex shrink-0 items-center gap-space-sm">
      <div
        title={user?.email}
        className="flex items-center gap-space-sm rounded-full border border-outline-variant bg-surface-container-lowest p-1 md:pl-space-md"
      >
        <div className="hidden flex-col text-right md:flex">
          {user ? (
            <>
              <span className="font-label text-label-md text-on-surface">
                {user.firstName} {user.lastName}
              </span>
              <span className="font-label text-label-sm text-tertiary">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </>
          ) : status === 'loading' ? (
            <div aria-hidden="true" className="flex animate-pulse flex-col items-end gap-1 py-0.5">
              <span className="h-3 w-28 rounded bg-surface-container-high" />
              <span className="h-2.5 w-16 rounded bg-surface-container-high" />
            </div>
          ) : (
            <span className="font-label text-label-md text-secondary">არ ხართ შესული</span>
          )}
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
          className="flex cursor-pointer items-center rounded p-2 text-secondary transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </form>
    </div>
  )
}
