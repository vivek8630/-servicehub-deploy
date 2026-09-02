import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils'
import { IndianRupee, ArrowLeft, TrendingUp, BookOpen, Users, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Platform Revenue & Analytics | Admin' }

export default async function AdminAnalyticsPage() {
  const sessionUser = await getSession()
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/')

  const completedBookings = await prisma.booking.findMany({
    where: { status: 'COMPLETED' },
    select: { estimatedPrice: true, createdAt: true },
  })

  const totalGrossValue = completedBookings.reduce((sum, b) => sum + b.estimatedPrice, 0)
  const platformRevenue = totalGrossValue * 0.10 // 10% commission

  const totalBookingsCount = await prisma.booking.count()
  const totalUsersCount = await prisma.user.count({ where: { role: 'CUSTOMER' } })
  const totalProvidersCount = await prisma.user.count({ where: { role: 'PROVIDER' } })

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
                <IndianRupee className="w-6 h-6 text-amber-600" />
                Platform Revenue & Analytics
              </h1>
              <p className="text-sm text-slate-500">Financial insights and platform growth metrics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-6">
              <p className="text-amber-100 text-sm font-medium">Estimated Platform Revenue (10%)</p>
              <h2 className="text-3xl font-extrabold mt-2">{formatCurrency(platformRevenue)}</h2>
              <p className="text-xs text-amber-100 mt-2">Based on completed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 text-sm font-medium">Total Booking Value (Gross)</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(totalGrossValue)}</h2>
              <p className="text-xs text-slate-400 mt-2">Across all completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 text-sm font-medium">Platform Activity</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <p>Total Customers: <strong>{totalUsersCount}</strong></p>
                <p>Total Providers: <strong>{totalProvidersCount}</strong></p>
                <p>Total Bookings: <strong>{totalBookingsCount}</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
