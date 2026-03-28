'use client'
// ============================================================
// Contact Section — info only (no email form), + CV download
// ============================================================
import { useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Mail, Phone, MapPin, Github, Linkedin, Instagram,
  Download, MessageCircle, Send
} from 'lucide-react'
import type { Profile } from '@/types'

interface ContactProps { profile: Profile | null }

export function ContactSection({ profile }: ContactProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const handleCV = useCallback(async () => {
    if (!profile?.cv_url) return
    await fetch('/api/download', { method: 'POST' })
    window.open(profile.cv_url, '_blank')
  }, [profile])

  const contactCards = [
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email ?? 'hello@fatwabawahsi.com',
      sub: 'Balas dalam 24 jam',
      href: `mailto:${profile?.email ?? 'hello@fatwabawahsi.com'}`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20 hover:border-blue-500/40',
    },
    {
      icon: Phone,
      label: 'WhatsApp / Phone',
      value: profile?.phone ?? '+62 8xx-xxxx-xxxx',
      sub: 'Chat via WhatsApp',
      href: `https://wa.me/${(profile?.phone ?? '').replace(/\D/g, '')}`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile?.location ?? 'Indonesia',
      sub: 'Open to Remote & On-site',
      href: null,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20 hover:border-violet-500/40',
    },
  ]

  const socials = [
    { icon: Linkedin,  label: 'LinkedIn',  href: profile?.linkedin_url,  color: 'hover:text-blue-400 hover:border-blue-500/30',   desc: 'Connect on LinkedIn' },
    { icon: Github,    label: 'GitHub',    href: profile?.github_url,    color: 'hover:text-slate-200 hover:border-white/30',      desc: 'See my code' },
    { icon: Instagram, label: 'Instagram', href: profile?.instagram_url, color: 'hover:text-pink-400 hover:border-pink-500/30',   desc: 'Follow on Instagram' },
  ].filter(s => s.href)

  return (
    <section id="contact" className="section-padding bg-dark-900/40" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
            <MessageCircle size={14} /> Contact
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            Tertarik bekerja sama atau punya pertanyaan? Jangan ragu untuk menghubungi saya melalui salah satu channel di bawah ini.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {contactCards.map(({ icon: Icon, label, value, sub, href, color, bg, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`glass rounded-2xl p-6 border ${border} flex flex-col gap-4
                              transition-all duration-300 hover:shadow-glow-blue group block`}>
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className={`text-sm font-medium ${color} group-hover:underline truncate`}>{value}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
                  </div>
                </a>
              ) : (
                <div className={`glass rounded-2xl p-6 border ${border} flex flex-col gap-4 transition-all duration-300`}>
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className={`text-sm font-medium ${color} truncate`}>{value}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom row: social links + CV download */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Social links */}
          {socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-2xl border border-white/[0.07] p-6"
            >
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Send size={11} /> Social Media
              </p>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, href, color, desc }) => (
                  <a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/[0.07]
                                text-slate-400 ${color} transition-all duration-200 group`}>
                    <Icon size={17} />
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-slate-600">{desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* CV Download card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* CV card */}
            <button
              onClick={handleCV}
              disabled={!profile?.cv_url}
              className="flex-1 glass rounded-2xl border border-blue-500/20 p-6 text-left
                         hover:border-blue-500/50 hover:shadow-glow-blue transition-all duration-300 group
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Download size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Download CV / Resume</p>
                  <p className="text-xs text-slate-500">Format PDF · Updated 2025</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Unduh CV saya untuk melihat pengalaman kerja, keahlian, dan portofolio lengkap dalam format yang mudah dibaca.
              </p>
              <div className={`flex items-center gap-2 text-sm font-medium
                              ${profile?.cv_url ? 'text-blue-400' : 'text-slate-600'}`}>
                <Download size={14} />
                {profile?.cv_url ? 'Klik untuk download' : 'CV belum tersedia'}
              </div>
            </button>

            {/* Availability card */}
            <div className="glass rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-emerald-400">Tersedia untuk Peluang Baru</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Terbuka untuk posisi full-time, kontrak, proyek freelance, dan kerja remote.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
