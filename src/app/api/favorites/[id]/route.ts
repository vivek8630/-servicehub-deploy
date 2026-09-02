import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: providerProfileId } = await params
  const user = await getSession()

  if (!user || user.role !== 'CUSTOMER' || !user.customerProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const customerProfileId = user.customerProfile.id

  const existing = await prisma.favorite.findUnique({
    where: { customerProfileId_providerProfileId: { customerProfileId, providerProfileId } },
  })

  if (existing) {
    await prisma.favorite.delete({
      where: { customerProfileId_providerProfileId: { customerProfileId, providerProfileId } },
    })
    return NextResponse.redirect(new URL(`/providers/${providerProfileId}`, req.url))
  }

  await prisma.favorite.create({ data: { customerProfileId, providerProfileId } })
  return NextResponse.redirect(new URL(`/providers/${providerProfileId}`, req.url))
}
