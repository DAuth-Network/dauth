import * as esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss'

const option = {
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
}

if (process.argv.slice(2).includes('--watch')) {
  const ctx = await esbuild.context(option)
  await ctx.watch()
} else {
  await esbuild.build()
}
