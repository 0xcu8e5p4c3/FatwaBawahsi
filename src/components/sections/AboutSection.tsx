'use client'
// ============================================================
// About Section
// Mobile : photo + socials on TOP → name → bio → info cards
//          → CV card + availability at bottom (unchanged)
// Desktop: left = name + bio + info cards
//          right = photo + socials + CV card + availability
// ============================================================
import { useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { User, MapPin, Mail, Phone, Globe, Download, Github, Linkedin } from 'lucide-react'
import type { Profile } from '@/types'

interface AboutProps { profile: Profile | null }

const FALLBACK_SUMMARY = `Saya adalah lulusan IT dengan keahlian yang kuat dalam Business Analysis, System Analysis, QA Testing, dan QA Engineering. Kemampuan analitis dan perhatian saya terhadap detail memungkinkan saya menjembatani kesenjangan antara stakeholder bisnis dan tim pengembangan, memastikan solusi perangkat lunak benar-benar memenuhi kebutuhan pengguna.

Saya berpengalaman dalam penulisan Business Requirements Documents (BRD), wawancara stakeholder, perancangan diagram UML, pembuatan strategi pengujian komprehensif, dan pembangunan framework otomasi. Saya berkembang pesat dalam lingkungan Agile dan percaya bahwa kualitas adalah tanggung jawab semua orang.`

export function AboutSection({ profile }: AboutProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const handleCV = useCallback(async () => {
    if (!profile?.cv_url) return
    await fetch('/api/download', { method: 'POST' })
    window.open(profile.cv_url, '_blank')
  }, [profile])

  const infoItems = [
    { icon: MapPin, label: 'Location', value: profile?.location   ?? 'Indonesia',         href: null },
    { icon: Mail,   label: 'Email',    value: profile?.email      ?? 'hello@example.com', href: `mailto:${profile?.email}` },
    { icon: Phone,  label: 'Phone',    value: profile?.phone      ?? '+62 8xx-xxxx-xxxx', href: `tel:${profile?.phone}` },
    { icon: Globe,  label: 'LinkedIn', value: 'linkedin.com/in/fatwabawahsi',              href: profile?.linkedin_url ?? '#' },
  ]

  const initials = profile?.name
    ? profile.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
    : 'FB'

  /* ── Shared: Photo card + social buttons ─────────────────── */
  const PhotoBlock = () => (
    <div className="flex flex-col items-center gap-5">
      {/* Photo with spinning ring */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-[2.5rem] border border-dashed border-blue-500/20 animate-spin-slow" />
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden shadow-card">
          {profile?.photo_url ? (
            <Image src={profile.photo_url} alt={profile?.name ?? 'Profile'} fill className="object-cover" />
          ) : (
            <div className="w-full h-full animated-border flex items-center justify-center">
              <span className="font-display font-extrabold text-5xl text-white">{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Badge top-right — Junior System Analyst */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -right-4 sm:-right-8 glass px-3 py-1.5 rounded-xl border border-indigo-500/20
                     text-xs font-medium text-indigo-300 shadow-card whitespace-nowrap"
        >
          🏗️ Junior System Analyst
        </motion.div>

        {/* Badge bottom-left — Junior QA Tester */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-4 -left-4 sm:-left-8 glass px-3 py-1.5 rounded-xl border border-emerald-500/20
                     text-xs font-medium text-emerald-300 shadow-card whitespace-nowrap"
        >
          🧪 Junior QA Tester
        </motion.div>
      </div>

      {/* Social buttons */}
      <div className="flex items-center gap-3 mt-2">
        {profile?.github_url && (
          <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
            className="glass p-3 rounded-xl border border-white/10 text-slate-400
                       hover:text-blue-400 hover:border-blue-500/30 transition-all">
            <Github size={18} />
          </a>
        )}
        {profile?.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
            className="glass p-3 rounded-xl border border-white/10 text-slate-400
                       hover:text-blue-400 hover:border-blue-500/30 transition-all">
            <Linkedin size={18} />
          </a>
        )}
        {profile?.email && (
          <a href={`mailto:${profile.email}`}
            className="glass p-3 rounded-xl border border-white/10 text-slate-400
                       hover:text-blue-400 hover:border-blue-500/30 transition-all">
            <Mail size={18} />
          </a>
        )}
      </div>
    </div>
  )

  /* ── Shared: CV card + availability ────────────────────────── */
  const BottomCards = () => (
    <div className="flex flex-col gap-3 w-full">
      {profile?.cv_url && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          onClick={handleCV}
          className="w-full glass rounded-xl border border-blue-500/20 px-4 py-3
                     flex items-center gap-3 hover:border-blue-500/50 hover:shadow-glow-blue
                     transition-all duration-300 group text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
            <Download size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Download CV / Resume</p>
            <p className="text-[10px] text-slate-500">Click to open PDF</p>
          </div>
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1 }}
        className="w-full glass rounded-2xl p-4 border border-emerald-500/20
                   bg-emerald-500/[0.04] flex items-center gap-4"
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <div>
          <div className="text-sm font-medium text-emerald-400">Open to New Opportunities</div>
          <div className="text-xs text-slate-500 mt-0.5">Full-time · Contract · Remote · Freelance</div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
            <User size={14} /> About Me
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            Who <span className="text-gradient">I Am</span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto" />
        </motion.div>

        {/* ══════════════════════════════════════════
            MOBILE layout  (block, shown on < lg)
            ══════════════════════════════════════════ */}
        <div className="lg:hidden flex flex-col gap-8">

          {/* 1. Photo + socials — top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center pt-6"
          >
            <PhotoBlock />
          </motion.div>

          {/* 2. Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-center">
              <span className="text-slate-100">{profile?.name?.split(' ')[0] ?? 'Fatwa'} </span>
              <span className="text-gradient">{profile?.name?.split(' ').slice(1).join(' ') ?? 'Bawahsi'}</span>
            </h3>
          </motion.div>

          {/* 3. Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert max-w-none"
          >
            {(profile?.summary ?? FALLBACK_SUMMARY).split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed mb-4 text-[0.95rem] text-justify">{para}</p>
            ))}
          </motion.div>

          {/* 4. Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {infoItems.map(({ icon: Icon, label, value, href }) => (
              <div key={label}
                className="glass rounded-xl p-3.5 border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-blue-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-sm text-slate-300 hover:text-blue-400 transition-colors truncate block">
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-300 truncate block">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* 5. CV card + availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <BottomCards />
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP layout  (grid, shown on >= lg)
            ══════════════════════════════════════════ */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-14 items-start">

          {/* Left: name + bio + info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display font-extrabold text-4xl leading-tight mb-6">
              <span className="text-slate-100">{profile?.name?.split(' ')[0] ?? 'Fatwa'} </span>
              <span className="text-gradient">{profile?.name?.split(' ').slice(1).join(' ') ?? 'Bawahsi'}</span>
            </h3>

            <div className="prose prose-invert max-w-none mb-8">
              {(profile?.summary ?? FALLBACK_SUMMARY).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-400 leading-relaxed mb-4 text-[0.95rem] text-justify">{para}</p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {infoItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label}
                  className="glass rounded-xl p-3.5 border border-white/[0.06] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm text-slate-300 hover:text-blue-400 transition-colors truncate block">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-300 truncate block">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: photo + socials + CV + availability */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <PhotoBlock />
            <BottomCards />
          </motion.div>

        </div>

      </div>
    </section>
  )
}
