import type { MaterialStatus } from '../../mocks/profile.ts'

const STATUS_STYLES: Record<MaterialStatus, { label: string; mark: string; className: string }> = {
  APPROVED: {
    label: 'დამტკიცებული',
    mark: '✓',
    className: 'border-status-approved-border bg-status-approved-bg text-status-approved',
  },
  PENDING: {
    label: 'მოლოდინში',
    mark: '⏳',
    className: 'border-status-pending-border bg-status-pending-bg text-status-pending',
  },
  REJECTED: {
    label: 'უარყოფილი',
    mark: '✕',
    className: 'border-status-rejected-border bg-status-rejected-bg text-status-rejected',
  },
}

/** Moderation status pill: approved (green), pending (amber) or rejected (red). */
export default function StatusBadge({ status }: { status: MaterialStatus }) {
  const { label, mark, className } = STATUS_STYLES[status]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-label text-label-sm ${className}`}>
      <span aria-hidden="true">{mark}</span>
      {label}
    </span>
  )
}
