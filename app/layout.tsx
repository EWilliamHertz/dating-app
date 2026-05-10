import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'QueAmor — International Dating, Find Love Worldwide',
  description: 'Find meaningful connections worldwide on QueAmor. Browse singles by location radius or country with real-time timezone support. Join free today.',
  keywords: 'dating, singles, international dating, meet people, relationships, love, QueAmor, online dating',
  openGraph: {
    title: 'QueAmor — Where Love Knows No Borders',
    description: 'Find meaningful connections worldwide. Browse singles by location or country with real-time timezone support.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF006E" />
      </head>
      <body className="bg-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
