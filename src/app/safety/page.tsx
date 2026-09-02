import { ShieldCheck, Lock, UserCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Safety & Trust | ServiceHub' }

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Safety & Trust Standards</h1>
          <p className="text-slate-600">Your safety and peace of mind are our top priorities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <UserCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Identity Verification</h3>
              <p className="text-sm text-slate-500">Providers undergo identity verification before earning a verified badge.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Lock className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Secure Messaging</h3>
              <p className="text-sm text-slate-500">Chat safely within our platform without exposing personal details upfront.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-violet-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Rating Transparency</h3>
              <p className="text-sm text-slate-500">Verified customer reviews and ratings ensure service quality control.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
