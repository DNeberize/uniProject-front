import { Link } from 'react-router'
import { materialPath } from '../../config/routes.ts'
import type { SavedMaterial } from '../../mocks/profile.ts'
import Tape from '../notebook/Tape.tsx'

const dateFormat = new Intl.DateTimeFormat('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' })

const TILTS = ['-rotate-1', 'rotate-1', '-rotate-[0.5deg]']

/** Small taped card for a bookmarked material. */
export default function SavedMaterialCard({ material, index = 0 }: { material: SavedMaterial; index?: number }) {
  return (
    <article
      className={`sheet rise group flex flex-col p-5 transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 ${TILTS[index % TILTS.length]}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Tape variant="clear" className="-top-2.5 left-1/2 w-14 -translate-x-1/2 rotate-2" />

      <div className="mb-2 flex items-start justify-between">
        <span className="rounded border border-pen/25 bg-pen/5 px-2 py-0.5 font-code text-code-sm font-semibold text-pen">
          {material.subjectCode}
        </span>
        <span title="შენახულია" className="material-symbols-outlined icon-filled text-[18px] text-status-pending">
          bookmark
        </span>
      </div>

      <h3 className="mb-2 line-clamp-2 font-headline text-body-md font-bold text-ink">
        <Link to={materialPath(material.id)} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4">
          {material.title}
        </Link>
      </h3>

      <div className="mt-auto space-y-1 border-t border-dashed border-outline-variant pt-3 text-body-sm text-secondary">
        <p className="flex justify-between gap-2">
          <span>ამტვირთავი:</span>
          <span className="truncate font-medium text-on-surface">{material.uploader}</span>
        </p>
        <p className="flex items-center justify-between gap-2">
          <time dateTime={material.uploadDate}>{dateFormat.format(new Date(material.uploadDate))}</time>
          <span className="font-semibold text-ink">
            <span aria-hidden="true" className="text-status-pending">★</span> {material.rating} ({material.ratingCount})
          </span>
        </p>
      </div>
    </article>
  )
}
