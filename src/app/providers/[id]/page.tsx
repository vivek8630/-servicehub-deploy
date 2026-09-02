import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Star, MapPin, CheckCircle2, Briefcase, Clock, MessageSquare, Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BookingFormWrapper from './booking-form-wrapper'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  })
  if (!provider) return { title: 'Provider Not Found' }
  return {
    title: `${provider.user.name} — ServiceHub`,
    description: provider.bio || `View profile and book services with ${provider.user.name}`,
  }
}

export default async function ProviderProfilePage({ params }: Props) {
  const { id } = await params
  const currentUser = await getSession()

  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, image: true, createdAt: true } },
      services: {
        where: { isActive: true },
        include: { category: true },
        orderBy: { price: 'asc' },
      },
      reviews: {
        where: { isVisible: true },
        include: { customer: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      portfolioItems: { orderBy: { createdAt: 'desc' }, take: 6 },
      availability: { orderBy: { dayOfWeek: 'asc' } },
    },
  })

  if (!provider) notFound()

  const isFavorited = currentUser?.customerProfile
    ? await prisma.favorite.findUnique({
        where: {
          customerProfileId_providerProfileId: {
            customerProfileId: currentUser.customerProfile.id,
            providerProfileId: id,
          },
        },
      })
    : null

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/providers" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Providers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(provider.user.name)}
                  </div>
                  {provider.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle2 className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{provider.user.name}</h1>
                    {provider.isVerified && (
                      <Badge variant="verified" className="mt-1">✓ Verified Provider</Badge>
                    )}
                  </div>

                  {provider.services[0] && (
                    <p className="text-slate-500 mb-3">{provider.services[0].category.name} Specialist</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-900">{provider.rating.toFixed(1)}</span>
                      <span className="text-slate-400">({provider.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{provider.completedJobs} jobs completed</span>
                    </div>
                    {provider.experience && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{provider.experience} years experience</span>
                      </div>
                    )}
                    {provider.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{provider.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {provider.bio && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">About</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{provider.bio}</p>
                </div>
              )}
            </div>

            {/* Services */}
            {provider.services.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-semibold text-slate-900 mb-4">Services Offered</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {provider.services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.category.name}</p>
                        {s.estimatedDuration && (
                          <p className="text-xs text-slate-400 mt-0.5">{s.estimatedDuration} mins</p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="font-semibold text-violet-600">
                          {formatCurrency(s.price)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {s.priceType === 'hourly' ? '/hr' : s.priceType === 'fixed' ? 'fixed' : 'onwards'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {provider.availability.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-semibold text-slate-900 mb-4">Availability</h2>
                <div className="grid grid-cols-7 gap-2">
                  {dayNames.map((day, idx) => {
                    const avail = provider.availability.find((a) => a.dayOfWeek === idx)
                    return (
                      <div
                        key={day}
                        className={`text-center p-2 rounded-lg ${avail?.isAvailable ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400'}`}
                      >
                        <p className="text-xs font-medium">{day}</p>
                        {avail?.isAvailable && (
                          <p className="text-[10px] mt-0.5">
                            {avail.startTime}–{avail.endTime}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-slate-900">Reviews ({provider.totalReviews})</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">{provider.rating.toFixed(1)}</span>
                </div>
              </div>

              {provider.reviews.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {provider.reviews.map((r) => (
                    <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {r.customer.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{r.customer.user.name}</p>
                            <p className="text-xs text-slate-400">{formatDate(r.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>}
                      <div className="flex gap-4 mt-2 text-xs text-slate-400">
                        <span>Quality: {r.serviceQuality}★</span>
                        <span>Communication: {r.communication}★</span>
                        <span>Value: {r.valueForMoney}★</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-2">Book This Provider</h2>
              {provider.services[0] && (
                <p className="text-sm text-slate-500 mb-4">
                  Starting from{' '}
                  <span className="font-semibold text-violet-600">{formatCurrency(provider.services[0].price)}</span>
                </p>
              )}

              {currentUser?.role === 'CUSTOMER' ? (
                <BookingFormWrapper
                  providerId={provider.id}
                  services={provider.services.map(s => ({ id: s.id, name: s.name, price: s.price, priceType: s.priceType }))}
                />
              ) : currentUser ? (
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 text-center">
                  Only customers can book services.
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login">
                    <Button variant="gradient" className="w-full">Login to Book</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="w-full">Create Account</Button>
                  </Link>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <Link href={`/compare?ids=${provider.id}`} className="block">
                  <Button variant="secondary" className="w-full gap-2 text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200">
                    ⚖️ Compare This Provider
                  </Button>
                </Link>

                {currentUser?.role === 'CUSTOMER' && (
                  <>
                    <form action={`/api/favorites/${provider.id}`} method="POST">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        type="submit"
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                        {isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
                      </Button>
                    </form>
                    <Link href={`/messages?userId=${provider.userId}`} className="block">
                      <Button variant="outline" className="w-full gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-500" />
                        Message Provider
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
