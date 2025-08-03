// @ts-check
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': './src'
      }
    }
  },
  integrations: [vue()],
  adapter: node({
    mode: 'standalone'
  }),
})
