import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import NewServiceClient from './new-service-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Service',
  description: 'Add a new service to your ServiceHub profile.',
}

export default async function NewServicePage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    redirect('/')
  }

  // Fetch active categories for selection
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <NewServiceClient categories={categories} />
    </div>
  )
}
