'use client'
// ============================================================
// Hero Section
// Desktop : Text LEFT  |  SVG RIGHT   (lg:flex-row)
// Mobile  : Text TOP   →  SVG BELOW   (flex-col)
// ============================================================
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, ArrowDown } from 'lucide-react'
import type { Profile } from '@/types'

interface HeroProps {
  profile: Profile | null
  projectsCount?: number
  certsCount?: number
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HeroSection({ profile, projectsCount = 0, certsCount = 0 }: HeroProps) {
  const handleCV = useCallback(async () => {
    if (!profile?.cv_url) return
    await fetch('/api/download', { method: 'POST' })
    window.open(profile.cv_url, '_blank')
  }, [profile])

  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 pt-20 pb-16 overflow-x-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/*
          flex-col     → mobile:  text on top, SVG below
          lg:flex-row  → desktop: text left,   SVG right
          (Text first in DOM = top on mobile / left on desktop)
          (SVG second in DOM = bottom on mobile / right on desktop)
        */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 lg:justify-between">

          {/* ── TEXT block — top on mobile, left on desktop ── */}
          <motion.div
            variants={container} initial="hidden" animate="show"
            className="flex-1 w-full text-center lg:text-left"
          >
            {/* Available badge */}
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                  ${profile?.available ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5
                  ${profile?.available ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              </span>
              <span className="text-sm text-slate-400 glass px-3 py-1 rounded-full">
                {profile?.available ? 'Available for opportunities' : 'Currently busy'}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={item}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-tight mb-4">
              <span className="text-slate-100">Tech </span>
              <span className="text-gradient">Enthusiast</span>
            </motion.h1>

            {/* ── SVG: MOBILE ONLY — below heading, no overflowing chips ── */}
            <motion.div variants={item} className="flex lg:hidden justify-center my-6">
              <div className="relative w-52 h-52 sm:w-60 sm:h-60">
                <div className="absolute inset-0 rounded-[2.5rem] border border-dashed border-blue-500/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-[2rem] border border-blue-500/10" />
                <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900/80
                                border border-blue-500/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  <TechSVG />
                </div>
              </div>
            </motion.div>

            {/* Role pills */}
            <motion.div variants={item}
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              {['Business Analyst', 'System Analyst', 'QA Engineer'].map(role => (
                <span key={role}
                  className="text-xs font-medium px-3 py-1 rounded-full glass border border-blue-500/20 text-blue-300">
                  {role}
                </span>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p variants={item}
              className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8 mx-auto lg:mx-0">
              {profile?.tagline ?? 'Bridging the gap between business needs and technical excellence — turning complex requirements into quality software.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
              <button
                onClick={handleCV}
                disabled={!profile?.cv_url}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white font-medium
                           shadow-glow-blue hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <Download size={16} />
                {profile?.cv_url ? 'Download CV' : 'CV Coming Soon'}
              </button>
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
                { value: '< 1',               label: 'Years Experience' },
                { value: `${projectsCount}+`,  label: 'Projects Done' },
                { value: `${certsCount}`,       label: 'Certifications' },
                { value: '99%',                label: 'Satisfaction' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-bold text-2xl text-gradient">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── SVG block — DESKTOP ONLY, right column ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex flex-shrink-0 items-center justify-center"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              {/* Spinning dashed ring */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-dashed border-blue-500/20 animate-spin-slow" />
              {/* Inner glow ring */}
              <div className="absolute inset-4 rounded-[2rem] border border-blue-500/10 shadow-glow-blue" />
              {/* SVG card */}
              <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900/80
                              border border-blue-500/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <TechSVG />
              </div>
              {/* Floating chip top */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -left-2 sm:-left-8 glass px-2.5 py-1.5 rounded-xl border border-white/10
                           text-[11px] font-medium text-slate-300 shadow-card whitespace-nowrap"
              >
                ⚡ Automation Testing
              </motion.div>
              {/* Floating chip bottom */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-3 -right-2 sm:-right-8 glass px-2.5 py-1.5 rounded-xl border border-white/10
                           text-[11px] font-medium text-slate-300 shadow-card whitespace-nowrap"
              >
                📊 Business Analysis
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="hidden lg:flex flex-col items-center gap-1 text-slate-600 mt-12"
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

/* ── Animated Tech SVG ─────────────────────────────────────── */
function TechSVG() {
  return (
    <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-4">
      <rect x="20" y="30" width="180" height="120" rx="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="2"/>
      <rect x="28" y="38" width="164" height="104" rx="6" fill="#020617"/>
      <rect x="28" y="38" width="164" height="104" rx="6" fill="url(#screenGlow)" opacity="0.4"/>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="40" y="55" width="60" height="4" rx="2" fill="#3b82f6" opacity="0.8"/>
        <rect x="40" y="65" width="90" height="4" rx="2" fill="#6366f1" opacity="0.6"/>
        <rect x="40" y="75" width="50" height="4" rx="2" fill="#3b82f6" opacity="0.8"/>
        <rect x="55" y="85" width="70" height="4" rx="2" fill="#22d3ee" opacity="0.5"/>
        <rect x="55" y="95" width="40" height="4" rx="2" fill="#3b82f6" opacity="0.7"/>
        <rect x="40" y="105" width="80" height="4" rx="2" fill="#6366f1" opacity="0.6"/>
        <rect x="40" y="115" width="55" height="4" rx="2" fill="#3b82f6" opacity="0.8"/>
        <rect x="55" y="125" width="65" height="4" rx="2" fill="#22d3ee" opacity="0.5"/>
      </motion.g>

      <motion.rect
        x="108" y="55" width="3" height="14" rx="1" fill="#60a5fa"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '160px 90px' }}
      >
        <circle cx="160" cy="90" r="22" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" opacity="0.9"/>
        <polygon points="152,80 152,100 174,90" fill="#60a5fa"/>
      </motion.g>

      <rect x="28" y="132" width="164" height="6" rx="3" fill="#0f172a"/>
      <motion.rect
        x="28" y="132" width="0" height="6" rx="3" fill="#3b82f6"
        animate={{ width: [0, 110, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <rect x="100" y="150" width="20" height="20" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5"/>
      <rect x="80" y="168" width="60" height="6" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5"/>

      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <circle cx="195" cy="55" r="10" fill="#1e293b" stroke="#ef4444" strokeWidth="1.2"/>
        <text x="189" y="60" fontSize="11" fill="#f87171">🐛</text>
      </motion.g>

      <motion.g
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        <circle cx="20" cy="145" r="10" fill="#1e293b" stroke="#22c55e" strokeWidth="1.2"/>
        <text x="14" y="150" fontSize="11" fill="#4ade80">✓</text>
      </motion.g>

      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  )
}
