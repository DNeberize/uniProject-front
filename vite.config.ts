import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { devAuth } from './dev-auth.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix: also load the non-VITE_ dev secrets, they stay on the dev server and never reach the bundle
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      devAuth({
        backendUrl: env.BACKEND_URL || 'https://backend.chemilabi.trade',
        username: env.DEV_AUTH_USERNAME,
        password: env.DEV_AUTH_PASSWORD,
      }),
    ],
  }
})
