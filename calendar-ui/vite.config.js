import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3002,
    host: true // This will enable the server to be accessible externally
  },
  base: '/calendar/',
})
