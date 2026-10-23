import { Link } from 'react-router'
import PageContainer from '../components/layout/PageContainer.tsx'
import { Arrow, Check } from '../components/notebook/Doodles.tsx'
import Sheet from '../components/notebook/Sheet.tsx'
import StickyNote from '../components/notebook/StickyNote.tsx'
import { ROUTES } from '../config/routes.ts'

export default function NotFoundPage() {
  return (
    <PageContainer title="გვერდი ვერ მოიძებნა">
      <div className="mt-space-xl flex flex-col items-start gap-space-xl md:flex-row md:items-center">
        <Sheet taped className="w-full max-w-md px-space-lg pb-space-lg pt-space-xl sm:px-space-xl">
          <p className="font-hand text-[88px] font-bold leading-none text-primary -rotate-3">404</p>
          <p className="mt-space-md text-body-lg text-on-surface-variant">
            ეს ფურცელი რვეულიდან ამოგლეჯილია. შეიძლება ბმული შეიცვალა ან გვერდი წაიშალა.
          </p>
          <Link
            to={ROUTES.home}
            className="btn-press mt-space-lg inline-flex h-11 items-center rounded bg-primary px-space-lg font-label text-[15px] font-semibold text-on-primary hover:bg-[#c91f1f]"
          >
            მთავარ გვერდზე დაბრუნება
          </Link>
        </Sheet>

        <div className="flex items-center gap-space-md">
          <Arrow className="hidden h-16 w-28 -scale-x-100 text-pen md:block" delay={0.4} />
          <StickyNote title="რა შეგიძლია გააკეთო" className="w-60 rotate-2">
            <ul className="grid gap-2">
              <li className="flex items-start gap-2">
                <Check checked className="mt-0.5 h-[18px] w-[18px] shrink-0" delay={0.6} />
                შეამოწმე ბმული
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                მოძებნე მასალა მთავარ გვერდზე
              </li>
            </ul>
          </StickyNote>
        </div>
      </div>
    </PageContainer>
  )
}
