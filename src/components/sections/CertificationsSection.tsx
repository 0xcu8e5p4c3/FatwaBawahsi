'use client'
// ============================================================
// Certifications Section
// ============================================================
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'
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
            Credentials & <span className="text-gradient">Licenses</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Industry-recognized certifications validating expertise in QA, BA, and project management.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass rounded-2xl p-5 border border-white/[0.07] group
                         hover:border-blue-500/25 hover:shadow-glow-blue transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-4">
                {cert.image_url ? (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                    <Image src={cert.image_url} alt={cert.name} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center
                                  text-xl group-hover:scale-110 transition-transform duration-300">
                    {CERT_EMOJIS[i % CERT_EMOJIS.length]}
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="font-display font-semibold text-slate-200 text-sm leading-snug mb-2 group-hover:text-blue-300 transition-colors">
                {cert.name}
              </h3>

              {/* Issuer */}
              <p className="text-xs text-blue-400 font-medium mb-1">{cert.issuer}</p>
              <p className="text-xs text-slate-500 mb-3">{formatDate(cert.issue_date)}</p>

              {/* Expiry */}
              {cert.expiry_date && (
                <p className="text-[10px] text-amber-400/70 mb-3">
                  Expires {formatDate(cert.expiry_date)}
                </p>
              )}

              {/* Credential link */}
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink size={10} /> Verify Credential
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
