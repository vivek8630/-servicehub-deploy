import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Users, ArrowLeft, Shield, Mail, Phone, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'User Management | Admin' }

export default async function AdminUsersPage() {
  const sessionUser = await getSession()
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          notifications: true,
        },
      },
    },
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
                <Users className="w-6 h-6 text-blue-600" />
                User Management
              </h1>
              <p className="text-sm text-slate-500">Manage all registered accounts ({users.length} total)</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {users.map((u) => (
                <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{u.name}</h3>
                        <Badge variant={u.role === 'ADMIN' ? 'destructive' : u.role === 'PROVIDER' ? 'default' : 'secondary'}>
                          {u.role}
                        </Badge>
                        <Badge variant={u.isActive ? 'success' : 'outline'}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {u.email}
                        </span>
                        {u.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {u.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
