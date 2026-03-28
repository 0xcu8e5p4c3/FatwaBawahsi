'use client'
// ============================================================
// Admin — Projects CRUD
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, Star, StarOff } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { roleBadgeStyles, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Project } from '@/types'

const ROLES = ['BA', 'SA', 'QA', 'QA Engineer', 'Full Stack']
const EMPTY: Omit<Project, 'id' | 'created_at'> = {
  title: '', description: '', role: 'BA', tech_stack: [], image_url: null,
  demo_url: null, github_url: null, featured: false, order_index: 0,
}

export default function AdminProjects() {
  const [projects,   setProjects]   = useState<Project[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [showForm,   setShowForm]   = useState(false)
  const [editing,    setEditing]    = useState<Project | null>(null)
  const [form,       setForm]       = useState<Omit<Project, 'id' | 'created_at'>>(EMPTY)
  const [techInput,  setTechInput]  = useState('')

  const supabase = createClient()

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('order_index')
    setProjects(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const openNew = () => {
    setEditing(null); setForm(EMPTY); setTechInput(''); setShowForm(true)
  }
  const openEdit = (p: Project) => {
    setEditing(p); setForm({ title: p.title, description: p.description, role: p.role,
      tech_stack: p.tech_stack, image_url: p.image_url, demo_url: p.demo_url,
      github_url: p.github_url, featured: p.featured, order_index: p.order_index });
    setTechInput(''); setShowForm(true)
  }

  const addTech = () => {
    const t = techInput.trim()
    if (t && !form.tech_stack.includes(t)) {
      setForm(f => ({ ...f, tech_stack: [...f.tech_stack, t] }))
    }
    setTechInput('')
  }
  const removeTech = (t: string) => setForm(f => ({ ...f, tech_stack: f.tech_stack.filter(x => x !== t) }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const payload   = { ...form }

    const { error } = editing
      ? await supabase.from('projects').update(payload).eq('id', editing.id)
      : await supabase.from('projects').insert(payload)

    setSaving(false)
    if (error) { toast.error(error.message) } else {
      toast.success(editing ? 'Project updated!' : 'Project added!')
      setShowForm(false); fetchProjects()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Project deleted'); fetchProjects()
  }

  return (
    <div className="pt-14 lg:pt-0 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-100">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">{projects.length} projects in your portfolio</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-medium
                     shadow-glow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id}
              className="glass rounded-xl border border-white/[0.07] p-4 flex items-center gap-4
                         hover:border-blue-500/20 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase', roleBadgeStyles[p.role] ?? '')}>
                    {p.role}
                  </span>
                  {p.featured && <Star size={12} className="text-amber-400" />}
                </div>
                <h3 className="font-medium text-slate-200 text-sm truncate">{p.title}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{p.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(p)}
                  className="p-2 rounded-lg glass border border-white/[0.07] text-slate-400 hover:text-blue-400 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg glass border border-white/[0.07] text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <div className="text-4xl mb-3">📂</div>
              <p>No projects yet. Click &quot;Add Project&quot; to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-2xl border border-white/[0.1] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-xl text-slate-100">
                {editing ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Project title" required
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40 placeholder-slate-600" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Project description…"
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40 placeholder-slate-600 resize-none" />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Project['role'] }))}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40 bg-dark-850">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Tech stack */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input value={techInput} onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="e.g. Selenium"
                    className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                               focus:outline-none focus:border-blue-500/40 placeholder-slate-600" />
                  <button type="button" onClick={addTech}
                    className="px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm border border-blue-500/25 hover:bg-blue-500/30 transition-colors">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tech_stack.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full
                                             glass border border-white/[0.1] text-slate-300">
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="text-slate-500 hover:text-red-400 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'demo_url',   label: 'Demo URL' },
                  { key: 'github_url', label: 'GitHub URL' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
                    <input
                      value={(form as Record<string, unknown>)[key] as string ?? ''}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value || null }))}
                      placeholder="https://…"
                      className="w-full glass rounded-xl px-3 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                                 focus:outline-none focus:border-blue-500/40 placeholder-slate-600" />
                  </div>
                ))}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Project Image URL</label>
                <input
                  value={form.image_url ?? ''}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value || null }))}
                  placeholder="https://example.com/image.png"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40 placeholder-slate-600" />
              </div>

              {/* Featured + Order */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 rounded border border-white/20 accent-blue-500" />
                  <span className="text-sm text-slate-400">Featured project</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Order</label>
                  <input type="number" value={form.order_index}
                    onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                    className="w-16 glass rounded-lg px-2 py-1.5 text-sm text-slate-300 border border-white/[0.08]
                               focus:outline-none focus:border-blue-500/40" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl glass border border-white/[0.1] text-slate-400 text-sm hover:text-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                             bg-gradient-brand text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
