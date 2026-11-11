import { customAvatar } from '../api/user.ts'
import { avatarColors, userInitials } from '../utils/avatar.ts'
import { useAfterFirstPaint } from '../utils/firstPaint.ts'

type UserAvatarProps = {
  user: { keycloakId?: string; firstName?: string; lastName?: string; email?: string; avatar?: string }
  /** Size and font size, e.g. "h-8 w-8 text-[13px]" */
  className?: string
}

/** Round avatar: the user's photo if they uploaded one, otherwise their initials on a colour derived from their id. */
export default function UserAvatar({ user, className = 'h-8 w-8 text-[13px]' }: UserAvatarProps) {
  const photo = customAvatar(user)
  // The photo comes from S3 and arrives after the first paint anyway: request it only then, so it doesn't
  // compete with what the first screen needs. Until it loads the circle shows the same empty background as before.
  const painted = useAfterFirstPaint()

  return (
    <span
      aria-hidden="true"
      style={photo ? undefined : avatarColors(user.keycloakId)}
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full font-label font-semibold leading-none select-none ${
        photo ? 'bg-surface-container-high ring-1 ring-outline-variant' : 'avatar-initials'
      } ${className}`}
    >
      {photo ? painted && <img src={photo} alt="" className="h-full w-full object-cover" /> : userInitials(user)}
    </span>
  )
}
