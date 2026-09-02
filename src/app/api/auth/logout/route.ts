import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session-token')?.value

    if (token) {
      await prisma.session.deleteMany({ where: { token } }).catch(() => {})
    }

    const response = NextResponse.redirect(new URL('/', req.url))
    response.cookies.delete('session-token')
    return response
  } catch {
    const response = NextResponse.redirect(new URL('/', req.url))
    response.cookies.delete('session-token')
    return response
  }
}
