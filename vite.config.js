import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    allowedHosts: [
      'procuremindai.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1',
    ],
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'procuremindai.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1',
    ],
  },
})

