'use client'
// ============================================================
// Experience Section — vertical timeline
// ============================================================
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Experience } from '@/types'

interface ExperienceProps { experiences: Experience[] }

const FALLBACK_EXPERIENCES: Experience[] = [
  { id:'1', title:'QA Engineer & Business Analyst', company:'PT. TechSolusi Indonesia', location:'Jakarta', type:'Full-time', start_date:'2023-01-01', end_date:null, current:true, description:'Leading QA automation for 3 enterprise products using Selenium, Cypress, and Postman. Acting as BA for requirements gathering — writing BRDs, facilitating sprint planning, and managing stakeholder communication for 2 cross-functional Scrum teams.', order_index:1, created_at:'' },
  { id:'2', title:'System Analyst', company:'CV. Digital Maju Bersama', location:'Bandung', type:'Contract', start_date:'2022-07-01', end_date:'2022-12-31', current:false, description:'Designed full UML documentation for a logistics SaaS platform including use case diagrams, ERD, and data flow diagrams. Coordinated between development team and business stakeholders throughout the system design phase.', order_index:2, created_at:'' },
  { id:'3', title:'QA Tester Intern', company:'Startup Fintech XYZ', location:'Remote', type:'Internship', start_date:'2022-02-01', end_date:'2022-06-30', current:false, description:'Executed manual regression and UAT testing for a digital wallet application. Documented 120+ bug reports in JIRA, wrote test cases from user stories, and participated in daily Scrum ceremonies.', order_index:3, created_at:'' },
  { id:'4', title:'S1 Teknik Informatika', company:'Universitas XYZ', location:'Jakarta', type:'Full-time', start_date:'2018-09-01', end_date:'2022-07-31', current:false, description:'GPA 3.78/4.00. Thesis: "Automated Test Suite Design for RESTful API using Behavior-Driven Development." Active member of Software Engineering student organization.', order_index:4, created_at:'' },
]

const TYPE_STYLES: Record<string, string> = {
  'Full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Contract':   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Internship': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Freelance':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Part-time':  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const data = experiences.length > 0 ? experiences : FALLBACK_EXPERIENCES

  return (
    <section id="experience" className="section-padding bg-dark-900/40" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
            <Briefcase size={14} /> Experience
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            Career <span className="text-gradient">Timeline</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            My professional journey across business analysis, system design, and quality engineering.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-indigo-500/40 to-transparent" />

          <div className="space-y-8">
            {data.map((exp, i) => {
              const typeStyle = TYPE_STYLES[exp.type] ?? TYPE_STYLES['Contract']
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-[18px] top-5 w-4 h-4 rounded-full border-2 border-dark-950
                                   flex items-center justify-center
                                   ${exp.current ? 'bg-blue-500' : 'bg-dark-850 border-blue-500/50'}`}>
                    {exp.current && (
                      <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />
                    )}
                  </div>

                  {/* Card */}
                  <div className="glass rounded-2xl p-6 border border-white/[0.07]
                                  hover:border-blue-500/20 transition-all duration-300">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${typeStyle}`}>
                        {exp.type}
                      </span>
                      {exp.current && (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full
                                         bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">
                        {formatDate(exp.start_date)} — {exp.current ? 'Present' : formatDate(exp.end_date ?? '')}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-slate-100 text-lg mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-blue-400 text-sm font-medium mb-1">
                      {exp.company}
                    </p>
                    <p className="text-slate-500 text-xs mb-4">
                      📍 {exp.location}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
