import { useRef, useState, type DragEvent } from 'react'

export const ACCEPTED_TYPES = '.pdf,.docx,.pptx,.zip'
export const MAX_FILE_MB = 20

type FileDropzoneProps = {
  file: File | null
  onChange: (file: File | null) => void
}

export default function FileDropzone({ file, onChange }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [tooLarge, setTooLarge] = useState(false)

  const pick = (picked: File | null) => {
    const oversized = picked !== null && picked.size > MAX_FILE_MB * 1024 * 1024
    setTooLarge(oversized)
    if (oversized && inputRef.current) inputRef.current.value = ''
    onChange(oversized ? null : picked)
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    const dropped = event.dataTransfer.files[0]
    if (dropped) pick(dropped)
  }

  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-space-lg text-center transition-colors sm:p-space-xl ${
        dragging ? 'border-pen bg-surface-container' : 'border-outline bg-surface-container-low hover:border-secondary hover:bg-surface-container'
      }`}
    >
      <input
        ref={inputRef}
        id="upload-file"
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={(event) => pick(event.target.files?.[0] ?? null)}
        className="peer sr-only"
      />
      <label htmlFor="upload-file" className="absolute inset-0 cursor-pointer rounded-lg peer-focus-visible:outline-2 peer-focus-visible:outline-ink">
        <span className="sr-only">ფაილის არჩევა</span>
      </label>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="doodle mb-space-sm h-9 w-9 text-pen transition-transform group-hover:scale-110"
      >
        <path pathLength={1} d="M12 3v14M7 12l5 5 5-5" />
        <path d="M5 21h14" style={{ strokeDasharray: '2 2', animation: 'none' }} />
      </svg>
      <p className="font-hand text-[26px] font-bold leading-tight text-ink">ჩააგდე ფაილი აქ ან აირჩიე</p>
      <p className="mt-space-xs text-body-sm text-secondary">
        მხარდაჭერილია: <span className="font-medium text-on-surface">PDF, DOCX, PPTX, ZIP</span> (მაქს. {MAX_FILE_MB} MB)
      </p>
      {tooLarge && (
        <p role="alert" className="mt-space-sm text-body-sm font-medium text-error">
          ფაილი ძალიან დიდია — მაქსიმუმ {MAX_FILE_MB} MB.
        </p>
      )}

      {file && (
        <div className="relative z-10 mt-space-md inline-flex max-w-full items-center gap-space-sm rounded border border-status-pending-border bg-status-pending-bg px-3 py-1.5 font-label text-label-md text-ink">
          <span className="material-symbols-outlined text-[16px] text-secondary">attach_file</span>
          <span className="max-w-60 truncate">{file.name}</span>
          <button
            type="button"
            onClick={clear}
            aria-label="ფაილის მოხსნა"
            className="cursor-pointer rounded-full p-0.5 text-primary hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  )
}
