import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import MessagesClient from './messages-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Chat and communicate with service providers or customers.',
}

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function MessagesPage({ searchParams }: Props) {
  const user = await getSession()
  if (!user) redirect('/login')

  const resolvedParams = await searchParams
  const contactUserId = resolvedParams.userId || null

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <MessagesClient currentUserId={user.id} contactUserId={contactUserId} />
    </div>
  )
}
