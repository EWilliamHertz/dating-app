'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

const COUNTRIES = [
  'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Denmark',
  'Egypt', 'France', 'Germany', 'India', 'Indonesia', 'Italy', 'Japan', 'Kenya',
  'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea',
  'Spain', 'Sweden', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam', 'Other'
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    city: '',
    country: '',
    timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    bio: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Try to get geolocation, but don't require it
      let latitude = 0
      let longitude = 0
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        })
        latitude = position.coords.latitude
        longitude = position.coords.longitude
      } catch {
        // Geolocation not available or denied — that's OK
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          city: formData.city,
          country: formData.country,
          timezone: formData.timezone,
          bio: formData.bio,
          latitude,
          longitude,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login?registered=true'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-gray-600">Welcome to QueAmor! Redirecting to login...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <Heart className="text-primary fill-primary" size={28} />
            <span className="text-2xl font-black text-primary">QueAmor</span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-1">Create Your Profile</h2>
          <p className="text-gray-500 text-center mb-8">Find love across the world 🌍</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Step indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <h3 className="font-semibold text-gray-700 mb-4">👤 About You</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="Ana" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="García" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" placeholder="anagarcia92" required minLength={3} maxLength={20} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" required max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" required>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-Binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full gradient-primary text-white py-3 rounded-xl font-bold mt-2 hover:opacity-90 transition">
                  Continue →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="font-semibold text-gray-700 mb-4">📍 Your Location</h3>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" placeholder="Madrid" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} className="input-field">
                    <option value="">Select your country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field" rows={3} placeholder="Tell us a little about yourself..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                    ← Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 gradient-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
                    Continue →
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-semibold text-gray-700 mb-4">🔐 Account Details</h3>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="Min. 8 characters" required minLength={8} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="Repeat password" required />
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                  <input type="checkbox" id="terms" required className="mt-0.5" />
                  <label htmlFor="terms">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 gradient-primary text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-md">
                    {loading ? 'Creating...' : 'Create Account ❤️'}
                  </button>
                </div>
              </>
            )}

            <p className="text-center text-gray-600 text-sm pt-1">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline font-bold">Login</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
