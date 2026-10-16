import type { ReactNode } from 'react'

type PageContainerProps = {
  title: string
  children?: ReactNode
}

/** Shared wrapper for page content: consistent vertical spacing and page heading. */
export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <section className="py-space-xl">
      <h1 className="font-headline text-headline-lg-mobile text-on-surface md:text-headline-lg">
        {title}
      </h1>
      {children}
    </section>
  )
}
