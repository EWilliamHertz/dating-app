import { Heart, MapPin, Globe, MessageCircle, Shield, Clock } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="text-primary fill-primary" size={24} />
              <span className="text-2xl font-bold text-primary">QueAmor</span>
            </div>
            <div className="flex gap-3">
              <a href="/login" className="text-gray-600 hover:text-primary px-4 py-2 rounded-lg transition">Login</a>
              <a href="/signup" className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-pink-700 transition shadow-md">
                Join Free
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-primary text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="fill-white" size={40} />
            <h1 className="text-6xl font-black">QueAmor</h1>
          </div>
          <p className="text-2xl font-semibold mb-3">Where Love Knows No Borders</p>
          <p className="text-lg mb-10 text-pink-100 max-w-2xl mx-auto">
            Connect with amazing singles worldwide. Search by distance radius or choose specific countries.
            Real-time timezone support so you always know when to say hello.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/signup" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition shadow-lg">
              Start for Free ❤️
            </a>
            <a href="/login" className="border-2 border-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition">
              Login
            </a>
          </div>
          <p className="mt-6 text-pink-200 text-sm">Join thousands of singles already finding love 💕</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-primary">50K+</p>
            <p className="text-gray-600 mt-1">Active Members</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">120+</p>
            <p className="text-gray-600 mt-1">Countries</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">10K+</p>
            <p className="text-gray-600 mt-1">Matches Made</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Why QueAmor?</h2>
          <p className="text-gray-500 text-center mb-14 text-lg">Built for international love ❤️</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:shadow-xl transition">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin className="text-primary" size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3">Radius Search</h3>
              <p className="text-gray-600">Find matches within your chosen distance — from 10 km to global reach.</p>
            </div>
            <div className="card p-8 text-center hover:shadow-xl transition">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <Globe className="text-secondary" size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3">Country Filter</h3>
              <p className="text-gray-600">Pick specific countries to connect with. Perfect for international dating.</p>
            </div>
            <div className="card p-8 text-center hover:shadow-xl transition">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <Clock className="text-blue-600" size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3">Timezone Display</h3>
              <p className="text-gray-600">See each match&apos;s local time so you always know the perfect moment to chat.</p>
            </div>
            <div className="card p-8 text-center hover:shadow-xl transition">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="text-red-500" size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-gray-600">Like profiles and match instantly when the feeling is mutual.</p>
            </div>
            <div className="card p-8 text-center hover:shadow-xl transition">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="text-green-600" size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real Conversations</h3>
              <p className="text-gray-600">Chat directly with your matches. No pay-walls, no barriers.</p>
            </div>
            <div className="card p-8 text-center hover:shadow-xl transition">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <Shield className="text-yellow-600" size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-gray-600">Encrypted data, verified profiles, and easy reporting tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Love Stories ❤️</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { names: 'Sofia & Marco', countries: '🇧🇷 Brazil & 🇮🇹 Italy', quote: 'QueAmor connected us across continents. We met 8 months ago and now I\'m moving to Brazil!' },
              { names: 'Aisha & James', countries: '🇿🇦 South Africa & 🇬🇧 UK', quote: 'The timezone feature made it so easy to plan our calls. QueAmor changed my life completely.' },
              { names: 'Yuna & Carlos', countries: '🇯🇵 Japan & 🇲🇽 Mexico', quote: 'I never thought I\'d find love on the other side of the world. QueAmor made it happen!' },
            ].map((story, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400 text-lg">★</span>)}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{story.quote}&rdquo;</p>
                <p className="font-bold text-gray-900">{story.names}</p>
                <p className="text-gray-500 text-sm mt-1">{story.countries}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Find Love?</h2>
          <p className="text-lg mb-8 text-pink-100">Create your free profile in 2 minutes and start connecting today.</p>
          <a href="/signup" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 inline-block shadow-lg transition">
            Create Free Account ❤️
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="text-primary fill-primary" size={20} />
            <span className="text-xl font-bold text-primary">QueAmor</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Product</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Safety</a></li>
                <li><a href="/signup" className="hover:text-white transition">Sign Up</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Legal</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Follow Us</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">TikTok</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter / X</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © 2025 QueAmor. All rights reserved. Made with ❤️ for global connections.
          </div>
        </div>
      </footer>
    </main>
  )
}
