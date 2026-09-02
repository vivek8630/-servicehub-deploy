import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ReviewClient from './review-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write a Review',
  description: 'Provide feedback and rate your experience with this service provider.',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function BookingReviewPage({ params }: Props) {
  const { id: bookingId } = await params
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'CUSTOMER' || !user.customerProfile) {
    redirect('/')
  }

  // Load the booking details
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      provider: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      service: {
        select: { name: true },
      },
      review: true,
    },
  })

  if (!booking) notFound()

  // Authorization checks
  if (booking.customerProfileId !== user.customerProfile.id) {
    redirect('/bookings')
  }
  if (booking.status !== 'COMPLETED') {
    redirect('/bookings')
  }
  if (booking.review) {
    redirect('/bookings') // Already reviewed
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <ReviewClient
        bookingId={bookingId}
        providerName={booking.provider.user.name}
        serviceName={booking.service?.name || 'Service'}
      />
    </div>
  )
}
