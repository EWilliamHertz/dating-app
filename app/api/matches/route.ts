import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const prisma = new PrismaClient()

function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get all users that this user liked
    const sentLikes = await prisma.like.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
    })
    const likedIds = sentLikes.map(l => l.receiverId)

    // Find mutual likes (they also liked back)
    const mutualLikes = await prisma.like.findMany({
      where: {
        senderId: { in: likedIds },
        receiverId: userId,
      },
      include: {
        sender: {
          select: {
            id: true, username: true, firstName: true, lastName: true,
            profileImages: true, bio: true, city: true, country: true,
            timezone: true, dateOfBirth: true, lastSeen: true, isActive: true,
          },
        },
      },
    })

    const matches = mutualLikes.map(like => ({
      ...like.sender,
      age: calculateAge(like.sender.dateOfBirth),
      dateOfBirth: undefined,
    }))

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Matches error:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}
