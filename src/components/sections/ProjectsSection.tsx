'use client'
// ============================================================
// Projects Section — grid on desktop, carousel on mobile
// ============================================================
import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FolderOpen, ExternalLink, Github, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, roleBadgeStyles } from '@/lib/utils'
import type { Project, RoleFilter } from '@/types'

interface ProjectsProps { projects: Project[] }

const FALLBACK_PROJECTS: Project[] = [
  { id:'1', title:'E-Commerce BRD & Process Redesign', description:'Complete business requirements document and AS-IS/TO-BE process mapping for a B2C marketplace migration project involving 40+ stakeholders.', role:'BA', tech_stack:['Confluence','Visio','BPMN','Lucidchart'], image_url:null, demo_url:'#', github_url:'#', featured:true, order_index:1, created_at:'' },
  { id:'2', title:'Banking App Automated Regression Suite', description:'Selenium + TestNG automation framework covering 300+ test cases integrated into Jenkins CI/CD pipeline. Reduced regression cycle by 70%.', role:'QA Engineer', tech_stack:['Selenium','TestNG','Jenkins','Java','Maven'], image_url:null, demo_url:'#', github_url:'#', featured:true, order_index:2, created_at:'' },
  { id:'3', title:'HR Management System — UML Architecture', description:'Full system architecture documentation with use case, sequence, ERD, and DFD diagrams for a mid-scale HR SaaS platform.', role:'SA', tech_stack:['StarUML','Draw.io','SQL','Lucidchart'], image_url:null, demo_url:null, github_url:'#', featured:true, order_index:3, created_at:'' },
  { id:'4', title:'Fintech API Performance Testing — JMeter', description:'Load and stress testing for a fintech REST API handling 10K concurrent users. Generated comprehensive HTML performance reports.', role:'QA Engineer', tech_stack:['JMeter','Postman','Grafana','REST API'], image_url:null, demo_url:'#', github_url:'#', featured:false, order_index:4, created_at:'' },
  { id:'5', title:'Healthcare CRM — Gap Analysis', description:'Requirements elicitation and gap analysis for a clinic management CRM serving 50+ branch locations across Indonesia.', role:'BA', tech_stack:['Miro','Confluence','Figma','Excel'], image_url:null, demo_url:null, github_url:'#', featured:false, order_index:5, created_at:'' },
  { id:'6', title:'POS System — Database & Architecture Design', description:'Relational database design and system architecture for a retail POS covering inventory, sales, and reporting modules.', role:'SA', tech_stack:['MySQL','ERD','StarUML','PostgreSQL'], image_url:null, demo_url:null, github_url:'#', featured:false, order_index:6, created_at:'' },
]

const FILTERS: { label: string; value: RoleFilter }[] = [
  { label: 'All',            value: 'all' },
  { label: 'Business Analyst', value: 'BA' },
  { label: 'System Analyst',   value: 'SA' },
  { label: 'QA Engineer',      value: 'QA Engineer' },
  { label: 'QA Tester',        value: 'QA' },
]

const PROJECT_GRADIENTS = [
  'from-violet-900/60 to-violet-800/20',
  'from-blue-900/60 to-blue-800/20',
  'from-orange-900/60 to-orange-800/20',
  'from-cyan-900/60 to-cyan-800/20',
  'from-indigo-900/60 to-indigo-800/20',
  'from-emerald-900/60 to-emerald-800/20',
]

const PROJECT_EMOJIS: Record<string, string> = {
  BA: '📊', SA: '🏗️', QA: '🧪', 'QA Engineer': '⚙️', 'Full Stack': '🚀',
}

/* ── Project Card ─────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length]
  return (
    <article className="glass rounded-2xl border border-white/[0.07] overflow-hidden group
                        hover:border-blue-500/25 hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}>
        {project.image_url ? (
          <Image src={project.image_url} alt={project.title} fill className="object-cover" />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
            {PROJECT_EMOJIS[project.role] ?? '💼'}
          </span>
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full
                           bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={cn('text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide',
            roleBadgeStyles[project.role] ?? roleBadgeStyles['BA'])}>
            {project.role}
          </span>
        </div>
        <h3 className="font-display font-semibold text-slate-200 mb-2 leading-snug group-hover:text-blue-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack.slice(0, 4).map(tech => (
            <span key={tech}
              className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-400">
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-500">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300
                         glass px-3 py-1.5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <ExternalLink size={11} /> Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200
                         glass px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all">
              <Github size={11} /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

/* ── Shared Carousel Nav ──────────────────────────────────── */
function CarouselControls({ current, total, onPrev, onNext, onDot }: {
  current: number; total: number
  onPrev: () => void; onNext: () => void; onDot: (i: number) => void
}) {
  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full px-1">
        <button onClick={onPrev}
          className="flex items-center gap-1.5 glass px-4 py-2 rounded-xl border border-white/10
                     text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all text-sm font-medium">
          <ChevronLeft size={16} /> Prev
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => onDot(i)}
              className={`rounded-full transition-all duration-300
                ${i === current ? 'w-5 h-2 bg-blue-500' : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'}`}
            />
          ))}
        </div>
        <button onClick={onNext}
          className="flex items-center gap-1.5 glass px-4 py-2 rounded-xl border border-white/10
                     text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all text-sm font-medium">
          Next <ChevronRight size={16} />
        </button>
      </div>
      <p className="text-xs text-slate-600">{current + 1} / {total}</p>
    </div>
  )
}

/* ── Mobile Project Carousel ──────────────────────────────── */
function MobileProjectCarousel({ items }: { items: Project[] }) {
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

  if (total === 0) return <p className="text-center text-slate-500 py-12">No projects found.</p>

  return (
    <div>
      <div className="overflow-hidden rounded-2xl" style={{ minHeight: 380 }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div key={items[current].id} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit">
            <ProjectCard project={items[current]} index={current} />
          </motion.div>
        </AnimatePresence>
      </div>
      <CarouselControls current={current} total={total}
        onPrev={prev} onNext={next} onDot={i => goTo(i, i > current ? 1 : -1)} />
    </div>
  )
}

/* ── Main Section ─────────────────────────────────────────── */
export function ProjectsSection({ projects }: ProjectsProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [filter, setFilter] = useState<RoleFilter>('all')
  const [search, setSearch] = useState('')

  const data = projects.length > 0 ? projects : FALLBACK_PROJECTS

  const filtered = useMemo(() => {
    let result = data
    if (filter !== 'all') result = result.filter(p => p.role === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech_stack.some(t => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [data, filter, search])

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
            <FolderOpen size={14} /> Projects
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            A selection of projects spanning business analysis, system design, and quality engineering.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={cn(
                  'text-xs font-medium px-4 py-1.5 rounded-full border transition-all duration-200',
                  filter === f.value
                    ? 'bg-gradient-brand text-white border-transparent shadow-glow-blue'
                    : 'glass border-white/[0.1] text-slate-400 hover:text-slate-200 hover:border-white/20'
                )}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search projects…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 border border-white/[0.08]
                         focus:outline-none focus:border-blue-500/40 w-48 placeholder-slate-600" />
          </div>
        </motion.div>

        {/* ── MOBILE: carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sm:hidden"
        >
          <MobileProjectCarousel items={filtered} />
        </motion.div>

        {/* ── TABLET + DESKTOP: grid ── */}
        <motion.div layout className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}>
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="hidden sm:block text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>No projects match your search.</p>
          </div>
        )}
      </div>
    </section>
  )
}
