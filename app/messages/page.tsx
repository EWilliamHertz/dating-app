'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, MessageCircle, User, ArrowLeft } from 'lucide-react'

interface Conversation {
  userId: string
  user: { id: string; firstName: string; lastName: string; profileImages: string[]; username: string }
  lastMessage: string
  lastMessageAt: string
  unread: number
}

export default function MessagesPage() {
  useSession({ required: true })
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(d => { setConversations(d.conversations || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="p-1 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </a>
            <h1 className="text-lg font-bold">Messages 💬</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">No messages yet</h3>
            <p className="text-gray-500 mb-6">Match with someone to start chatting!</p>
            <a href="/matches" className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition inline-block">
              View Matches
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 bg-white">
            {conversations.map(conv => {
              const avatar = conv.user.profileImages?.[0] || `https://randomuser.me/api/portraits/men/1.jpg`
              return (
                <a key={conv.userId} href={`/messages/${conv.userId}`} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition">
                  <div className="relative flex-shrink-0">
                    <img src={avatar} alt={conv.user.firstName} className="w-14 h-14 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://randomuser.me/api/portraits/men/1.jpg' }} />
                    {conv.unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className={`font-semibold ${conv.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conv.user.firstName} {conv.user.lastName}
                      </p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{timeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${conv.unread > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
        <div className="max-w-lg mx-auto flex">
          <a href="/dashboard" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <Heart size={22} className="text-gray-400" />
            <span className="text-xs text-gray-400">Discover</span>
          </a>
          <a href="/matches" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <Heart size={22} className="text-gray-400" />
            <span className="text-xs text-gray-400">Matches</span>
          </a>
          <a href="/messages" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <MessageCircle size={22} className="text-primary" />
            <span className="text-xs font-medium text-primary">Messages</span>
          </a>
          <a href="/profile" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <User size={22} className="text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}
