'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Heart, X, MapPin, Clock, User, MessageCircle, LogOut } from 'lucide-react'

interface Profile {
  id: string
  firstName: string
  lastName: string
  age: number
  bio: string
  city: string
  country: string
  timezone: string
  distance: number
  profileImages: string[]
  gender: string
}

function getLocalTime(timezone: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date())
  } catch {
    return ''
  }
}

function getAvatarUrl(profile: Profile, index = 0) {
  if (profile.profileImages && profile.profileImages.length > index) {
    return profile.profileImages[index]
  }
  const seed = profile.id || 'default'
  const gender = profile.gender === 'FEMALE' ? 'women' : 'men'
  const num = Math.abs(seed.charCodeAt(0) + seed.charCodeAt(1)) % 70
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`
}

export default function DashboardPage() {
  const { data: session } = useSession({ required: true })
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'like' | 'pass' } | null>(null)
  const [filterMode, setFilterMode] = useState<'radius' | 'country'>('radius')
  const [maxDistance, setMaxDistance] = useState(200)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  const userId = (session?.user as any)?.id

  useEffect(() => {
    if (userId) fetchProfiles()
  }, [userId])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      let url = `/api/matches/browse?userId=${userId}`
      if (filterMode === 'radius') {
        url += `&maxDistance=${maxDistance}`
      } else {
        selectedCountries.forEach(c => { url += `&countries=${encodeURIComponent(c)}` })
      }
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setProfiles(data.profiles || [])
        setCurrentIndex(0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    const profile = profiles[currentIndex]
    if (!profile) return
    setActionMsg({ text: '❤️ Liked!', type: 'like' })
    try {
      await fetch('/api/matches/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId: profile.id }),
      })
    } catch {}
    setTimeout(() => {
      setActionMsg(null)
      setCurrentIndex(i => i + 1)
    }, 600)
  }

  const handlePass = () => {
    setActionMsg({ text: '✗ Passed', type: 'pass' })
    setTimeout(() => {
      setActionMsg(null)
      setCurrentIndex(i => i + 1)
    }, 400)
  }

  const current = profiles[currentIndex]
  const hasMore = currentIndex < profiles.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart className="text-primary fill-primary" size={20} />
            <span className="text-xl font-black text-primary">QueAmor</span>
          </div>
          <div className="flex items-center gap-1">
            <a href="/matches" className="p-2 rounded-full hover:bg-gray-100 transition">
              <Heart size={22} className="text-gray-600" />
            </a>
            <a href="/messages" className="p-2 rounded-full hover:bg-gray-100 transition">
              <MessageCircle size={22} className="text-gray-600" />
            </a>
            <a href="/profile" className="p-2 rounded-full hover:bg-gray-100 transition">
              <User size={22} className="text-gray-600" />
            </a>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 rounded-full hover:bg-gray-100 transition">
              <LogOut size={22} className="text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFilterMode('radius')}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition ${filterMode === 'radius' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              📍 By Distance
            </button>
            <button
              onClick={() => setFilterMode('country')}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition ${filterMode === 'country' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              🌍 By Country
            </button>
          </div>
          {filterMode === 'radius' ? (
            <div>
              <label className="text-sm text-gray-600 flex justify-between mb-2">
                <span>Max Distance</span>
                <span className="font-bold text-primary">{maxDistance === 20000 ? 'Worldwide' : `${maxDistance} km`}</span>
              </label>
              <input
                type="range" min={10} max={20000} step={10}
                value={maxDistance}
                onChange={e => setMaxDistance(parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10 km</span><span>Worldwide</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">Enter countries (comma separated):</p>
              <input
                type="text"
                className="input-field text-sm"
                placeholder="Spain, Brazil, Japan..."
                onChange={e => setSelectedCountries(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </div>
          )}
          <button
            onClick={fetchProfiles}
            className="w-full mt-3 gradient-primary text-white py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition"
          >
            Search Profiles
          </button>
        </div>

        {/* Profile Card */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-3xl h-96 mb-4" />
            </div>
            <p className="text-gray-500">Finding matches for you...</p>
          </div>
        ) : !hasMore ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-xl font-bold mb-2">You&apos;ve seen everyone!</h3>
            <p className="text-gray-500 mb-6">Try expanding your search area or check back later.</p>
            <button onClick={fetchProfiles} className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Search Again
            </button>
          </div>
        ) : current ? (
          <div className="relative">
            {/* Action feedback */}
            {actionMsg && (
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-full font-bold text-white shadow-lg text-lg transition-all ${actionMsg.type === 'like' ? 'bg-green-500' : 'bg-gray-500'}`}>
                {actionMsg.text}
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              {/* Photo */}
              <div className="relative h-96 bg-gradient-to-br from-pink-100 to-purple-100">
                <img
                  src={getAvatarUrl(current)}
                  alt={current.firstName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const gender = current.gender === 'FEMALE' ? 'women' : 'men'
                    ;(e.target as HTMLImageElement).src = `https://randomuser.me/api/portraits/${gender}/1.jpg`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-black">{current.firstName}, {current.age}</h2>
                  <div className="flex items-center gap-1 text-sm mt-1 opacity-90">
                    <MapPin size={14} />
                    <span>{current.city}{current.city && current.country ? ', ' : ''}{current.country}</span>
                  </div>
                </div>
                {current.distance < 20000 && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {current.distance < 1 ? '< 1 km' : `${current.distance} km away`}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                {current.timezone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock size={14} />
                    <span>Local time: <span className="font-semibold text-gray-700">{getLocalTime(current.timezone)}</span></span>
                  </div>
                )}
                {current.bio && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{current.bio}</p>
                )}

                {/* Buttons */}
                <div className="flex gap-4 justify-center mt-2">
                  <button
                    onClick={handlePass}
                    className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition shadow-md hover:shadow-lg"
                  >
                    <X size={28} />
                  </button>
                  <button
                    onClick={handleLike}
                    className="w-20 h-20 gradient-primary hover:opacity-90 rounded-full flex items-center justify-center text-white transition shadow-lg hover:shadow-xl"
                  >
                    <Heart size={32} className="fill-white" />
                  </button>
                  <button
                    onClick={() => setCurrentIndex(i => i + 1)}
                    className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition shadow-md hover:shadow-lg"
                  >
                    <span className="text-lg">›</span>
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-3">
                  {profiles.length - currentIndex - 1} more profiles to browse
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
        <div className="max-w-lg mx-auto flex">
          <a href="/dashboard" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <Heart size={22} className="text-primary fill-primary" />
            <span className="text-xs font-medium text-primary">Discover</span>
          </a>
          <a href="/matches" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <Heart size={22} className="text-gray-400" />
            <span className="text-xs text-gray-400">Matches</span>
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
