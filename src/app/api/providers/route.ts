import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
  const minRating = parseFloat(searchParams.get('minRating') || '0')
  const verified = searchParams.get('verified') === 'true'
  const sortBy = searchParams.get('sortBy') || 'rating'
  const city = searchParams.get('city') || ''
  const emergency = searchParams.get('emergency') === 'true'
  const atHome = searchParams.get('atHome') === 'true'
  const online = searchParams.get('online') === 'true'
  const minExperience = parseInt(searchParams.get('minExperience') || '0')
  const language = searchParams.get('language') || ''

  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {
    user: { isActive: true },
    services: {
      some: {
        isActive: true,
        ...(minPrice || maxPrice < 999999
          ? { price: { gte: minPrice, lte: maxPrice } }
          : {}),
        ...(category ? { category: { slug: category } } : {}),
      },
    },
    ...(minRating > 0 ? { rating: { gte: minRating } } : {}),
    ...(verified ? { isVerified: true } : {}),
    ...(city ? { city: { contains: city } } : {}),
    ...(emergency ? { isEmergencyAvailable: true } : {}),
    ...(atHome ? { atHomeService: true } : {}),
    ...(online ? { onlineService: true } : {}),
    ...(minExperience > 0 ? { experience: { gte: minExperience } } : {}),
    ...(language ? { languages: { contains: language } } : {}),
    ...(search
      ? {
          OR: [
            { user: { name: { contains: search } } },
            { bio: { contains: search } },
            { services: { some: { name: { contains: search } } } },
          ],
        }
      : {}),
  }

  const orderBy: Record<string, unknown>[] =
    sortBy === 'rating'
      ? [{ rating: 'desc' }]
      : sortBy === 'experience'
      ? [{ experience: 'desc' }]
      : sortBy === 'jobs'
      ? [{ completedJobs: 'desc' }]
      : [{ rating: 'desc' }]

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        user: { select: { id: true, name: true, image: true } },
        services: {
          where: { isActive: true },
          include: { category: true },
          take: 3,
        },
      },
    }),
    prisma.providerProfile.count({ where }),
  ])

  return NextResponse.json({
    providers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}
