import { useSearchParams } from 'react-router'
import { getTags } from '../api/catalog.ts'
import { searchMaterials, type MaterialSort } from '../api/materials.ts'
import { useApi } from '../api/useApi.ts'
import SearchBar from '../components/home/SearchBar.tsx'
import SortToggle from '../components/home/SortToggle.tsx'
import TagFilter from '../components/home/TagFilter.tsx'
import PageContainer from '../components/layout/PageContainer.tsx'
import MaterialCard from '../components/materials/MaterialCard.tsx'
import MaterialGridSkeleton from '../components/materials/MaterialGridSkeleton.tsx'
import Pagination from '../components/materials/Pagination.tsx'
import { Arrow } from '../components/notebook/Doodles.tsx'
import Highlight from '../components/notebook/Highlight.tsx'
import StickyNote from '../components/notebook/StickyNote.tsx'

const PAGE_SIZE = 12

export default function HomePage() {
  // Search state lives in the URL, so results can be shared and survive back/forward
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const selectedTags = params.getAll('tags')
  const sort: MaterialSort = params.get('sort') === 'LIKES' ? 'LIKES' : 'NEWEST'
  const page = Math.max(0, Number(params.get('page')) || 0)

  const update = (changes: { q?: string; tags?: string[]; sort?: MaterialSort; page?: number }) => {
    const next = { q, tags: selectedTags, sort, page: 0, ...changes }
    const search = new URLSearchParams()
    if (next.q) search.set('q', next.q)
    for (const tag of next.tags) search.append('tags', tag)
    if (next.sort !== 'NEWEST') search.set('sort', next.sort)
    if (next.page > 0) search.set('page', String(next.page))
    setParams(search)
  }

  const tags = useApi(() => getTags(), [])
  const results = useApi(
    (signal) => searchMaterials({ q, tags: selectedTags, sort, page, size: PAGE_SIZE }, { signal }),
    [q, selectedTags.join('\u0000'), sort, page],
  )

  const isFiltered = Boolean(q) || selectedTags.length > 0
  const materials = results.data?.content ?? []

  return (
    <PageContainer title="სასწავლო მასალები">
      <p className="mt-space-lg max-w-prose text-body-lg text-on-surface-variant">
        კონსპექტები, სილაბუსები და გამოცდის მასალები — <Highlight>ყველაფერი ერთ რვეულში</Highlight>,
      </p>

      <div className="mt-space-xl max-w-3xl">
        <SearchBar value={q} onSearch={(query) => update({ q: query })} />
        <div className="mt-space-lg">
          <TagFilter
            tags={tags.data?.map((t) => t.name) ?? []}
            selected={selectedTags}
            onChange={(next) => update({ tags: next })}
          />
        </div>
      </div>

      <div className="mt-space-xl flex flex-wrap items-end justify-between gap-space-md">
        <h2 className="relative font-headline text-headline-md text-ink">
          {isFiltered ? 'ძიების შედეგები' : 'ბოლოს დამატებული'}
          {!isFiltered && (
            <span className="pointer-events-none absolute -right-28 -top-5 hidden items-start gap-1 md:flex">
              <Arrow className="h-8 w-14 -scale-x-100 rotate-[200deg] text-pen" delay={0.6} />
              <span className="font-hand text-[20px] leading-none text-pen">ახალი!</span>
            </span>
          )}
          {isFiltered && results.data && (
            <span className="ml-space-sm font-hand text-[22px] font-normal text-pen">
              ~ {results.data.totalElements} მასალა
            </span>
          )}
        </h2>
        <SortToggle value={sort} onChange={(next) => update({ sort: next })} />
      </div>

      {results.status === 'error' && (
        <StickyNote title="მასალები ვერ ჩაიტვირთა" className="mt-space-xl w-72 -rotate-1">
          <p>სერვერთან კავშირი ვერ მოხერხდა. სცადე გვერდის განახლება.</p>
        </StickyNote>
      )}

      {results.status === 'loading' && !results.data && <MaterialGridSkeleton count={4} />}

      {results.status !== 'error' && results.data && materials.length === 0 && (
        <div className="mt-space-xl flex flex-wrap items-center gap-space-lg">
          <StickyNote title="ვერაფერი ვიპოვე" className="w-72 rotate-1">
            <p>
              {isFiltered
                ? 'ამ ძიებით მასალა არ მოიძებნა. სცადე სხვა სიტყვა ან მოხსენი თაგები.'
                : 'ჯერ არცერთი მასალა არ დამტკიცებულა.'}
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={() => update({ q: '', tags: [] })}
                className="mt-space-sm cursor-pointer font-hand text-[20px] text-pen underline underline-offset-4"
              >
                ფილტრების გასუფთავება
              </button>
            )}
          </StickyNote>
        </div>
      )}

      {materials.length > 0 && (
        <div
          aria-busy={results.status === 'loading'}
          className={`mt-space-xl grid gap-x-space-lg gap-y-space-xl transition-opacity sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${
            results.status === 'loading' ? 'opacity-60' : ''
          }`}
        >
          {materials.map((material, index) => (
            <MaterialCard key={material.id} material={material} index={index} />
          ))}
        </div>
      )}

      {results.data && results.data.totalPages > 1 && (
        <Pagination page={page} totalPages={results.data.totalPages} onChange={(next) => update({ page: next })} />
      )}
    </PageContainer>
  )
}
