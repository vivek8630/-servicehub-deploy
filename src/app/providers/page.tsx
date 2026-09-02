import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProvidersClient from './providers-client'

export const metadata: Metadata = {
  title: 'Find Service Providers',
  description: 'Search and filter verified local service providers. Compare ratings, experience, and pricing.',
}

export default function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-500">Loading providers...</div>}>
        <ProvidersClient searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  )
}
