import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import VerificationsClient from './verifications-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Verification Queue',
  description: 'Manage and review pending service provider verification requests.',
}

export default async function AdminVerificationsPage() {
  const user = await getSession()
  if (!user || user.role !== 'ADMIN') redirect('/')

  // Fetch providers with verificationStatus = 'PENDING'
  const pendingProviders = await prisma.providerProfile.findMany({
    where: { verificationStatus: 'PENDING' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { updatedAt: 'asc' },
  })

  const formattedProviders = pendingProviders.map((p) => ({
    id: p.id,
    name: p.user.name,
    email: p.user.email,
    phone: p.user.phone || 'N/A',
    bio: p.bio || 'No bio provided.',
    experience: p.experience !== null && p.experience !== undefined ? String(p.experience) : 'N/A',
    city: p.city || 'N/A',
    location: p.location || 'N/A',
    rating: p.rating,
  }))

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <VerificationsClient pendingProviders={formattedProviders} />
    </div>
  )
}
