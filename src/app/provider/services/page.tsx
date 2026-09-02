import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ServicesClient from './services-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Services',
  description: 'Manage the professional services you offer on ServiceHub.',
}

export default async function ProviderServicesPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    redirect('/')
  }

  const services = await prisma.service.findMany({
    where: { providerProfileId: user.providerProfile.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  // Format services to match the client component needs
  const formattedServices = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description || '',
    price: s.price,
    priceType: s.priceType,
    estimatedDuration: s.estimatedDuration || null,
    isActive: s.isActive,
    categoryName: s.category.name,
  }))

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <ServicesClient initialServices={formattedServices} />
    </div>
  )
}
