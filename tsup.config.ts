import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/shared/infra/http/server.ts'],
  clean: true,
  minify: true,
})
