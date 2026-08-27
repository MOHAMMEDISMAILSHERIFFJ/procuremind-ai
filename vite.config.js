import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4173

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: port,
    strictPort: false,
    allowedHosts: [
      'procuremindai.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: port,
    strictPort: false,
    allowedHosts: [
      'procuremindai.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
  },
})


