import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { providerProfileId, action } = body

    if (!providerProfileId) {
      return NextResponse.json({ error: 'Provider Profile ID required' }, { status: 400 })
    }
    if (action !== 'APPROVE' && action !== 'REJECT') {
      return NextResponse.json({ error: 'Invalid action. Must be APPROVE or REJECT' }, { status: 400 })
    }

    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider Profile not found' }, { status: 404 })
    }

    const status = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'
    const isVerified = action === 'APPROVE'

    const updated = await prisma.providerProfile.update({
      where: { id: providerProfileId },
      data: { verificationStatus: status, isVerified },
    })

    // Notify provider
    await prisma.notification.create({
      data: {
        userId: provider.userId,
        title: action === 'APPROVE' ? 'Profile Verified!' : 'Verification Application Rejected',
        message: action === 'APPROVE'
          ? 'Congratulations! Your profile details have been approved and you are now a verified service provider.'
          : 'Unfortunately, your verification details did not match our requirements. Please check and re-apply.',
        type: action === 'APPROVE' ? 'verification_approved' : 'verification_rejected',
        link: '/provider/verification',
      },
    })

    return NextResponse.json({ provider: updated })
  } catch (error) {
    console.error('Admin verification transition error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
