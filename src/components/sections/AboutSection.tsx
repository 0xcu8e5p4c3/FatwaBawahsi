'use client'
// ============================================================
// About Section
// ============================================================
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { User, MapPin, Mail, Phone, Globe } from 'lucide-react'
import type { Profile } from '@/types'

interface AboutProps { profile: Profile | null }

const FALLBACK_SUMMARY = `Saya adalah lulusan IT dengan keahlian yang kuat dalam Business Analysis, System Analysis, QA Testing, dan QA Engineering. Kemampuan analitis dan perhatian saya terhadap detail memungkinkan saya menjembatani kesenjangan antara stakeholder bisnis dan tim pengembangan, memastikan solusi perangkat lunak benar-benar memenuhi kebutuhan pengguna.

Saya berpengalaman dalam penulisan Business Requirements Documents (BRD), wawancara stakeholder, perancangan diagram UML, pembuatan strategi pengujian komprehensif, dan pembangunan framework otomasi. Saya berkembang pesat dalam lingkungan Agile dan percaya bahwa kualitas adalah tanggung jawab semua orang.`

export function AboutSection({ profile }: AboutProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const infoItems = [
    { icon: MapPin, label: 'Location', value: profile?.location   ?? 'Indonesia',         href: null },
    { icon: Mail,   label: 'Email',    value: profile?.email      ?? 'hello@example.com', href: `mailto:${profile?.email}` },
    { icon: Phone,  label: 'Phone',    value: profile?.phone      ?? '+62 8xx-xxxx-xxxx', href: `tel:${profile?.phone}` },
    { icon: Globe,  label: 'LinkedIn', value: 'linkedin.com/in/fatwabawahsi',              href: profile?.linkedin_url ?? '#' },
  ]

  const roleHighlights = [
    { emoji: '📊', role: 'Business Analyst',  desc: 'BRD, FRD, process mapping & stakeholder management' },
    { emoji: '🏗️', role: 'System Analyst',    desc: 'UML, ERD, use case, sequence & data flow diagrams' },
    { emoji: '🧪', role: 'QA Tester',         desc: 'Test planning, manual testing, UAT & bug reporting' },
    { emoji: '⚙️', role: 'QA Engineer',       desc: 'Selenium, Cypress, Postman, JMeter & CI/CD pipelines' },
  ]

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
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

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: summary + info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="prose prose-invert max-w-none">
              {(profile?.summary ?? FALLBACK_SUMMARY).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-400 leading-relaxed mb-4 text-[0.95rem]">{para}</p>
              ))}
            </div>

            {/* Info cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label}
                  className="glass rounded-xl p-3.5 border border-white/[0.06] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                    {href ? (
                      <a href={href}
                        className="text-sm text-slate-300 hover:text-blue-400 transition-colors truncate block">
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

          {/* Right: role highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {roleHighlights.map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-5 border border-white/[0.06]
                           hover:border-blue-500/20 hover:shadow-glow-blue transition-all duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </div>
                <h3 className="font-display font-semibold text-slate-200 mb-2 text-sm">{item.role}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}

            {/* Availability card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="sm:col-span-2 glass rounded-2xl p-5 border border-emerald-500/20
                         bg-emerald-500/[0.04] flex items-center gap-4"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <div className="text-sm font-medium text-emerald-400">Open to New Opportunities</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Full-time · Contract · Remote · Freelance
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
