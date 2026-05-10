'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, MessageCircle, User, ArrowLeft, Clock, MapPin } from 'lucide-react'

interface Match {
  id: string
  firstName: string
  lastName: string
  age: number
  city: string
  country: string
  timezone: string
  bio: string
  profileImages: string[]
  gender: string
  lastSeen: string | null
  isActive: boolean
}

function getLocalTime(timezone: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date())
  } catch { return '' }
}

function getAvatarUrl(match: Match) {
  if (match.profileImages?.length > 0) return match.profileImages[0]
  const gender = match.gender === 'FEMALE' ? 'women' : 'men'
  const num = Math.abs((match.id?.charCodeAt(0) || 1) + (match.id?.charCodeAt(1) || 2)) % 70
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`
}

function isOnline(lastSeen: string | null) {
  if (!lastSeen) return false
  return Date.now() - new Date(lastSeen).getTime() < 5 * 60 * 1000
}

export default function MatchesPage() {
  useSession({ required: true })
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(d => { setMatches(d.matches || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="p-1 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </a>
            <h1 className="text-lg font-bold">Your Matches ❤️</h1>
          </div>
          <span className="text-sm text-gray-500">{matches.length} mutual</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-60 animate-pulse" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold mb-2">No matches yet</h3>
            <p className="text-gray-500 mb-6">Keep liking profiles — your match is out there!</p>
            <a href="/dashboard" className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition inline-block">
              Browse Profiles
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {matches.map(match => (
              <div key={match.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
                <div className="relative h-44">
                  <img
                    src={getAvatarUrl(match)}
                    alt={match.firstName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const g = match.gender === 'FEMALE' ? 'women' : 'men'
                      ;(e.target as HTMLImageElement).src = `https://randomuser.me/api/portraits/${g}/1.jpg`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {isOnline(match.lastSeen) && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                  <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-bold text-sm">{match.firstName}, {match.age}</p>
                  </div>
                </div>
                <div className="p-3">
                  {match.city || match.country ? (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPin size={10} />
                      <span>{match.city}{match.city && match.country ? ', ' : ''}{match.country}</span>
                    </div>
                  ) : null}
                  {match.timezone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock size={10} />
                      <span>{getLocalTime(match.timezone)}</span>
                    </div>
                  )}
                  <a
                    href={`/messages/${match.id}`}
                    className="w-full gradient-primary text-white py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 hover:opacity-90 transition"
                  >
                    <MessageCircle size={12} />
                    Message
                  </a>
                </div>
              </div>
            ))}
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
            <Heart size={22} className="text-primary fill-primary" />
            <span className="text-xs font-medium text-primary">Matches</span>
          </a>
          <a href="/messages" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <MessageCircle size={22} className="text-gray-400" />
            <span className="text-xs text-gray-400">Messages</span>
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
