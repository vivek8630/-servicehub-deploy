import Link from 'next/link'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reset Password | ServiceHub' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Reset Password</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Enter your registered email address to receive password reset instructions.</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
                placeholder="name@example.com"
              />
            </div>
            <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium">
              Send Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
