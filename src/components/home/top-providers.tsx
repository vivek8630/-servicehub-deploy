import Link from 'next/link'
import { Star, MapPin, CheckCircle2, Briefcase, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getInitials } from '@/lib/utils'

type Provider = {
  id: string
  rating: number
  totalReviews: number
  completedJobs: number
  experience?: number | null
  location?: string | null
  city?: string | null
  isVerified: boolean
  user: { name: string; image?: string | null }
  services: {
    id: string
    name: string
    price: number
    priceType: string
    category: { name: string }
  }[]
}

interface TopProvidersProps {
  providers: Provider[]
}

const demoProviders: Provider[] = [
  {
    id: 'demo-1',
    rating: 4.9,
    totalReviews: 128,
    completedJobs: 345,
    experience: 8,
    location: 'Mumbai',
    city: 'Mumbai',
    isVerified: true,
    user: { name: 'Rahul Sharma' },
    services: [{ id: 's1', name: 'Laptop Repair', price: 499, priceType: 'starting_from', category: { name: 'Technology' } }],
  },
  {
    id: 'demo-2',
    rating: 4.8,
    totalReviews: 96,
    completedJobs: 210,
    experience: 5,
    location: 'Delhi',
    city: 'Delhi',
    isVerified: true,
    user: { name: 'Priya Patel' },
    services: [{ id: 's2', name: 'Home Cleaning', price: 799, priceType: 'starting_from', category: { name: 'Cleaning' } }],
  },
  {
    id: 'demo-3',
    rating: 4.7,
    totalReviews: 84,
    completedJobs: 180,
    experience: 6,
    location: 'Bangalore',
    city: 'Bangalore',
    isVerified: true,
    user: { name: 'Arjun Mehta' },
    services: [{ id: 's3', name: 'Photography', price: 1999, priceType: 'starting_from', category: { name: 'Creative' } }],
  },
  {
    id: 'demo-4',
    rating: 4.9,
    totalReviews: 154,
    completedJobs: 420,
    experience: 10,
    location: 'Chennai',
    city: 'Chennai',
    isVerified: true,
    user: { name: 'Kavya Nair' },
    services: [{ id: 's4', name: 'Maths Tutoring', price: 399, priceType: 'hourly', category: { name: 'Education' } }],
  },
  {
    id: 'demo-5',
    rating: 4.8,
    totalReviews: 112,
    completedJobs: 290,
    experience: 7,
    location: 'Pune',
    city: 'Pune',
    isVerified: true,
    user: { name: 'Vikram Singh' },
    services: [{ id: 's5', name: 'Electrician', price: 299, priceType: 'starting_from', category: { name: 'Home Repair' } }],
  },
  {
    id: 'demo-6',
    rating: 4.6,
    totalReviews: 67,
    completedJobs: 145,
    experience: 4,
    location: 'Hyderabad',
    city: 'Hyderabad',
    isVerified: true,
    user: { name: 'Meena Iyer' },
    services: [{ id: 's6', name: 'Graphic Design', price: 999, priceType: 'starting_from', category: { name: 'Design' } }],
  },
]

export default function TopProviders({ providers }: TopProvidersProps) {
  const displayProviders = providers.length > 0 ? providers : demoProviders

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4">
          <div>
            <h2 className="section-title">Top-Rated Providers</h2>
            <p className="section-subtitle">
              Handpicked professionals with verified credentials and outstanding reviews.
            </p>
          </div>
          <Link href="/providers">
            <Button variant="outline" className="shrink-0">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProviders.map((provider) => {
            const primaryService = provider.services[0]
            return (
              <div
                key={provider.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-violet-200 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(provider.user.name)}
                      </div>
                      {provider.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{provider.user.name}</h3>
                      {primaryService && (
                        <p className="text-xs text-slate-500 mt-0.5">{primaryService.name}</p>
                      )}
                    </div>
                  </div>
                  {provider.isVerified && (
                    <Badge variant="verified" className="text-[10px]">✓ Verified</Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <div className="flex items-center justify-center gap-0.5 mb-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-slate-900">{provider.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{provider.totalReviews} reviews</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <p className="text-xs font-semibold text-slate-900 mb-0.5">{provider.completedJobs}</p>
                    <p className="text-[10px] text-slate-500">Jobs done</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <p className="text-xs font-semibold text-slate-900 mb-0.5">{provider.experience || '—'}yr</p>
                    <p className="text-[10px] text-slate-500">Experience</p>
                  </div>
                </div>

                {/* Location & Price */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">{provider.city || provider.location || 'India'}</span>
                  </div>
                  {primaryService && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400">
                        {primaryService.priceType === 'hourly' ? 'From' : 'Starting at'}
                      </span>{' '}
                      <span className="text-sm font-semibold text-violet-600">
                        {formatCurrency(primaryService.price)}
                      </span>
                      {primaryService.priceType === 'hourly' && (
                        <span className="text-xs text-slate-400">/hr</span>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link href={`/providers/${provider.id}`} className="block">
                  <Button variant="outline" className="w-full group-hover:border-violet-300 group-hover:text-violet-600 transition-colors">
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
