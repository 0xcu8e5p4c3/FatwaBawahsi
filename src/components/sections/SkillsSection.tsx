'use client'
// ============================================================
// Skills Section — grouped categories with proficiency bars
// ============================================================
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Layers } from 'lucide-react'
import { categoryIcons, categoryColors } from '@/lib/utils'
import type { Skill } from '@/types'

interface SkillsProps { skills: Skill[] }

// Fallback data shown when database is empty
const FALLBACK_SKILLS: Skill[] = [
  // Business Analysis
  { id:'1', category:'Business Analysis', name:'Requirements Gathering', proficiency:90, order_index:1, icon:null, created_at:'' },
  { id:'2', category:'Business Analysis', name:'BRD / FRD Writing',      proficiency:88, order_index:2, icon:null, created_at:'' },
  { id:'3', category:'Business Analysis', name:'User Stories & Epics',   proficiency:85, order_index:3, icon:null, created_at:'' },
  { id:'4', category:'Business Analysis', name:'BPMN Process Mapping',   proficiency:80, order_index:4, icon:null, created_at:'' },
  // System Analysis
  { id:'5', category:'System Analysis', name:'UML Diagrams',      proficiency:87, order_index:1, icon:null, created_at:'' },
  { id:'6', category:'System Analysis', name:'ERD Design',        proficiency:85, order_index:2, icon:null, created_at:'' },
  { id:'7', category:'System Analysis', name:'Use Case Diagrams', proficiency:90, order_index:3, icon:null, created_at:'' },
  { id:'8', category:'System Analysis', name:'Data Flow Diagrams',proficiency:82, order_index:4, icon:null, created_at:'' },
  // QA Testing
  { id:'9',  category:'QA Testing', name:'Test Planning',  proficiency:92, order_index:1, icon:null, created_at:'' },
  { id:'10', category:'QA Testing', name:'Test Case Design',proficiency:90, order_index:2, icon:null, created_at:'' },
  { id:'11', category:'QA Testing', name:'UAT Management', proficiency:85, order_index:3, icon:null, created_at:'' },
  { id:'12', category:'QA Testing', name:'JIRA & Bug Reporting', proficiency:88, order_index:4, icon:null, created_at:'' },
  // QA Engineering
  { id:'13', category:'QA Engineering', name:'Selenium WebDriver', proficiency:82, order_index:1, icon:null, created_at:'' },
  { id:'14', category:'QA Engineering', name:'Cypress',            proficiency:78, order_index:2, icon:null, created_at:'' },
  { id:'15', category:'QA Engineering', name:'Postman / API Testing', proficiency:88, order_index:3, icon:null, created_at:'' },
  { id:'16', category:'QA Engineering', name:'JMeter / Load Testing', proficiency:75, order_index:4, icon:null, created_at:'' },
  // Tools
  { id:'17', category:'Tools & Platforms', name:'Confluence & Notion', proficiency:85, order_index:1, icon:null, created_at:'' },
  { id:'18', category:'Tools & Platforms', name:'Figma (Wireframing)', proficiency:72, order_index:2, icon:null, created_at:'' },
  { id:'19', category:'Tools & Platforms', name:'Git & GitHub',        proficiency:80, order_index:3, icon:null, created_at:'' },
  { id:'20', category:'Tools & Platforms', name:'SQL / Database',      proficiency:78, order_index:4, icon:null, created_at:'' },
  // Methodologies
  { id:'21', category:'Methodologies', name:'Agile / Scrum', proficiency:90, order_index:1, icon:null, created_at:'' },
  { id:'22', category:'Methodologies', name:'Kanban',        proficiency:85, order_index:2, icon:null, created_at:'' },
  { id:'23', category:'Methodologies', name:'SDLC & STLC',  proficiency:88, order_index:3, icon:null, created_at:'' },
  { id:'24', category:'Methodologies', name:'Waterfall',     proficiency:80, order_index:4, icon:null, created_at:'' },
]

const CATEGORY_ORDER = [
  'Business Analysis','System Analysis','QA Testing','QA Engineering','Tools & Platforms','Methodologies',
]

function SkillBar({ name, proficiency, delay }: { name: string; proficiency: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-300">{name}</span>
        <span className="text-xs text-slate-500 font-mono">{proficiency}%</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function SkillsSection({ skills }: SkillsProps) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const data   = skills.length > 0 ? skills : FALLBACK_SKILLS

  // Group by category in defined order
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
            <Layers size={14} /> Skills & Expertise
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4">
            My <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Four core competency areas developed through real-world projects and continuous learning.
          </p>
          <div className="w-16 h-0.5 bg-gradient-brand mx-auto mt-4" />
        </motion.div>

        {/* Skill groups grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grouped.map((group, gi) => {
            const colorClass = categoryColors[group.category] ?? 'from-slate-500/10 to-slate-500/5 border-slate-500/20'
            const icon       = categoryIcons[group.category] ?? '🔧'

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: gi * 0.08 }}
                className={`relative rounded-2xl p-6 border bg-gradient-to-b ${colorClass}
                            hover:shadow-card transition-all duration-300 group`}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-200 text-sm">{group.category}</h3>
                    <p className="text-xs text-slate-500">{group.skills.length} skills</p>
                  </div>
                </div>

                {/* Skill bars */}
                <div>
                  {group.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      proficiency={skill.proficiency}
                      delay={gi * 0.08 + si * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
