import { useEffect, useState } from 'react'
import { getAuthUser, type AuthUser } from '../api/user.ts'

let request: Promise<AuthUser> | undefined

type CurrentUserState =
  | { status: 'loading'; user?: undefined }
  | { status: 'ready'; user: AuthUser }
  | { status: 'error'; user?: undefined }

export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    request ??= getAuthUser()
    request.then(
      (user) => active && setState({ status: 'ready', user }),
      () => {
        request = undefined
        if (active) setState({ status: 'error' })
      },
    )
    return () => {
      active = false
    }
  }, [])

  return state
}
