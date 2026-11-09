import { useEffect, useState } from 'react'

export type ApiState<T> =
  | { status: 'loading'; data?: T; error?: undefined }
  | { status: 'ready'; data: T; error?: undefined }
  | { status: 'error'; data?: T; error: unknown }

type Settled<T> = { key: string; data?: T; error?: unknown; failed?: boolean }

/**
 * Runs `load` whenever `deps` change, aborting the previous request.
 * Keeps the last data while reloading so lists don't flash empty.
 */
export function useApi<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]): ApiState<T> {
  const key = JSON.stringify(deps)
  const [settled, setSettled] = useState<Settled<T> | undefined>()

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      (data) => setSettled({ key, data }),
      (error: unknown) => {
        if (!controller.signal.aborted) setSettled((current) => ({ key, error, failed: true, data: current?.data }))
      },
    )
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Until the request for the current deps settles, we are loading (with the previous data, if any)
  if (settled?.key !== key) return { status: 'loading', data: settled?.data }
  if (settled.failed) return { status: 'error', error: settled.error, data: settled.data }
  return { status: 'ready', data: settled.data as T }
}
