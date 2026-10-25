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
  rating: number
  ratingCount: number
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
    rating: 4.9,
    ratingCount: 34,
  },
  {
    id: 2,
    title: 'ალგორითმები II — ლექციების პრეზენტაციები (დინამიური დაპროგრამება)',
    subject: 'ალგორითმები II',
    subjectCode: 'CS-301',
    tags: ['პრეზენტაცია'],
    uploader: 'ნინო ახვლედიანი',
    uploadDate: '2025-02-08',
    rating: 4.8,
    ratingCount: 29,
  },
  {
    id: 3,
    title: 'კალკულუსი I — ფინალური გამოცდის საკითხები და ფორმულარი',
    subject: 'კალკულუსი I',
    subjectCode: 'MATH-101',
    tags: ['ფინალური'],
    uploader: 'მარიამ გელოვანი',
    uploadDate: '2025-01-27',
    rating: 4.7,
    ratingCount: 52,
  },
  {
    id: 4,
    title: 'მონაცემთა ბაზები — SQL და ნორმალიზაციის სილაბუსი',
    subject: 'მონაცემთა ბაზები',
    subjectCode: 'DB-201',
    tags: ['სილაბუსი'],
    uploader: 'სანდრო გაბუნია',
    uploadDate: '2025-01-11',
    rating: 4.9,
    ratingCount: 22,
  },
]
