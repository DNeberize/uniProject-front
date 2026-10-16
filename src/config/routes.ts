export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  materialDetails: '/materials/:id',
  upload: '/upload',
  favorites: '/favorites',
  moderation: '/moderation',
  admin: '/admin',
} as const

export const materialPath = (id: string | number) => `/materials/${id}`

/** Links shown in the header navigation. */
export const HEADER_NAV = [
  { to: ROUTES.home, label: 'მთავარი' },
  { to: ROUTES.upload, label: 'მასალის ატვირთვა' },
  { to: ROUTES.moderation, label: 'მოდერაცია' },
  { to: ROUTES.admin, label: 'ადმინისტრაცია' },
] as const
