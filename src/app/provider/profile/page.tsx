import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ProviderProfileClient from './provider-profile-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Provider Profile',
  description: 'Update your professional bio, experience, and location on ServiceHub.',
}

export default async function ProviderProfilePage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    redirect('/')
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { id: user.providerProfile.id },
    include: { user: { select: { name: true, phone: true } } },
  })

  if (!profile) {
    redirect('/')
  }

  const initialData = {
    name: profile.user.name,
    phone: profile.user.phone || '',
    bio: profile.bio || '',
    experience: profile.experience !== null && profile.experience !== undefined ? String(profile.experience) : '',
    city: profile.city || '',
    location: profile.location || '',
    isEmergencyAvailable: profile.isEmergencyAvailable,
    atHomeService: profile.atHomeService,
    onlineService: profile.onlineService,
    languages: profile.languages || '',
    latitude: profile.latitude !== null && profile.latitude !== undefined ? String(profile.latitude) : '',
    longitude: profile.longitude !== null && profile.longitude !== undefined ? String(profile.longitude) : '',
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <ProviderProfileClient initialData={initialData} />
    </div>
  )
}
