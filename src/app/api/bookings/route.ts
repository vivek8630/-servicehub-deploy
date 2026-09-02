import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { bookingSchema } from '@/lib/validations'

// Get bookings (customer sees their own, provider sees assigned)
export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  let where: Record<string, unknown> = {}

  if (user.role === 'CUSTOMER' && user.customerProfile) {
    where = { customerProfileId: user.customerProfile.id }
  } else if (user.role === 'PROVIDER' && user.providerProfile) {
    where = { providerProfileId: user.providerProfile.id }
  } else if (user.role === 'ADMIN') {
    where = {}
  } else {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (status) where.status = status

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { include: { user: { select: { name: true, email: true, image: true } } } },
        provider: { include: { user: { select: { name: true, email: true, image: true } } } },
        service: { include: { category: true } },
        review: true,
      },
    }),
    prisma.booking.count({ where }),
  ])

  return NextResponse.json({ bookings, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}

// Create booking (customer only)
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user || user.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!user.customerProfile) {
    return NextResponse.json({ error: 'Customer profile not found' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { providerId, serviceId, scheduledDate, scheduledTime, address, city, notes, estimatedPrice } = parsed.data

    const provider = await prisma.providerProfile.findUnique({ where: { id: providerId } })
    if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 })

    const booking = await prisma.booking.create({
      data: {
        customerProfileId: user.customerProfile.id,
        providerProfileId: providerId,
        serviceId: serviceId || null,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        address,
        city: city || null,
        notes: notes || null,
        estimatedPrice,
        status: 'PENDING',
      },
      include: {
        provider: { include: { user: { select: { name: true } } } },
        service: true,
      },
    })

    // Create notification for provider
    if (provider.userId) {
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          title: 'New Booking Request',
          message: `${user.name} has requested a booking for ${booking.service?.name || 'your service'}.`,
          type: 'booking_new',
          link: `/provider/bookings/${booking.id}`,
        },
      })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
