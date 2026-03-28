'use client'
// ============================================================
// Admin — Experience CRUD
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Experience } from '@/types'

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']

const EMPTY: Omit<Experience, 'id' | 'created_at'> = {
  title: '', company: '', location: '', type: 'Full-time',
  start_date: '', end_date: null, current: false, description: '', order_index: 0,
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [showForm,    setShowForm]    = useState(false)
  const [editing,     setEditing]     = useState<Experience | null>(null)
  const [form,        setForm]        = useState<Omit<Experience, 'id' | 'created_at'>>(EMPTY)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('experiences').select('*').order('order_index')
    setExperiences(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (e: Experience) => {
    setEditing(e)
    setForm({
      title: e.title, company: e.company, location: e.location, type: e.type,
      start_date: e.start_date, end_date: e.end_date, current: e.current,
      description: e.description, order_index: e.order_index,
    })
    setShowForm(true)
  }

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.company || !form.start_date) {
      toast.error('Title, company, and start date are required'); return
    }
    setSaving(true)
    const payload = { ...form, end_date: form.current ? null : form.end_date }
    const { error } = editing
      ? await supabase.from('experiences').update(payload).eq('id', editing.id)
      : await supabase.from('experiences').insert(payload)
    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success(editing ? 'Experience updated!' : 'Experience added!'); setShowForm(false); fetchData() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    await supabase.from('experiences').delete().eq('id', id)
    toast.success('Experience deleted'); fetchData()
  }

  const inputClass = `w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
    focus:outline-none focus:border-blue-500/40 placeholder-slate-600`

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-100">Experience</h1>
          <p className="text-slate-500 text-sm mt-1">{experiences.length} entries in your timeline</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-medium
                     shadow-glow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Timeline list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="relative pl-6 border-l border-blue-500/20 space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="relative">
              {/* Dot */}
              <div className={`absolute -left-[29px] top-4 w-3 h-3 rounded-full border-2 border-dark-950
                               ${exp.current ? 'bg-blue-500' : 'bg-slate-700 border-blue-500/40'}`} />

              <div className="glass rounded-2xl border border-white/[0.07] p-5 hover:border-blue-500/20 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full
                                       bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {exp.type}
                      </span>
                      {exp.current && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full
                                         bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">
                        {formatDate(exp.start_date)} — {exp.current ? 'Present' : formatDate(exp.end_date ?? '')}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-slate-200">{exp.title}</h3>
                    <p className="text-sm text-blue-400">{exp.company} · {exp.location}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(exp)}
                      className="p-2 rounded-lg glass border border-white/[0.07] text-slate-400 hover:text-blue-400 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(exp.id)}
                      className="p-2 rounded-lg glass border border-white/[0.07] text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <div className="text-4xl mb-3">📋</div>
              <p>No experience entries yet.</p>
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
                {editing ? 'Edit Experience' : 'New Experience'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Job Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} required
                  placeholder="e.g. QA Engineer" className={inputClass} />
              </div>

              {/* Company + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Company *</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} required
                    placeholder="Company name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Location</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="Jakarta / Remote" className={inputClass} />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Employment Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className={`${inputClass} bg-dark-850`}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Start Date *</label>
                  <input type="month" value={form.start_date?.slice(0, 7) ?? ''}
                    onChange={e => set('start_date', e.target.value + '-01')} required
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">End Date</label>
                  <input type="month" value={form.end_date?.slice(0, 7) ?? ''}
                    onChange={e => set('end_date', e.target.value ? e.target.value + '-01' : null)}
                    disabled={form.current}
                    className={`${inputClass} disabled:opacity-40`} />
                </div>
              </div>

              {/* Current role */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.current}
                  onChange={e => set('current', e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500" />
                <span className="text-sm text-slate-400">I currently work here</span>
              </label>

              {/* Description */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Describe your role and achievements…"
                  className={`${inputClass} resize-none`} />
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Order Index</label>
                <input type="number" value={form.order_index}
                  onChange={e => set('order_index', Number(e.target.value))}
                  className={inputClass} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl glass border border-white/[0.1] text-slate-400 text-sm hover:text-slate-200">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                             bg-gradient-brand text-white text-sm font-medium disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
