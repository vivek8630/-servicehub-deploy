import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Layers, ArrowLeft, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Service Categories | Admin' }

export default async function AdminCategoriesPage() {
  const sessionUser = await getSession()
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/')

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { services: true } },
    },
    orderBy: { sortOrder: 'asc' },
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
                <Layers className="w-6 h-6 text-emerald-600" />
                Service Categories
              </h1>
              <p className="text-sm text-slate-500">Manage platform categories ({categories.length} total)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{c.description || 'No description'}</p>
                  </div>
                  <Badge variant={c.isActive ? 'success' : 'secondary'}>
                    {c.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Slug: <code>{c.slug}</code></span>
                  <span><strong>{c._count.services}</strong> services</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
