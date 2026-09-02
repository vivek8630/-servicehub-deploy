import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AlertTriangle, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Open Reports & Moderation | Admin' }

export default async function AdminReportsPage() {
  const sessionUser = await getSession()
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/')

  const reports = await prisma.report.findMany({
    include: {
      provider: { include: { user: { select: { name: true, email: true } } } },
      booking: { select: { id: true, estimatedPrice: true } },
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
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Reports & Moderation
              </h1>
              <p className="text-sm text-slate-500">Review reported providers, bookings, or user feedback ({reports.length} total)</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500">
                <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                No reported issues or open tickets found.
              </CardContent>
            </Card>
          ) : (
            reports.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={r.status === 'PENDING' ? 'destructive' : 'secondary'}>
                          {r.status}
                        </Badge>
                        <h3 className="font-semibold text-slate-900">{r.reason}</h3>
                      </div>
                      {r.description && (
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {r.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">
                        Reported on {new Date(r.createdAt).toLocaleDateString()}
                      </p>
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
