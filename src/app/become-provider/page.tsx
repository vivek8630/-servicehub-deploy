import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Briefcase, CheckCircle, ShieldCheck, TrendingUp, Clock, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become a Provider | ServiceHub',
  description: 'Grow your local service business with ServiceHub. Connect with thousands of customers across India.',
}

export default async function BecomeProviderPage() {
  const user = await getSession()

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/30">
            <Briefcase className="w-4 h-4" /> Join as a Service Professional
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Grow Your Service Business with <span className="text-violet-400">ServiceHub</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Connect with thousands of customers in your city, manage bookings easily, and earn flexible income on your own schedule.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              user.role === 'PROVIDER' ? (
                <Link href="/provider/dashboard">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 gap-2">
                    Go to Provider Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/provider/profile">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 gap-2">
                    Set Up Provider Profile <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/signup?role=PROVIDER">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 gap-2">
                  Register as a Partner <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Why Partner with ServiceHub?</h2>
          <p className="text-slate-500 mt-2">Everything you need to expand your reach and manage your work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: 'More Bookings & Earnings',
              desc: 'Get direct job requests from verified local customers without paying upfront advertising costs.',
            },
            {
              icon: Clock,
              title: 'Flexible Working Hours',
              desc: 'You choose when and where you want to work. Set your own custom service rates and availability.',
            },
            {
              icon: ShieldCheck,
              title: 'Verified Badge & Trust',
              desc: 'Complete identity verification to earn a Verified badge, boosting customer trust and bookings.',
            },
          ].map((benefit) => (
            <Card key={benefit.title} className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
