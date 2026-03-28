'use client'
// ============================================================
// Navbar — sticky, glass, smooth scroll, mobile hamburger
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

const NAV_LINKS = [
  { label: 'Home',           href: '#hero' },
  { label: 'About',          href: '#about' },
  { label: 'Skills',         href: '#skills' },
  { label: 'Projects',       href: '#projects' },
  { label: 'Experience',     href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact',        href: '#contact' },
]

interface NavbarProps { profile: Profile | null }

export function Navbar({ profile }: NavbarProps) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active,     setActive]     = useState('#hero')

  // Track scroll position
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Highlight active section
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleDownloadCV = useCallback(async () => {
    if (!profile?.cv_url) return
    // Increment download count via API
    await fetch('/api/download', { method: 'POST' })
    window.open(profile.cv_url, '_blank')
  }, [profile])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
        )}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
            className="font-display font-bold text-lg text-gradient"
          >
            {profile?.name?.split(' ').map(w => w[0]).join('') ?? 'RA'}
            <span className="text-slate-400 font-normal">.</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    'text-sm transition-colors duration-200',
                    active === link.href
                      ? 'text-blue-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            {profile?.cv_url && (
              <button
                onClick={handleDownloadCV}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                           bg-gradient-brand text-white shadow-glow-blue
                           hover:opacity-90 transition-opacity"
              >
                <Download size={14} />
                Download CV
              </button>
            )}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-slate-200"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass-dark border-b border-white/[0.08] md:hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-1">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className={cn(
                      'w-full text-left py-3 text-sm border-b border-white/[0.05]',
                      active === link.href ? 'text-blue-400 font-medium' : 'text-slate-300'
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {profile?.cv_url && (
                <li className="pt-3">
                  <button
                    onClick={handleDownloadCV}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                               bg-gradient-brand text-white w-full justify-center"
                  >
                    <Download size={14} /> Download CV
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
