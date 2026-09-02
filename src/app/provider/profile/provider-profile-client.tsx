'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Briefcase,
  MapPin,
  AlignLeft,
  ShieldAlert,
  Home,
  Globe,
  Languages as LangIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toaster'
import { providerProfileSchema } from '@/lib/validations'

interface ProfileData {
  name: string
  phone: string
  bio: string
  experience: string
  city: string
  location: string
  isEmergencyAvailable: boolean
  atHomeService: boolean
  onlineService: boolean
  languages: string
  latitude: string
  longitude: string
}

interface ProviderProfileClientProps {
  initialData: ProfileData
}

export default function ProviderProfileClient({ initialData }: ProviderProfileClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleCheckboxChange = (name: keyof ProfileData) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const payload = {
      name: formData.name,
      phone: formData.phone || undefined,
      bio: formData.bio || undefined,
      experience: formData.experience ? Number(formData.experience) : undefined,
      city: formData.city || undefined,
      location: formData.location || undefined,
      isEmergencyAvailable: formData.isEmergencyAvailable,
      atHomeService: formData.atHomeService,
      onlineService: formData.onlineService,
      languages: formData.languages || undefined,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
    }

    // Client-side schema check
    const validation = providerProfileSchema.safeParse({
      bio: payload.bio,
      experience: payload.experience,
      city: payload.city,
      location: payload.location,
      isEmergencyAvailable: payload.isEmergencyAvailable,
      atHomeService: payload.atHomeService,
      onlineService: payload.onlineService,
      languages: payload.languages,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message
        }
      })
      setErrors(fieldErrors)
      setLoading(false)
      toast({
        title: 'Validation Error',
        description: 'Please correct the highlighted fields.',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Your profile has been updated successfully.',
          variant: 'success',
        })
        router.push('/provider/dashboard')
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
        href="/provider/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <Card className="border-slate-100 shadow-md">
        <CardHeader className="border-b border-slate-50">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-violet-600" />
            Edit Provider Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. +91 9999999999"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                Service & Emergency Controls
              </h3>

              {/* Toggle controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEmergencyAvailable}
                    onChange={() => handleCheckboxChange('isEmergencyAvailable')}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4.5 h-4.5 mt-0.5"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-red-600 flex items-center gap-0.5">⚡ Emergency</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Offer 24/7 priority support slots</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.atHomeService}
                    onChange={() => handleCheckboxChange('atHomeService')}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4.5 h-4.5 mt-0.5"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-0.5">🏡 At-Home</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Travel to customer locations</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.onlineService}
                    onChange={() => handleCheckboxChange('onlineService')}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4.5 h-4.5 mt-0.5"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-0.5">💻 Online</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Deliver online consultation</p>
                  </div>
                </label>
              </div>

              {/* Experience and Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experience" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Years of Experience
                  </label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g. 5"
                    value={formData.experience}
                    onChange={handleChange}
                    className={errors.experience ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                  />
                  {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
                </div>

                <div>
                  <label htmlFor="languages" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <LangIcon className="w-3.5 h-3.5 text-slate-400" /> Languages Spoken
                  </label>
                  <Input
                    id="languages"
                    name="languages"
                    type="text"
                    placeholder="e.g. English, Hindi, Kannada"
                    value={formData.languages}
                    onChange={handleChange}
                    className={errors.languages ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                  />
                  {errors.languages && <p className="text-xs text-red-500 mt-1">{errors.languages}</p>}
                </div>
              </div>

              {/* City and Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="e.g. Bangalore, Delhi"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Full Location details
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Sector 4, HSR Layout"
                    value={formData.location}
                    onChange={handleChange}
                    className={errors.location ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Latitude
                  </label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 12.9715987"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 77.5945627"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Professional Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Tell potential customers about your specialties, quality of work, service guarantees, etc..."
                  value={formData.bio}
                  onChange={handleChange}
                  className={errors.bio ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                />
                {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full mt-4" isLoading={loading}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
