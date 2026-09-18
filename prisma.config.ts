import { defineConfig } from 'prisma/config'
import path from 'path'
import { readFileSync } from 'fs'

// Manually load .env before Prisma evaluates the config
try {
  const envPath = path.join(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = value
  }
} catch { /* .env not present — env vars must be set externally (e.g. CI/CD) */ }

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export default defineConfig({
  schema: path.join(process.cwd(), 'prisma/schema.prisma'),
  datasource: {
    url: databaseUrl,
  },
})
