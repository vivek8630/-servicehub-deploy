import { getSession } from '@/lib/auth'
import CompareClient from './compare-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Providers | ServiceHub',
  description: 'Side-by-side provider comparison matrix for pricing, ratings, and experience.',
}

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function ComparePage({ searchParams }: Props) {
  const user = await getSession()
  const resolvedParams = await searchParams
  const ids = resolvedParams.ids ? resolvedParams.ids.split(',') : []

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <CompareClient providerIds={ids} userRole={user?.role} />
    </div>
  )
}
