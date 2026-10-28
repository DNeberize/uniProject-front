import { useEffect, useRef, useState } from 'react'

type LikeButtonProps = {
  initialLiked?: boolean
  initialCount: number
  className?: string
}

const BREAK_MS = 750


export default function LikeButton({ initialLiked = false, initialCount, className = '' }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [anim, setAnim] = useState<'like' | 'break' | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = () => {
    const next = !liked
    setLiked(next)
    setCount((c) => c + (next ? 1 : -1))
    setAnim(next ? 'like' : 'break')
    setAnimKey((k) => k + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAnim(null), BREAK_MS)
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? `მოწონების გაუქმება (${count})` : `მოწონება (${count})`}
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
      <span className="tabular-nums">{count}</span>
    </button>
  )
}
