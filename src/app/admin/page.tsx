import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import {
  Users,
  Briefcase,
  BookOpen,
  IndianRupee,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'ADMIN') redirect('/')

  const [
    totalUsers,
    totalProviders,
    totalBookings,
    completedBookings,
    pendingBookings,
    pendingVerifications,
    openReports,
    recentBookings,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'PROVIDER' } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.providerProfile.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.booking.findMany({
      include: {
        customer: { include: { user: { select: { name: true } } } },
        provider: { include: { user: { select: { name: true } } } },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    }),
  ])

  const totalRevenue = await prisma.booking.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { estimatedPrice: true },
  })

  const stats = [
    { label: 'Total Customers', value: totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '/admin/users' },
    { label: 'Total Providers', value: totalProviders.toLocaleString(), icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-100', href: '/admin/providers' },
    { label: 'Total Bookings', value: totalBookings.toLocaleString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100', href: '/admin/bookings' },
    { label: 'Platform Revenue', value: formatCurrency((totalRevenue._sum.estimatedPrice || 0) * 0.1), icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-100', href: '/admin/analytics' },
    { label: 'Completed', value: completedBookings.toLocaleString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/bookings?status=COMPLETED' },
    { label: 'Pending Bookings', value: pendingBookings.toLocaleString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/bookings?status=PENDING' },
    { label: 'Verification Queue', value: pendingVerifications.toLocaleString(), icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/verifications' },
    { label: 'Open Reports', value: openReports.toLocaleString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', href: '/admin/reports' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
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
                <Link href="/admin/bookings">
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
                        {b.customer.user.name} → {b.provider.user.name}
                      </p>
                      <p className="text-xs text-slate-500">{b.service?.name || 'Service'}</p>
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
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  Recent Registrations
                </CardTitle>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <div className="shrink-0">
                      <Badge variant={u.role === 'PROVIDER' ? 'default' : 'secondary'} className="text-[10px]">
                        {u.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Admin Actions */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Manage Users', href: '/admin/users', color: 'bg-blue-600' },
            { label: 'Verify Providers', href: '/admin/verifications', color: 'bg-violet-600' },
            { label: 'Manage Categories', href: '/admin/categories', color: 'bg-emerald-600' },
            { label: 'Review Reports', href: '/admin/reports', color: 'bg-red-600' },
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
