// Placeholder feed for markup only — replace with GET /api/materials later.

export type MaterialTag = 'შუალედური' | 'ფინალური' | 'სილაბუსი' | 'კონსპექტი' | 'წიგნი' | 'პრეზენტაცია'

export type MaterialSummary = {
  id: number
  title: string
  subject: string
  subjectCode: string
  tags: MaterialTag[]
  uploader: string
  uploadDate: string
  likes: number
  /** Whether the current user has liked it */
  likedByMe: boolean
}

export const MATERIAL_TAGS: MaterialTag[] = ['შუალედური', 'ფინალური', 'სილაბუსი', 'კონსპექტი', 'წიგნი', 'პრეზენტაცია']

export const MOCK_MATERIALS: MaterialSummary[] = [
  {
    id: 1,
    title: 'მონაცემთა სტრუქტურები — სრული კონსპექტი და შუალედურის ამოცანები',
    subject: 'მონაცემთა სტრუქტურები',
    subjectCode: 'CS-204',
    tags: ['კონსპექტი', 'შუალედური'],
    uploader: 'დავით კვარაცხელია',
    uploadDate: '2025-02-14',
    likes: 34,
    likedByMe: true,
  },
  {
    id: 2,
    title: 'ალგორითმები II — ლექციების პრეზენტაციები (დინამიური დაპროგრამება)',
    subject: 'ალგორითმები II',
    subjectCode: 'CS-301',
    tags: ['პრეზენტაცია'],
    uploader: 'ნინო ახვლედიანი',
    uploadDate: '2025-02-08',
    likes: 29,
    likedByMe: false,
  },
  {
    id: 3,
    title: 'კალკულუსი I — ფინალური გამოცდის საკითხები და ფორმულარი',
    subject: 'კალკულუსი I',
    subjectCode: 'MATH-101',
    tags: ['ფინალური'],
    uploader: 'მარიამ გელოვანი',
    uploadDate: '2025-01-27',
    likes: 52,
    likedByMe: false,
  },
  {
    id: 4,
    title: 'მონაცემთა ბაზები — SQL და ნორმალიზაციის სილაბუსი',
    subject: 'მონაცემთა ბაზები',
    subjectCode: 'DB-201',
    tags: ['სილაბუსი'],
    uploader: 'სანდრო გაბუნია',
    uploadDate: '2025-01-11',
    likes: 22,
    likedByMe: false,
  },
]
