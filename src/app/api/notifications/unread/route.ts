import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ count: 0 })
  }

  try {
    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Fetch unread notifications count error:', error)
    return NextResponse.json({ count: 0 })
  }
}
