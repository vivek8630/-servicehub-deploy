import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  IndianRupee,
  CheckCircle,
  Star,
  Users,
  Briefcase,
  Clock,
  Heart,
  BookOpen,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    { label: 'Total Earnings', value: formatCurrency(totalEarnings._sum.estimatedPrice || 0), icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'This Month', value: formatCurrency(thisMonthEarnings._sum.estimatedPrice || 0), icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Completed Jobs', value: profile?.completedJobs || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Rating', value: `${(profile?.rating || 0).toFixed(1)}★`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Pending Requests', value: pendingBookings.length, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Services', value: profile?.services.length || 0, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Saved by Customers', value: profile?._count.favorites || 0, icon: Heart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Reviews', value: profile?.totalReviews || 0, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  Recent Bookings
                </CardTitle>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {b.customer.user.name} → You
                      </p>
                      <p className="text-xs text-slate-500">{b.service?.name || 'Service'} · {formatDate(b.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-xs text-slate-700">{formatCurrency(b.estimatedPrice)}</p>
                      <Badge
                        variant={b.status === 'COMPLETED' ? 'success' : b.status === 'PENDING' ? 'warning' : 'secondary'}
                        className="text-[10px] mt-1"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentBookings.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No recent bookings</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  Pending Requests
                </CardTitle>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {b.customer.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{b.customer.user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{b.service?.name} · {formatDate(b.scheduledDate)}</p>
                    </div>
                    <div className="shrink-0">
                      <Badge variant="warning" className="text-[10px]">
                        PENDING
                      </Badge>
                    </div>
                  </div>
                ))}
                {pendingBookings.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No pending requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Manage Services', href: '/provider/services', color: 'bg-blue-600' },
            { label: 'View Schedule', href: '/bookings', color: 'bg-violet-600' },
            { label: 'Edit Profile', href: '/provider/profile', color: 'bg-emerald-600' },
            { label: 'Messages', href: '/messages', color: 'bg-red-600' },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <div className={`${action.color} text-white rounded-xl p-4 text-center hover:opacity-90 transition-opacity cursor-pointer`}>
                <p className="text-sm font-semibold">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
