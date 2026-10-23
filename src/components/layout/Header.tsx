import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { HEADER_NAV, ROUTES } from '../../config/routes.ts'
import MenuIcon from './MenuIcon.tsx'
import UserMenu from './UserMenu.tsx'

// The active page gets a highlighter swipe, like a marked line in a notebook.
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded px-space-md py-2 font-label text-label-md transition-colors',
    isActive
      ? 'font-semibold text-ink'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  ].join(' ')

const navLabel = (label: string, isActive: boolean) =>
  isActive ? <mark className="highlight">{label}</mark> : label

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the mobile menu
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-paper/95 backdrop-blur-sm">
        <div className="flex h-16 w-full items-center justify-between gap-space-sm px-gutter sm:gap-space-md lg:px-gutter-desktop">
          <Link to={ROUTES.home} className="flex min-w-0 items-center gap-space-sm sm:gap-space-md">
            <img src="/logo.png" alt="SANGU" className="h-8 w-auto shrink-0 object-contain sm:h-9" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-headline text-[15px] font-semibold leading-5 tracking-tight text-ink sm:text-headline-sm">
                SANGU NoteHub
              </span>
              <span className="hidden font-label text-label-sm text-secondary sm:block">
                აკადემიური პლატფორმა
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-space-xs xl:flex">
            {HEADER_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end className={navLinkClass}>
                {({ isActive }) => navLabel(item.label, isActive)}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-space-xs sm:gap-space-sm">
            <UserMenu />
            <button
              type="button"
              aria-label="მენიუ"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
              className="cursor-pointer rounded p-2 text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface xl:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: slides down from under the header (z-40 sits below the header's z-50) */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-x-0 top-16 bottom-0 z-30 bg-ink/15 transition-opacity duration-300 xl:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed inset-x-0 top-16 z-40 grid shadow-[0_12px_24px_-16px_rgb(19_26_43/0.35)] transition-[grid-template-rows] duration-300 ease-out xl:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <nav
            id="mobile-nav"
            inert={!menuOpen}
            className={`bg-ruled flex flex-col gap-space-xs border-b border-outline-variant px-gutter py-space-sm transition-[translate,opacity] duration-300 ease-out ${
              menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
            }`}
          >
            {HEADER_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => navLabel(item.label, isActive)}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
