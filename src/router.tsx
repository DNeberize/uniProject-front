import { createBrowserRouter } from 'react-router'
import { ROUTES } from './config/routes.ts'
import MainLayout from './layouts/MainLayout.tsx'
import AdminPage from './pages/AdminPage.tsx'
import FavoritesPage from './pages/FavoritesPage.tsx'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import MaterialDetailsPage from './pages/MaterialDetailsPage.tsx'
import ModerationPage from './pages/ModerationPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import UploadPage from './pages/UploadPage.tsx'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
      { path: ROUTES.materialDetails, element: <MaterialDetailsPage /> },
      { path: ROUTES.upload, element: <UploadPage /> },
      { path: ROUTES.favorites, element: <FavoritesPage /> },
      { path: ROUTES.moderation, element: <ModerationPage /> },
      { path: ROUTES.admin, element: <AdminPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
