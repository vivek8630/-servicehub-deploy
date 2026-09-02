'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toaster'
import { reviewSchema } from '@/lib/validations'

interface ReviewClientProps {
  bookingId: string
  providerName: string
  serviceName: string
}

type RatingFields = 'rating' | 'serviceQuality' | 'communication' | 'valueForMoney'

export default function ReviewClient({ bookingId, providerName, serviceName }: ReviewClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [ratings, setRatings] = useState<Record<RatingFields, number>>({
    rating: 5,
    serviceQuality: 5,
    communication: 5,
    valueForMoney: 5,
  })

  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleRatingChange = (field: RatingFields, val: number) => {
    setRatings((prev) => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const payload = {
      bookingId,
      rating: ratings.rating,
      serviceQuality: ratings.serviceQuality,
      communication: ratings.communication,
      valueForMoney: ratings.valueForMoney,
      comment: comment || undefined,
    }

    // Client-side schema check
    const validation = reviewSchema.safeParse({
      rating: payload.rating,
      serviceQuality: payload.serviceQuality,
      communication: payload.communication,
      valueForMoney: payload.valueForMoney,
      comment: payload.comment,
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
        description: 'Please correct the highlighted errors.',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({
          title: 'Review Submitted',
          description: 'Thank you for your feedback!',
          variant: 'success',
        })
        router.push('/bookings')
        router.refresh()
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit review.',
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

  const renderStars = (field: RatingFields, currentVal: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const val = i + 1
          return (
            <button
              key={val}
              type="button"
              onClick={() => handleRatingChange(field, val)}
              className="p-1 hover:scale-110 transition-transform focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  val <= currentVal
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }`}
              />
            </button>
          )
        })}
      </div>
    )
  }

  const ratingCategories: { field: RatingFields; label: string; desc: string }[] = [
    { field: 'rating', label: 'Overall Rating', desc: 'How would you rate your overall experience?' },
    { field: 'serviceQuality', label: 'Service Quality', desc: 'Was the service performed professionally and accurately?' },
    { field: 'communication', label: 'Communication & Timing', desc: 'Was the provider polite, responsive, and punctual?' },
    { field: 'valueForMoney', label: 'Value for Money', desc: 'Do you feel the service price matched the value provided?' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link href="/bookings" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      <Card className="border-slate-100 shadow-md">
        <CardHeader className="border-b border-slate-50">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-600" />
            Write a Review
          </CardTitle>
          <CardDescription>
            Share your feedback on the <span className="font-semibold text-slate-800">{serviceName}</span> service by{' '}
            <span className="font-semibold text-slate-800">{providerName}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating controls */}
            <div className="space-y-4">
              {ratingCategories.map(({ field, label, desc }) => (
                <div key={field} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100/50 gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <div className="shrink-0">
                    {renderStars(field, ratings[field])}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Area */}
            <div>
              <label htmlFor="comment" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Detailed Feedback (Minimum 10 characters) *
              </label>
              <Textarea
                id="comment"
                rows={5}
                placeholder="How was your experience? What went well and what could be improved? Be honest and helpful to future customers."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={errors.comment ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                required
              />
              {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
            </div>

            <Button type="submit" variant="gradient" className="w-full" isLoading={loading}>
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
