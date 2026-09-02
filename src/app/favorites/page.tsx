import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import FavoritesClient from './favorites-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View and manage your saved service providers on ServiceHub.',
}

export default async function FavoritesPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'CUSTOMER' || !user.customerProfile) {
    redirect('/')
  }

  // Load all favorites
  const favorites = await prisma.favorite.findMany({
    where: { customerProfileId: user.customerProfile.id },
    include: {
      provider: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          services: {
            where: { isActive: true },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const formattedFavorites = favorites.map((f) => ({
    id: f.provider.id,
    name: f.provider.user.name,
    image: f.provider.user.image || undefined,
    rating: f.provider.rating,
    totalReviews: f.provider.totalReviews,
    completedJobs: f.provider.completedJobs,
    city: f.provider.city || 'India',
    isVerified: f.provider.isVerified,
    primaryService: f.provider.services[0]
      ? {
          name: f.provider.services[0].name,
          price: f.provider.services[0].price,
          priceType: f.provider.services[0].priceType,
        }
      : null,
  }))

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <FavoritesClient initialFavorites={formattedFavorites} />
    </div>
  )
}
