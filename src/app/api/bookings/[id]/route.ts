import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// Update booking status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { status, cancellationReason, finalPrice } = body

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { include: { user: true } },
        provider: { include: { user: true } },
      },
    })

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    // Authorization checks
    if (user.role === 'PROVIDER') {
      if (booking.provider.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // Provider can accept/reject/confirm/start/complete
      const allowedStatuses = ['ACCEPTED', 'REJECTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
      }
    } else if (user.role === 'CUSTOMER') {
      if (booking.customer.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // Customer can only cancel
      if (status !== 'CANCELLED') {
        return NextResponse.json({ error: 'Customers can only cancel bookings' }, { status: 400 })
      }
    }
    // Admin can do anything

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(cancellationReason ? { cancellationReason } : {}),
        ...(finalPrice ? { finalPrice } : {}),
      },
    })

    // Send notification
    const notifyUserId =
      user.role === 'PROVIDER' ? booking.customer.userId : booking.provider.userId

    const messages: Record<string, string> = {
      ACCEPTED: 'Your booking has been accepted! The provider will confirm shortly.',
      REJECTED: 'Your booking request was rejected.',
      CONFIRMED: 'Your booking is confirmed!',
      IN_PROGRESS: 'Your service has started.',
      COMPLETED: 'Your service is now marked as completed. Please leave a review!',
      CANCELLED: 'A booking has been cancelled.',
    }

    if (messages[status]) {
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          title: `Booking ${status.replace('_', ' ').toLowerCase()}`,
          message: messages[status],
          type: 'booking_update',
          link: `/bookings/${id}`,
        },
      })
    }

    // Update provider stats if completed
    if (status === 'COMPLETED' && booking.providerProfileId) {
      await prisma.providerProfile.update({
        where: { id: booking.providerProfileId },
        data: { completedJobs: { increment: 1 } },
      })
    }

    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
