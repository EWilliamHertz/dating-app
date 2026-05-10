import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderId, receiverId } = body

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Both senderId and receiverId are required' },
        { status: 400 }
      )
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId }
      }
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked this user' },
        { status: 400 }
      )
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        senderId,
        receiverId,
      },
    })

    // Check for mutual like (match)
    const mutualLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: { senderId: receiverId, receiverId: senderId }
      }
    })

    return NextResponse.json({
      like,
      isMutual: !!mutualLike,
    })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to like profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const senderId = searchParams.get('senderId')
    const receiverId = searchParams.get('receiverId')

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Both senderId and receiverId are required' },
        { status: 400 }
      )
    }

    // Delete like
    await prisma.like.delete({
      where: {
        senderId_receiverId: { senderId, receiverId }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json(
      { error: 'Failed to unlike profile' },
      { status: 500 }
    )
  }
}
