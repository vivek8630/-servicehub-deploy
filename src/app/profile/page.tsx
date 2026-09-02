import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ProfileClient from './profile-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your ServiceHub account settings and location details.',
}

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/login')

  // If PROVIDER, redirect to the provider-specific profile page
  if (user.role === 'PROVIDER') {
    redirect('/provider/profile')
  }

  // Load customer profile details
  const customer = await prisma.customerProfile.findUnique({
    where: { userId: user.id },
    include: { user: { select: { name: true, email: true, phone: true } } },
  })

  if (!customer) {
    redirect('/')
  }

  const initialData = {
    name: customer.user.name,
    email: customer.user.email,
    phone: customer.user.phone || '',
    address: customer.address || '',
    city: customer.city || '',
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <ProfileClient initialData={initialData} />
    </div>
  )
}
