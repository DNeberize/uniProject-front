// Placeholder profile data for markup only — replace with the profile API later.
// Name, email, role and registration date already come from GET /api/auth (useCurrentUser).

export type MaterialStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

/** A material the current user uploaded, with its moderation status. */
export type MyMaterial = {
  id: number
  title: string
  subject: string
  subjectCode: string
  uploadDate: string
  status: MaterialStatus
  /** Only rejected materials have a moderator note */
  rejectionReason?: string
}

/** Profile fields the /api/auth response does not include yet. */
export const MOCK_PROFILE_DETAILS = {
  studentId: '84910',
  faculty: 'ინფორმატიკა და ინჟინერია',
  semester: '2024-2025',
}

export const MOCK_MY_MATERIALS: MyMaterial[] = [
  {
    id: 101,
    title: 'მონაცემთა სტრუქტურები - სრული კონსპექტი და შუალედურის ამოცანები (AVL, BST, B-Tree)',
    subject: 'მონაცემთა სტრუქტურები და ალგორითმები',
    subjectCode: 'CS-204',
    uploadDate: '2025-02-14',
    status: 'APPROVED',
  },
  {
    id: 102,
    title: 'Spring Boot 3 + PostgreSQL: სრული REST API ლაბორატორიული კოდი და Docker კომპოზი',
    subject: 'Java & Spring Boot',
    subjectCode: 'SWE-310',
    uploadDate: '2025-02-18',
    status: 'PENDING',
  },
  {
    id: 103,
    title: 'ბიზნეს სტატისტიკა - ლაბორატორიული 04 (ფოტოების არქივი)',
    subject: 'ბიზნეს სტატისტიკა',
    subjectCode: 'STAT-204',
    uploadDate: '2025-02-10',
    status: 'REJECTED',
    rejectionReason: 'დაბალი ხარისხი — ფაილი არ იკითხება (გადაიღეთ მაღალი რეზოლუციით ან გადაიყვანეთ PDF ფორმატში)',
  },
  {
    id: 104,
    title: 'კალკულუსი I - ფინალური გამოცდის თეორიული საკითხები და ფორმულარი',
    subject: 'კალკულუსი I',
    subjectCode: 'MATH-101',
    uploadDate: '2025-01-22',
    status: 'APPROVED',
  },
  {
    id: 105,
    title: 'კომპიუტერული ქსელები - Cisco Packet Tracer ლაბორატორიები და ტესტები',
    subject: 'ქსელები & პროტოკოლები',
    subjectCode: 'NET-220',
    uploadDate: '2025-01-15',
    status: 'APPROVED',
  },
  {
    id: 106,
    title: 'მონაცემთა ბაზების მართვის სისტემები - SQL & Normalization Cheatsheet',
    subject: 'მონაცემთა ბაზები',
    subjectCode: 'DB-201',
    uploadDate: '2025-02-20',
    status: 'PENDING',
  },
]
