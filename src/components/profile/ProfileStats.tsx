import StickyNote from '../notebook/StickyNote.tsx'

type ProfileStatsProps = {
  total: number
  approved: number
  pending: number
  rejected: number
  averageRating: number
  ratingCount: number
}

/** Upload counters as four small sticky notes, plus the average rating underneath. */
export default function ProfileStats({ total, approved, pending, rejected, averageRating, ratingCount }: ProfileStatsProps) {
  const notes = [
    { label: 'ატვირთული', mark: '📁', value: total, caption: 'სულ მასალა', color: 'text-on-sticky', tilt: '-rotate-1' },
    { label: 'დამტკიცებული', mark: '✓', value: approved, caption: 'ხელმისაწვდომია', color: 'text-status-approved', tilt: 'rotate-1' },
    { label: 'მოლოდინში', mark: '⏳', value: pending, caption: 'მოდერაციის რიგში', color: 'text-status-pending', tilt: 'rotate-2' },
    { label: 'უარყოფილი', mark: '✕', value: rejected, caption: 'გასასწორებელია', color: 'text-status-rejected', tilt: '-rotate-2' },
  ]

  return (
    <div className="flex flex-col gap-space-md">
      <div className="grid grid-cols-2 gap-3.5">
        {notes.map((note) => (
          <StickyNote key={note.label} className={note.tilt}>
            <div className={note.color}>
              <p className="flex items-center justify-between font-label text-label-sm">
                <span>{note.label}</span>
                <span aria-hidden="true">{note.mark}</span>
              </p>
              <p className="mt-1 font-headline text-[30px] font-bold leading-9">{note.value}</p>
              <p className="text-body-sm opacity-80">{note.caption}</p>
            </div>
          </StickyNote>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border border-outline-variant bg-white/70 px-3.5 py-3 shadow-sm">
        <p className="flex items-center gap-2 font-hand text-[22px] font-bold text-pen">
          <span aria-hidden="true" className="text-[18px]">⭐</span>
          საშუალო რეიტინგი ★ {averageRating}
        </p>
        <p className="font-hand text-[17px] text-secondary">(სულ {ratingCount} სტუდენტის შეფასება)</p>
      </div>
    </div>
  )
}
