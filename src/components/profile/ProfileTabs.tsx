export type ProfileTabId = 'uploads' | 'saved'

type ProfileTab = {
  id: ProfileTabId
  label: string
  /** Shorter label for phones, so the tabs always fit side by side */
  shortLabel: string
  icon: string
  count?: number
}

type ProfileTabsProps = {
  tabs: ProfileTab[]
  active: ProfileTabId
  onChange: (id: ProfileTabId) => void
}

/**
 * Notebook divider tabs that sit on top of the panel below them. On phones the tabs share the
 * width equally and use their short labels, so nothing ever scrolls sideways.
 */
export default function ProfileTabs({ tabs, active, onChange }: ProfileTabsProps) {
  return (
    <div role="tablist" className="flex items-end gap-1.5 px-1 sm:gap-2 sm:pl-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-t-xl font-headline transition-colors sm:flex-none sm:gap-2 ${
              isActive
                ? 'z-10 -mb-0.5 border-2 border-b-0 border-outline bg-white px-2.5 py-2.5 text-body-md font-bold text-ink sm:px-6 sm:text-body-lg'
                : 'border border-b-0 border-outline bg-surface-container-high px-2.5 py-2 text-body-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest sm:px-5 sm:text-body-md'
            }`}
          >
            {/* Icons only from tablet width up: phones need the room for the label (the wrapper hides
                it, since the icon class sets its own display) */}
            <span aria-hidden="true" className="hidden sm:inline-flex">
              <span className={`material-symbols-outlined text-[18px] ${isActive ? 'icon-filled text-primary' : ''}`}>{tab.icon}</span>
            </span>
            <span className="truncate sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`shrink-0 rounded-full px-2 font-code text-code-sm ${
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
