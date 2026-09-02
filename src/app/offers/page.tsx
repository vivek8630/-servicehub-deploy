'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tag, Sparkles, Copy, Check, ArrowRight, Percent, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'

const offersList = [
  {
    code: 'AC10',
    title: 'Beat the Heat: AC Services',
    discount: '10% OFF',
    desc: 'Valid on AC installation, gas refilling, and priority repair servicing.',
    category: 'home-repair-maintenance',
    search: 'AC Repair',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Trending',
  },
  {
    code: 'CLEAN20',
    title: 'Festival Deep Cleaning Special',
    discount: '20% OFF',
    desc: 'Applies to full home deep cleaning, kitchen sanitation, and sofa cleaning services.',
    category: 'home-repair-maintenance',
    search: 'Cleaning',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Popular',
  },
  {
    code: 'FIXIT15',
    title: 'First Plumbing or Electrical Job',
    discount: '15% OFF',
    desc: 'Discount applied to labor charges on electrical wiring, leaks, or faucet replacements.',
    category: 'home-repair-maintenance',
    search: 'Plumbing',
    color: 'from-orange-500 to-amber-600',
    badge: 'New Users',
  },
  {
    code: 'SHPHOTO',
    title: 'Premium Event Photography',
    discount: 'Flat ₹500 Off',
    desc: 'Save flat ₹500 on weddings, birthdays, portraits, or video coverage booking.',
    category: 'creative-design',
    search: 'Photography',
    color: 'from-pink-500 to-rose-600',
    badge: 'Limited Time',
  },
]

export default function OffersPage() {
  const { toast } = useToast()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast({
      title: 'Coupon Copied!',
      description: `Code "${code}" copied to clipboard. Apply it at checkout.`,
      variant: 'success',
    })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-3">
            <Tag className="w-3.5 h-3.5" />
            Active Promos
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Special Offers & Promotions
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Save on trusted home services, repairs, photography, and more. Copy a code and book priority slots today.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offersList.map((offer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-300"
            >
              {/* Left Discount Banner */}
              <div className={`sm:w-44 bg-gradient-to-br ${offer.color} p-6 flex flex-col justify-between text-white shrink-0 items-center text-center sm:items-start sm:text-left`}>
                <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase">
                  {offer.badge}
                </div>
                <div className="my-6">
                  <Percent className="w-6 h-6 opacity-80 mb-2 hidden sm:block" />
                  <p className="text-2xl sm:text-3xl font-black leading-none">{offer.discount.split(' ')[0]}</p>
                  <p className="text-sm font-semibold mt-0.5 opacity-90">{offer.discount.split(' ').slice(1).join(' ') || 'OFF'}</p>
                </div>
                <div className="text-[10px] opacity-75 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Ends Soon
                </div>
              </div>

              {/* Right Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {offer.desc}
                  </p>
                </div>

                {/* Coupon Copy area */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 border border-dashed border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
                    <span className="text-xs font-mono font-bold text-slate-700 tracking-wider">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy Coupon Code"
                    >
                      {copiedCode === offer.code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <Link href={`/providers?search=${encodeURIComponent(offer.search)}`} className="flex-1 min-w-[120px]">
                    <Button variant="gradient" className="w-full text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 group">
                      Book Now
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo notice */}
        <div className="mt-12 bg-violet-50 rounded-2xl border border-violet-100 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Sparkles className="w-8 h-8 text-violet-600 shrink-0" />
          <div>
            <h4 className="font-bold text-violet-900">How to use coupon codes?</h4>
            <p className="text-xs sm:text-sm text-violet-700 mt-0.5">
              Copy any active coupon code from this page. When booking a service, the coupon discount is automatically calculated on the checkout page during the payment step!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
