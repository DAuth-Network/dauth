import * as esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'index.js',
  bundle: true,
  sourcemap: true,
  minify: true,
  format: 'cjs',
  external: ['react'],
  loader: {
    '.png': 'dataurl',
  },
  plugins: [tailwindPlugin()],
})
