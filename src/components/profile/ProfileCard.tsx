import type { UserRole } from '../../api/user.ts'
import { useCurrentUser } from '../../auth/useCurrentUser.ts'
import { MOCK_PROFILE_DETAILS } from '../../mocks/profile.ts'
import Tape from '../notebook/Tape.tsx'
import AvatarUpload from './AvatarUpload.tsx'

// Same labels as the header's UserMenu
const ROLE_LABELS: Record<UserRole, string> = {
  USER: 'სტუდენტი',
  MODERATOR: 'მოდერატორი',
  ADMIN: 'ადმინისტრატორი',
}

const dateFormat = new Intl.DateTimeFormat('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' })

/** The signed-in user's details on a taped white sheet: avatar, name, role, email, faculty, join date. */
export default function ProfileCard() {
  const { status, user } = useCurrentUser()

  return (
    <div className="sheet rise p-space-lg sm:p-7">
      <Tape className="-top-3 left-1/2 w-24 -translate-x-1/2 -rotate-1" />

      {status === 'loading' ? (
        <div aria-hidden="true" className="flex animate-pulse flex-col items-center gap-5 sm:flex-row sm:items-start">
          <span className="h-20 w-20 shrink-0 rounded-full bg-surface-container-high" />
          <div className="flex flex-1 flex-col items-center gap-3 pt-2 sm:items-start">
            <span className="h-6 w-48 rounded bg-surface-container-high" />
            <span className="h-4 w-40 rounded bg-surface-container-high" />
            <span className="h-4 w-64 rounded bg-surface-container-high" />
          </div>
        </div>
      ) : !user ? (
        <p className="py-space-md text-center font-hand text-[22px] text-secondary">
          პროფილი ვერ ჩაიტვირთა, რადგან არ ხართ შესული
        </p>
      ) : (
        <>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <AvatarUpload user={user} />
              <span
                title="ონლაინ"
                className="pointer-events-none absolute top-[60px] right-0 h-5 w-5 rounded-full border-2 border-white bg-status-approved"
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <h2 className="font-headline text-headline-md font-bold text-ink">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="rounded-full border border-status-pending-border bg-status-pending-bg px-2.5 py-0.5 font-label text-label-sm text-status-pending">
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
                <span className="rounded-full border border-outline-variant bg-surface-container px-2 py-0.5 font-code text-code-sm text-on-surface-variant">
                  ID: #{MOCK_PROFILE_DETAILS.studentId}
                </span>
              </div>

              <p className="mt-1 flex items-center justify-center gap-1.5 text-body-md text-on-surface-variant sm:justify-start">
                <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                <span className="truncate">{user.email}</span>
              </p>

              {/* One fact per line, so long values (faculty names) never squeeze next to each other */}
              <dl className="mt-space-md grid gap-2.5 border-t border-dashed border-outline-variant pt-3.5 text-body-sm">
                <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                  <dt className="shrink-0 whitespace-nowrap font-semibold text-secondary">🏫 ფაკულტეტი:</dt>
                  <dd className="font-semibold text-ink">{MOCK_PROFILE_DETAILS.faculty}</dd>
                </div>
                <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                  <dt className="shrink-0 whitespace-nowrap font-semibold text-secondary">📅 რეგისტრირებულია:</dt>
                  <dd className="font-semibold text-ink">
                    <time dateTime={user.createdAt}>{dateFormat.format(new Date(user.createdAt))}</time>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Spans the whole card (under the avatar too), so both fit side by side; wraps only when the card is narrow */}
          <div className="mt-space-lg flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-dashed border-outline-variant pt-space-md sm:justify-start">
            <button
              type="button"
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border border-outline bg-surface-container-low px-3 py-1.5 font-label text-label-md text-on-surface transition-colors hover:border-ink hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">edit</span>
              პროფილის რედაქტირება
            </button>
            <a href="#" className="shrink-0 whitespace-nowrap font-hand text-[18px] font-bold text-pen hover:underline">
              სასწავლო ბარათის ნახვა →
            </a>
          </div>
        </>
      )}
    </div>
  )
}
