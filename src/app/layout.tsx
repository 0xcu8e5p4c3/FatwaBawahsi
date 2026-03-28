// ============================================================
// Root Layout — fonts, global meta, dark mode default
// ============================================================
import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Fatwa Bawahsi — Business Analyst & QA Engineer',
    template: '%s | Fatwa Bawahsi',
  },
  description:
    'IT Graduate specializing in Business Analysis, System Analysis, QA Testing & QA Engineering. Open to full-time, contract & remote opportunities.',
  keywords: [
    'Business Analyst', 'System Analyst', 'QA Engineer', 'QA Tester',
    'IT Graduate', 'Portfolio', 'Katalon', 'Agile', 'Fatwa Bawahsi',
  ],
  authors: [{ name: 'Fatwa Bawahsi' }],
  creator: 'Fatwa Bawahsi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Fatwa Bawahsi — Business Analyst & QA Engineer',
    description: 'IT Graduate specializing in BA, SA, QA Testing & QA Engineering.',
    siteName: 'Fatwa Bawahsi Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fatwa Bawahsi — Business Analyst & QA Engineer',
    description: 'IT Graduate specializing in BA, SA, QA Testing & QA Engineering.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: 'https://res.cloudinary.com/dbhueijx0/image/upload/v1774733661/logo-removebg-preview_qam6ys.png',
    apple: 'https://res.cloudinary.com/dbhueijx0/image/upload/v1774733661/logo-removebg-preview_qam6ys.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${syne.variable} font-sans bg-dark-950 text-slate-100 antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </body>
    </html>
  )
}
