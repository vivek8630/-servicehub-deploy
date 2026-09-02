import { HelpCircle, Search, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Help Center | ServiceHub' }

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-violet-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">How can we help?</h1>
          <p className="text-slate-600">Find answers to frequently asked questions about ServiceHub.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: 'How do I book a service provider?', a: 'Search for providers by location or category, choose a service, and select a preferred date and time.' },
            { q: 'How does provider verification work?', a: 'Providers submit government ID and business details which are reviewed by our admin team before earning a Verified badge.' },
            { q: 'Can I cancel or reschedule my booking?', a: 'Yes, you can manage your active bookings from your Customer Bookings dashboard.' },
            { q: 'How do payments work?', a: 'Payments are recorded securely upon booking completion.' },
          ].map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-slate-900">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
