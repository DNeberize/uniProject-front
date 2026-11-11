import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

type AvatarCropDialogProps = {
  /** Object URL of the picked image */
  src: string
  onCancel: () => void
  onConfirm: (area: Area) => void
}

/** Modal with a round, draggable, zoomable crop area over the picked image. */
export default function AvatarCropDialog({ src, onCancel, onConfirm }: AvatarCropDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area>()

  useEffect(() => {
    dialog.current?.showModal()
  }, [])

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), [])

  return (
    <dialog
      ref={dialog}
      onCancel={onCancel}
      aria-labelledby="avatar-crop-title"
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-lg bg-surface-container-lowest p-0 text-ink shadow-xl backdrop:bg-ink/50"
    >
      <div className="p-space-lg">
        <h2 id="avatar-crop-title" className="font-headline text-headline-sm font-bold">
          ავატარის მორგება
        </h2>
        <p className="mt-1 text-body-sm text-secondary">გადაათრიე სურათი და გაადიდე, სანამ წრეში სასურველი ნაწილი არ მოხვდება.</p>

        <div className="relative mt-space-md aspect-square w-full overflow-hidden rounded bg-ink">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <label className="mt-space-md flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-[18px] text-secondary" aria-hidden="true">
            zoom_out
          </span>
          <span className="sr-only">მასშტაბი</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="material-symbols-outlined text-[18px] text-secondary" aria-hidden="true">
            zoom_in
          </span>
        </label>

        <div className="mt-space-lg flex justify-end gap-space-sm">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded border border-outline bg-surface-container-low px-3 py-1.5 font-label text-label-md text-on-surface transition-colors hover:border-ink hover:bg-surface-container"
          >
            გაუქმება
          </button>
          <button
            type="button"
            disabled={!area}
            onClick={() => area && onConfirm(area)}
            className="cursor-pointer rounded bg-primary px-3 py-1.5 font-label text-label-md text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            შენახვა
          </button>
        </div>
      </div>
    </dialog>
  )
}
