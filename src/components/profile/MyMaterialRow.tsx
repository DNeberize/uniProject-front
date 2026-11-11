import { Link } from 'react-router'
import { materialPath, ROUTES } from '../../config/routes.ts'
import type { MyMaterial } from '../../mocks/profile.ts'
import StatusBadge from '../materials/StatusBadge.tsx'

const dateFormat = new Intl.DateTimeFormat('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' })

/** One of the user's uploads: subject, title, status and, if rejected, the moderator's note. */
export default function MyMaterialRow({ material }: { material: MyMaterial }) {
  const rejected = material.status === 'REJECTED'

  return (
    <li
      className={`-mx-2 rounded-lg px-2 py-4 transition-colors ${
        rejected ? 'my-1 border border-status-rejected-border/60 bg-status-rejected-bg/50 px-3' : 'hover:bg-surface-container-low'
      }`}
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-body-sm text-secondary">
            <span className="rounded border border-pen/25 bg-pen/5 px-2 py-0.5 font-code text-code-sm font-semibold text-pen">
              {material.subjectCode}
            </span>
            <span className="font-semibold">{material.subject}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={material.uploadDate}>{dateFormat.format(new Date(material.uploadDate))}</time>
          </div>

          <h3 className="font-headline text-headline-sm font-bold text-ink">
            <Link to={materialPath(material.id)} className="transition-colors hover:text-primary">
              {material.title}
            </Link>
          </h3>

          {rejected && material.rejectionReason && (
            <div className="mt-2.5 inline-flex items-start gap-2 rounded border-l-4 border-primary bg-white/90 px-3 py-1.5 shadow-sm">
              <span aria-hidden="true" className="text-body-md">⚠️</span>
              <div>
                <p className="font-label text-label-sm uppercase text-primary">მოდერატორის შენიშვნა:</p>
                <p className="text-body-sm font-medium text-on-error-container">მიზეზი: {material.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-start gap-3 self-start">
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={material.status} />

            {material.status === 'PENDING' && (
              <p className="font-hand text-[18px] font-bold text-pen">ელოდება მოდერატორს ✎</p>
            )}
            {rejected && (
              <Link to={ROUTES.upload} className="font-label text-label-md text-primary hover:underline">
                ხელახლა ატვირთვა →
              </Link>
            )}
          </div>

          {!rejected && (
            <button
              type="button"
              aria-label="მენიუ"
              title="მენიუ"
              className="cursor-pointer rounded p-1 text-secondary transition-colors hover:bg-surface-container-high hover:text-ink"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
