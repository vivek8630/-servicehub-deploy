import { Newspaper } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Press & Media | ServiceHub' }

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">Press & News</h1>
          <p className="text-slate-600">Latest announcements, news, and press kits from ServiceHub.</p>
        </div>

        <div className="space-y-4">
          {[
            { date: 'August 2026', title: 'ServiceHub Expands On-Demand Home Services to 15+ Cities Across India' },
            { date: 'July 2026', title: 'Introducing Verified Partner Badges & Instant Customer Ratings' },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6 space-y-2">
                <span className="text-xs font-semibold text-violet-600 uppercase">{item.date}</span>
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
