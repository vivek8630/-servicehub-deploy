'use client'

import { useEffect, useState } from 'react'
import { MapPin, Star, Phone, ShieldCheck, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProviderLocation {
  id: string
  name: string
  category: string
  rating: number
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  profileImage?: string | null
  price?: number
}

interface ProviderMapProps {
  providers: ProviderLocation[]
  selectedCity?: string
  radiusKm?: number
}

export function ProviderMap({ providers, selectedCity, radiusKm = 10 }: ProviderMapProps) {
  const [activeProvider, setActiveProvider] = useState<ProviderLocation | null>(null)

  // Filter providers that have geolocation coords
  const mapProviders = providers.filter((p) => p.latitude && p.longitude)

  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative flex flex-col justify-between p-6 text-white">
      {/* Map Header Overlay */}
      <div className="z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Interactive Provider Map</h4>
            <p className="text-xs text-slate-400">
              Showing verified service professionals within {radiusKm}km {selectedCity ? `of ${selectedCity}` : ''}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
          {mapProviders.length || providers.length} Nearby
        </span>
      </div>

      {/* Simulated Map Visual Grid with Marker Pins */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full border border-violet-500/20 bg-violet-500/5 animate-ping duration-1000"></div>
      </div>

      {/* Provider Marker Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-auto">
        {providers.slice(0, 8).map((prov, index) => {
          const isSelected = activeProvider?.id === prov.id
          return (
            <button
              key={prov.id}
              onClick={() => setActiveProvider(prov)}
              className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-3 backdrop-blur-md ${
                isSelected
                  ? 'bg-violet-600/90 border-violet-400 shadow-lg scale-105 z-20'
                  : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-700/80 hover:border-slate-500'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/30 border border-violet-400/30 flex items-center justify-center shrink-0">
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-violet-400'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs truncate text-white">{prov.name}</p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{prov.rating ? prov.rating.toFixed(1) : '5.0'}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Selected Provider Detail Card Popup */}
      {activeProvider && (
        <div className="z-10 bg-slate-800/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
              {activeProvider.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">{activeProvider.name}</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400">{activeProvider.category || 'Service Specialist'} • {activeProvider.city || 'Local'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/providers/${activeProvider.id}`}>
              <Button size="sm" variant="gradient" className="rounded-xl text-xs">
                Book Provider
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveProvider(null)}
              className="rounded-xl text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
