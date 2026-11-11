import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import { afterFirstPaint } from '../../utils/firstPaint.ts'

async function loadPdfJs() {
  // pdf.js (~130 KB) plus its worker (~1.2 MB) would otherwise compete with the page's own first paint
  await afterFirstPaint
  const [pdfjs, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return pdfjs
}

const GAP = 12

interface Props {
  url: string
  className?: string
  onError: () => void
}

export default function PdfPages({ url, className = '', onError }: Props) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null)
  const [doc, setDoc] = useState<PDFDocumentProxy>()
  const [firstRatio, setFirstRatio] = useState(Math.SQRT2)
  const [box, setBox] = useState<{ width: number; height: number }>()

  useEffect(() => {
    let cancelled = false
    let destroyTask: (() => Promise<void>) | undefined

    loadPdfJs()
      .then((pdfjs) => {
        if (cancelled) return
        const task = pdfjs.getDocument({ url, disableRange: true, disableStream: true })
        destroyTask = () => task.destroy()
        return task.promise.then(async (pdf) => {
          const viewport = (await pdf.getPage(1)).getViewport({ scale: 1 })
          if (cancelled) return
          setFirstRatio(viewport.height / viewport.width)
          setDoc(pdf)
        })
      })
      .catch(() => {
        if (!cancelled) onError()
      })

    return () => {
      cancelled = true
      void destroyTask?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    if (!scroller) return
    const observer = new ResizeObserver(() => setBox({ width: scroller.clientWidth, height: scroller.clientHeight }))
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [scroller])

  const pageWidth = box ? Math.max(120, Math.min(box.width - 2 * GAP, (box.height - 2 * GAP) / firstRatio)) : 0

  return (
    <div
      ref={setScroller}
      className={`w-full min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain rounded border border-outline bg-surface-container ${className}`}
    >
      {!doc || !pageWidth ? (
        <div aria-busy="true" aria-label="იტვირთება…" className="h-full p-space-sm">
          <div className="h-full w-full animate-pulse rounded bg-surface-container-high" />
        </div>
      ) : (
        <div className="flex flex-col items-center" style={{ gap: GAP, padding: GAP }}>
          {Array.from({ length: doc.numPages }, (_, index) => (
            <PdfPage
              key={index}
              doc={doc}
              pageNumber={index + 1}
              pageCount={doc.numPages}
              width={pageWidth}
              fallbackRatio={firstRatio}
              root={scroller}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface PageProps {
  doc: PDFDocumentProxy
  pageNumber: number
  pageCount: number
  width: number
  fallbackRatio: number
  root: HTMLElement | null
}

function PdfPage({ doc, pageNumber, pageCount, width, fallbackRatio, root }: PageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [near, setNear] = useState(false)
  const [ratio, setRatio] = useState(fallbackRatio)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { root, rootMargin: '150% 0px' })
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [root])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!near) {
      canvas.width = 0
      canvas.height = 0
      return
    }

    let cancelled = false
    let task: RenderTask | undefined
    doc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled) return
        const base = page.getViewport({ scale: 1 })
        setRatio(base.height / base.width)
        const viewport = page.getViewport({ scale: (width / base.width) * Math.min(window.devicePixelRatio || 1, 2) })
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        task = page.render({ canvas, viewport })
        return task.promise
      })
      .catch(() => {})

    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, pageNumber, width, near])

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0 bg-white shadow-sm"
      style={{ width, height: Math.round(width * ratio) }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-label={`გვერდი ${pageNumber}`} />
      <span className="absolute bottom-1 right-2 rounded bg-ink/60 px-1.5 font-label text-label-sm text-white">
        {pageNumber} / {pageCount}
      </span>
    </div>
  )
}
