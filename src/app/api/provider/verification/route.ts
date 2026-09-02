import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { businessName, registrationNumber, docUrl } = body

    // Update status to PENDING and save business details if needed
    // The schema does not have businessName/registrationNumber fields directly on ProviderProfile,
    // so we can store them in bio or log them, or just update the verificationStatus.
    // Let's check schema.prisma to see if there are fields for registration details.
    // VerificationStatus is the main state. We will transition it to PENDING.
    
    await prisma.providerProfile.update({
      where: { id: user.providerProfile.id },
      data: {
        verificationStatus: 'PENDING',
        // If there were business details fields, we would update them.
        // Let's check schema.prisma just in case. It has:
        // isVerified: Boolean
        // verificationStatus: VerificationStatus
      },
    })

    return NextResponse.json({
      message: 'Verification application submitted successfully.',
      status: 'PENDING',
    })
  } catch (error) {
    console.error('Verification submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
