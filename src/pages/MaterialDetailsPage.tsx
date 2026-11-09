import { Link, useLocation, useParams } from 'react-router'
import { getMaterial, uploaderName, type MaterialResponse } from '../api/materials.ts'
import { useApi } from '../api/useApi.ts'
import LikeButton from '../components/materials/LikeButton.tsx'
import { dateFormat } from '../utils/format.ts'
import { Underline } from '../components/notebook/Doodles.tsx'
import Sheet from '../components/notebook/Sheet.tsx'
import StickyNote from '../components/notebook/StickyNote.tsx'
import Tape from '../components/notebook/Tape.tsx'
import { ROUTES } from '../config/routes.ts'
import NotFoundPage from './NotFoundPage.tsx'

// Tag chips cycle through soft marker colours, like in the Stitch design
const TAG_COLORS = [
  'border-status-pending-border bg-status-pending-bg text-status-pending',
  'border-pen/30 bg-pen/5 text-pen',
  'border-status-approved-border bg-status-approved-bg text-status-approved',
  'border-primary/30 bg-primary-container text-on-primary-container',
]

const initials = (material: MaterialResponse) =>
  `${material.uploader.firstName.charAt(0)}${material.uploader.lastName.charAt(0)}` || material.uploader.email.charAt(0)

const fileExtension = (url: string) => new URL(url, window.location.href).pathname.split('.').pop()?.toLowerCase() ?? ''

export default function MaterialDetailsPage() {
  const { id } = useParams()
  // The card passes the material along, so opening it from the list needs no extra request
  const passed = (useLocation().state as { material?: MaterialResponse } | null)?.material
  const materialId = Number(id)

  const loaded = useApi(
    (signal) => (passed?.id === materialId ? Promise.resolve(passed) : getMaterial(materialId, { signal })),
    [materialId],
  )

  if (!Number.isInteger(materialId) || (loaded.status === 'ready' && !loaded.data)) return <NotFoundPage />

  const material = loaded.data

  return (
    <section className="py-space-xl">
      <Link
        to={ROUTES.home}
        className="inline-flex items-center gap-1 font-label text-label-md text-on-surface-variant transition-colors hover:text-primary"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        მთავარი
      </Link>

      {loaded.status === 'error' && (
        <StickyNote title="მასალა ვერ ჩაიტვირთა" className="mt-space-xl w-72 -rotate-1">
          <p>სერვერთან კავშირი ვერ მოხერხდა. სცადე გვერდის განახლება.</p>
        </StickyNote>
      )}

      {!material && loaded.status === 'loading' && <DetailsSkeleton />}

      {material && (
        <div className="mt-space-lg grid gap-space-xl">
          <Sheet className="relative px-space-lg pb-space-lg pt-space-xl sm:px-space-xl">
            <Tape className="-top-3 left-1/2 w-24 -translate-x-1/2 -rotate-1" />

            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <span className="rounded border border-outline bg-surface-container-low px-2.5 py-1 font-label text-label-md text-ink">
                {material.subjectName}
              </span>
              <LikeButton initialCount={material.likesCount} />
            </div>

            <h1 className="mt-space-md font-headline text-headline-lg-mobile text-ink md:text-headline-lg">
              <span className="relative inline">
                {material.title}
              </span>
            </h1>
            <Underline className="mt-1 h-3 w-48 text-primary sm:w-80" />

            {material.description && (
              <p className="mt-space-lg border-l-4 border-sticky bg-surface-container-low px-space-md py-space-md text-body-lg text-on-surface-variant">
                {material.description}
              </p>
            )}

            <div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant pt-space-md">
              <div className="flex min-w-0 items-center gap-space-sm">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-status-pending-border bg-status-pending-bg font-label text-label-sm text-status-pending">
                  {initials(material)}
                </span>
                <span className="truncate font-label text-label-md text-ink">{uploaderName(material.uploader)}</span>
                <span className="hidden truncate font-code text-code-sm text-secondary sm:inline">({material.uploader.email})</span>
              </div>
              <span className="flex items-center gap-1 text-body-md text-secondary">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <time dateTime={material.createdAt}>{dateFormat.format(new Date(material.createdAt))}</time>
              </span>
            </div>

            {material.tags.length > 0 && (
              <ul className="mt-space-md flex flex-wrap gap-space-xs">
                {material.tags.map((tag, index) => (
                  <li key={tag} className={`rounded-full border px-2.5 py-0.5 font-label text-label-sm ${TAG_COLORS[index % TAG_COLORS.length]}`}>
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={material.fileUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="btn-press mt-space-lg inline-flex h-12 items-center gap-space-sm rounded bg-primary px-space-lg font-label text-[15px] font-semibold text-on-primary hover:bg-[#c91f1f]"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              გადმოწერა
            </a>
          </Sheet>

          <Preview material={material} />
        </div>
      )}
    </section>
  )
}

function Preview({ material }: { material: MaterialResponse }) {
  const isPdf = fileExtension(material.fileUrl) === 'pdf'

  return (
    <div className="sheet rise relative border-t-4 border-t-primary px-space-md pb-space-lg pt-space-lg sm:px-space-xl">
      <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant pb-space-md">
        <h2 className="flex items-center gap-space-sm font-headline text-headline-sm font-semibold text-ink">
          <span className="material-symbols-outlined text-[22px] text-primary">menu_book</span>
          მასალის გადაფურცვლა
        </h2>
        <a
          href={material.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-label text-label-md text-pen hover:underline"
        >
          ახალ ფანჯარაში გახსნა
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>

      {isPdf ? (
        <iframe
          title={`${material.title} — პრევიუ`}
          src={material.fileUrl}
          className="mt-space-lg h-[75vh] min-h-[420px] w-full rounded border border-outline bg-surface-container-low"
        />
      ) : (
        <div className="mt-space-lg flex flex-col items-center gap-space-sm rounded border border-dashed border-outline bg-surface-container-low px-space-md py-space-xl text-center">
          <span className="material-symbols-outlined text-[40px] text-secondary">description</span>
          <p className="text-body-md text-on-surface-variant">ამ ფაილის პრევიუ ბრაუზერში არ ჩანს — გადმოწერე და ისე გახსენი.</p>
        </div>
      )}

      <StickyNote title="📌 მინიშნება:" className="absolute -right-3 -top-6 hidden w-48 rotate-3 lg:block">
        <p>თუ პრევიუ არ ჩანს, გამოიყენე „გადმოწერა“.</p>
      </StickyNote>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div aria-busy="true" aria-label="იტვირთება…" className="sheet mt-space-lg grid animate-pulse gap-space-md px-space-lg pb-space-lg pt-space-xl sm:px-space-xl">
      <div className="h-6 w-40 rounded bg-surface-container-high" />
      <div className="h-9 w-3/4 rounded bg-surface-container-high" />
      <div className="h-16 w-full rounded bg-surface-container" />
      <div className="h-4 w-56 rounded bg-surface-container-high" />
      <div className="h-12 w-40 rounded bg-surface-container-high" />
    </div>
  )
}
