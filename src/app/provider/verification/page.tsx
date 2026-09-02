import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import VerificationClient from './verification-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Provider Verification',
  description: 'Apply for verification to get a verified badge and attract more customers.',
}

export default async function ProviderVerificationPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    redirect('/')
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { id: user.providerProfile.id },
    select: { verificationStatus: true, isVerified: true },
  })

  if (!profile) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <VerificationClient initialStatus={profile.verificationStatus} isVerified={profile.isVerified} />
    </div>
  )
}
