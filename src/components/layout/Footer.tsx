export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest py-space-xl">
      <div className="flex w-full flex-col items-center justify-between gap-space-md px-gutter text-center md:flex-row md:text-left lg:px-gutter-desktop">
        <div className="flex flex-col items-center gap-space-sm md:flex-row md:gap-space-md">
          <span className="font-headline text-headline-sm text-on-surface">SANGU NoteHub</span>
          <span className="text-body-sm text-secondary">
            © {new Date().getFullYear()} წმ. ანდრიას ქართული უნივერსიტეტი. ყველა უფლება დაცულია.
          </span>
        </div>
      </div>
    </footer>
  )
}
