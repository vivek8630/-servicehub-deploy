import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/utils'
import {
  IndianRupee,
  Calendar,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Clock,
  Settings,
  PlusCircle,
  Briefcase,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingActionButton } from '@/components/bookings/booking-action-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Provider Dashboard' }

export default async function ProviderDashboard() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'PROVIDER') redirect(user.role === 'CUSTOMER' ? '/dashboard' : '/admin')

  const providerId = user.providerProfile?.id
  if (!providerId) redirect('/login')

  const [profile, recentBookings, pendingBookings] = await Promise.all([
    prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        services: { where: { isActive: true }, include: { category: true } },
        _count: { select: { bookings: true, reviews: true, favorites: true } },
      },
    }),
    prisma.booking.findMany({
      where: { providerProfileId: providerId },
      include: {
        customer: { include: { user: { select: { name: true } } } },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { providerProfileId: providerId, status: 'PENDING' },
      include: {
        customer: { include: { user: { select: { name: true } } } },
        service: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }),
  ])

  const totalEarnings = await prisma.booking.aggregate({
    where: { providerProfileId: providerId, status: 'COMPLETED' },
    _sum: { estimatedPrice: true },
  })

  const thisMonthEarnings = await prisma.booking.aggregate({
    where: {
      providerProfileId: providerId,
      status: 'COMPLETED',
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    _sum: { estimatedPrice: true },
  })

  const stats = [
    { label: 'Total Earnings', value: formatCurrency(totalEarnings._sum.estimatedPrice || 0), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'This Month', value: formatCurrency(thisMonthEarnings._sum.estimatedPrice || 0), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed Jobs', value: profile?.completedJobs || 0, icon: CheckCircle, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Rating', value: `${(profile?.rating || 0).toFixed(1)}★`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  const verificationStatus = user.providerProfile?.verificationStatus

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Provider Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back, {user.name.split(' ')[0]}!</p>
            </div>
            <div className="flex items-center gap-3">
              {verificationStatus === 'UNVERIFIED' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700">
                  ⚠️ Profile not verified yet.{' '}
                  <Link href="/provider/verification" className="underline font-medium">Apply for verification</Link>
                </div>
              )}
              <Link href="/provider/services/new">
                <Button variant="gradient">
                  <PlusCircle className="w-4 h-4" />
                  Add Service
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Pending Requests
                    {pendingBookings.length > 0 && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {pendingBookings.length}
                      </span>
                    )}
                  </CardTitle>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingBookings.map((b) => (
                      <div key={b.id} className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm">
                            {b.customer.user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {b.service?.name || 'Service'} · {formatDate(b.scheduledDate)} at {b.scheduledTime}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{b.address}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm text-slate-900">{formatCurrency(b.estimatedPrice)}</p>
                          <div className="flex gap-1.5 mt-2 justify-end">
                            <BookingActionButton bookingId={b.id} status="ACCEPTED" label="Accept" variant="default" size="sm" className="h-7 px-2 text-xs" />
                            <BookingActionButton bookingId={b.id} status="REJECTED" label="Reject" variant="destructive" size="sm" className="h-7 px-2 text-xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm">{b.customer.user.name}</p>
                          <p className="text-xs text-slate-500">{b.service?.name} · {formatDate(b.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${BOOKING_STATUS_COLORS[b.status]}`}>
                            {BOOKING_STATUS_LABELS[b.status]}
                          </span>
                          <span className="text-sm font-semibold text-slate-700">{formatCurrency(b.estimatedPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile + Services Quick View */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Services Listed</span>
                  <span className="font-semibold text-slate-900">{profile?.services.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Reviews</span>
                  <span className="font-semibold text-slate-900">{profile?.totalReviews || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Saved by Customers</span>
                  <span className="font-semibold text-slate-900">{profile?._count.favorites || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Verification</span>
                  <Badge variant={verificationStatus === 'VERIFIED' ? 'verified' : verificationStatus === 'PENDING' ? 'warning' : 'secondary'} className="text-[10px]">
                    {verificationStatus}
                  </Badge>
                </div>
                <Link href="/provider/profile">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Services</CardTitle>
                  <Link href="/provider/services/new">
                    <Button variant="ghost" size="sm"><PlusCircle className="w-4 h-4" /></Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {!profile?.services.length ? (
                  <p className="text-slate-500 text-sm text-center py-2">No services added yet</p>
                ) : (
                  <div className="space-y-2">
                    {profile.services.slice(0, 3).map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{s.name}</p>
                          <p className="text-slate-400 text-[10px]">{s.category.name}</p>
                        </div>
                        <span className="text-violet-600 font-semibold text-xs">{formatCurrency(s.price)}</span>
                      </div>
                    ))}
                    {profile.services.length > 3 && (
                      <Link href="/provider/services">
                        <p className="text-xs text-center text-violet-600 hover:underline pt-1">
                          +{profile.services.length - 3} more
                        </p>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
