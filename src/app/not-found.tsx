// ============================================================
// Custom 404 Not Found Page
// ============================================================
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Page Not Found' }

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-extrabold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-slate-200 mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          This page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white
                     font-medium hover:opacity-90 transition-opacity"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  )
}
