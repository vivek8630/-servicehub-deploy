import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const defaultUrl = `file:${path.join(process.cwd(), 'prisma/dev.db')}`
  const url = process.env.DATABASE_URL || defaultUrl
  const authToken = process.env.TURSO_AUTH_TOKEN

  const adapter = new PrismaLibSql({ url, authToken })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

