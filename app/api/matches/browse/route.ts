import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { calculateDistance, calculateAge } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET(_request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const maxDistance = searchParams.get('maxDistance') ? parseInt(searchParams.get('maxDistance')!) : null
    const countries = searchParams.getAll('countries')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Build filter
    const whereClause: any = {
      id: { not: userId },
      gender: { in: user.seekingGender },
      isActive: true,
      isVerified: true,
      // Exclude blocked users
      blockedByUsers: {
        none: { blockingUserId: userId }
      }
    }

    // Apply country filter if specified
    if (countries && countries.length > 0) {
      whereClause.country = { in: countries }
    }

    // Get matching profiles
    let profiles = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        profileImages: true,
        gender: true,
        dateOfBirth: true,
        city: true,
        country: true,
        timezone: true,
        latitude: true,
        longitude: true,
        lastSeen: true,
      },
      take: 50,
    })

    // Filter by distance if specified
    if (maxDistance) {
      profiles = profiles.filter(profile => {
        const distance = calculateDistance(
          user.latitude,
          user.longitude,
          profile.latitude,
          profile.longitude
        )
        return distance <= maxDistance
      })
    }

    // Add computed fields
    const enrichedProfiles = profiles.map(profile => {
      const distance = calculateDistance(
        user.latitude,
        user.longitude,
        profile.latitude,
        profile.longitude
      )
      const age = calculateAge(profile.dateOfBirth)

      return {
        ...profile,
        dateOfBirth: undefined,
        age,
        distance: Math.round(distance),
        liked: false, // Would check in real app
      }
    })

    return NextResponse.json({ profiles: enrichedProfiles })
  } catch (error) {
    console.error('Browse error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}
