'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Filter,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  X,
  Map as MapIcon,
  List as ListIcon,
  ShieldAlert,
  Percent,
  Clock,
  Compass,
  DollarSign,
  Languages,
  Plus,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, getInitials } from '@/lib/utils'
import { CompareBar } from '@/components/providers/compare-bar'

type Provider = {
  id: string
  rating: number
  totalReviews: number
  completedJobs: number
  experience?: number | null
  location?: string | null
  city?: string | null
  bio?: string | null
  isVerified: boolean
  isEmergencyAvailable: boolean
  atHomeService: boolean
  onlineService: boolean
  languages: string
  latitude?: number | null
  longitude?: number | null
  user: { name: string; image?: string | null }
  services: { id: string; name: string; price: number; priceType: string; category: { name: string } }[]
}

type Pagination = { page: number; limit: number; total: number; pages: number }

interface ProvidersClientProps {
  searchParamsPromise: Promise<{ [key: string]: string | undefined }>
}

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'jobs', label: 'Most Jobs Done' },
]

export default function ProvidersClient({ searchParamsPromise }: ProvidersClientProps) {
  const resolvedParams = use(searchParamsPromise)
  const router = useRouter()

  const [providers, setProviders] = useState<Provider[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)

  // Search/Filters states
  const [search, setSearch] = useState(resolvedParams.search || '')
  const [city, setCity] = useState(resolvedParams.city || '')
  const [category, setCategory] = useState(resolvedParams.category || '')
  const [sortBy, setSortBy] = useState('rating')
  const [minRating, setMinRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Extra filter states
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [emergencyOnly, setEmergencyOnly] = useState(resolvedParams.emergency === 'true')
  const [atHomeOnly, setAtHomeOnly] = useState(false)
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [minExperience, setMinExperience] = useState(0)
  const [language, setLanguage] = useState('')

  // View Mode: 'list' | 'map'
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedMapProvider, setSelectedMapProvider] = useState<Provider | null>(null)
  const [mapZoom, setMapZoom] = useState(1)

  // Compare List state
  const [compareList, setCompareList] = useState<{ id: string; name: string }[]>([])

  const toggleCompare = (id: string, name: string) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === id)
      if (exists) return prev.filter((p) => p.id !== id)
      if (prev.length >= 3) {
        alert('You can compare up to 3 providers at a time.')
        return prev
      }
      return [...prev, { id, name }]
    })
  }

  const fetchProviders = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      search,
      city,
      category,
      sortBy,
      page: String(page),
      limit: '12',
      ...(minRating > 0 ? { minRating: String(minRating) } : {}),
      ...(verifiedOnly ? { verified: 'true' } : {}),
      ...(minPrice > 0 ? { minPrice: String(minPrice) } : {}),
      ...(maxPrice < 10000 ? { maxPrice: String(maxPrice) } : {}),
      ...(emergencyOnly ? { emergency: 'true' } : {}),
      ...(atHomeOnly ? { atHome: 'true' } : {}),
      ...(onlineOnly ? { online: 'true' } : {}),
      ...(minExperience > 0 ? { minExperience: String(minExperience) } : {}),
      ...(language ? { language } : {}),
    })

    try {
      const res = await fetch(`/api/providers?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProviders(data.providers || [])
        setPagination(data.pagination || { page: 1, limit: 12, total: 0, pages: 0 })
      }
    } catch {
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch when page, filters, or category change
  useEffect(() => {
    fetchProviders()
  }, [
    page,
    sortBy,
    minRating,
    verifiedOnly,
    category,
    minPrice,
    maxPrice,
    emergencyOnly,
    atHomeOnly,
    onlineOnly,
    minExperience,
    language,
  ])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProviders()
  }

  const handleClearFilters = () => {
    setSearch('')
    setCity('')
    setCategory('')
    setMinRating(0)
    setVerifiedOnly(false)
    setMinPrice(0)
    setMaxPrice(10000)
    setEmergencyOnly(false)
    setAtHomeOnly(false)
    setOnlineOnly(false)
    setMinExperience(0)
    setLanguage('')
    setPage(1)
  }

  // SVG Map bounding box geometry helpers
  const getCityBounds = (cityName: string) => {
    const c = cityName.toLowerCase()
    if (c.includes('bangalore') || c.includes('bengaluru')) {
      return { minLat: 12.90, maxLat: 13.00, minLng: 77.55, maxLng: 77.68, name: 'Bengaluru Metro Area' }
    }
    if (c.includes('delhi') || c.includes('new delhi')) {
      return { minLat: 28.50, maxLat: 28.68, minLng: 77.15, maxLng: 77.28, name: 'Delhi NCR Area' }
    }
    if (c.includes('mumbai') || c.includes('bombay')) {
      return { minLat: 18.95, maxLat: 19.18, minLng: 72.80, maxLng: 72.92, name: 'Mumbai Metro Area' }
    }
    // Default fallback bounds
    return { minLat: 12.85, maxLat: 13.05, minLng: 77.50, maxLng: 77.72, name: 'National Coverage Map' }
  }

  const getCoordinates = (p: Provider) => {
    if (p.latitude && p.longitude) {
      return { lat: p.latitude, lng: p.longitude }
    }
    // Fallback stable projection coordinates using ID hash code
    const bounds = getCityBounds(city || p.city || 'Bangalore')
    const hash = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const latDiff = bounds.maxLat - bounds.minLat
    const lngDiff = bounds.maxLng - bounds.minLng
    const lat = bounds.minLat + (0.2 + (hash % 60) / 100) * latDiff
    const lng = bounds.minLng + (0.2 + ((hash * 7) % 60) / 100) * lngDiff
    return { lat, lng }
  }

  const bounds = getCityBounds(city || 'Bangalore')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Find Service Providers</h1>
          <p className="text-slate-500 mt-1">Discover, verify, and book local service professionals</p>
        </div>

        {/* List/Map Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            List View
          </button>
          <button
            onClick={() => {
              setViewMode('map')
              if (providers.length > 0 && !selectedMapProvider) {
                setSelectedMapProvider(providers[0])
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Map View
          </button>
        </div>
      </div>

      {/* Search Filter Form */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="providers-search"
              type="text"
              placeholder="What service or provider name are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="relative flex-1 md:max-w-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="providers-city"
              type="text"
              placeholder="City (e.g. Bangalore, Delhi, Mumbai)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="gradient" className="flex-1 sm:flex-none">
              <Search className="w-4 h-4" /> Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`shrink-0 ${showFilters ? 'border-violet-300 text-violet-700 bg-violet-50/50' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Sort Options */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 bg-white"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 bg-white"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3.0+ Stars</option>
                <option value={4}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            {/* Price Slider/Inputs */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Max Budget: {formatCurrency(maxPrice)}</label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹100</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Minimum Experience */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Min Experience</label>
              <select
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 bg-white"
              >
                <option value={0}>Any Experience</option>
                <option value={3}>3+ Years</option>
                <option value={5}>5+ Years</option>
                <option value={8}>8+ Years</option>
              </select>
            </div>

            {/* Language filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 bg-white"
              >
                <option value="">Any Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Kannada">Kannada</option>
                <option value="Tamil">Tamil</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>

            {/* Checkbox Options */}
            <div className="sm:col-span-3 flex flex-wrap gap-x-6 gap-y-2 pt-2 items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-350 text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                Verified Providers Only
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="rounded border-slate-350 text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  ⚡ Emergency Available
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={atHomeOnly}
                  onChange={(e) => setAtHomeOnly(e.target.checked)}
                  className="rounded border-slate-350 text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                At-Home Services
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="rounded border-slate-350 text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                Online / Remote Options
              </label>
            </div>

            {/* Clear Button */}
            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 py-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Main Catalog View area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-20 bg-slate-100 rounded-xl mb-3" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-150 shadow-sm max-w-xl mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Providers Match Filters</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            We couldn't find any service providers that match all your filters. Try clearing some selections or broadening your search!
          </p>
          <Button variant="outline" className="mt-6" onClick={handleClearFilters}>
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View Mode */
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{providers.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{pagination.total}</span> experts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {providers.map((p) => {
              const primaryService = p.services[0]
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-5 border border-slate-150 hover:shadow-lg hover:border-violet-200 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {getInitials(p.user.name)}
                          </div>
                          {p.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Verified Professional">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-violet-600 transition-colors">{p.user.name}</h3>
                          <div className="flex items-center gap-1 mt-0.5 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11px] truncate max-w-[120px]">{p.location || p.city || 'India'}</span>
                          </div>
                        </div>
                      </div>
                      {p.isEmergencyAvailable && (
                        <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold tracking-wider animate-pulse flex items-center gap-0.5 shrink-0">
                          ⚡ Priority
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    {p.bio && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {p.bio}
                      </p>
                    )}

                    {/* Service Preview Badge */}
                    <div className="space-y-1.5 mb-4">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Featured Service</p>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
                          {primaryService ? primaryService.name : 'General Consultation'}
                        </span>
                        <span className="text-xs font-bold text-violet-600">
                          {primaryService ? formatCurrency(primaryService.price) : 'Contact'}
                          {primaryService?.priceType === 'hourly' && <span className="text-[10px] font-normal text-slate-400">/hr</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer details & Button */}
                  <div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mb-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-900">{p.rating.toFixed(1)}</span>
                        <span>({p.totalReviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{p.completedJobs} completed</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/providers/${p.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all font-semibold rounded-xl text-xs">
                          View Profile & Book
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant={compareList.some((item) => item.id === p.id) ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => toggleCompare(p.id, p.user.name)}
                        className="rounded-xl text-xs shrink-0 px-3"
                      >
                        {compareList.some((item) => item.id === p.id) ? '✓ Comparing' : '+ Compare'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      page === p ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:border-violet-300'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Interactive Vector Map View Mode */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[550px]">
          {/* Map canvas container */}
          <div className="flex-1 bg-slate-900 relative overflow-hidden h-[300px] lg:h-full group">
            {/* Compass / Location Indicator overlay */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur border border-slate-700 text-white text-xs px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5 shadow-md">
              <Compass className="w-3.5 h-3.5 text-violet-400 animate-spin" style={{ animationDuration: '6s' }} />
              {bounds.name}
            </div>

            {/* Map Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setMapZoom((prev) => Math.min(1.8, prev + 0.2))}
                className="w-9 h-9 bg-slate-900/95 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMapZoom((prev) => Math.max(0.6, prev - 0.2))}
                className="w-9 h-9 bg-slate-900/95 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Stylized vector SVG map */}
            <svg
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
              style={{ transform: `scale(${mapZoom})` }}
              viewBox="0 0 400 400"
            >
              {/* Grid lines background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Central Green park area */}
              <rect x="120" y="150" width="100" height="70" rx="10" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
              <text x="170" y="190" fill="rgba(34,197,94,0.3)" fontSize="10" fontWeight="bold" textAnchor="middle">CENTRAL PARK</text>

              {/* Water body / Lake */}
              <path d="M -20,20 Q 80,60 150,40 T 320,10 T 420,-10 L 420,-40 L -20,-40 Z" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.2)" strokeWidth="2" />
              <text x="80" y="25" fill="rgba(59,130,246,0.3)" fontSize="9" fontWeight="semibold" transform="rotate(12, 80, 25)">RIVER PASS</text>

              {/* Main Ring Road lines */}
              <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="2" strokeDasharray="5,5" />
              <text x="200" y="38" fill="rgba(139,92,246,0.3)" fontSize="8" fontWeight="bold" textAnchor="middle">OUTER RING ROAD</text>

              {/* Horizontal / Diagonal Streets */}
              <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <line x1="0" y1="0" x2="400" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />

              {/* Pins layer */}
              {providers.map((p) => {
                const { lat, lng } = getCoordinates(p)
                const isSelected = selectedMapProvider?.id === p.id

                // Normalize coordinates within bounds box to percentage of 400x400
                const latRange = bounds.maxLat - bounds.minLat
                const lngRange = bounds.maxLng - bounds.minLng
                const xPercent = (lng - bounds.minLng) / lngRange
                const yPercent = 1 - (lat - bounds.minLat) / latRange

                const px = Math.min(380, Math.max(20, xPercent * 400))
                const py = Math.min(380, Math.max(20, yPercent * 400))

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedMapProvider(p)}
                  >
                    {/* Glowing outer circle if selected */}
                    {isSelected && (
                      <>
                        <circle cx={px} cy={py} r="14" fill="rgba(139,92,246,0.3)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                        <circle cx={px} cy={py} r="10" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                      </>
                    )}

                    {/* Small pulse ring for emergency */}
                    {p.isEmergencyAvailable && (
                      <circle cx={px} cy={py} r="9" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: '1.5s' }} />
                    )}

                    {/* Main location pin dot */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? '6' : '5'}
                      fill={p.isEmergencyAvailable ? '#ef4444' : '#8b5cf6'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="transition-all hover:scale-125 hover:fill-violet-400"
                    />

                    {/* Pin tag text */}
                    {isSelected && (
                      <g transform={`translate(${px}, ${py - 12})`}>
                        <rect x="-40" y="-14" width="80" height="15" rx="4" fill="rgba(15,23,42,0.95)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        <text x="0" y="-4" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                          {p.user.name.split(' ')[0]}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Map Preview detail card panel */}
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-150 p-6 flex flex-col justify-between shrink-0 h-[250px] lg:h-full">
            {selectedMapProvider ? (
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-4">
                  {/* Rating / Emergency badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Map Preview</span>
                    {selectedMapProvider.isEmergencyAvailable && (
                      <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold flex items-center gap-0.5 animate-pulse">
                        ⚡ Urgent Support
                      </span>
                    )}
                  </div>

                  {/* Profile info */}
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(selectedMapProvider.user.name)}
                      </div>
                      {selectedMapProvider.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                          <CheckCircle2 className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{selectedMapProvider.user.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{selectedMapProvider.location || selectedMapProvider.city}</p>
                    </div>
                  </div>

                  {/* Rating details */}
                  <div className="flex gap-4 text-xs border-y border-slate-100 py-2.5">
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {selectedMapProvider.rating.toFixed(1)}
                    </div>
                    <div className="text-slate-400">|</div>
                    <div className="text-slate-500 font-medium">
                      {selectedMapProvider.completedJobs} Jobs
                    </div>
                    <div className="text-slate-400">|</div>
                    <div className="text-slate-500 font-medium">
                      {selectedMapProvider.experience ? `${selectedMapProvider.experience} yrs` : 'Expert'}
                    </div>
                  </div>

                  {/* Primary Service price */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Featured Rate</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-lg font-extrabold text-slate-900">
                        {selectedMapProvider.services[0] ? formatCurrency(selectedMapProvider.services[0].price) : 'Contact'}
                      </span>
                      {selectedMapProvider.services[0]?.priceType === 'hourly' && (
                        <span className="text-xs text-slate-400">/ hour</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Link href={`/providers/${selectedMapProvider.id}`} className="w-full block">
                    <Button variant="gradient" className="w-full rounded-xl text-xs font-semibold py-2">
                      Book Professional
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedMapProvider(null)}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1 transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <MapIcon className="w-10 h-10 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Interactive Map</h4>
                <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto mt-1 leading-relaxed">
                  Click on any provider's marker pin on the map to show booking details, ratings, and pricing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      <CompareBar
        selectedProviders={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setCompareList([])}
      />
    </div>
  )
}
