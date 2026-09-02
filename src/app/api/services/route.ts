import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { serviceSchema } from '@/lib/validations'

// GET: list services of current provider
export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const services = await prisma.service.findMany({
      where: { providerProfileId: user.providerProfile.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ services })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: create a new service
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const { name, description, categoryId, price, priceType, estimatedDuration } = parsed.data

    // Check if category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist.' }, { status: 404 })
    }

    const service = await prisma.service.create({
      data: {
        providerProfileId: user.providerProfile.id,
        categoryId,
        name,
        description: description || null,
        price,
        priceType,
        estimatedDuration: estimatedDuration || null,
        isActive: true,
      },
      include: { category: true },
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Service creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
