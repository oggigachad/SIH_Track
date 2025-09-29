import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ClientProviders } from '@/components/client-providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Track - Railway Management System',
  description: 'Digital Railway Component Management Platform for Indian Railways',
  generator: 'Track Railway Management',
  keywords: ['railway', 'management', 'track', 'components', 'indian railways', 'qr code', 'inventory'],
  authors: [{ name: 'Track Railway Management' }],
  creator: 'Track Railway Management',
  publisher: 'Track Railway Management',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/track-logo.png',
    shortcut: '/images/track-logo.png',
    apple: '/images/track-logo.png',
  },
  openGraph: {
    title: 'Track - Railway Management System',
    description: 'Digital Railway Component Management Platform for Indian Railways',
    url: 'https://track.railway.in',
    siteName: 'Track Railway Management',
    images: [
      {
        url: '/images/track-logo.png',
        width: 800,
        height: 600,
        alt: 'Track Railway Management System Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track - Railway Management System',
    description: 'Digital Railway Component Management Platform for Indian Railways',
    images: ['/images/track-logo.png'],
    creator: '@TrackRailway',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
    yandex: 'yandex-verification-token',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/track-logo.png" />
        <link rel="apple-touch-icon" href="/images/track-logo.png" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientProviders>
          {children}
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  )
}
