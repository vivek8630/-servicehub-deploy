'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  Calendar,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Trash2,
  Check,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatTimeAgo } from '@/lib/utils'
import { useToast } from '@/components/ui/toaster'

type Notification = {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}

export default function NotificationsClient() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?limit=50')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load notifications.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      })
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
        // Dispatch global custom event to update navbar count
        window.dispatchEvent(new Event('notificationsUpdated'))
      }
    } catch {
      // Ignored
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        window.dispatchEvent(new Event('notificationsUpdated'))
        toast({
          title: 'Success',
          description: 'All notifications marked as read.',
          variant: 'success',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update notifications.',
        variant: 'destructive',
      })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_new':
      case 'booking_update':
      case 'booking_accept':
      case 'booking_reject':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-violet-600" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-600" />
      default:
        return <Bell className="w-5 h-5 text-slate-500" />
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking_new':
      case 'booking_update':
      case 'booking_accept':
      case 'booking_reject':
        return 'bg-blue-100/80'
      case 'new_message':
        return 'bg-violet-100/80'
      case 'payment':
        return 'bg-emerald-100/80'
      default:
        return 'bg-slate-100'
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with your service bookings and account activity</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={fetchNotifications} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50">
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-violet-100 text-violet-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-violet-100 text-violet-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-1/4 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center bg-white rounded-2xl border border-slate-150 py-16 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No notifications</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            {filter === 'unread'
              ? "All caught up! You don't have any unread notifications."
              : "You haven't received any notifications yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm overflow-hidden">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/80 cursor-pointer ${
                !notification.isRead ? 'bg-violet-50/10' : ''
              }`}
            >
              {/* Status Indicator Dot */}
              <div className="pt-2 shrink-0">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    !notification.isRead ? 'bg-violet-600' : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Icon */}
              <div className={`p-2.5 rounded-xl shrink-0 ${getIconBg(notification.type)}`}>
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                  <h3 className={`text-sm font-semibold text-slate-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                  {notification.message}
                </p>

                {/* Action Link */}
                {notification.link && (
                  <Link
                    href={notification.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
