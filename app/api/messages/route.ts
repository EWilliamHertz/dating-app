import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const prisma = new PrismaClient()

// GET /api/messages - Get all conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id

    // Get all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, profileImages: true, username: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, profileImages: true, username: true } },
      },
    })

    // Group into conversations by the other user
    const convMap = new Map<string, any>()
    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          userId: otherId,
          user: otherUser,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unread: !msg.isRead && msg.receiverId === userId ? 1 : 0,
        })
      } else {
        const existing = convMap.get(otherId)!
        if (!msg.isRead && msg.receiverId === userId) existing.unread++
      }
    }

    return NextResponse.json({ conversations: Array.from(convMap.values()) })
  } catch (error) {
    console.error('Messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id

    const { receiverId, content } = await request.json()
    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'receiverId and content are required' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: { senderId: userId, receiverId, content: content.trim() },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
