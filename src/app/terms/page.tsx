import { FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service | ServiceHub' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <FileText className="w-12 h-12 text-violet-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last updated: August 2026</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>Welcome to ServiceHub. By creating an account or accessing our services, you agree to comply with and be bound by these Terms of Service.</p>
            <h3 className="text-base font-bold text-slate-900">1. User Accounts</h3>
            <p>Users must provide accurate information when registering as customers or service providers. Providers are responsible for maintaining valid licenses and service quality.</p>
            <h3 className="text-base font-bold text-slate-900">2. Bookings & Cancellations</h3>
            <p>Customers can request service bookings through the platform. Booking cancellations or rescheduling must adhere to provider response schedules.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
