import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils'
import { BookOpen, ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bookings Management | Admin' }

interface AdminBookingsProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsProps) {
  const sessionUser = await getSession()
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/')

  const params = await searchParams
  const statusFilter = params.status

  const whereCondition = statusFilter ? { status: statusFilter as any } : {}

  const bookings = await prisma.booking.findMany({
    where: whereCondition,
    include: {
      customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
      provider: { include: { user: { select: { name: true, email: true, phone: true } } } },
      service: { select: { name: true, price: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                Bookings Management
              </h1>
              <p className="text-sm text-slate-500">
                {statusFilter ? `Filtering by ${statusFilter} (${bookings.length} found)` : `All Platform Bookings (${bookings.length} total)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/bookings">
              <Button variant={!statusFilter ? 'default' : 'outline'} size="sm">All</Button>
            </Link>
            <Link href="/admin/bookings?status=PENDING">
              <Button variant={statusFilter === 'PENDING' ? 'default' : 'outline'} size="sm">Pending</Button>
            </Link>
            <Link href="/admin/bookings?status=COMPLETED">
              <Button variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'} size="sm">Completed</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500">
                No bookings found for the selected filter.
              </CardContent>
            </Card>
          ) : (
            bookings.map((b) => (
              <Card key={b.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            b.status === 'COMPLETED'
                              ? 'success'
                              : b.status === 'PENDING'
                              ? 'warning'
                              : b.status === 'CANCELLED' || b.status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {b.status}
                        </Badge>
                        <h3 className="font-bold text-slate-900">
                          {b.service?.name || 'Custom Service'}
                        </h3>
                      </div>

                      <div className="text-sm text-slate-600 space-y-1">
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span><strong>Customer:</strong> {b.customer.user.name} ({b.customer.user.email})</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span><strong>Provider:</strong> {b.provider.user.name} ({b.provider.user.email})</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(b.scheduledDate).toLocaleDateString()} at {b.scheduledTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {b.address} {b.city ? `, ${b.city}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(b.estimatedPrice)}
                      </p>
                      <p className="text-xs text-slate-400">Created {new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
