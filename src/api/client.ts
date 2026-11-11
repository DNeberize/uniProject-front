const API_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const send = (path: string, init?: RequestInit) =>
  fetch(`${API_URL}/api${path}`, {
    ...init,
    credentials: API_URL ? 'include' : 'same-origin',
    headers: { Accept: 'application/json', ...init?.headers },
  })

/** GETs started before the first render (see prefetchGet), waiting to be picked up by the first matching call */
const early = new Map<string, { response: Promise<Response>; at: number }>()
/** An early response older than this is not reused: the page did not ask for it in time */
const EARLY_TTL_MS = 15_000

/**
 * Starts a GET now so its response is already on the way when the page asks for it. Used by main.tsx to
 * fetch the landing page's data while the fonts load. The next plain GET of the same path takes it over (once).
 */
export function prefetchGet(path: string) {
  if (!early.has(path)) early.set(path, { response: send(path), at: performance.now() })
}

function takeEarly(path: string, init?: RequestInit) {
  if (init?.method && init.method !== 'GET') return undefined
  const entry = early.get(path)
  early.delete(path)
  return entry && performance.now() - entry.at < EARLY_TTL_MS ? entry.response.catch(() => send(path, init)) : undefined
}

async function request(path: string, init?: RequestInit) {
  const response = await (takeEarly(path, init) ?? send(path, init))
  if (!response.ok) {
    throw new ApiError(response.status, `${init?.method ?? 'GET'} /api${path} failed with ${response.status}`)
  }
  return response
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await request(path, init)
  if (!response.headers.get('content-type')?.includes('json')) {
    throw new ApiError(response.status, `${init?.method ?? 'GET'} /api${path} returned ${response.headers.get('content-type')} instead of JSON, is /api proxied to the backend?`)
  }
  return response.json() as Promise<T>
}

/** For endpoints that answer with an empty body (e.g. the like toggle) */
export async function apiSend(path: string, init?: RequestInit): Promise<void> {
  await request(path, init)
}

/** PUT a file straight to a presigned S3 link. Not through apiFetch: it is not our API and returns no JSON. */
export async function putToStorage(uploadUrl: string, file: File, contentType: string) {
  const response = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
  if (!response.ok) throw new ApiError(response.status, `PUT to storage failed with ${response.status}`)
}
