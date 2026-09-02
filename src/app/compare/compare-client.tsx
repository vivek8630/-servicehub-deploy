'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  X,
  Star,
  ShieldCheck,
  Zap,
  Briefcase,
  Clock,
  MapPin,
  Loader2,
  Scale,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, getInitials } from '@/lib/utils'

interface CompareClientProps {
  providerIds: string[]
  userRole?: string
}

export default function CompareClient({ providerIds, userRole }: CompareClientProps) {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadComparisonData = async () => {
      setLoading(true)
      try {
        let fetchedList: any[] = []

        // If specific provider IDs were passed
        if (providerIds.length > 0) {
          const promises = providerIds.map((id) =>
            fetch(`/api/providers/${id}`).then((res) => (res.ok ? res.json() : null))
          )
          const results = await Promise.all(promises)
          fetchedList = results.filter((r) => r && r.provider).map((r) => r.provider)
        }

        // If only 1 provider was selected or 0 were selected, fetch top providers automatically to compare
        if (fetchedList.length < 2) {
          const listRes = await fetch('/api/providers?limit=4')
          if (listRes.ok) {
            const listData = await listRes.json()
            const additional = listData.providers || []
            for (const item of additional) {
              if (fetchedList.length >= 3) break
              if (!fetchedList.some((p) => p.id === item.id)) {
                // Fetch full detail for this provider
                const dRes = await fetch(`/api/providers/${item.id}`)
                if (dRes.ok) {
                  const dJson = await dRes.json()
                  if (dJson.provider) {
                    fetchedList.push(dJson.provider)
                  }
                }
              }
            }
          }
        }

        setProviders(fetchedList)
      } catch (err) {
        console.error('Error loading comparison matrix:', err)
      } finally {
        setLoading(false)
      }
    }

    loadComparisonData()
  }, [providerIds.join(',')])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 mb-3" />
        <p className="text-slate-500 text-sm">Building side-by-side comparison matrix...</p>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4 border border-violet-100">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Providers Available for Comparison</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Browse the providers catalog and select providers to compare ratings, prices, and qualifications side-by-side.
        </p>
        <Link href="/providers">
          <Button variant="gradient" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Providers Catalog
          </Button>
        </Link>
      </div>
    )
  }

  // Find best values for highlighting top features
  const highestRating = Math.max(...providers.map((p) => p.rating || 0))
  const maxJobs = Math.max(...providers.map((p) => p.completedJobs || 0))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/providers" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Providers
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Scale className="w-7 h-7 text-violet-600" />
            Side-by-Side Provider Comparison
          </h1>
          <p className="text-slate-500 text-sm mt-1">Comparing {providers.length} top service professionals side by side</p>
        </div>

        <Link href="/providers">
          <Button variant="outline" className="rounded-xl text-xs">
            + Compare More Providers
          </Button>
        </Link>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="p-6 w-56 text-xs font-bold uppercase text-slate-400 tracking-wider">
                Feature / Criteria
              </th>
              {providers.map((prov) => (
                <th key={prov.id} className="p-6 text-center border-l border-slate-100 min-w-[240px]">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-xl flex items-center justify-center mb-3 shadow-md">
                      {getInitials(prov.user.name)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{prov.user.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{prov.location || prov.city || 'India'}</p>
                    <Link href={`/providers/${prov.id}`} className="mt-3 w-full">
                      <Button variant="gradient" size="sm" className="w-full rounded-xl text-xs font-bold">
                        Book {prov.user.name.split(' ')[0]}
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {/* Rating */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Overall Rating</td>
              {providers.map((p) => {
                const isTop = p.rating === highestRating && highestRating > 0
                return (
                  <td key={p.id} className="p-5 text-center border-l border-slate-100">
                    <div className="inline-flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{(p.rating || 0).toFixed(1)}</span>
                      <span className="text-xs font-normal text-slate-500">({p.totalReviews || 0})</span>
                    </div>
                    {isTop && <span className="block text-[10px] font-bold text-emerald-600 mt-1">★ Highest Rated</span>}
                  </td>
                )
              })}
            </tr>

            {/* Starting Rate */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Starting Price</td>
              {providers.map((p) => {
                const primaryService = p.services?.[0]
                return (
                  <td key={p.id} className="p-5 text-center border-l border-slate-100 font-extrabold text-violet-700 text-base">
                    {primaryService ? formatCurrency(primaryService.price) : 'Contact'}
                    {primaryService?.priceType === 'hourly' && <span className="text-xs font-normal text-slate-400">/hr</span>}
                  </td>
                )
              })}
            </tr>

            {/* Completed Jobs */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Completed Jobs</td>
              {providers.map((p) => {
                const isTop = p.completedJobs === maxJobs && maxJobs > 0
                return (
                  <td key={p.id} className="p-5 text-center border-l border-slate-100">
                    <span className="font-bold text-slate-900">{p.completedJobs || 0} jobs</span>
                    {isTop && <span className="block text-[10px] font-bold text-emerald-600 mt-1">🏆 Most Experienced</span>}
                  </td>
                )
              })}
            </tr>

            {/* Experience */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Experience</td>
              {providers.map((p) => (
                <td key={p.id} className="p-5 text-center border-l border-slate-100 text-slate-700 font-medium">
                  {p.experience ? `${p.experience} Years` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Verification Status */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Identity Verification</td>
              {providers.map((p) => (
                <td key={p.id} className="p-5 text-center border-l border-slate-100">
                  {p.isVerified ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">Standard</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Emergency Support */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Emergency Support</td>
              {providers.map((p) => (
                <td key={p.id} className="p-5 text-center border-l border-slate-100">
                  {p.isEmergencyAvailable ? (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
                      <Zap className="w-3.5 h-3.5" /> Available 24/7
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">Standard Hours</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Services Offered */}
            <tr>
              <td className="p-5 font-semibold text-slate-700 bg-slate-50/30">Services Offered</td>
              {providers.map((p) => (
                <td key={p.id} className="p-5 text-center border-l border-slate-100">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {p.services && p.services.length > 0 ? (
                      p.services.map((s: any) => (
                        <span key={s.id} className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                          {s.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">General Services</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
