'use client'
// ============================================================
// Skills Section — grid on desktop, auto-sliding carousel on mobile
// ============================================================
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import { categoryIcons, categoryColors } from '@/lib/utils'
import type { Skill } from '@/types'

interface SkillsProps { skills: Skill[] }

const FALLBACK_SKILLS: Skill[] = [
  { id:'1', category:'Business Analysis', name:'Requirements Gathering', proficiency:90, order_index:1, icon:null, created_at:'' },
  { id:'2', category:'Business Analysis', name:'BRD / FRD Writing',      proficiency:88, order_index:2, icon:null, created_at:'' },
  { id:'3', category:'Business Analysis', name:'User Stories & Epics',   proficiency:85, order_index:3, icon:null, created_at:'' },
  { id:'4', category:'Business Analysis', name:'BPMN Process Mapping',   proficiency:80, order_index:4, icon:null, created_at:'' },
  { id:'5', category:'System Analysis', name:'UML Diagrams',      proficiency:87, order_index:1, icon:null, created_at:'' },
  { id:'6', category:'System Analysis', name:'ERD Design',        proficiency:85, order_index:2, icon:null, created_at:'' },
  { id:'7', category:'System Analysis', name:'Use Case Diagrams', proficiency:90, order_index:3, icon:null, created_at:'' },
  { id:'8', category:'System Analysis', name:'Data Flow Diagrams',proficiency:82, order_index:4, icon:null, created_at:'' },
  { id:'9',  category:'QA Testing', name:'Test Planning',      proficiency:92, order_index:1, icon:null, created_at:'' },
  { id:'10', category:'QA Testing', name:'Test Case Design',   proficiency:90, order_index:2, icon:null, created_at:'' },
  { id:'11', category:'QA Testing', name:'UAT Management',     proficiency:85, order_index:3, icon:null, created_at:'' },
  { id:'12', category:'QA Testing', name:'JIRA & Bug Reporting',proficiency:88, order_index:4, icon:null, created_at:'' },
  { id:'13', category:'QA Engineering', name:'Selenium WebDriver',    proficiency:82, order_index:1, icon:null, created_at:'' },
  { id:'14', category:'QA Engineering', name:'Cypress',               proficiency:78, order_index:2, icon:null, created_at:'' },
  { id:'15', category:'QA Engineering', name:'Postman / API Testing', proficiency:88, order_index:3, icon:null, created_at:'' },
  { id:'16', category:'QA Engineering', name:'JMeter / Load Testing', proficiency:75, order_index:4, icon:null, created_at:'' },
  { id:'17', category:'Tools & Platforms', name:'Confluence & Notion', proficiency:85, order_index:1, icon:null, created_at:'' },
  { id:'18', category:'Tools & Platforms', name:'Figma (Wireframing)', proficiency:72, order_index:2, icon:null, created_at:'' },
  { id:'19', category:'Tools & Platforms', name:'Git & GitHub',        proficiency:80, order_index:3, icon:null, created_at:'' },
  { id:'20', category:'Tools & Platforms', name:'SQL / Database',      proficiency:78, order_index:4, icon:null, created_at:'' },
  { id:'21', category:'Methodologies', name:'Agile / Scrum', proficiency:90, order_index:1, icon:null, created_at:'' },
  { id:'22', category:'Methodologies', name:'Kanban',        proficiency:85, order_index:2, icon:null, created_at:'' },
  { id:'23', category:'Methodologies', name:'SDLC & STLC',  proficiency:88, order_index:3, icon:null, created_at:'' },
  { id:'24', category:'Methodologies', name:'Waterfall',     proficiency:80, order_index:4, icon:null, created_at:'' },
]

const CATEGORY_ORDER = [
  'Business Analysis','System Analysis','QA Testing','QA Engineering','Tools & Platforms','Methodologies',
]

/* ── Skill Bar ───────────────────────────────────────────── */
function SkillBar({ name, proficiency, delay, animate }: {
  name: string; proficiency: number; delay: number; animate: boolean
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-300">{name}</span>
        <span className="text-xs text-slate-500 font-mono">{proficiency}%</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={animate ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

/* ── Skill Card ──────────────────────────────────────────── */
function SkillCard({ group, gi, animate }: {
  group: { category: string; skills: Skill[] }
  gi: number
  animate: boolean
}) {
  const colorClass = categoryColors[group.category] ?? 'from-slate-500/10 to-slate-500/5 border-slate-500/20'
  const icon       = categoryIcons[group.category]  ?? '🔧'
  return (
    <div className={`relative rounded-2xl p-6 border bg-gradient-to-b ${colorClass} h-full`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-display font-semibold text-slate-200 text-sm">{group.category}</h3>
          <p className="text-xs text-slate-500">{group.skills.length} skills</p>
        </div>
      </div>
      <div>
        {group.skills.map((skill, si) => (
          <SkillBar
            key={skill.id}
            name={skill.name}
            proficiency={skill.proficiency}
            delay={gi * 0.08 + si * 0.05}
            animate={animate}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Mobile Carousel ─────────────────────────────────────── */
function MobileCarousel({ groups }: { groups: { category: string; skills: Skill[] }[] }) {
  const [current, setCurrent] = useState(0)
  const [dir, setDir]         = useState(1) // 1 = forward, -1 = back
  const total = groups.length

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction)
    setCurrent(next)
  }, [])

  const prev = () => goTo((current - 1 + total) % total, -1)
  const next = () => goTo((current + 1) % total, 1)

  // Auto-slide every 3s
  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % total, 1), 3000)
    return () => clearInterval(id)
  }, [current, total, goTo])

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 260 : -260, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit:   (d: number) => ({ x: d > 0 ? -260 : 260, opacity: 0, transition: { duration: 0.3 } }),
  }

  return (
    <div className="relative">
      {/* Card area */}
      <div className="overflow-hidden rounded-2xl" style={{ minHeight: 340 }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <SkillCard group={groups[current]} gi={current} animate={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5 px-1">
        {/* Prev */}
        <button
          onClick={prev}
          className="flex items-center gap-1.5 glass px-4 py-2 rounded-xl border border-white/10
                     text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all text-sm font-medium"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {groups.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all duration-300
                ${i === current
                  ? 'w-5 h-2 bg-blue-500'
                  : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="flex items-center gap-1.5 glass px-4 py-2 rounded-xl border border-white/10
                     text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all text-sm font-medium"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Counter */}
      <p className="text-center text-xs text-slate-600 mt-3">
        {current + 1} / {total}
      </p>
    </div>
  )
}

/* ── Main Section ────────────────────────────────────────── */
export function SkillsSection({ skills }: SkillsProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const data    = skills.length > 0 ? skills : FALLBACK_SKILLS
  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    skills:   data.filter(s => s.category === cat),
  })).filter(g => g.skills.length > 0)

  return (
    <section id="skills" className="section-padding bg-dark-900/40" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
            <Layers size={14} /> Skills &amp; Expertise
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            My <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Core competency areas developed through real-world projects and continuous learning.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* ── MOBILE: auto-sliding carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="sm:hidden"
        >
          <MobileCarousel groups={grouped} />
        </motion.div>

        {/* ── TABLET + DESKTOP: grid ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grouped.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: gi * 0.08 }}
            >
              <SkillCard group={group} gi={gi} animate={inView} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
