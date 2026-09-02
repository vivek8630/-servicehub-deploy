import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { Layers, Search, Star, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services Directory | ServiceHub',
  description: 'Explore all available home, personal, technology, and educational services.',
}

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      include: {
        category: true,
        provider: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      take: 24,
    }),
  ])

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Layers className="w-8 h-8 text-violet-600" />
            Services Directory
          </h1>
          <p className="text-slate-500 mt-1">Browse verified local services and professionals across categories</p>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/providers?category=${cat.slug}`}>
                <Card className="hover:border-violet-500 hover:shadow-sm transition-all cursor-pointer text-center p-4">
                  <CardContent className="p-0 space-y-2">
                    <p className="font-semibold text-slate-900 text-sm truncate">{cat.name}</p>
                    <p className="text-xs text-slate-400">Explore</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline">{s.category.name}</Badge>
                      <span className="font-bold text-slate-900 text-lg">{formatCurrency(s.price)}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{s.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mt-1">{s.description || 'Professional service offered by verified partner.'}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Provider</p>
                      <p className="text-sm font-medium text-slate-900">{s.provider.user.name}</p>
                    </div>
                    <Link href={`/providers/${s.providerProfileId}`}>
                      <Button size="sm" variant="default" className="gap-1 bg-violet-600 hover:bg-violet-500">
                        Book <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
