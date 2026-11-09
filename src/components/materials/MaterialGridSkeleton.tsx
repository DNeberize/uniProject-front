/** Blank sheets shown while the first page of materials loads. */
export default function MaterialGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="იტვირთება…" className="mt-space-xl grid gap-x-space-lg gap-y-space-xl sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="sheet flex animate-pulse flex-col gap-space-sm p-space-lg pt-space-xl">
          <div className="h-3 w-24 rounded bg-surface-container-high" />
          <div className="h-5 w-full rounded bg-surface-container-high" />
          <div className="h-5 w-2/3 rounded bg-surface-container-high" />
          <div className="mt-space-md h-4 w-20 rounded-full bg-surface-container" />
          <div className="mt-space-lg border-t border-dashed border-outline pt-space-md">
            <div className="h-3 w-28 rounded bg-surface-container-high" />
          </div>
        </div>
      ))}
    </div>
  )
}
