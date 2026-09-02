'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, MapPin, CheckCircle2, Heart, Briefcase, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toaster'
import { formatCurrency, getInitials } from '@/lib/utils'

interface Provider {
  id: string
  name: string
  image?: string
  rating: number
  totalReviews: number
  completedJobs: number
  city: string
  isVerified: boolean
  primaryService: {
    name: string
    price: number
    priceType: string
  } | null
}

interface FavoritesClientProps {
  initialFavorites: Provider[]
}

export default function FavoritesClient({ initialFavorites }: FavoritesClientProps) {
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<Provider[]>(initialFavorites)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemoveFavorite = async (id: string) => {
    setRemovingId(id)
    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: 'POST',
      })

      if (res.ok) {
        setFavorites((prev) => prev.filter((p) => p.id !== id))
        toast({
          title: 'Removed',
          description: 'Provider removed from favorites.',
          variant: 'success',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to remove favorite.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'A network error occurred.',
        variant: 'destructive',
      })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
        <p className="text-slate-500 mt-1">Quickly access and book your preferred service providers</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No favorites saved yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            When browsing professionals, click the "Save to Favorites" button to save providers you like here.
          </p>
          <Link href="/providers">
            <Button variant="gradient" className="gap-2">
              <Search className="w-4 h-4" />
              Explore Providers
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-all duration-300 border-slate-100 relative group">
              <CardContent className="p-5">
                {/* Heart Button */}
                <button
                  onClick={() => handleRemoveFavorite(p.id)}
                  disabled={removingId === p.id}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 text-rose-500 flex items-center justify-center border border-slate-100 transition-colors shadow-sm z-10"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>

                <div className="flex items-start gap-3 mb-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(p.name)}
                    </div>
                    {p.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{p.name}</h3>
                    {p.primaryService && (
                      <p className="text-xs text-slate-500 truncate">{p.primaryService.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-900">{p.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({p.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{p.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.completedJobs} jobs completed</span>
                  </div>
                  {p.primaryService && (
                    <span className="text-sm font-bold text-violet-600">
                      {formatCurrency(p.primaryService.price)}
                      {p.primaryService.priceType === 'hourly' && <span className="text-[10px] font-normal text-slate-400">/hr</span>}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/providers/${p.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      Book Service
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
