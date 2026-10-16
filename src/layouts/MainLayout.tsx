import { Outlet } from 'react-router'
import Footer from '../components/layout/Footer.tsx'
import Header from '../components/layout/Header.tsx'

export default function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="w-full flex-1 px-gutter pt-16 lg:px-gutter-desktop">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
