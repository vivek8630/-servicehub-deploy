import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { transactionId, status = 'SUCCESS', bookingId } = body

    if (!bookingId && !transactionId) {
      return NextResponse.json({ error: 'Transaction or Booking ID required' }, { status: 400 })
    }

    let payment = null

    if (bookingId) {
      payment = await prisma.payment.findUnique({ where: { bookingId } })
    } else if (transactionId) {
      payment = await prisma.payment.findFirst({ where: { transactionId } })
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
      },
    })

    // If payment succeeded, confirm the booking
    if (status === 'SUCCESS') {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      })

      // Record provider earning
      const booking = await prisma.booking.findUnique({
        where: { id: payment.bookingId },
        select: { providerProfileId: true },
      })

      if (booking) {
        const now = new Date()
        await prisma.earning.create({
          data: {
            providerProfileId: booking.providerProfileId,
            bookingId: payment.bookingId,
            amount: payment.providerAmount,
            description: `Payment for booking #${payment.bookingId.slice(-6)}`,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
          },
        })
      }
    }

    return NextResponse.json({
      received: true,
      status: updatedPayment.status,
    })
  } catch (err: any) {
    console.error('Payment Webhook Error:', err)
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 })
  }
}
