import { useState } from 'react'

type BookmarkButtonProps = {
  initialSaved?: boolean
  className?: string
}

/**
 * A ribbon bookmark tucked into the top edge of a sheet: pale and short when not saved, it drops
 * down in red pen colour when saved. Put it inside a `relative` card; it positions itself.
 *
 * Markup only for now: the backend has GET /users/{id}/favorites but no endpoint to add or remove
 * a favorite yet, and materials don't say whether they are saved. Once it exists, call it here the
 * same way LikeButton calls toggleLike (optimistic, rolled back on failure).
 */
export default function BookmarkButton({ initialSaved = false, className = '' }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved)

  return (
    <button
      type="button"
      aria-pressed={saved}
      title={saved ? 'შენახულია' : 'შენახვა'}
      onClick={() => setSaved((s) => !s)}
      className={`group/bookmark absolute -top-px right-4 z-10 flex h-12 w-9 cursor-pointer justify-center ${className}`}
    >
      <span className="sr-only">შენახვა</span>
      <span aria-hidden="true" className={`bookmark-ribbon ${saved ? 'is-saved' : ''}`} />
    </button>
  )
}
