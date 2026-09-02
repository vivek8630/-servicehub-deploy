'use client'

import Link from 'next/link'
import { Tag, ArrowRight, Sparkles, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'

const homeOffers = [
  {
    code: 'AC10',
    title: 'AC Repairs & Gas Refill',
    discount: '10% OFF',
    desc: 'Keep cool with expert AC maintenance.',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    code: 'CLEAN20',
    title: 'Deep House Cleaning',
    discount: '20% OFF',
    desc: 'Eco-friendly premium sanitation.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    code: 'FIXIT15',
    title: 'Home Repair & Plumbing',
    discount: '15% OFF',
    desc: 'Valid on plumbing & electrical services.',
    color: 'from-orange-500 to-amber-600',
  },
]

export default function OffersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3" /> Special Promotions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Exclusive Deals & Offers
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Grab high-value discounts on top-rated local services near you.
            </p>
          </div>
          <Link href="/offers" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50">
              View All Offers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Offers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeOffers.map((offer, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl border border-slate-100 hover:border-violet-200 p-6 bg-gradient-to-b from-slate-50 to-white hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-56"
            >
              {/* background vector gradient glow */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-violet-100/30 blur-2xl group-hover:bg-violet-100/50 transition-all duration-300" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 text-[10px] font-bold font-mono tracking-wider">
                    {offer.code}
                  </span>
                  <div className="text-violet-600 font-bold text-lg flex items-center gap-0.5">
                    <Percent className="w-4 h-4" />
                    {offer.discount}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-violet-600 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {offer.desc}
                </p>
              </div>

              <div className="pt-4 z-10">
                <Link href="/offers">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                    Claim Promotion
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
