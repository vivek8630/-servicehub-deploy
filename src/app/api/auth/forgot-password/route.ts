import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Security best practice: Don't reveal if the user exists
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // In a real application, you would send an email here.
    // For development, we'll log it and (optionally) return it so we can test the flow.
    console.log(`[DEV MODE] Password reset token for ${email}: ${resetToken}`)

    return NextResponse.json(
      { 
        message: 'If an account exists with this email, a password reset link has been sent.',
        // TODO: Remove this in production. Included for testing purposes.
        devToken: process.env.NODE_ENV === 'development' ? resetToken : undefined 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
