'use client'
// ============================================================
// Certifications Section — grid on desktop, carousel on mobile
// ============================================================
import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Certification } from '@/types'

interface CertificationsProps { certifications: Certification[] }

const FALLBACK_CERTIFICATIONS: Certification[] = [
  { id:'1', name:'ISTQB Certified Tester Foundation Level', issuer:'ISTQB',    issue_date:'2023-05-01', expiry_date:null, credential_url:'#', image_url:null, order_index:1, created_at:'' },
  { id:'2', name:'PMI-PBA Preparation Certificate',          issuer:'PMI',      issue_date:'2023-09-01', expiry_date:null, credential_url:'#', image_url:null, order_index:2, created_at:'' },
  { id:'3', name:'Professional Scrum Master I (PSM I)',      issuer:'Scrum.org',issue_date:'2022-11-01', expiry_date:null, credential_url:'#', image_url:null, order_index:3, created_at:'' },
  { id:'4', name:'Postman API Fundamentals Expert',          issuer:'Postman',  issue_date:'2022-08-01', expiry_date:null, credential_url:'#', image_url:null, order_index:4, created_at:'' },
  { id:'5', name:'AWS Cloud Practitioner',                   issuer:'Amazon',   issue_date:'2023-03-01', expiry_date:'2026-03-01', credential_url:'#', image_url:null, order_index:5, created_at:'' },
  { id:'6', name:'Google Data Analytics Professional',       issuer:'Google',   issue_date:'2022-06-01', expiry_date:null, credential_url:'#', image_url:null, order_index:6, created_at:'' },
  { id:'7', name:'Agile BA Practitioner',                    issuer:'IIBA',     issue_date:'2023-12-01', expiry_date:null, credential_url:'#', image_url:null, order_index:7, created_at:'' },
  { id:'8', name:'Selenium WebDriver with Java — Advanced',  issuer:'Udemy',    issue_date:'2022-04-01', expiry_date:null, credential_url:'#', image_url:null, order_index:8, created_at:'' },
]

const CERT_EMOJIS = ['🏅','📊','🔄','⚡','☁️','🎯','📋','🧬']

/* ── Cert Card ────────────────────────────────────────────── */
function CertCard({ cert, index }: { cert: Certification; index: number }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.07] group
                    hover:border-blue-500/25 hover:shadow-glow-blue transition-all duration-300 h-full flex flex-col">
      <div className="mb-4">
        {cert.image_url ? (
          <div className="relative w-10 h-10 rounded-xl overflow-hidden">
            <Image src={cert.image_url} alt={cert.name} fill className="object-contain" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center
                          text-xl group-hover:scale-110 transition-transform duration-300">
            {CERT_EMOJIS[index % CERT_EMOJIS.length]}
          </div>
        )}
      </div>
      <h3 className="font-display font-semibold text-slate-200 text-sm leading-snug mb-2 group-hover:text-blue-300 transition-colors flex-1">
        {cert.name}
      </h3>
      <p className="text-xs text-blue-400 font-medium mb-1">{cert.issuer}</p>
      <p className="text-xs text-slate-500 mb-3">{formatDate(cert.issue_date)}</p>
      {cert.expiry_date && (
        <p className="text-[10px] text-amber-400/70 mb-3">Expires {formatDate(cert.expiry_date)}</p>
      )}
      {cert.credential_url && (
        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 transition-colors mt-auto">
          <ExternalLink size={10} /> Verify Credential
        </a>
      )}
    </div>
  )
}

/* ── Mobile Cert Carousel ─────────────────────────────────── */
function MobileCertCarousel({ items }: { items: Certification[] }) {
  const [current, setCurrent] = useState(0)
  const [dir, setDir]         = useState(1)
  const total = items.length

  const goTo = useCallback((next: number, d: number) => { setDir(d); setCurrent(next) }, [])
  const prev = () => goTo((current - 1 + total) % total, -1)
  const next = () => goTo((current + 1) % total,        1)

  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % total, 1), 3500)
    return () => clearInterval(id)
  }, [current, total, goTo])

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit:   (d: number) => ({ x: d > 0 ? -280 : 280, opacity: 0, transition: { duration: 0.3 } }),
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl" style={{ minHeight: 260 }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div key={items[current].id} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit">
            <CertCard cert={items[current]} index={current} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full px-1">
          <button onClick={prev}
            className="flex items-center gap-1.5 glass px-4 py-2 rounded-xl border border-white/10
                       text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all text-sm font-medium">
            <ChevronLeft size={16} /> Prev
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-300
                  ${i === current ? 'w-5 h-2 bg-blue-500' : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'}`}
              />
            ))}
          </div>
          <button onClick={next}
            className="flex items-center gap-1.5 glass px-4 py-2 rounded-xl border border-white/10
                       text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all text-sm font-medium">
            Next <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-600">{current + 1} / {total}</p>
      </div>
    </div>
  )
}

/* ── Main Section ─────────────────────────────────────────── */
export function CertificationsSection({ certifications }: CertificationsProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const data = certifications.length > 0 ? certifications : FALLBACK_CERTIFICATIONS

  return (
    <section id="certifications" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
            <Award size={14} /> Certifications
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            Credentials &amp; <span className="text-gradient">Licenses</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Industry-recognized certifications validating expertise in QA, BA, and project management.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* ── MOBILE: carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sm:hidden"
        >
          <MobileCertCarousel items={data} />
        </motion.div>

        {/* ── TABLET + DESKTOP: grid ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((cert, i) => (
            <motion.div key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}>
              <CertCard cert={cert} index={i} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
