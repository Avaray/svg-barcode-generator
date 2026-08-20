import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  minify: true,
  sourcemap: true,
  target: 'es2020',
  globalName: 'BarcodeGenerator',
  clean: true,
  outDir: 'dist'
})
