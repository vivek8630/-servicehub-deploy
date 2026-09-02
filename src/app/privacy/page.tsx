import { Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy | ServiceHub' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Shield className="w-12 h-12 text-violet-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: August 2026</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>
              At ServiceHub, we are committed to protecting your personal data and privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our web platform and services.
            </p>
            <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
            <p>We collect account details (name, email, phone number), profile location, service preferences, and booking details necessary to connect customers with local service providers.</p>
            <h3 className="text-base font-bold text-slate-900">2. How We Use Information</h3>
            <p>Your information is used strictly to process bookings, enable communication between customers and providers, ensure safety, and improve platform performance.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
