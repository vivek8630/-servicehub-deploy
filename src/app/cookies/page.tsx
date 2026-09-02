import { Cookie } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cookie Policy | ServiceHub' }

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Cookie className="w-12 h-12 text-amber-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Cookie Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: August 2026</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>ServiceHub uses essential cookies and local storage to maintain session authentication, remember user preferences, and deliver seamless browsing experiences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
