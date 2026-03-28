'use client'
// ============================================================
// Admin — Skills CRUD
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { categoryIcons } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Skill } from '@/types'

const CATEGORIES = [
  'Business Analysis','System Analysis','QA Testing','QA Engineering','Tools & Platforms','Methodologies'
]
const EMPTY: Omit<Skill, 'id' | 'created_at'> = {
  category: 'Business Analysis', name: '', icon: null, proficiency: 80, order_index: 0
}

export default function AdminSkills() {
  const [skills,   setSkills]   = useState<Skill[]>([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Skill | null>(null)
  const [form,     setForm]     = useState<Omit<Skill, 'id' | 'created_at'>>(EMPTY)
  const supabase = createClient()

  const fetchSkills = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('skills').select('*').order('category').order('order_index')
    setSkills(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (s: Skill) => {
    setEditing(s)
    setForm({ category: s.category, name: s.name, icon: s.icon, proficiency: s.proficiency, order_index: s.order_index })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { toast.error('Name is required'); return }
    setSaving(true)
    const { error } = editing
      ? await supabase.from('skills').update(form).eq('id', editing.id)
      : await supabase.from('skills').insert(form)
    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success(editing ? 'Skill updated!' : 'Skill added!'); setShowForm(false); fetchSkills() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await supabase.from('skills').delete().eq('id', id)
    toast.success('Skill deleted'); fetchSkills()
  }

  // Group by category
  const grouped = CATEGORIES.map(cat => ({ cat, items: skills.filter(s => s.category === cat) }))

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-100">Skills</h1>
          <p className="text-slate-500 text-sm mt-1">{skills.length} skills across {CATEGORIES.length} categories</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-medium
                     shadow-glow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items }) => items.length > 0 && (
            <div key={cat} className="glass rounded-2xl border border-white/[0.07] p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{categoryIcons[cat] ?? '🔧'}</span>
                <h2 className="font-display font-semibold text-slate-200">{cat}</h2>
                <span className="text-xs text-slate-500 ml-auto">{items.length} skills</span>
              </div>
              <div className="space-y-2">
                {items.map(skill => (
                  <div key={skill.id}
                    className="flex items-center gap-3 p-3 rounded-xl glass border border-white/[0.05]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-300">{skill.name}</span>
                        <div className="flex-1 progress-bar h-1.5">
                          <div className="progress-fill h-full" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(skill)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-2xl border border-white/[0.1] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-xl text-slate-100">{editing ? 'Edit Skill' : 'New Skill'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-200"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40 bg-dark-850">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Skill Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Selenium WebDriver" required
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40 placeholder-slate-600" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Proficiency: {form.proficiency}%</label>
                <input type="range" min={10} max={100} value={form.proficiency}
                  onChange={e => setForm(f => ({ ...f, proficiency: Number(e.target.value) }))}
                  className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Order Index</label>
                <input type="number" value={form.order_index}
                  onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
                             focus:outline-none focus:border-blue-500/40" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl glass border border-white/[0.1] text-slate-400 text-sm">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                             bg-gradient-brand text-white text-sm font-medium disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
