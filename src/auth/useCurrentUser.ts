import { useEffect, useState } from 'react'
import { getAuthUser, type AuthUser } from '../api/user.ts'

let request: Promise<AuthUser> | undefined
/** The user once the request has finished, so components mounting later render it straight away */
let known: AuthUser | undefined
const listeners = new Set<(user: AuthUser) => void>()

type CurrentUserState =
  | { status: 'loading'; user?: undefined }
  | { status: 'ready'; user: AuthUser }
  | { status: 'error'; user?: undefined }

/**
 * Starts loading the signed-in user (once). main.tsx calls it before the first render, so the user is
 * usually already known when the header mounts and no loading skeleton (and no layout shift) is shown.
 */
export function loadCurrentUser() {
  request ??= getAuthUser().then(
    (user) => (known = user),
    (error: unknown) => {
      request = undefined
      throw error
    },
  )
  return request
}

/** Replaces the cached user everywhere (e.g. after an avatar change) */
export function setCurrentUser(user: AuthUser) {
  known = user
  request = Promise.resolve(user)
  for (const listener of listeners) listener(user)
}

export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>(() =>
    known ? { status: 'ready', user: known } : { status: 'loading' },
  )

  useEffect(() => {
    let active = true
    const onChange = (user: AuthUser) => setState({ status: 'ready', user })
    listeners.add(onChange)
    loadCurrentUser().then(
      (user) => active && setState((current) => (current.user === user ? current : { status: 'ready', user })),
      () => active && setState({ status: 'error' }),
    )
    return () => {
      active = false
      listeners.delete(onChange)
    }
  }, [])

  return state
}
