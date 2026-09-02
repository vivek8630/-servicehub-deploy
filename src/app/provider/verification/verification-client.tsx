'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, ShieldCheck, ShieldAlert, Clock, CheckCircle2, FileText, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toaster'
import { Badge } from '@/components/ui/badge'

interface VerificationClientProps {
  initialStatus: string
  isVerified: boolean
}

export default function VerificationClient({ initialStatus, isVerified }: VerificationClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    legalName: '',
    idType: 'aadhaar',
    idNumber: '',
    businessType: 'individual',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/provider/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus('PENDING')
        toast({
          title: 'Application Submitted',
          description: 'Your verification details have been sent to administration.',
          variant: 'success',
        })
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit application. Please try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'A network error occurred.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Dashboard */}
      <Link
        href="/provider/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {status === 'VERIFIED' || isVerified ? (
        <Card className="border-emerald-100 bg-emerald-50/30 shadow-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verified Professional</h2>
            <div className="flex justify-center mb-4">
              <Badge variant="verified" className="bg-emerald-600 px-3 py-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Badge Active
              </Badge>
            </div>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Congratulations! Your provider profile has been verified by the ServiceHub Admin team. A checkmark is now visible next to your name, boosting your visibility and booking potential.
            </p>
            <div className="mt-8 pt-6 border-t border-emerald-100/50 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/providers">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Public Profile
                </Button>
              </Link>
              <Link href="/provider/dashboard">
                <Button variant="gradient" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : status === 'PENDING' ? (
        <Card className="border-amber-100 bg-amber-50/20 shadow-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-50">
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Under Review</h2>
            <div className="flex justify-center mb-4">
              <Badge variant="warning" className="px-3 py-1">
                Under Admin Review
              </Badge>
            </div>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              We have received your verification application. Our administrative support team is currently review your identity, business details, and certificates. This process usually takes 24–48 hours.
            </p>
            <div className="mt-6 text-xs text-slate-400">
              Need help? Contact support at <span className="font-medium text-slate-600">support@servicehub.in</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-100 shadow-md">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Apply for Verification</CardTitle>
                <CardDescription>Verify your profile to gain trust and receive up to 5x more bookings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {status === 'REJECTED' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 text-sm">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Previous Application Rejected</p>
                  <p className="text-xs text-red-700 mt-0.5">
                    Your previous verification request was not approved. Please ensure all ID details are correct and submit a fresh application.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="legalName" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Legal Name (As on ID card) *
                </label>
                <Input
                  id="legalName"
                  name="legalName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.legalName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessType" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-900"
                    required
                  >
                    <option value="individual">Individual Freelancer</option>
                    <option value="agency">Agency / Business Entity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="idType" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Identity Proof Document *
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-900"
                    required
                  >
                    <option value="aadhaar">Aadhaar Card (India)</option>
                    <option value="pan">PAN Card</option>
                    <option value="license">Driver's License</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="idNumber" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Document Identification Number *
                </label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  placeholder="Enter card/document number"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Guideline Checklist:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Your profile name must match the legal name on the identity card.</li>
                  <li>You must have completed profile location details and have at least 1 registered service.</li>
                  <li>Our administrators will cross-verify this information with local business directories.</li>
                </ul>
              </div>

              <Button type="submit" variant="gradient" className="w-full flex items-center justify-center gap-1.5" isLoading={loading}>
                Submit Application
                <ChevronRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
