import { lazy, Suspense, useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import type { Area } from 'react-easy-crop'
import {
  AVATAR_MAX_BYTES,
  AVATAR_TYPES,
  customAvatar,
  resetAvatar,
  uploadAvatar,
  type AuthUser,
} from '../../api/user.ts'
import { setCurrentUser } from '../../auth/useCurrentUser.ts'
import { avatarColors, userInitials } from '../../utils/avatar.ts'
import { cropToSquare } from '../../utils/cropImage.ts'
import { useAfterFirstPaint } from '../../utils/firstPaint.ts'
import Tape from '../notebook/Tape.tsx'
// The cropper library is only needed after an image is picked: load it when the file picker opens
const loadCropDialog = () => import('./AvatarCropDialog.tsx')
const AvatarCropDialog = lazy(loadCropDialog)

/** Long enough for the eraser to visibly wipe the photo even when the request is instant */
const ERASE_MS = 1100

const CRUMBS = [
  { left: '30%', x: '-10px', delay: '0s' },
  { left: '48%', x: '4px', delay: '0.3s' },
  { left: '62%', x: '12px', delay: '0.15s' },
  { left: '40%', x: '-4px', delay: '0.55s' },
  { left: '70%', x: '8px', delay: '0.7s' },
]

/**
 * The profile's round avatar. Click it to pick an image, crop it in a dialog, and it is uploaded
 * and set right away. The eraser pinned to its corner puts back the default avatar, after a
 * sticky-note "are you sure?" and a little scrubbing animation.
 */
export default function AvatarUpload({ user }: { user: AuthUser }) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<'upload' | 'remove'>()
  const [error, setError] = useState<string>()
  /** Object URL of the picked image while the crop dialog is open */
  const [picked, setPicked] = useState<string>()
  /** Object URL of the cropped image while it uploads */
  const [preview, setPreview] = useState<string>()
  const [confirming, setConfirming] = useState(false)
  const confirmBox = useRef<HTMLDivElement>(null)
  const eraserButton = useRef<HTMLButtonElement>(null)

  // The sticky note closes on Escape or a click anywhere else
  useEffect(() => {
    if (!confirming) return
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!confirmBox.current?.contains(target) && !eraserButton.current?.contains(target)) setConfirming(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setConfirming(false)
      eraserButton.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    confirmBox.current?.querySelector<HTMLButtonElement>('[data-autofocus]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [confirming])

  const closeCrop = () => {
    if (picked) URL.revokeObjectURL(picked)
    setPicked(undefined)
  }

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = '' // so picking the same file again still fires change
    if (!file) return

    if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) {
      setError('მხოლოდ JPG, PNG ან WEBP სურათი')
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setError('სურათი 15 MB-ზე დიდი არ უნდა იყოს')
      return
    }
    setError(undefined)
    setPicked(URL.createObjectURL(file))
  }

  const onCropped = async (area: Area) => {
    if (!picked) return
    setBusy('upload')
    let previewUrl: string | undefined
    try {
      const file = await cropToSquare(picked, area)
      closeCrop()
      previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      setCurrentUser(await uploadAvatar(file))
    } catch {
      closeCrop()
      setError('ავატარის ატვირთვა ვერ მოხერხდა')
    } finally {
      setBusy(undefined)
      setPreview(undefined)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }

  const onRemove = async () => {
    setConfirming(false)
    setError(undefined)
    setBusy('remove')
    try {
      const [updated] = await Promise.all([resetAvatar(), new Promise((resolve) => setTimeout(resolve, ERASE_MS))])
      setCurrentUser(updated)
    } catch {
      setError('ავატარის წაშლა ვერ მოხერხდა')
    } finally {
      setBusy(undefined)
    }
  }

  const own = customAvatar(user)
  const src = preview ?? own
  // The S3 photo is requested after the first paint (see UserAvatar); a local crop preview shows at once
  const painted = useAfterFirstPaint()
  const erasing = busy === 'remove'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="group/avatar relative">
        <button
          type="button"
          onClick={() => {
            void loadCropDialog()
            input.current?.click()
          }}
          disabled={!!busy}
          aria-label="ავატარის შეცვლა"
          title="ავატარის შეცვლა"
          style={src ? undefined : avatarColors(user.keycloakId)}
          className={`group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white font-label text-[26px] font-semibold shadow-md ring-1 ring-outline-variant select-none disabled:cursor-wait ${
            src ? 'bg-surface-container-high' : 'avatar-initials'
          }`}
        >
          {src ? (
            (preview || painted) && (
              <img src={src} alt="" className={`h-full w-full object-cover ${erasing ? 'avatar-erasing' : ''}`} />
            )
          ) : (
            <span className="rise">{userInitials(user)}</span>
          )}

          {erasing ? (
            <span aria-hidden="true">
              {CRUMBS.map((crumb) => (
                <span
                  key={crumb.left}
                  className="eraser-crumb"
                  style={{ left: crumb.left, top: '55%', '--crumb-x': crumb.x, '--crumb-delay': crumb.delay } as CSSProperties}
                />
              ))}
              <span className="avatar-eraser">
                <span className="material-symbols-outlined icon-filled text-[30px]">ink_eraser</span>
              </span>
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={`absolute inset-0 flex items-center justify-center bg-ink/50 text-white transition-opacity ${
                busy ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${busy ? 'animate-spin' : ''}`}>
                {busy ? 'progress_activity' : 'photo_camera'}
              </span>
            </span>
          )}
        </button>

        {own && !busy && (
          <button
            ref={eraserButton}
            type="button"
            onClick={() => setConfirming((open) => !open)}
            aria-label="ავატარის წაშლა"
            aria-expanded={confirming}
            title="ავატარის წაშლა"
            className={`absolute -top-1.5 -right-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-outline text-primary shadow-md transition-[opacity,rotate,scale,background-color] duration-200 hover:-rotate-12 hover:scale-110 hover:bg-error-container focus-visible:opacity-100 [@media(hover:none)]:opacity-100 ${
              confirming
                ? 'scale-110 -rotate-12 bg-error-container opacity-100'
                : 'rotate-12 bg-surface-container-lowest opacity-0 group-hover/avatar:opacity-100'
            }`}
          >
            <span className="material-symbols-outlined icon-filled text-[18px]">ink_eraser</span>
          </button>
        )}

        {confirming && (
          // .sticky-note forces position: relative, so an outer box does the absolute positioning:
          // centred under the avatar on phones, hanging from its left edge next to the details on wider screens
          // Typography matches the app's StickyNote: Caveat (font-hand) has no Georgian glyphs, so it is not used here
          <div className="absolute top-full left-1/2 z-30 mt-4 w-64 -translate-x-1/2 sm:-left-2 sm:translate-x-0">
            <div
              ref={confirmBox}
              role="dialog"
              aria-label="ავატარის წაშლის დადასტურება"
              className="sticky-note -rotate-1 px-space-md pt-7 pb-space-md"
            >
              <Tape variant="clear" className="-top-3 left-1/2 w-16 -translate-x-1/2 -rotate-3" />
              <p className="font-label text-[15px] font-semibold pl-2.5">წავშალოთ ფოტო?</p>
              <p className="mt-1 text-body-sm opacity-80 pl-2.5">მის ადგილას ისევ ინიციალები გამოჩნდება.</p>
              <div className="mt-space-md flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false)
                    eraserButton.current?.focus()
                  }}
                  className="cursor-pointer rounded px-2.5 py-1.5 font-label text-label-md transition-colors hover:bg-black/5"
                >
                  დატოვე
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={onRemove}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded bg-primary px-3 py-1.5 font-label text-label-md text-on-primary shadow-sm transition-opacity hover:opacity-90"
                >
                  <span className="material-symbols-outlined icon-filled text-[16px]">ink_eraser</span>
                  წაშალე
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <input ref={input} type="file" accept={AVATAR_TYPES.join(',')} onChange={onPick} className="hidden" />

      {error && (
        <p role="alert" className="max-w-32 text-center text-body-sm text-error">
          {error}
        </p>
      )}

      {picked && (
        <Suspense fallback={null}>
          <AvatarCropDialog src={picked} onCancel={closeCrop} onConfirm={onCropped} />
        </Suspense>
      )}
    </div>
  )
}
