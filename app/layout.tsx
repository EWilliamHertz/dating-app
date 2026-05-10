import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ConnectMatch - International Dating Platform',
  description: 'Find meaningful connections worldwide. Browse profiles by location or country with real-time timezone support.',
  keywords: 'dating, singles, international, meet people, relationships',
  openGraph: {
    title: 'ConnectMatch - International Dating Platform',
    description: 'Find meaningful connections worldwide. Browse profiles by location or country with real-time timezone support.',
    type: 'website',
    url: 'https://connectmatch.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF006E" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-gray-900">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-2xl font-bold text-primary">ConnectMatch</div>
              <div className="flex gap-4">
                <a href="/login" className="text-gray-600 hover:text-primary">Login</a>
                <a href="/signup" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-pink-700">Sign Up</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
