'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Heart, MessageCircle, User, MapPin, Clock, Edit2, Save, LogOut, Settings } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  bio: string
  profileImages: string[]
  gender: string
  dateOfBirth: string
  city: string
  country: string
  timezone: string
  seekingGender: string[]
  minAge: number
  maxAge: number
  maxDistance: number | null
  preferredCountries: string[]
  isVerified: boolean
  createdAt: string
}

function calculateAge(dob: string) {
  const today = new Date()
  const d = new Date(dob)
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age
}

function getLocalTime(timezone: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date())
  } catch { return '' }
}

export default function ProfilePage() {
  const { data: session } = useSession({ required: true })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editData, setEditData] = useState({ bio: '', city: '', country: '', maxDistance: '' })

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setProfile(d.user)
          setEditData({
            bio: d.user.bio || '',
            city: d.user.city || '',
            country: d.user.country || '',
            maxDistance: d.user.maxDistance?.toString() || '',
          })
        }
      })
      .catch(console.error)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editData.bio,
          city: editData.city,
          country: editData.country,
          maxDistance: editData.maxDistance ? parseInt(editData.maxDistance) : null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(prev => prev ? { ...prev, ...data.user } : null)
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {}
    finally { setSaving(false) }
  }

  const avatar = profile?.profileImages?.[0] ||
    `https://randomuser.me/api/portraits/${profile?.gender === 'FEMALE' ? 'women' : 'men'}/1.jpg`

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart className="text-primary fill-primary" size={20} />
            <span className="text-xl font-black text-primary">QueAmor</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)} className="p-2 rounded-full hover:bg-gray-100 transition">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition px-3 py-2 rounded-xl hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        {!profile ? (
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
            </div>
          </div>
        ) : (
          <>
            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm text-center">
                ✅ Profile saved!
              </div>
            )}

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
              <div className="gradient-primary h-24" />
              <div className="px-6 pb-6 -mt-12">
                <div className="relative w-24 h-24 mb-3">
                  <img src={avatar} alt={profile.firstName} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = 'https://randomuser.me/api/portraits/men/1.jpg' }} />
                  {profile.isVerified && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">✓</div>
                  )}
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  {profile.firstName} {profile.lastName}
                  <span className="text-gray-400 font-normal text-lg ml-2">{calculateAge(profile.dateOfBirth)}</span>
                </h2>
                <p className="text-gray-500 text-sm mb-2">@{profile.username}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(profile.city || profile.country) && (
                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                      <MapPin size={11} /> {profile.city}{profile.city && profile.country ? ', ' : ''}{profile.country}
                    </span>
                  )}
                  {profile.timezone && (
                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                      <Clock size={11} /> {getLocalTime(profile.timezone)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {editing ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Edit2 size={16} /> Edit Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={e => setEditData(p => ({ ...p, bio: e.target.value }))}
                      className="input-field"
                      rows={3}
                      placeholder="Tell people about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">City</label>
                      <input type="text" value={editData.city} onChange={e => setEditData(p => ({ ...p, city: e.target.value }))} className="input-field" placeholder="Your city" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">Country</label>
                      <input type="text" value={editData.country} onChange={e => setEditData(p => ({ ...p, country: e.target.value }))} className="input-field" placeholder="Your country" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Max Distance (km)</label>
                    <input type="number" value={editData.maxDistance} onChange={e => setEditData(p => ({ ...p, maxDistance: e.target.value }))} className="input-field" placeholder="Leave blank for worldwide" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 gradient-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              profile.bio && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                  <h3 className="font-bold text-gray-800 mb-2">About Me</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )
            )}

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
              <h3 className="font-bold text-gray-800 mb-4">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-800">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member since</span>
                  <span className="font-medium text-gray-800">{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seeking</span>
                  <span className="font-medium text-gray-800">{profile.seekingGender.map(g => g.charAt(0) + g.slice(1).toLowerCase()).join(', ')}</span>
                </div>
                {profile.maxDistance && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max distance</span>
                    <span className="font-medium text-gray-800">{profile.maxDistance} km</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full border-2 border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </>
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
            <MessageCircle size={22} className="text-gray-400" />
            <span className="text-xs text-gray-400">Messages</span>
          </a>
          <a href="/profile" className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <User size={22} className="text-primary" />
            <span className="text-xs font-medium text-primary">Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}
