import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import NotificationsClient from './notifications-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications | ServiceHub',
  description: 'View your alerts and booking updates on ServiceHub.',
}

export default async function NotificationsPage() {
  const user = await getSession()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <NotificationsClient />
    </div>
  )
}
