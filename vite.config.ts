import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import * as fs from 'fs'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import generateFile from 'vite-plugin-generate-file'

// Plugin to exclude folders from build output
function excludeFromBuild(foldersToExclude: string[]) {
  return {
    name: 'exclude-from-build',
    writeBundle() {
      foldersToExclude.forEach((folder) => {
        const distPath = path.resolve(__dirname, 'dist', folder)
        if (fs.existsSync(distPath)) {
          fs.rmSync(distPath, { recursive: true, force: true })
          console.log(`Removed ${folder} from dist`)
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    sourcemap: true,
    // À partir du 16/11/24 le build est devenu impossible sans options de chunking
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          console.log('id', id)
          // Pour les dépendances pnpm
          if (id.includes('.pnpm')) {
            // Extraire le vrai nom du package
            const regex = /\.pnpm\/@?(.*?)(?=@)/
            const match = id.match(regex)
            // const match = id.match(/.pnpm\/(.*?)@/) // MGu : @cortex-js/compute-engine non géré ici!!!
            if (match && match[1]) {
              // Nettoyer le nom du package
              const pkgName = match[1].replace(/@/g, '').replace(/\//g, '-')
              return `vendors/${pkgName}`
            }
          }

          // // Pour les dépendances normales
          // if (id.includes('node_modules')) {
          //   const module = id.split('node_modules/')[1].split('/')[0]
          //   return `vendors/${module.replace(/[@\/]/g, '-')}`
          // }

          // Pour les JSON
          if (id.endsWith('.json')) {
            const jsonName = id.split('/').pop().replace('.json', '')
            return `json/${jsonName}`
          }
        },
      },
    },
  },
  server: process.env.CI ? { port: 80, watch: null } : { port: 5173 },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    // Injecte dans le bundle final
    __REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify({ isDisabled: true }),
  },
  plugins: [
    tailwindcss(),
    svelte({
      compilerOptions: {
        dev: process.env.NODE_ENV !== 'production',
      },
    }),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
    generateFile([
      {
        type: 'json',
        output: './version.txt',
        data: {
          version: '3.0.20230508.' + Date.now(),
        },
      },
    ]),
    excludeFromBuild([
      'static',
      'topmaths/cours-image',
      'topmaths/cours-video',
    ]),
  ],
})
