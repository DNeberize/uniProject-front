import { useState } from 'react'
import { Link } from 'react-router'
import { ROUTES } from '../config/routes.ts'
import PageContainer from '../components/layout/PageContainer.tsx'
import StickyNote from '../components/notebook/StickyNote.tsx'
import Tape from '../components/notebook/Tape.tsx'
import MyMaterialRow from '../components/profile/MyMaterialRow.tsx'
import ProfileCard from '../components/profile/ProfileCard.tsx'
import ProfileStats from '../components/profile/ProfileStats.tsx'
import ProfileTabs, { type ProfileTabId } from '../components/profile/ProfileTabs.tsx'
import SavedMaterialCard from '../components/profile/SavedMaterialCard.tsx'
import StatusFilter, { type StatusFilterValue } from '../components/profile/StatusFilter.tsx'
import { MOCK_MY_MATERIALS, MOCK_PROFILE_DETAILS, MOCK_SAVED_MATERIALS } from '../mocks/profile.ts'

const countByStatus = (status: StatusFilterValue) =>
  status === 'ALL' ? MOCK_MY_MATERIALS.length : MOCK_MY_MATERIALS.filter((m) => m.status === status).length

const COUNTS: Record<StatusFilterValue, number> = {
  ALL: countByStatus('ALL'),
  APPROVED: countByStatus('APPROVED'),
  PENDING: countByStatus('PENDING'),
  REJECTED: countByStatus('REJECTED'),
}

export default function ProfilePage() {
  const [tab, setTab] = useState<ProfileTabId>('uploads')
  const [filter, setFilter] = useState<StatusFilterValue>('ALL')

  const materials = filter === 'ALL' ? MOCK_MY_MATERIALS : MOCK_MY_MATERIALS.filter((m) => m.status === filter)

  return (
    <PageContainer title="ჩემი პროფილი">
      <div className="max-w-6xl">
        <div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-md">
          <p className="flex flex-wrap items-center gap-x-2 text-body-md text-on-surface-variant">
            სტუდენტის პირადი კაბინეტი და ატვირთული მასალების მართვა
            <span className="font-hand text-[20px] font-bold text-pen">~ {MOCK_PROFILE_DETAILS.semester} სემესტრი</span>
          </p>
          <span className="hidden -rotate-1 items-center gap-1.5 rounded border border-status-pending-border bg-status-pending-bg px-3 py-1 shadow-sm sm:inline-flex">
            <span aria-hidden="true">💡</span>
            <span className="font-hand text-[19px] font-bold text-ink">აქტიური კონტრიბუტორი</span>
          </span>
        </div>

        <div className="mt-space-xl grid items-start gap-space-lg lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProfileCard />
          </div>
          <div className="lg:col-span-5">
            <ProfileStats
              total={COUNTS.ALL}
              approved={COUNTS.APPROVED}
              pending={COUNTS.PENDING}
              rejected={COUNTS.REJECTED}
              averageRating={MOCK_PROFILE_DETAILS.averageRating}
              ratingCount={MOCK_PROFILE_DETAILS.ratingCount}
            />
          </div>
        </div>

        <div className="mt-space-xl">
          <ProfileTabs
            active={tab}
            onChange={setTab}
            tabs={[
              { id: 'uploads', label: 'ჩემი ატვირთვები', count: COUNTS.ALL },
              { id: 'saved', label: '🔖 შენახული მასალები', count: MOCK_SAVED_MATERIALS.length },
            ]}
          />

          <div
            role="tabpanel"
            className="relative rounded-tr-xl rounded-b-xl border-2 border-outline bg-white p-space-md shadow-[0_1px_2px_rgb(19_26_43/0.05),0_22px_44px_-28px_rgb(19_26_43/0.35)] sm:p-7"
          >
            <Tape className="-top-3 right-12 hidden w-24 rotate-2 sm:block" />

            {tab === 'uploads' && (
              <>
                <div className="mb-space-md flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-space-md">
                  <StatusFilter value={filter} counts={COUNTS} onChange={setFilter} />
                  <Link to={ROUTES.upload} className="pen-link font-label text-label-md text-primary">
                    + ახალი მასალის ატვირთვა
                  </Link>
                </div>

                {materials.length > 0 ? (
                  <ul className="divide-y divide-outline-variant">
                    {materials.map((material) => (
                      <MyMaterialRow key={material.id} material={material} />
                    ))}
                  </ul>
                ) : (
                  <p className="py-space-xl text-center font-hand text-[22px] text-secondary">ამ ფილტრით მასალა არ მოიძებნა</p>
                )}

                <StickyNote className="mx-auto mt-space-xl max-w-2xl -rotate-1">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-[20px]">📌</span>
                    <div>
                      <p className="font-hand text-[22px] font-bold leading-snug">
                        „უარყოფილი მასალის გასწორება და ხელახლა ატვირთვა შეგიძლია ატვირთვის გვერდიდან.“
                      </p>
                      <p className="mt-1 text-body-sm">
                        ~ SANGU Moderation Team • გთხოვთ ყურადღებით გაეცნოთ მოდერატორის მიერ მითითებულ მიზეზს.
                      </p>
                    </div>
                  </div>
                </StickyNote>
              </>
            )}

            {tab === 'saved' && (
              <div className="grid gap-space-lg pt-space-sm md:grid-cols-3">
                {MOCK_SAVED_MATERIALS.map((material, index) => (
                  <SavedMaterialCard key={material.id} material={material} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="mt-space-xl pt-space-md">
          <div className="mb-space-md flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex flex-wrap items-baseline gap-2 font-headline text-headline-md text-ink">
              შენახული მასალები
              <span className="font-hand text-[19px] font-bold text-pen">~ სწრაფი წვდომა</span>
            </h2>
            <Link to={ROUTES.favorites} className="font-hand text-[19px] font-bold text-pen hover:underline">
              ყველას ნახვა ({MOCK_SAVED_MATERIALS.length}) →
            </Link>
          </div>

          <div className="grid gap-space-lg md:grid-cols-3">
            {MOCK_SAVED_MATERIALS.map((material, index) => (
              <SavedMaterialCard key={material.id} material={material} index={index} />
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  )
}
