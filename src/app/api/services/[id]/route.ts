import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { serviceSchema } from '@/lib/validations'

// PATCH: toggle active status or update service details
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: serviceId } = await params
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    if (service.providerProfileId !== user.providerProfile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    // If it's a simple status toggle
    if (body.isActive !== undefined) {
      const updated = await prisma.service.update({
        where: { id: serviceId },
        data: { isActive: !!body.isActive },
      })
      return NextResponse.json({ service: updated })
    }

    // Otherwise, it's a detail update
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const { name, description, categoryId, price, priceType, estimatedDuration } = parsed.data

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description: description || null,
        categoryId,
        price,
        priceType,
        estimatedDuration: estimatedDuration || null,
      },
    })

    return NextResponse.json({ service: updated })
  } catch (error) {
    console.error('Service update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: delete a service
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: serviceId } = await params
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'PROVIDER' || !user.providerProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    if (service.providerProfileId !== user.providerProfile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.service.delete({
      where: { id: serviceId },
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Service deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
