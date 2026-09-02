import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session-token')?.value

  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          isActive: true,
          customerProfile: { select: { id: true } },
          providerProfile: { select: { id: true, isVerified: true, verificationStatus: true } },
        },
      },
    },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  if (!session.user.isActive) return null

  return session.user
}

export async function requireAuth() {
  const user = await getSession()
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  return user
}

export async function requireRole(role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN') {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error('FORBIDDEN')
  }
  return user
}
