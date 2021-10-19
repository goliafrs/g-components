import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

import { defineConfig } from 'vite'

export default defineConfig({
  root: './src/_site',

  server: { port: 80 },

  plugins: [
    vue(),
    jsx()
  ]
})
