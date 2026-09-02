'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Power, Clock, Tag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toaster'
import { formatCurrency } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string
  price: number
  priceType: string
  estimatedDuration: number | null
  isActive: boolean
  categoryName: string
}

interface ServicesClientProps {
  initialServices: Service[]
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const { toast } = useToast()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (res.ok) {
        const data = await res.json()
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: data.service.isActive } : s))
        )
        toast({
          title: 'Status Updated',
          description: `Service is now ${!currentStatus ? 'active' : 'inactive'}.`,
          variant: 'success',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update service status.',
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
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id))
        toast({
          title: 'Service Deleted',
          description: 'The service has been removed successfully.',
          variant: 'success',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete service.',
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
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link href="/provider/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Services</h1>
          <p className="text-slate-500 mt-1">Manage and update the service listings you offer to customers</p>
        </div>
        <Link href="/provider/services/new">
          <Button variant="gradient" className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            Add New Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No services registered</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Register the professional services you offer to start getting bookings from customers in your city.
          </p>
          <Link href="/provider/services/new">
            <Button variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <Card key={s.id} className={`hover:shadow-md transition-all duration-300 border-slate-100 ${!s.isActive ? 'opacity-75' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <Badge variant="secondary" className="mb-2 bg-slate-100 text-slate-700 font-medium">
                      {s.categoryName}
                    </Badge>
                    <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-extrabold text-violet-600">
                      {formatCurrency(s.price)}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {s.priceType === 'hourly' ? 'hourly' : s.priceType === 'fixed' ? 'fixed' : 'starting from'}
                    </p>
                  </div>
                </div>

                {s.description && (
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {s.estimatedDuration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.estimatedDuration} mins</span>
                      </div>
                    )}
                    <Badge variant={s.isActive ? 'success' : 'outline'} className="text-[10px]">
                      {s.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={s.isActive ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleToggleActive(s.id, s.isActive)}
                      disabled={updatingId === s.id}
                      className="h-8 gap-1 text-xs"
                    >
                      <Power className="w-3 h-3" />
                      {s.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(s.id)}
                      disabled={updatingId === s.id}
                      className="h-8 border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
