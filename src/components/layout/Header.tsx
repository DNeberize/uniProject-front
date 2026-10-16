import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { HEADER_NAV, ROUTES } from '../../config/routes.ts'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'px-space-md py-2 font-label text-label-md transition-colors',
    isActive
      ? 'bg-primary-container text-on-primary-container'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  ].join(' ')

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/90 shadow-[0_1px_8px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-space-md px-gutter lg:px-gutter-desktop">
        <Link to={ROUTES.home} className="flex shrink-0 items-center gap-space-md">
          <img src="/logo.png" alt="SANGU" className="h-8 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-headline text-headline-sm tracking-tight text-on-surface">
              SANGU NoteHub
            </span>
            <span className="hidden font-label text-label-sm uppercase text-secondary sm:block">
              აკადემიური პლატფორმა
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-space-xs xl:flex">
          {HEADER_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          aria-label="მენიუ"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="p-2 text-secondary transition-colors hover:bg-surface-container hover:text-on-surface xl:hidden"
        >
          <span className="material-symbols-outlined text-[24px]">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-space-xs border-t border-surface-container-highest bg-surface px-gutter py-space-sm xl:hidden">
          {HEADER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
