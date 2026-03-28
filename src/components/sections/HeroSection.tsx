'use client'
// ============================================================
// Hero Section
// ============================================================
import { useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, Mail, ArrowDown, Github, Linkedin } from 'lucide-react'
import type { Profile } from '@/types'

interface HeroProps { 
  profile: Profile | null;
  projectsCount?: number;
  certsCount?: number;
}

const FALLBACK: Partial<Profile> = {
  name:      'Fatwa Bawahsi',
  title:     'Business Analyst · System Analyst · QA Engineer',
  tagline:   'Bridging the gap between business needs and technical excellence — turning complex requirements into quality software.',
  available: true,
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HeroSection({ profile, projectsCount = 0, certsCount = 0 }: HeroProps) {
  const p = profile ?? FALLBACK as Profile

  const handleCV = useCallback(async () => {
    if (!profile?.cv_url) return
    await fetch('/api/download', { method: 'POST' })
    window.open(profile.cv_url, '_blank')
  }, [profile])

  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  const initials = p.name
    ? p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
    : 'FB'

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* ── Left: Text ─────────────────────────────── */}
          <motion.div variants={container} initial="hidden" animate="show"
            className="flex-1 text-center lg:text-left">

            {/* Available badge */}
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                  ${p.available ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5
                  ${p.available ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              </span>
              <span className="text-sm text-slate-400 glass px-3 py-1 rounded-full">
                {p.available ? 'Available for opportunities' : 'Currently busy'}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1 variants={item}
              className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-4">
              <span className="text-slate-100">{p.name?.split(' ')[0] ?? 'Fatwa'} </span>
              <span className="text-gradient">{p.name?.split(' ').slice(1).join(' ') ?? 'Bawahsi'}</span>
            </motion.h1>

            {/* Role pills */}
            <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              {['Business Analyst', 'System Analyst', 'QA Engineer'].map(role => (
                <span key={role}
                  className="text-xs font-medium px-3 py-1 rounded-full glass border border-blue-500/20 text-blue-300">
                  {role}
                </span>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p variants={item}
              className="text-slate-400 text-lg leading-relaxed max-w-xl mb-10 mx-auto lg:mx-0">
              {p.tagline ?? FALLBACK.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-12">

              {/* Download CV — primary */}
              <button
                onClick={handleCV}
                disabled={!p.cv_url}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white font-medium
                           shadow-glow-blue hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <Download size={16} />
                {p.cv_url ? 'Download CV' : 'CV Coming Soon'}
              </button>

              {/* Contact */}
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-slate-300 font-medium
                           hover:border-blue-500/40 hover:text-blue-300 hover:-translate-y-0.5 transition-all duration-200">
                <Mail size={16} /> Contact Me
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item}
              className="flex flex-wrap gap-8 justify-center lg:justify-start">
              {[
                { value: '< 1',  label: 'Years Experience' },
                { value: `${projectsCount}+`, label: 'Projects Done' },
                { value: `${certsCount}`,   label: 'Certifications' },
                { value: '99%', label: 'Satisfaction' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-bold text-2xl text-gradient">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Avatar ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5"
          >
            <div className="relative">
              {/* Spinning ring */}
              <div className="absolute -inset-4 rounded-[2.5rem] border border-dashed border-blue-500/20 animate-spin-slow" />

              {/* Photo / initials */}
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-card">
                {p.photo_url ? (
                  <Image src={p.photo_url} alt={p.name} fill className="object-cover" priority />
                ) : (
                  <div className="w-full h-full animated-border flex items-center justify-center">
                    <span className="font-display font-extrabold text-6xl text-white">{initials}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-8 glass px-3 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 shadow-card whitespace-nowrap"
              >
                🏅 ISTQB Certified
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-8 glass px-3 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 shadow-card whitespace-nowrap"
              >
                📍 Indonesia
              </motion.div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                  className="glass p-3 rounded-xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                  <Github size={18} />
                </a>
              )}
              {p.linkedin_url && (
                <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="glass p-3 rounded-xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                  <Linkedin size={18} />
                </a>
              )}
              {p.email && (
                <a href={`mailto:${p.email}`}
                  className="glass p-3 rounded-xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                  <Mail size={18} />
                </a>
              )}
            </div>

            {/* CV download card */}
            {p.cv_url && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={handleCV}
                className="w-full glass rounded-xl border border-blue-500/20 px-4 py-3 flex items-center gap-3
                           hover:border-blue-500/50 hover:shadow-glow-blue transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Download size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-300">Download CV / Resume</p>
                  <p className="text-[10px] text-slate-500">Click to download PDF</p>
                </div>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
        >
          <span className="text-xs">scroll down</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
