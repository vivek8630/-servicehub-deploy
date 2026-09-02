import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Star, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ServiceMoments() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-violet-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4 border border-violet-200 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Real Service Moments
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Quality Service Delivered to Your Doorstep
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            From electrical repairs to luxury deep cleaning, our verified professionals ensure every job is completed with excellence.
          </p>
        </div>

        {/* Feature Grid with Real Moments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Main Hero Banner Picture */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
            <img
              src="/images/hero-banner.png"
              alt="ServiceHub Professionals in Action"
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-8 text-white">
              <div className="flex items-center gap-2 bg-emerald-500/90 text-white rounded-full px-3 py-1 text-xs font-bold mb-2 w-fit backdrop-blur-md">
                <ShieldCheck className="w-4 h-4" /> 100% Verified Experts
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Trusted Professionals for Every Need
              </h3>
              <p className="text-sm text-slate-200 max-w-md">
                Background-checked, insured, and top-rated local experts ready to serve you today.
              </p>
            </div>
          </div>

          {/* Right Side: Two Picture Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Moment 1: Electrical Repair */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/repair-moment.png"
                  alt="Electrical Repair Specialist"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-slate-950" /> 4.9 Rating
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Home Electrical & Plumbing
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Quick wiring fixes, socket repairs, fixture installations by certified technicians.
                </p>
                <Link href="/providers?category=home-services">
                  <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold text-violet-600 border-violet-200 hover:bg-violet-50">
                    Book Technician <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Moment 2: Deep Cleaning */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/cleaning-moment.png"
                  alt="Home Deep Cleaning Specialist"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-cyan-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eco-Clean
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Luxury Home Deep Cleaning
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Spotless apartment cleaning, kitchen degreasing & sofa sanitization.
                </p>
                <Link href="/providers?category=cleaning">
                  <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold text-violet-600 border-violet-200 hover:bg-violet-50">
                    Book Cleaners <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
