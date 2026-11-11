import { ApiError, apiFetch, apiSend, putToStorage } from './client.ts'

export interface UserSummary {
  keycloakId: string
  firstName: string
  lastName: string
  email: string
}

export interface PresignedUrl {
  uploadUrl: string
  fileKey: string
}

export interface MaterialCreate {
  title: string
  description?: string
  fileKey: string
  subjectId: number
  tagNames: string[]
}

export interface MaterialResponse {
  id: number
  title: string
  description?: string
  fileUrl: string
  status: string
  uploader: UserSummary
  subjectName: string
  likesCount: number
  /** Missing when nobody is signed in */
  isLikedByCurrentUser?: boolean
  tags: string[]
  createdAt: string
}

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

/** Sort values the backend's SortOption enum accepts */
export type MaterialSort = 'NEWEST' | 'LIKES'

export interface MaterialSearchParams {
  q?: string
  tags?: string[]
  sort?: MaterialSort
  page?: number
  size?: number
}

/** Materials per page on the home page */
export const HOME_PAGE_SIZE = 12

/** The home page's search, read from its URL (?q=&tags=&sort=&page=) */
export function homeSearch(params: URLSearchParams) {
  return {
    q: params.get('q') ?? '',
    tags: params.getAll('tags'),
    sort: (params.get('sort') === 'LIKES' ? 'LIKES' : 'NEWEST') as MaterialSort,
    page: Math.max(0, Number(params.get('page')) || 0),
    size: HOME_PAGE_SIZE,
  }
}

export function searchMaterialsPath({ q, tags = [], sort = 'NEWEST', page = 0, size = HOME_PAGE_SIZE }: MaterialSearchParams) {
  const params = new URLSearchParams({ sort, page: String(page), size: String(size) })
  if (q?.trim()) params.set('q', q.trim())
  for (const tag of tags) params.append('tags', tag)
  return `/materials/search?${params}`
}

/** GET /materials/search: full-text search over approved materials, filtered by tags, paged */
export const searchMaterials = (search: MaterialSearchParams, init?: RequestInit) =>
  apiFetch<Page<MaterialResponse>>(searchMaterialsPath(search), init)

export const getMaterials = (init?: RequestInit) => apiFetch<MaterialResponse[]>('/materials', init)

export async function getMaterial(id: number, init?: RequestInit) {
  try {
    return await apiFetch<MaterialResponse>(`/materials/${id}`, init)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export const getFavorites = (userId: string, init?: RequestInit) =>
  apiFetch<MaterialResponse[]>(`/users/${encodeURIComponent(userId)}/favorites`, init)

/** POST /materials/{id}/like: toggles the current user's like (adds it, or removes it if already there) */
export const toggleLike = (materialId: number) => apiSend(`/materials/${materialId}/like`, { method: 'POST' })

export const uploaderName = (user: UserSummary) => `${user.firstName} ${user.lastName}`.trim() || user.email

// Standard types by extension: browsers disagree on some (Chrome on Windows reports .zip as
// application/x-zip-compressed), and the S3 link is signed for exactly the type we send.
const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
}

export function contentTypeOf(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return CONTENT_TYPES[extension] ?? (file.type || 'application/octet-stream')
}

/** Step 1 (step 2 is putToStorage): ask the backend for a presigned S3 link (valid for 10 minutes) */
export const getUploadUrl = (file: File, contentType: string) =>
  apiFetch<PresignedUrl>(
    `/materials/upload-url?${new URLSearchParams({ fileName: file.name, contentType, fileSize: String(file.size) })}`,
  )

/** Step 3: tell the backend the file is on S3 so it saves the material */
export const confirmUpload = (material: MaterialCreate) =>
  apiFetch<MaterialResponse>('/materials/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(material),
  })

export type UploadStep = 'url' | 'storage' | 'confirm'

/** Says which of the three steps failed, so the form can show a useful message */
export class UploadError extends Error {
  readonly step: UploadStep
  /** HTTP status, or undefined when the request never got a response (network or CORS) */
  readonly status?: number

  constructor(step: UploadStep, cause: unknown) {
    super(`upload failed at step "${step}": ${cause instanceof Error ? cause.message : String(cause)}`, { cause })
    this.step = step
    this.status = cause instanceof ApiError ? cause.status : undefined
  }
}

async function step<T>(name: UploadStep, run: () => Promise<T>) {
  try {
    return await run()
  } catch (error) {
    throw new UploadError(name, error)
  }
}

/** Runs the whole upload: presigned link, S3 PUT, confirm. */
export async function uploadMaterial(
  file: File,
  details: Omit<MaterialCreate, 'fileKey'>,
  onStep?: (step: UploadStep) => void,
) {
  const contentType = contentTypeOf(file)

  onStep?.('url')
  const { uploadUrl, fileKey } = await step('url', () => getUploadUrl(file, contentType))

  onStep?.('storage')
  await step('storage', () => putToStorage(uploadUrl, file, contentType))

  onStep?.('confirm')
  return step('confirm', () => confirmUpload({ ...details, fileKey }))
}
