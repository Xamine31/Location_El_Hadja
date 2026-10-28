
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Location_El_Hadja/',
  build: {
    sourcemap: false,
  },
})
