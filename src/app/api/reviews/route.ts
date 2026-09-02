import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { reviewSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user || user.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { bookingId } = body
    if (!bookingId) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, review: true },
    })

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    if (booking.customer.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (booking.status !== 'COMPLETED') return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 })
    if (booking.review) return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })

    const { rating, serviceQuality, communication, valueForMoney, comment } = parsed.data

    const review = await prisma.review.create({
      data: {
        bookingId,
        customerProfileId: booking.customerProfileId,
        providerProfileId: booking.providerProfileId,
        rating,
        serviceQuality,
        communication,
        valueForMoney,
        comment: comment || null,
      },
    })

    // Update provider's average rating
    const reviews = await prisma.review.findMany({
      where: { providerProfileId: booking.providerProfileId, isVisible: true },
      select: { rating: true },
    })
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.providerProfile.update({
      where: { id: booking.providerProfileId },
      data: { rating: parseFloat(avg.toFixed(2)), totalReviews: reviews.length },
    })

    // Notify provider
    const provider = await prisma.providerProfile.findUnique({
      where: { id: booking.providerProfileId },
      select: { userId: true },
    })
    if (provider) {
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          title: 'New Review Received',
          message: `${user.name} left you a ${rating}★ review.`,
          type: 'review_new',
          link: `/provider/reviews`,
        },
      })
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
