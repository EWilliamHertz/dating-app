'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Send, Clock } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}

interface OtherUser {
  id: string
  firstName: string
  lastName: string
  profileImages: string[]
  username: string
  timezone: string
  lastSeen: string | null
}

function getLocalTime(timezone: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date())
  } catch { return '' }
}

export default function ChatPage({ params }: { params: { userId: string } }) {
  const { data: session } = useSession({ required: true })
  const myId = (session?.user as any)?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [params.userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    try {
      const res = await fetch(`/api/messages/${params.userId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
        setOtherUser(data.otherUser || null)
      }
    } catch {}
    finally { setLoading(false) }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const content = text.trim()
    setText('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: params.userId, content }),
      })
      if (res.ok) await loadMessages()
    } catch {}
    finally { setSending(false) }
  }

  function formatTime(dateStr: string) {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(dateStr))
  }

  const avatar = otherUser?.profileImages?.[0] || `https://randomuser.me/api/portraits/men/1.jpg`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <a href="/messages" className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </a>
          {otherUser && (
            <>
              <img src={avatar} alt={otherUser.firstName} className="w-9 h-9 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://randomuser.me/api/portraits/men/1.jpg' }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 leading-tight">{otherUser.firstName} {otherUser.lastName}</p>
                {otherUser.timezone && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={10} />
                    <span>Local time: {getLocalTime(otherUser.timezone)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 overflow-y-auto pb-24">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-gray-500">Say hello to {otherUser?.firstName}!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === myId
              const showDate = i === 0 || new Date(messages[i-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString()
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="text-center text-xs text-gray-400 my-3">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'gradient-primary text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-pink-200' : 'text-gray-400'}`}>{formatTime(msg.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 input-field py-2.5 text-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="gradient-primary text-white w-11 h-11 rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
