'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, MapPin, Mail, Phone, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toaster'

interface ProfileData {
  name: string
  email: string
  phone: string
  address: string
  city: string
}

interface ProfileClientProps {
  initialData: ProfileData
}

export default function ProfileClient({ initialData }: ProfileClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Base validation
    if (formData.name.trim().length < 2) {
      toast({
        title: 'Validation Error',
        description: 'Name must be at least 2 characters.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Profile Updated',
          description: 'Your account settings have been saved.',
          variant: 'success',
        })
        router.push('/dashboard')
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update profile.',
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
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <Card className="border-slate-100 shadow-md">
        <CardHeader className="border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Account Settings</CardTitle>
              <CardDescription>Update your personal information and default service address.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1 text-slate-400">
                <Mail className="w-3 h-3" /> Email Address (Cannot be changed)
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> City
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <Home className="w-3 h-3 text-slate-400" /> Default Booking Address
                </label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="e.g. 123 Main St, Sector 2"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full mt-4" isLoading={loading}>
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
