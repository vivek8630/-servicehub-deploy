import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signInSchema } from '@/lib/validations'
import crypto from 'crypto'

import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limitResult = rateLimit({ key: `login_${ip}`, limit: 5, windowMs: 60 * 1000 })
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 1 minute.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = signInSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        image: true,
        customerProfile: { select: { id: true } },
        providerProfile: { select: { id: true, isVerified: true, verificationStatus: true } },
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create session
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await prisma.session.create({ data: { userId: user.id, token, expiresAt } })

    const { passwordHash: _, ...safeUser } = user

    const response = NextResponse.json({ user: safeUser })
    response.cookies.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
