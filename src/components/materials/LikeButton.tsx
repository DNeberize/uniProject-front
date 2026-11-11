import { useEffect, useRef, useState } from 'react'
import { toggleLike } from '../../api/materials.ts'

type LikeButtonProps = {
  materialId: number
  initialLiked?: boolean
  initialCount: number
  className?: string
}

const BREAK_MS = 750

/**
 * Heart toggle backed by POST /materials/{id}/like. Updates optimistically and rolls back if the
 * request fails. Clicks while a request is in flight are ignored: the endpoint is a toggle, so
 * two racing requests could leave the server out of sync with what the button shows.
 */
export default function LikeButton({ materialId, initialLiked = false, initialCount, className = '' }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [pending, setPending] = useState(false)
  const [anim, setAnim] = useState<'like' | 'break' | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  // Fresh data from the server (e.g. the details page replacing the card's copy) wins over local state
  const [synced, setSynced] = useState({ materialId, initialLiked, initialCount })
  if (synced.materialId !== materialId || synced.initialLiked !== initialLiked || synced.initialCount !== initialCount) {
    setSynced({ materialId, initialLiked, initialCount })
    setLiked(initialLiked)
    setCount(initialCount)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const animate = (next: boolean) => {
    setAnim(next ? 'like' : 'break')
    setAnimKey((k) => k + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAnim(null), BREAK_MS)
  }

  const toggle = async () => {
    if (pending) return
    const next = !liked
    setLiked(next)
    setCount((c) => c + (next ? 1 : -1))
    animate(next)
    setPending(true)
    try {
      await toggleLike(materialId)
    } catch {
      setLiked(!next)
      setCount((c) => c + (next ? -1 : 1))
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-busy={pending}
      onClick={toggle}
      className={`relative z-10 flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 font-hand text-[22px] leading-none text-ink transition-colors hover:bg-primary-container ${className}`}
    >
      <span aria-hidden="true" className="relative inline-flex h-[18px] w-[18px]">
        <span
          key={`heart-${animKey}`}
          className={`material-symbols-outlined like-heart text-[18px] ${liked ? 'is-liked' : ''} ${
            anim === 'like' ? 'like-pop' : anim === 'break' ? 'like-regrow' : ''
          }`}
        >
          favorite
        </span>
        {anim === 'break' && (
          <>
            <span key={`l-${animKey}`} className="material-symbols-outlined icon-filled heart-shard heart-shard--left text-[18px]">
              favorite
            </span>
            <span key={`r-${animKey}`} className="material-symbols-outlined icon-filled heart-shard heart-shard--right text-[18px]">
              favorite
            </span>
          </>
        )}
      </span>
      {/* Accessible name is "მოწონება 3": it must contain the visible count; aria-pressed says whether it is liked */}
      <span className="sr-only">მოწონება</span>
      <span className="tabular-nums">{count}</span>
    </button>
  )
}
