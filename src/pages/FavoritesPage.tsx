import { Link } from 'react-router'
import { getFavorites } from '../api/materials.ts'
import { useApi } from '../api/useApi.ts'
import { useCurrentUser } from '../auth/useCurrentUser.ts'
import PageContainer from '../components/layout/PageContainer.tsx'
import MaterialCard from '../components/materials/MaterialCard.tsx'
import MaterialGridSkeleton from '../components/materials/MaterialGridSkeleton.tsx'
import StickyNote from '../components/notebook/StickyNote.tsx'
import { ROUTES } from '../config/routes.ts'

export default function FavoritesPage() {
  const { status: userStatus, user } = useCurrentUser()

  const favorites = useApi(
    (signal) => (user ? getFavorites(user.keycloakId, { signal }) : new Promise<never>(() => {})),
    [user?.keycloakId],
  )

  const failed = userStatus === 'error' || favorites.status === 'error'
  const materials = favorites.data ?? []

  return (
    <PageContainer title="შენახული მასალები" subtitle="მასალები, რომლებიც რჩეულებში დაამატე — ყოველთვის ხელთ.">
      {failed && (
        <StickyNote title="რჩეულები ვერ ჩაიტვირთა" className="mt-space-xl w-72 -rotate-1">
          <p>სერვერთან კავშირი ვერ მოხერხდა. სცადე გვერდის განახლება.</p>
        </StickyNote>
      )}

      {!failed && favorites.status === 'loading' && <MaterialGridSkeleton count={3} />}

      {favorites.status === 'ready' && materials.length === 0 && (
        <StickyNote title="ჯერ ცარიელია" className="mt-space-xl w-72 rotate-1">
          <p>შენახული მასალა ჯერ არ გაქვს. მოძებნე რამე საინტერესო მთავარ გვერდზე.</p>
          <Link to={ROUTES.home} className="mt-space-sm inline-block font-hand text-[20px] text-pen underline underline-offset-4">
            მასალების ნახვა →
          </Link>
        </StickyNote>
      )}

      {materials.length > 0 && (
        <div className="mt-space-xl grid gap-x-space-lg gap-y-space-xl sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {materials.map((material, index) => (
            <MaterialCard key={material.id} material={material} index={index} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
