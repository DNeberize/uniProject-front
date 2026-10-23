import type { ReactNode } from 'react'
import { Underline } from '../notebook/Doodles.tsx'

type PageContainerProps = {
  title: string
  subtitle?: string
  children?: ReactNode
}

/** Shared wrapper for page content: consistent vertical spacing and a page heading with a red-pen underline. */
export default function PageContainer({ title, subtitle, children }: PageContainerProps) {
  return (
    <section className="py-space-xl">
      <h1 className="font-headline text-headline-lg-mobile text-ink md:text-headline-lg">
        <span className="relative inline-block">
          {title}
          <Underline className="absolute -bottom-2.5 -left-1 h-3 w-[calc(100%+10px)] text-primary" />
        </span>
      </h1>
      {subtitle && <p className="mt-space-lg max-w-prose text-body-lg text-on-surface-variant">{subtitle}</p>}
      {children}
    </section>
  )
}
