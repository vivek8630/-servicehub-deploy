import { Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact Us | ServiceHub' }

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">Contact Support</h1>
          <p className="text-slate-600">We are here to help you 24/7.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Mail className="w-6 h-6 text-violet-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Email Us</h3>
              <p className="text-sm text-slate-500">support@servicehub.in</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Phone className="w-6 h-6 text-violet-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Call Support</h3>
              <p className="text-sm text-slate-500">+91 1800-123-4567</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <MapPin className="w-6 h-6 text-violet-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Headquarters</h3>
              <p className="text-sm text-slate-500">Bengaluru, Karnataka, India</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
