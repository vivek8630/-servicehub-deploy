import { Briefcase, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Careers | ServiceHub' }

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">Careers at ServiceHub</h1>
          <p className="text-slate-600">Build the future of local services marketplaces in India.</p>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Full Stack Engineer (Next.js & TypeScript)', location: 'Bengaluru / Remote', type: 'Full-time' },
            { title: 'Product Manager - Discovery & Growth', location: 'Mumbai / Hybrid', type: 'Full-time' },
            { title: 'Provider Operations Lead', location: 'Delhi NCR', type: 'Full-time' },
          ].map((job) => (
            <Card key={job.title}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" /> {job.location} • {job.type}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
