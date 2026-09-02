'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, X, Shield, ShieldCheck, Mail, Phone, Briefcase, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toaster'

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  experience: string
  city: string
  location: string
  rating: number
}

interface VerificationsClientProps {
  pendingProviders: Provider[]
}

export default function VerificationsClient({ pendingProviders }: VerificationsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [providers, setProviders] = useState<Provider[]>(pendingProviders)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAction = async (providerProfileId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(providerProfileId)
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerProfileId, action }),
      })

      if (res.ok) {
        setProviders((prev) => prev.filter((p) => p.id !== providerProfileId))
        toast({
          title: action === 'APPROVE' ? 'Approved' : 'Rejected',
          description: `Provider profile has been ${action.toLowerCase()}d.`,
          variant: 'success',
        })
        router.refresh()
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to update verification status.',
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
      setProcessingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-8 h-8 text-violet-600" />
          Verification Queue
        </h1>
        <p className="text-slate-500 mt-1">Review credentials and verify service providers</p>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Queue is empty</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            All pending service provider verification requests have been processed. Excellent job!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((p) => (
            <Card key={p.id} className="hover:shadow-sm transition-all duration-300 border-slate-100">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Provider Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {p.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {p.phone}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl text-sm">
                      <div className="space-y-0.5">
                        <p className="text-xs text-slate-400 font-medium">Experience</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {p.experience} years
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-slate-400 font-medium">Location</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {p.city}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-0.5">
                        <p className="text-xs text-slate-400 font-medium">Detail Address</p>
                        <p className="text-slate-600 font-medium text-xs truncate" title={p.location}>
                          {p.location}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Bio & Business Description</p>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        {p.bio}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0 lg:w-40">
                    <Button
                      variant="default"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-10 text-xs"
                      onClick={() => handleAction(p.id, 'APPROVE')}
                      disabled={processingId === p.id}
                      isLoading={processingId === p.id}
                    >
                      <Check className="w-4 h-4" />
                      Approve Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-600 gap-1.5 h-10 text-xs"
                      onClick={() => handleAction(p.id, 'REJECT')}
                      disabled={processingId === p.id}
                      isLoading={processingId === p.id}
                    >
                      <X className="w-4 h-4" />
                      Reject Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
