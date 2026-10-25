import SearchBar from '../components/home/SearchBar.tsx'
import SortToggle from '../components/home/SortToggle.tsx'
import TagFilter from '../components/home/TagFilter.tsx'
import PageContainer from '../components/layout/PageContainer.tsx'
import MaterialCard from '../components/materials/MaterialCard.tsx'
import { Arrow } from '../components/notebook/Doodles.tsx'
import Highlight from '../components/notebook/Highlight.tsx'
import { MOCK_MATERIALS } from '../mocks/materials.ts'

export default function HomePage() {
  return (
    <PageContainer title="სასწავლო მასალები">
      <p className="mt-space-lg max-w-prose text-body-lg text-on-surface-variant">
        კონსპექტები, სილაბუსები და გამოცდის მასალები — <Highlight>ყველაფერი ერთ რვეულში</Highlight>,
      </p>

      <div className="mt-space-xl max-w-3xl">
        <SearchBar />
        <div className="mt-space-lg">
          <TagFilter />
        </div>
      </div>

      <div className="mt-space-xl flex flex-wrap items-end justify-between gap-space-md">
        <h2 className="relative font-headline text-headline-md text-ink">
          ბოლოს დამატებული
          <span className="pointer-events-none absolute -right-28 -top-5 hidden items-start gap-1 md:flex">
            <Arrow className="h-8 w-14 -scale-x-100 rotate-[200deg] text-pen" delay={0.6} />
            <span className="font-hand text-[20px] leading-none text-pen">ახალი!</span>
          </span>
        </h2>
        <SortToggle />
      </div>

      <div className="mt-space-xl grid gap-x-space-lg gap-y-space-xl sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {MOCK_MATERIALS.map((material, index) => (
          <MaterialCard key={material.id} material={material} index={index} />
        ))}
      </div>
    </PageContainer>
  )
}
