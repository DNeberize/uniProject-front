import { Outlet } from 'react-router'
import Footer from '../components/layout/Footer.tsx'
import Header from '../components/layout/Header.tsx'

// On large screens the content area gets the red notebook margin line on its left.
export default function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="w-full flex-1 px-gutter pt-16 lg:margin-line lg:pr-gutter-desktop lg:pl-14 lg:[--margin-x:20px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
