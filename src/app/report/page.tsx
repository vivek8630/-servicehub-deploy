import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Report an Issue | ServiceHub' }

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Report an Issue</h1>
          <p className="text-slate-600">Submit a safety or service concern to our administration team.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Category</label>
              <select className="w-full rounded-md border border-slate-300 p-2 text-sm">
                <option>Provider Conduct</option>
                <option>Booking Problem</option>
                <option>Review Moderation</option>
                <option>Other Technical Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
                placeholder="Provide details about the issue..."
              />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-medium">
              Submit Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
