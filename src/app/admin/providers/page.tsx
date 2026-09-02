import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Briefcase, ArrowLeft, Star, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Provider Management | Admin' }

export default async function AdminProvidersPage() {
  const sessionUser = await getSession()
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/')

  const providers = await prisma.providerProfile.findMany({
    include: {
      user: {
        select: { name: true, email: true, phone: true, isActive: true },
      },
      services: { select: { id: true, name: true, price: true } },
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
                <Briefcase className="w-6 h-6 text-violet-600" />
                Provider Management
              </h1>
              <p className="text-sm text-slate-500">Manage all registered service providers ({providers.length} total)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {providers.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-lg shrink-0">
                      {p.user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-lg">{p.user.name}</h3>
                        <Badge
                          variant={
                            p.verificationStatus === 'VERIFIED'
                              ? 'success'
                              : p.verificationStatus === 'PENDING'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {p.verificationStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{p.user.email} • {p.user.phone || 'No Phone'}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                        {p.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {p.city}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {p.rating.toFixed(1)} ({p.totalReviews} reviews)
                        </span>
                        <span>Completed Jobs: <strong>{p.completedJobs}</strong></span>
                        <span>Experience: <strong>{p.experience || 0} years</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Link href={`/providers/${p.id}`}>
                      <Button variant="outline" size="sm">View Public Profile</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
