import { Star } from '../notebook/Doodles.tsx'

export default function Footer() {
  return (
    <footer className="bg-ruled margin-line w-full border-t border-outline-variant py-space-xl [--margin-x:12px] lg:[--margin-x:20px]">
      <div className="flex w-full flex-col items-center justify-between gap-space-md pl-10 pr-gutter text-center md:flex-row md:text-left lg:pl-14 lg:pr-gutter-desktop">
        <div className="flex flex-col items-center gap-space-sm md:flex-row md:gap-space-md">
          <span className="font-headline text-headline-sm font-semibold text-ink">SANGU NoteBase</span>
          <span className="text-body-sm text-secondary">
            © {new Date().getFullYear()} წმ. ანდრიას ქართული უნივერსიტეტი. ყველა უფლება დაცულია.
          </span>
        </div>
        <p className="flex items-center gap-2 font-hand text-[22px] text-pen" lang="la">
          Nosce te ipsum
          <Star className="h-5 w-5 rotate-12 text-primary" />
        </p>
      </div>
    </footer>
  )
}
