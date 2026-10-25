import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // './' permet au build de fonctionner sur https://utilisateur.github.io/depot/
  // ainsi que sur un domaine personnalisé.
  base: './',
  build: { sourcemap: false }
})
