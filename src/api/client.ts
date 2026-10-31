
const API_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    credentials: API_URL ? 'include' : 'same-origin',
    headers: { Accept: 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    throw new ApiError(response.status, `${init?.method ?? 'GET'} /api${path} failed with ${response.status}`)
  }
  if (!response.headers.get('content-type')?.includes('json')) {
    throw new ApiError(response.status, `${init?.method ?? 'GET'} /api${path} returned ${response.headers.get('content-type')} instead of JSON, is /api proxied to the backend?`)
  }
  return response.json() as Promise<T>
}
