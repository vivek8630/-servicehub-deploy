'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toaster'
import { serviceSchema } from '@/lib/validations'

interface Category {
  id: string
  name: string
}

interface NewServiceClientProps {
  categories: Category[]
}

export default function NewServiceClient({ categories }: NewServiceClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    priceType: 'fixed',
    estimatedDuration: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      priceType: formData.priceType,
      estimatedDuration: formData.estimatedDuration ? Number(formData.estimatedDuration) : undefined,
    }

    // Client-side validation check
    const validation = serviceSchema.safeParse(payload)
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
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Service has been registered successfully.',
          variant: 'success',
        })
        router.push('/provider/services')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to register service.',
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
      {/* Back Link */}
      <Link
        href="/provider/services"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <Card className="border-slate-100 shadow-md">
        <CardHeader className="border-b border-slate-50">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-600" />
            Add New Service Listing
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Service Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Premium Bathroom Cleaning, AC General Repair"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-900 ${
                    errors.categoryId ? 'border-red-500' : 'border-slate-200'
                  }`}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
              </div>

              {/* Estimated Duration */}
              <div>
                <label htmlFor="estimatedDuration" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Est. Duration (Minutes)
                </label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  type="number"
                  placeholder="e.g. 60, 120"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  className={errors.estimatedDuration ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                />
                {errors.estimatedDuration && <p className="text-xs text-red-500 mt-1">{errors.estimatedDuration}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Base Price (₹) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g. 499"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                  required
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>

              {/* Price Type */}
              <div>
                <label htmlFor="priceType" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Price Type *
                </label>
                <select
                  id="priceType"
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-900"
                  required
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="starting_from">Starting From</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Description & Inclusions
              </label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe what services are included, specific materials/tools, or client preparation details..."
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <Button type="submit" variant="gradient" className="w-full" isLoading={loading}>
              Create Service Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
