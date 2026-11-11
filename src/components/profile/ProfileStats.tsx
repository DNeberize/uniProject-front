import StickyNote from '../notebook/StickyNote.tsx'

type ProfileStatsProps = {
  total: number
  approved: number
  pending: number
  rejected: number
}

/** Upload counters as four small sticky notes. */
export default function ProfileStats({ total, approved, pending, rejected }: ProfileStatsProps) {
  const notes = [
    { label: 'ატვირთული', mark: '📁', value: total, caption: 'სულ მასალა', color: 'text-on-sticky', tilt: '-rotate-1' },
    { label: 'დადასტურებული', mark: '✓', value: approved, caption: 'ხელმისაწვდომია', color: 'text-status-approved', tilt: 'rotate-1' },
    { label: 'მოლოდინში', mark: '⏳', value: pending, caption: 'მოდერაციის რიგში', color: 'text-status-pending', tilt: 'rotate-2' },
    { label: 'უარყოფილი', mark: '✕', value: rejected, caption: 'გასასწორებელია', color: 'text-status-rejected', tilt: '-rotate-2' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {notes.map((note) => (
        <StickyNote key={note.label} className={note.tilt}>
          <div className={note.color}>
            <p className="flex items-center justify-between gap-1 font-label text-label-sm">
              <span className="min-w-0 truncate">{note.label}</span>
              {/* The corner mark is decoration: on very narrow phones the label needs its room */}
              <span aria-hidden="true" className="max-[380px]:hidden">{note.mark}</span>
            </p>
            <p className="mt-1 font-headline text-[30px] font-bold leading-9">{note.value}</p>
            {/* Full colour (no fade): small text needs 4.5:1 contrast on the yellow note */}
            <p className="text-body-sm">{note.caption}</p>
          </div>
        </StickyNote>
      ))}
    </div>
  )
}
