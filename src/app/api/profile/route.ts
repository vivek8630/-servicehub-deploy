import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      name,
      phone,
      image,
      bio,
      experience,
      city,
      location,
      isEmergencyAvailable,
      atHomeService,
      onlineService,
      languages,
      latitude,
      longitude,
    } = body

    if (name && name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }

    // Update base User
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        image: image !== undefined ? image : undefined,
      },
    })

    // If user is a PROVIDER and providerProfile exists, update it too
    if (user.role === 'PROVIDER' && user.providerProfile) {
      const expValue = experience !== undefined && experience !== '' ? Number(experience) : undefined
      const latValue = latitude !== undefined && latitude !== '' ? Number(latitude) : undefined
      const lngValue = longitude !== undefined && longitude !== '' ? Number(longitude) : undefined

      await prisma.providerProfile.update({
        where: { id: user.providerProfile.id },
        data: {
          bio: bio !== undefined ? bio : undefined,
          experience: expValue !== undefined ? expValue : undefined,
          city: city !== undefined ? city : undefined,
          location: location !== undefined ? location : undefined,
          isEmergencyAvailable: isEmergencyAvailable !== undefined ? Boolean(isEmergencyAvailable) : undefined,
          atHomeService: atHomeService !== undefined ? Boolean(atHomeService) : undefined,
          onlineService: onlineService !== undefined ? Boolean(onlineService) : undefined,
          languages: languages !== undefined ? languages : undefined,
          latitude: latValue !== undefined ? latValue : undefined,
          longitude: lngValue !== undefined ? lngValue : undefined,
        },
      })
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
