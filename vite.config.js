import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Esta configuração ensina o Render a compilar o teu código React
export default defineConfig({
  plugins: [react()]
})
