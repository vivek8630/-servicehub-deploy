'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'

interface BookingActionButtonProps {
  bookingId: string
  status: string
  label: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
  className?: string
}

export function BookingActionButton({
  bookingId,
  status,
  label,
  variant = 'default',
  size = 'sm',
  className,
}: BookingActionButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Success',
          description: `Booking status updated to ${status.toLowerCase()}.`,
          variant: 'success',
        })
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update booking status.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'A network error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      isLoading={loading}
      className={className}
    >
      {label}
    </Button>
  )
}
