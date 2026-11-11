import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { getMaterial, uploaderName, type MaterialResponse } from '../api/materials.ts'
import { useApi } from '../api/useApi.ts'
import BookmarkButton from '../components/materials/BookmarkButton.tsx'
import LikeButton from '../components/materials/LikeButton.tsx'
import PdfPages from '../components/materials/PdfPages.tsx'
import UserAvatar from '../components/UserAvatar.tsx'
import { dateFormat } from '../utils/format.ts'
import { Arrow, Check, Underline } from '../components/notebook/Doodles.tsx'
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

const fileExtension = (url: string) => new URL(url, window.location.href).pathname.split('.').pop()?.toLowerCase() ?? ''

type FileLink = { state: 'ok'; url: string } | { state: 'broken' } | { state: 'expired' }

function checkFileLink(fileUrl: string | undefined): FileLink {
  let url: URL
  try {
    url = new URL(fileUrl ?? '')
  } catch {
    return { state: 'broken' }
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.origin === window.location.origin) return { state: 'broken' }

  const signedAt = url.searchParams.get('X-Amz-Date')?.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/)
  const lifetime = Number(url.searchParams.get('X-Amz-Expires'))
  if (signedAt && lifetime) {
    const [, y, mo, d, h, mi, s] = signedAt.map(Number)
    if (Date.UTC(y, mo - 1, d, h, mi, s) + lifetime * 1000 < Date.now()) return { state: 'expired' }
  }
  return { state: 'ok', url: url.href }
}

export default function MaterialDetailsPage() {
  const { id } = useParams()
  const passed = (useLocation().state as { material?: MaterialResponse } | null)?.material
  const materialId = Number(id)

  const loaded = useApi((signal) => getMaterial(materialId, { signal }), [materialId])

  if (!Number.isInteger(materialId) || (loaded.status === 'ready' && !loaded.data)) return <NotFoundPage />

  const fetched = loaded.data?.id === materialId ? loaded.data : undefined
  const material = fetched ?? (passed?.id === materialId ? passed : undefined)
  const fileLink = fetched && checkFileLink(fetched.fileUrl)
  const fileUrl = fileLink?.state === 'ok' ? fileLink.url : undefined

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
        <div className="mt-space-lg grid min-w-0 grid-cols-[minmax(0,1fr)] gap-space-xl">
          <Sheet className="relative px-space-lg pb-space-lg pt-space-xl sm:px-space-xl">
            <Tape className="-top-3 left-1/2 w-24 -translate-x-1/2 -rotate-1" />
            <BookmarkButton />

            {/* Right padding keeps the like button clear of the bookmark ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pr-8 sm:pr-4">
              <span className="rounded border border-outline bg-surface-container-low px-2.5 py-1 font-label text-label-md text-ink">
                {material.subjectName}
              </span>
              <LikeButton
                materialId={material.id}
                initialLiked={material.isLikedByCurrentUser}
                initialCount={material.likesCount}
              />
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
                <UserAvatar user={material.uploader} />
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

            {fileUrl ? (
              <DownloadButton fileUrl={fileUrl} title={material.title} />
            ) : (
              <span
                aria-disabled="true"
                className={`mt-space-lg inline-flex h-12 ${fileLink ? 'cursor-not-allowed' : 'cursor-wait'} items-center gap-space-sm rounded bg-primary/50 px-space-lg font-label text-[15px] font-semibold text-on-primary`}
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                გადმოწერა
              </span>
            )}
          </Sheet>

          {fileUrl ? (
            <Preview material={material} fileUrl={fileUrl} />
          ) : fileLink ? (
            <BrokenFile expired={fileLink.state === 'expired'} />
          ) : loaded.status === 'loading' && (
            <div aria-busy="true" aria-label="იტვირთება…" className="sheet h-[50vh] animate-pulse bg-surface-container" />
          )}
        </div>
      )}
    </section>
  )
}

const downloadName = (title: string, fileUrl: string) => {
  const extension = fileExtension(fileUrl)
  const base = title.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'material'
  return extension ? `${base}.${extension}` : base
}

function DownloadButton({ fileUrl, title }: { fileUrl: string; title: string }) {
  const [busy, setBusy] = useState(false)

  async function download() {
    setBusy(true)
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error(`download failed with ${response.status}`)
      const href = URL.createObjectURL(await response.blob())
      const link = Object.assign(document.createElement('a'), { href, download: downloadName(title, fileUrl) })
      document.body.append(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(href), 60_000)
    } catch {
      window.open(fileUrl, '_blank', 'noreferrer')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      aria-busy={busy}
      className="btn-press mt-space-lg inline-flex h-12 items-center gap-space-sm rounded bg-primary px-space-lg font-label text-[15px] font-semibold text-on-primary hover:bg-[#c91f1f] disabled:cursor-wait disabled:opacity-70"
    >
      <span className={`material-symbols-outlined text-[20px] ${busy ? 'animate-bounce' : ''}`}>download</span>
      {busy ? 'იტვირთება…' : 'გადმოწერა'}
    </button>
  )
}

const IMAGE_EXTENSIONS =['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'bmp', 'svg']
const TEXT_EXTENSIONS = ['txt', 'md', 'csv', 'log', 'json']

type PreviewKind = 'pdf' | 'image' | 'text' | 'none'

function previewKind(fileUrl: string): PreviewKind {
  const extension = fileExtension(fileUrl)
  if (extension === 'pdf') return 'pdf'
  if (IMAGE_EXTENSIONS.includes(extension)) return 'image'
  if (TEXT_EXTENSIONS.includes(extension)) return 'text'
  return 'none'
}

const browserShowsPdf = () =>
  navigator.pdfViewerEnabled !== false && !window.matchMedia('(pointer: coarse)').matches

const FRAME_HEIGHT = 'h-[calc(100dvh-7rem)] min-h-[360px]'

function PreviewBody({ title, fileUrl }: { title: string; fileUrl: string }) {
  const [failed, setFailed] = useState(false)
  const kind = previewKind(fileUrl)

  if (kind === 'pdf' && !failed) {
    if (!browserShowsPdf()) return <PdfPages url={fileUrl} className={FRAME_HEIGHT} onError={() => setFailed(true)} />

    return (
      <iframe
        title={`პრევიუ: ${title}`}
        src={`${fileUrl}#view=Fit&zoom=page-fit&navpanes=0`}
        className={`block w-full rounded border border-outline bg-surface-container-low ${FRAME_HEIGHT}`}
      />
    )
  }

  if (kind === 'image' && !failed) {
    return (
      <img
        src={fileUrl}
        alt={title}
        onError={() => setFailed(true)}
        className="mx-auto block h-auto max-h-[calc(100dvh-7rem)] w-auto max-w-full rounded border border-outline bg-surface-container-low object-contain"
      />
    )
  }

  if (kind === 'text') {
    return (
      <iframe
        title={`პრევიუ: ${title}`}
        src={fileUrl}
        className={`block w-full rounded border border-outline bg-white ${FRAME_HEIGHT}`}
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-space-sm rounded border border-dashed border-outline bg-surface-container-low px-space-md py-space-xl text-center">
      <span className="material-symbols-outlined text-[40px] text-secondary">
        {failed ? (kind === 'image' ? 'broken_image' : 'picture_as_pdf') : 'description'}
      </span>
      <p className="text-body-md text-on-surface-variant">
        {failed
          ? `${kind === 'image' ? 'სურათი' : 'ფაილი'} ვერ ჩაიტვირთა. სცადე გადმოწერა ან ახალ ფანჯარაში გახსნა.`
          : 'ამ ფაილის პრევიუ ბრაუზერში არ ჩანს. გადმოწერე და ისე გახსენი.'}
      </p>
    </div>
  )
}

function Preview({ material, fileUrl }: { material: MaterialResponse; fileUrl: string }) {
  return (
    <div className="sheet rise relative border-t-4 border-t-primary px-space-md pb-space-lg pt-space-lg sm:px-space-xl">
      <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant pb-space-md">
        <h2 className="flex items-center gap-space-sm font-headline text-headline-sm font-semibold text-ink">
          <span className="material-symbols-outlined text-[22px] text-primary">menu_book</span>
          მასალის გადაფურცვლა
        </h2>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-label text-label-md text-pen hover:underline"
        >
          ახალ ფანჯარაში გახსნა
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>

      <div className="mt-space-lg">
        <PreviewBody key={fileUrl} title={material.title} fileUrl={fileUrl} />
      </div>

      <StickyNote title="📌 მინიშნება:" className="absolute -right-3 -top-6 hidden w-48 rotate-3 lg:block">
        <p>თუ პრევიუ არ ჩანს, გამოიყენე „გადმოწერა“.</p>
      </StickyNote>
    </div>
  )
}

function BrokenFile({ expired }: { expired: boolean }) {
  return (
    <div className="flex flex-col items-start gap-space-xl md:flex-row md:items-center">
      <Sheet taped className="w-full max-w-md px-space-lg pb-space-lg pt-space-xl sm:px-space-xl">
        <p className="font-hand text-[88px] font-bold leading-none text-primary -rotate-3">{expired ? '⌛' : '404'}</p>
        <p className="mt-space-md text-body-lg text-on-surface-variant">
          {expired
            ? 'ფაილის ბმულს ვადა გაუვიდა. განაახლე გვერდი და ახალი ბმული ჩაიტვირთება.'
            : 'ამ მასალის ფაილი ვერ მოიძებნა. შეიძლება ბმული არასწორია ან ფაილი წაიშალა.'}
        </p>
        {expired ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-press mt-space-lg inline-flex h-11 items-center rounded bg-primary px-space-lg font-label text-[15px] font-semibold text-on-primary hover:bg-[#c91f1f]"
          >
            გვერდის განახლება
          </button>
        ) : (
          <Link
            to={ROUTES.home}
            className="btn-press mt-space-lg inline-flex h-11 items-center rounded bg-primary px-space-lg font-label text-[15px] font-semibold text-on-primary hover:bg-[#c91f1f]"
          >
            მთავარ გვერდზე დაბრუნება
          </Link>
        )}
      </Sheet>

      <div className="flex items-center gap-space-md">
        <Arrow className="hidden h-16 w-28 -scale-x-100 text-pen md:block" delay={0.4} />
        <StickyNote title={expired ? 'ბმული მოძველდა' : 'ფაილი ვერ ჩაიტვირთა'} className="w-60 rotate-2">
          <ul className="grid gap-2">
            <li className="flex items-start gap-2">
              <Check checked className="mt-0.5 h-[18px] w-[18px] shrink-0" delay={0.6} />
              {expired ? 'განაახლე გვერდი' : 'სცადე მოგვიანებით'}
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-[18px] w-[18px] shrink-0" />
              მოძებნე სხვა მასალა მთავარ გვერდზე
            </li>
          </ul>
        </StickyNote>
      </div>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    // The loaded page (details + file preview) is always taller than the screen, so the skeleton reserves
    // a screenful too: otherwise the footer sits in view while loading and then jumps down (layout shift).
    <div className="min-h-dvh">
      <div aria-busy="true" aria-label="იტვირთება…" className="sheet mt-space-lg grid animate-pulse gap-space-md px-space-lg pb-space-lg pt-space-xl sm:px-space-xl">
        <div className="h-6 w-40 rounded bg-surface-container-high" />
        <div className="h-9 w-3/4 rounded bg-surface-container-high" />
        <div className="h-16 w-full rounded bg-surface-container" />
        <div className="h-4 w-56 rounded bg-surface-container-high" />
        <div className="h-12 w-40 rounded bg-surface-container-high" />
      </div>
    </div>
  )
}
