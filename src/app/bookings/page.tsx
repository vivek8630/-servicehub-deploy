import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/utils'
import { Star, Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingActionButton } from '@/components/bookings/booking-action-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Bookings' }

export default async function BookingsPage() {
  const user = await getSession()
  if (!user) redirect('/login')

  const isProvider = user.role === 'PROVIDER'
  const profileId = isProvider ? user.providerProfile?.id : user.customerProfile?.id
  if (!profileId) redirect('/login')

  const bookings = await prisma.booking.findMany({
    where: isProvider ? { providerProfileId: profileId } : { customerProfileId: profileId },
    include: {
      customer: { include: { user: { select: { name: true } } } },
      provider: { include: { user: { select: { name: true } } } },
      service: true,
      review: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          {isProvider ? 'Booking Requests' : 'My Bookings'}
        </h1>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">No bookings yet</h3>
              <p className="text-slate-500 text-sm mb-6">
                {isProvider ? 'Bookings from customers will appear here.' : 'Browse providers and book your first service.'}
              </p>
              {!isProvider && (
                <Link href="/providers">
                  <Button variant="gradient">Find a Service</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Card key={b.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          {b.service?.name || 'Service Booking'}
                        </h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${BOOKING_STATUS_COLORS[b.status]}`}>
                          {BOOKING_STATUS_LABELS[b.status]}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-3">
                        {isProvider ? `Customer: ${b.customer.user.name}` : `Provider: ${b.provider.user.name}`}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(b.scheduledDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {b.scheduledTime}
                        </div>
                      </div>

                      {b.address && (
                        <p className="text-xs text-slate-400 mt-1">{b.address}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(b.estimatedPrice)}</p>
                      <p className="text-xs text-slate-400 mb-3">{formatDate(b.createdAt)}</p>

                      <div className="flex flex-col gap-2">
                        {isProvider && b.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <BookingActionButton bookingId={b.id} status="ACCEPTED" label="Accept" variant="default" />
                            <BookingActionButton bookingId={b.id} status="REJECTED" label="Reject" variant="destructive" />
                          </div>
                        )}
                        {isProvider && b.status === 'ACCEPTED' && (
                          <BookingActionButton bookingId={b.id} status="IN_PROGRESS" label="Start" variant="default" />
                        )}
                        {isProvider && b.status === 'IN_PROGRESS' && (
                          <BookingActionButton bookingId={b.id} status="COMPLETED" label="Complete" variant="gradient" />
                        )}
                        {!isProvider && b.status === 'COMPLETED' && !b.review && (
                          <Link href={`/bookings/${b.id}/review`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Star className="w-3.5 h-3.5" />
                              Leave Review
                            </Button>
                          </Link>
                        )}
                        {!isProvider && ['PENDING', 'ACCEPTED'].includes(b.status) && (
                          <BookingActionButton bookingId={b.id} status="CANCELLED" label="Cancel" variant="destructive" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

