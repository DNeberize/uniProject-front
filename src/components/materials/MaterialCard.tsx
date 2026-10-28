import { Link } from 'react-router'
import { materialPath } from '../../config/routes.ts'
import type { MaterialSummary } from '../../mocks/materials.ts'
import Tape from '../notebook/Tape.tsx'
import LikeButton from './LikeButton.tsx'

const dateFormat = new Intl.DateTimeFormat('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' })

// Cards sit slightly crooked on the page, like sheets dropped on a desk; they straighten on hover.
const TILTS = ['-rotate-[0.6deg]', 'rotate-[0.5deg]', 'rotate-[0.3deg]', '-rotate-[0.4deg]']

type MaterialCardProps = {
  material: MaterialSummary
  index?: number
}

export default function MaterialCard({ material, index = 0 }: MaterialCardProps) {
  return (
    <article
      className={`sheet rise group flex flex-col p-space-lg pt-space-xl transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 ${TILTS[index % TILTS.length]}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Tape
        variant={index % 2 ? 'striped' : 'plain'}
        className={`-top-3 left-1/2 w-20 -translate-x-1/2 ${index % 2 ? 'rotate-3' : '-rotate-2'}`}
      />

      <div className="flex items-center justify-between gap-space-sm">
        <span className="font-code text-code-sm text-pen">{material.subjectCode}</span>
        <span className="truncate text-body-sm text-secondary">{material.subject}</span>
      </div>

      <h2 className="mt-space-sm font-headline text-headline-sm font-semibold text-ink">
        <Link to={materialPath(material.id)} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4">
          {material.title}
        </Link>
      </h2>

      <ul className="mt-space-md flex flex-wrap gap-space-xs">
        {material.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-primary-container px-2.5 py-0.5 font-label text-label-sm text-on-primary-container">
            #{tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-space-sm border-t border-dashed border-outline pt-space-md">
        <div className="min-w-0">
          <p className="truncate font-label text-label-md text-on-surface">{material.uploader}</p>
          <time dateTime={material.uploadDate} className="text-body-sm text-secondary">
            {dateFormat.format(new Date(material.uploadDate))}
          </time>
        </div>
        <LikeButton initialLiked={material.likedByMe} initialCount={material.likes} className="shrink-0" />
      </div>
    </article>
  )
}
