import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const prisma = new PrismaClient()

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, username: true, firstName: true, lastName: true,
        bio: true, profileImages: true, gender: true, dateOfBirth: true,
        city: true, country: true, timezone: true, latitude: true, longitude: true,
        seekingGender: true, minAge: true, maxAge: true, maxDistance: true,
        preferredCountries: true, isVerified: true, lastSeen: true, createdAt: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Update lastSeen
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id

    const body = await request.json()
    const { bio, city, country, maxDistance, preferredCountries, minAge, maxAge } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(maxDistance !== undefined && { maxDistance }),
        ...(preferredCountries !== undefined && { preferredCountries }),
        ...(minAge !== undefined && { minAge }),
        ...(maxAge !== undefined && { maxAge }),
      },
      select: { id: true, username: true, firstName: true, bio: true, city: true, country: true },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
