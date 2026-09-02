import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/utils'
import {
  Calendar,
  CheckCircle,
  Heart,
  Bell,
  MessageSquare,
  Search,
  BookOpen,
  Star,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customer Dashboard' }

export default async function CustomerDashboard() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'CUSTOMER') redirect(user.role === 'PROVIDER' ? '/provider/dashboard' : '/admin')

  const customerId = user.customerProfile?.id
  if (!customerId) redirect('/login')

  const [upcomingBookings, recentBookings, favoriteCount, unreadNotifications] = await Promise.all([
    prisma.booking.findMany({
      where: {
        customerProfileId: customerId,
        status: { in: ['PENDING', 'ACCEPTED', 'CONFIRMED'] },
        scheduledDate: { gte: new Date() },
      },
      include: {
        provider: { include: { user: { select: { name: true } } } },
        service: true,
      },
      orderBy: { scheduledDate: 'asc' },
      take: 3,
    }),
    prisma.booking.findMany({
      where: { customerProfileId: customerId },
      include: {
        provider: { include: { user: { select: { name: true } } } },
        service: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.favorite.count({ where: { customerProfileId: customerId } }),
    prisma.notification.count({ where: { userId: user.id, isRead: false } }),
  ])

  const completedCount = await prisma.booking.count({
    where: { customerProfileId: customerId, status: 'COMPLETED' },
  })

  const stats = [
    { label: 'Upcoming Bookings', value: upcomingBookings.length, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Completed Services', value: completedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Favorite Providers', value: favoriteCount, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Notifications', value: unreadNotifications, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  const quickActions = [
    { label: 'Find Service', href: '/providers', icon: Search, color: 'bg-violet-600' },
    { label: 'My Bookings', href: '/bookings', icon: BookOpen, color: 'bg-blue-600' },
    { label: 'Favorites', href: '/favorites', icon: Heart, color: 'bg-rose-600' },
    { label: 'Messages', href: '/messages', icon: MessageSquare, color: 'bg-emerald-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Good day, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-500 mt-1">Here&apos;s an overview of your activity</p>
            </div>
            <Link href="/providers">
              <Button variant="gradient">
                <Search className="w-4 h-4" />
                Find a Service
              </Button>
            </Link>
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
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    Upcoming Bookings
                  </CardTitle>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No upcoming bookings</p>
                    <Link href="/providers">
                      <Button variant="outline" size="sm" className="mt-3">Book a Service</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((b) => (
                      <div key={b.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {b.service?.name || 'Service Booking'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {b.provider.user.name} · {formatDate(b.scheduledDate)} at {b.scheduledTime}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${BOOKING_STATUS_COLORS[b.status]}`}>
                          {BOOKING_STATUS_LABELS[b.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                    Recent Bookings
                  </CardTitle>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {b.service?.name || 'Service'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {b.provider.user.name} · {formatDate(b.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${BOOKING_STATUS_COLORS[b.status]}`}>
                            {BOOKING_STATUS_LABELS[b.status]}
                          </span>
                          {b.status === 'COMPLETED' && !b.review && (
                            <Link href={`/bookings/${b.id}/review`}>
                              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                                <Star className="w-3 h-3" />
                                Review
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:shadow-sm transition-all cursor-pointer group">
                        <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-slate-700 text-center">{action.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
