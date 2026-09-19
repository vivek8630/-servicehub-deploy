import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 })
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Coupon applied successfully',
      discount: coupon.discount
    }, { status: 200 })
  } catch (error) {
    console.error('Validate coupon error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
