'use client'

import Link from 'next/link'
import { AlertCircle, ShieldAlert, Flame, Wrench, Zap, Key, Snowflake, Truck } from 'lucide-react'

const emergencyCategories = [
  {
    name: 'Plumbing Emergency',
    slug: 'home-repair-maintenance', // matches plumbers in database slug
    description: 'Burst pipes, active leaks, or major blockages.',
    icon: Wrench,
    color: 'from-blue-500 to-sky-600',
    tag: 'Plumber',
  },
  {
    name: 'Electrical Failure',
    slug: 'home-repair-maintenance', // matches electricians
    description: 'Short circuits, power blackouts, or sparkling sockets.',
    icon: Zap,
    color: 'from-amber-500 to-yellow-600',
    tag: 'Electrician',
  },
  {
    name: 'AC Breakdown',
    slug: 'home-repair-maintenance', // AC repair
    description: 'Sudden AC failure in extreme heat or water leaks.',
    icon: Snowflake,
    color: 'from-cyan-500 to-teal-600',
    tag: 'AC Repair',
  },
  {
    name: 'Towing & Roadside',
    slug: 'technology-electronics', // can be other category or generic
    description: 'Car breakdown, towing, flat tire, or battery jumpstart.',
    icon: Truck,
    color: 'from-red-500 to-orange-600',
    tag: 'Mechanic',
  },
]

export default function EmergencyServices() {
  return (
    <section className="py-12 bg-gradient-to-r from-red-50/50 via-violet-50/20 to-indigo-50/50 border-y border-red-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Need Help Right Now? <span className="text-red-600 font-semibold text-sm bg-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">⚡ Emergency Mode</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Connect instantly with local professionals offering 24/7 priority emergency services.
            </p>
          </div>
        </div>

        {/* Grid list of categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {emergencyCategories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-red-200 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={`/providers?emergency=true&search=${encodeURIComponent(cat.tag)}`}
                  className="w-full text-center py-2 px-4 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Find Priority Providers
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
