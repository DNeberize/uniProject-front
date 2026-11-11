import { useCurrentUser } from '../auth/useCurrentUser.ts'
import { getFavorites } from './materials.ts'
import { useApi } from './useApi.ts'

/** The signed-in user's bookmarked materials (GET /users/{id}/favorites). */
export function useFavorites() {
  const { status: userStatus, user } = useCurrentUser()

  const favorites = useApi(
    (signal) => (user ? getFavorites(user.keycloakId, { signal }) : new Promise<never>(() => {})),
    [user?.keycloakId],
  )

  return { ...favorites, failed: userStatus === 'error' || favorites.status === 'error' }
}
