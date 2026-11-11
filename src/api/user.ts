import { apiFetch, putToStorage } from './client.ts'
import type { PresignedUrl } from './materials.ts'

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

export interface AuthUser {
  keycloakId: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isDeleted: boolean
  /** Presigned avatar URL; points at a shared default image until the user uploads one (see customAvatar) */
  avatar?: string
  createdAt: string
}

export const getAuthUser = () => apiFetch<AuthUser>('/auth')

/**
 * The user's own avatar URL, or undefined while they still have the backend's default placeholder
 * (defaults/user-profile.png: a red disc with a see-through outline that vanishes on our red backgrounds),
 * so the UI can show its own fallback instead.
 */
export function customAvatar(user: Pick<AuthUser, 'avatar'> | undefined) {
  if (!user?.avatar) return undefined
  try {
    return new URL(user.avatar).pathname.startsWith('/defaults/') ? undefined : user.avatar
  } catch {
    return undefined
  }
}

export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
/** Limit on the picked file; what gets uploaded is the much smaller cropped JPEG */
export const AVATAR_MAX_BYTES = 15 * 1024 * 1024

/** S3 key of the backend's shared placeholder image */
const DEFAULT_AVATAR_KEY = 'defaults/user-profile.png'

/** Step 1: presigned S3 link for the avatar */
const getAvatarUploadUrl = (file: File) =>
  apiFetch<PresignedUrl>(
    `/upload-url?${new URLSearchParams({ avatarName: file.name, contentType: file.type, fileSize: String(file.size) })}`,
  )

/** Step 3: point the user's avatar at the uploaded file; returns the updated user */
const updateAvatar = (fileKey: string) =>
  apiFetch<AuthUser>('/update/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileKey }),
  })

/** There is no delete endpoint: removing the avatar points it back at the default image. */
export const resetAvatar = () => updateAvatar(DEFAULT_AVATAR_KEY)

/** Presigned link, S3 PUT, then save it as the avatar. */
export async function uploadAvatar(file: File) {
  const { uploadUrl, fileKey } = await getAvatarUploadUrl(file)
  await putToStorage(uploadUrl, file, file.type)
  return updateAvatar(fileKey)
}
