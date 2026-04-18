import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cambia '/Bechapp/' por el nombre de tu repositorio en GitHub al hacer deploy
export default defineConfig({
  plugins: [react()],
  base: '/bechapp/',
})
