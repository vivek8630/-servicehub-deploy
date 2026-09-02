import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: list conversations for the current user
export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find all conversations where the user is a participant
    const participants = await prisma.conversationParticipant.findMany({
      where: { userId: user.id },
      select: { conversationId: true },
    })

    const conversationIds = participants.map((p) => p.conversationId)

    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    const allUserIds = Array.from(
      new Set(conversations.flatMap((c) => c.participants.map((p) => p.userId)))
    )

    const users = await prisma.user.findMany({
      where: { id: { in: allUserIds } },
      select: { id: true, name: true, image: true, role: true },
    })

    const usersMap = new Map(users.map((u) => [u.id, u]))

    const formattedConversations = conversations.map((conv) => ({
      ...conv,
      participants: conv.participants.map((p) => ({
        ...p,
        user: usersMap.get(p.userId) || { id: p.userId, name: 'Unknown User', role: 'CUSTOMER', image: null },
      })),
    }))

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error('Fetch conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: send a message or start a new conversation
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { conversationId, recipientId, content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 })
    }

    let activeConversationId = conversationId

    // If starting a new conversation with a recipient
    if (!activeConversationId && recipientId) {
      if (recipientId === user.id) {
        return NextResponse.json({ error: 'Cannot start conversation with yourself' }, { status: 400 })
      }

      // Check if a conversation already exists between these two users
      const existingConversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId: user.id },
          },
        },
        include: {
          participants: true,
        },
      })

      const duplicate = existingConversations.find((c) =>
        c.participants.some((p) => p.userId === recipientId)
      )

      if (duplicate) {
        activeConversationId = duplicate.id
      } else {
        // Create new conversation
        const newConversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [
                { userId: user.id },
                { userId: recipientId },
              ],
            },
          },
        })
        activeConversationId = newConversation.id
      }
    }

    if (!activeConversationId) {
      return NextResponse.json({ error: 'Conversation ID or Recipient ID required' }, { status: 400 })
    }

    // Verify participation
    const participation = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: activeConversationId,
          userId: user.id,
        },
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        senderId: user.id,
        content: content.trim(),
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
