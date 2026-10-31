import { apiFetch } from './client.ts'

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

export interface AuthUser {
  keycloakId: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isDeleted: boolean
  createdAt: string
}

export const getAuthUser = () => apiFetch<AuthUser>('/auth')
