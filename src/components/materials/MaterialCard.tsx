import { Link } from 'react-router'
import { uploaderName, type MaterialResponse } from '../../api/materials.ts'
import { materialPath } from '../../config/routes.ts'
import { dateFormat } from '../../utils/format.ts'
import Tape from '../notebook/Tape.tsx'
import UserAvatar from '../UserAvatar.tsx'
import BookmarkButton from './BookmarkButton.tsx'
import LikeButton from './LikeButton.tsx'

// Cards sit slightly crooked on the page, like sheets dropped on a desk; they straighten on hover.
const TILTS = ['-rotate-[0.6deg]', 'rotate-[0.5deg]', 'rotate-[0.3deg]', '-rotate-[0.4deg]']

type MaterialCardProps = {
  material: MaterialResponse
  index?: number
  /** Whether the current user has it bookmarked (true in favorites lists) */
  saved?: boolean
}

export default function MaterialCard({ material, index = 0, saved = false }: MaterialCardProps) {
  return (
    <article
      className={`sheet rise group flex flex-col p-space-lg pt-space-xl transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 ${TILTS[index % TILTS.length]}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Tape
        variant={index % 2 ? 'striped' : 'plain'}
        className={`-top-3 left-1/2 w-20 -translate-x-1/2 ${index % 2 ? 'rotate-3' : '-rotate-2'}`}
      />
      <BookmarkButton initialSaved={saved} />

      <p className="truncate pr-7 font-code text-code-sm text-pen">{material.subjectName}</p>

      <h2 className="mt-space-sm font-headline text-headline-sm font-semibold text-ink">
        <Link
          to={materialPath(material.id)}
          state={{ material }}
          className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4"
        >
          {material.title}
        </Link>
      </h2>

      {material.description && (
        <p className="mt-space-xs line-clamp-2 text-body-md text-on-surface-variant">{material.description}</p>
      )}

      {material.tags.length > 0 && (
        <ul className="mt-space-md flex flex-wrap gap-space-xs">
          {material.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-primary-container px-2.5 py-0.5 font-label text-label-sm text-on-primary-container">
              #{tag}
            </li>
          ))}
        </ul>
      )}

      {/* Pushes the footer to the bottom of the card, but always leaves some air above it */}
      <div aria-hidden="true" className="min-h-space-md flex-1" />

      <div className="flex items-end justify-between gap-space-sm border-t border-dashed border-outline pt-space-md">
        <div className="flex min-w-0 items-center gap-space-sm">
          <UserAvatar user={material.uploader} />
          <div className="min-w-0">
            <p className="truncate font-label text-label-md text-on-surface">{uploaderName(material.uploader)}</p>
            <time dateTime={material.createdAt} className="text-body-sm text-secondary">
              {dateFormat.format(new Date(material.createdAt))}
            </time>
          </div>
        </div>
        <LikeButton
          materialId={material.id}
          initialLiked={material.isLikedByCurrentUser}
          initialCount={material.likesCount}
          className="shrink-0"
        />
      </div>
    </article>
  )
}
