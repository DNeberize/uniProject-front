import { apiFetch } from './client.ts'

export interface Faculty {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
  facultyName: string
}

export interface Tag {
  id: number
  name: string
}

export const getFaculties = () => apiFetch<Faculty[]>('/faculties')

/** Subjects of one faculty, for the subject dropdown next to the faculty one */
export const getFacultySubjects = (facultyId: number) => apiFetch<Subject[]>(`/faculties/${facultyId}/subjects`)

export const getTags = () => apiFetch<Tag[]>('/tags')
