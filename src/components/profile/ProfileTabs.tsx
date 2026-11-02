export type ProfileTabId = 'uploads' | 'saved' | 'comments'

type ProfileTab = {
  id: ProfileTabId
  label: string
  count?: number
  /** Hide on phones so the tabs fit on one row */
  hideOnMobile?: boolean
}

type ProfileTabsProps = {
  tabs: ProfileTab[]
  active: ProfileTabId
  onChange: (id: ProfileTabId) => void
}

/** Notebook divider tabs that sit on top of the panel below them. */
export default function ProfileTabs({ tabs, active, onChange }: ProfileTabsProps) {
  return (
    <div role="tablist" className="flex items-end gap-1.5 pl-2 sm:gap-2 sm:pl-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative cursor-pointer items-center gap-2 rounded-t-xl font-headline transition-colors ${
              tab.hideOnMobile ? 'hidden sm:flex' : 'flex'
            } ${
              isActive
                ? 'z-10 -mb-0.5 border-2 border-b-0 border-outline bg-white px-4 py-2.5 text-body-md font-bold text-ink sm:px-6 sm:text-body-lg'
                : 'border border-b-0 border-outline bg-surface-container-high px-3.5 py-2 text-body-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest sm:px-5 sm:text-body-md'
            }`}
          >
            {isActive && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 font-code text-code-sm ${
                  isActive
                    ? 'border border-status-pending-border bg-status-pending-bg text-status-pending'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-1 rounded-full bg-marker" />}
          </button>
        )
      })}
    </div>
  )
}
