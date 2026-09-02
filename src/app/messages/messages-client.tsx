'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, AlertCircle, ArrowLeft, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toaster'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

interface Participant {
  id: string
  conversationId: string
  userId: string
  user: {
    id: string
    name: string
    image?: string | null
    role: string
  }
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
}

interface Conversation {
  id: string
  bookingId?: string | null
  createdAt: string
  updatedAt: string
  participants: Participant[]
  messages: Message[]
}

interface MessagesClientProps {
  currentUserId: string
  contactUserId: string | null
}

export default function MessagesClient({ currentUserId, contactUserId }: MessagesClientProps) {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageText, setMessageText] = useState('')
  
  // For starting a new conversation if it doesn't exist in the list
  const [newRecipient, setNewRecipient] = useState<{ id: string; name: string; role: string } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch all conversations
  const fetchConversations = async (showLoader = false) => {
    if (showLoader) setLoading(true)
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        const convList: Conversation[] = data.conversations || []
        setConversations(convList)

        // Check if there is an active conversation already, otherwise select first
        if (!activeConvId && convList.length > 0 && !contactUserId) {
          setActiveConvId(convList[0].id)
        }
      }
    } catch {
      console.error('Failed to load conversations')
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  // Load conversations on mount and poll every 4 seconds
  useEffect(() => {
    fetchConversations(true)

    const interval = setInterval(() => {
      fetchConversations(false)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Handle contactUserId query param (new chat)
  useEffect(() => {
    if (contactUserId && conversations.length > 0) {
      // Find if we already have a conversation with this user
      const existing = conversations.find((c) =>
        c.participants.some((p) => p.userId === contactUserId)
      )

      if (existing) {
        setActiveConvId(existing.id)
        setNewRecipient(null)
      } else {
        // Fetch recipient info to show a "New Conversation" placeholder
        const loadNewRecipient = async () => {
          try {
            const res = await fetch(`/api/providers`)
            const data = await res.json()
            const providers = data.providers || []
            const prov = providers.find((p: any) => p.user.id === contactUserId || p.userId === contactUserId)
            
            if (prov) {
              setNewRecipient({
                id: contactUserId,
                name: prov.user.name,
                role: 'PROVIDER',
              })
              setActiveConvId('new_placeholder')
            }
          } catch {
            console.error('Could not fetch recipient details')
          }
        }
        loadNewRecipient()
      }
    }
  }, [contactUserId, conversations])

  // Scroll to bottom on active conversation or new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConvId, conversations])

  const activeConv = conversations.find((c) => c.id === activeConvId)
  
  // Get details of the other user in active conversation
  const getOtherUser = (conv: Conversation) => {
    const otherPart = conv.participants.find((p) => p.userId !== currentUserId)
    return otherPart?.user || { id: '', name: 'Unknown', role: 'CUSTOMER' }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    setSending(true)

    const payload: any = {
      content: messageText.trim(),
    }

    if (activeConvId === 'new_placeholder' && newRecipient) {
      payload.recipientId = newRecipient.id
    } else {
      payload.conversationId = activeConvId
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        setMessageText('')
        
        // Refresh conversations list immediately
        await fetchConversations(false)

        if (activeConvId === 'new_placeholder') {
          // If it was a placeholder, find the newly created conversation ID
          const res2 = await fetch('/api/messages')
          const data2 = await res2.json()
          const list: Conversation[] = data2.conversations || []
          const created = list.find((c) =>
            c.participants.some((p) => p.userId === payload.recipientId)
          )
          if (created) {
            setActiveConvId(created.id)
            setNewRecipient(null)
          }
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'A network error occurred.',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex">
        
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-50">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-600" />
              Inbox Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {/* New Placeholder Conversation */}
            {newRecipient && activeConvId === 'new_placeholder' && (
              <button
                onClick={() => setActiveConvId('new_placeholder')}
                className="w-full text-left p-4 bg-violet-50/50 border-l-4 border-violet-600 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(newRecipient.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-slate-900 truncate">{newRecipient.name}</p>
                    <Badge variant="verified" className="text-[9px] bg-violet-600 px-1 py-0">NEW</Badge>
                  </div>
                  <p className="text-xs text-violet-600 truncate mt-0.5 font-medium">Starting chat...</p>
                </div>
              </button>
            )}

            {conversations.length === 0 && !newRecipient ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No active conversations.
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherUser(conv)
                const isActive = conv.id === activeConvId
                const lastMsg = conv.messages[conv.messages.length - 1]

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id)
                      setNewRecipient(null)
                    }}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-3 ${
                      isActive ? 'bg-violet-50/30 border-l-4 border-violet-600' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {getInitials(other.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold text-sm truncate ${isActive ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                          {other.name}
                        </p>
                        <Badge variant="secondary" className="text-[9px] scale-90 origin-right">
                          {other.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {lastMsg ? lastMsg.content : 'No messages yet.'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Pane */}
        <div className={`flex-1 flex flex-col ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
          {activeConvId ? (
            <>
              {/* Active Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(
                    activeConvId === 'new_placeholder' && newRecipient
                      ? newRecipient.name
                      : activeConv
                      ? getOtherUser(activeConv).name
                      : 'C'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeConvId === 'new_placeholder' && newRecipient
                      ? newRecipient.name
                      : activeConv
                      ? getOtherUser(activeConv).name
                      : ''}
                  </h3>
                  <Badge variant="secondary" className="text-[9px] mt-0.5">
                    {activeConvId === 'new_placeholder' && newRecipient
                      ? newRecipient.role
                      : activeConv
                      ? getOtherUser(activeConv).role
                      : ''}
                  </Badge>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
                {activeConvId === 'new_placeholder' && newRecipient ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <p className="text-slate-500 text-xs">
                      Send a message to start your conversation with <span className="font-semibold">{newRecipient.name}</span>.
                    </p>
                  </div>
                ) : activeConv && activeConv.messages.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No messages in this chat yet.
                  </div>
                ) : (
                  activeConv?.messages.map((msg) => {
                    const isSelf = msg.senderId === currentUserId
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                            isSelf
                              ? 'bg-violet-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`text-[9px] text-right mt-1.5 ${
                              isSelf ? 'text-violet-200' : 'text-slate-400'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
                  disabled={sending}
                  required
                />
                <Button type="submit" variant="gradient" className="shrink-0 rounded-xl" isLoading={sending}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/20">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-slate-800 font-semibold mb-1">No conversation selected</h3>
              <p className="text-slate-500 text-xs text-center max-w-xs">
                Select an existing chat from the inbox sidebar, or contact a provider from their profile details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
