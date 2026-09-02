import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getSession } from '@/lib/auth'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ServiceHub — Find Trusted Local Professionals',
    template: '%s | ServiceHub',
  },
  description:
    'Discover, compare, and book reliable local service providers in one simple platform. Electricians, plumbers, tutors, photographers and more.',
  keywords: [
    'local services',
    'service providers',
    'book professionals',
    'electrician',
    'plumber',
    'laptop repair',
    'home services',
    'India',
  ],
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'ServiceHub',
    title: 'ServiceHub — Find Trusted Local Professionals',
    description:
      'Discover, compare, and book reliable local service providers in one simple platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ServiceHub — Find Trusted Local Professionals',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSession()

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Toaster>
          <Navbar user={user} />
          <main>{children}</main>
          <Footer />
        </Toaster>
      </body>
    </html>
  )
}
