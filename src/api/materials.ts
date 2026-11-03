import { ApiError, apiFetch } from './client.ts'

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
  tags: string[]
  createdAt: string
}

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

/** Step 1: ask the backend for a presigned S3 link (valid for 10 minutes) */
export const getUploadUrl = (file: File, contentType: string) =>
  apiFetch<PresignedUrl>(
    `/materials/upload-url?${new URLSearchParams({ fileName: file.name, contentType, fileSize: String(file.size) })}`,
  )

/** Step 2: PUT the file straight to S3. Not through apiFetch: it is not our API and returns no JSON. */
export async function putToStorage(uploadUrl: string, file: File, contentType: string) {
  const response = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
  if (!response.ok) throw new ApiError(response.status, `PUT to storage failed with ${response.status}`)
}

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
