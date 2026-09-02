import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const provider = await prisma.providerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
        services: {
          where: { isActive: true },
          include: { category: true },
          orderBy: { price: 'asc' },
        },
        reviews: {
          where: { isVisible: true },
          select: {
            id: true,
            rating: true,
            comment: true,
            serviceQuality: true,
            communication: true,
            valueForMoney: true,
          },
          take: 5,
        },
      },
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    return NextResponse.json({ provider })
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json({ error: 'Failed to fetch provider' }, { status: 500 })
  }
}
