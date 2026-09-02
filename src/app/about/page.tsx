import Link from 'next/link'
import { Wrench, Users, ShieldCheck, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us | ServiceHub' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">About ServiceHub</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Connecting homes and businesses with trusted, verified local service professionals across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Users className="w-8 h-8 text-violet-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Customer First</h3>
              <p className="text-sm text-slate-500">Transparent pricing, verified ratings, and easy booking wizard.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Verified Pros</h3>
              <p className="text-sm text-slate-500">Rigorous identity and background verification checks for peace of mind.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Heart className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="font-bold text-slate-900">Local Empowerment</h3>
              <p className="text-sm text-slate-500">Helping skilled workers grow their business independently.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
