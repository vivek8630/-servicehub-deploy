import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, paymentMethod = 'card' } = await req.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, provider: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const amount = booking.finalPrice || booking.estimatedPrice || 0
    const platformFee = Math.round(amount * 0.1 * 100) / 100 // 10% platform fee
    const providerAmount = Math.round((amount - platformFee) * 100) / 100
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Create or update Payment record in database
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount,
        platformFee,
        providerAmount,
        status: 'PENDING',
        paymentMethod,
        transactionId,
      },
      update: {
        amount,
        platformFee,
        providerAmount,
        status: 'PENDING',
        paymentMethod,
        transactionId,
      },
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      clientSecret: `mock_sec_${payment.transactionId}`,
      message: 'Payment intent created successfully',
    })
  } catch (err: any) {
    console.error('Payment Intent Error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
