'use client'
// ============================================================
// Admin — Certifications CRUD
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Certification } from '@/types'

const EMPTY: Omit<Certification, 'id' | 'created_at'> = {
  name: '', issuer: '', issue_date: '', expiry_date: null,
  credential_url: null, image_url: null, order_index: 0,
}

export default function AdminCertifications() {
  const [certs,    setCerts]    = useState<Certification[]>([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Certification | null>(null)
  const [form,     setForm]     = useState<Omit<Certification, 'id' | 'created_at'>>(EMPTY)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('certifications').select('*').order('order_index')
    setCerts(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (c: Certification) => {
    setEditing(c)
    setForm({
      name: c.name, issuer: c.issuer, issue_date: c.issue_date, expiry_date: c.expiry_date,
      credential_url: c.credential_url, image_url: c.image_url, order_index: c.order_index,
    })
    setShowForm(true)
  }

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.issuer || !form.issue_date) {
      toast.error('Name, issuer, and issue date are required'); return
    }
    setSaving(true)
    const payload   = { ...form }
    const { error } = editing
      ? await supabase.from('certifications').update(payload).eq('id', editing.id)
      : await supabase.from('certifications').insert(payload)
    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success(editing ? 'Cert updated!' : 'Cert added!'); setShowForm(false); fetchData() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    await supabase.from('certifications').delete().eq('id', id)
    toast.success('Certification deleted'); fetchData()
  }

  const inputClass = `w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
    focus:outline-none focus:border-blue-500/40 placeholder-slate-600`

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-100">Certifications</h1>
          <p className="text-slate-500 text-sm mt-1">{certs.length} credentials</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-medium
                     shadow-glow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div key={cert.id}
              className="glass rounded-2xl border border-white/[0.07] p-5 hover:border-blue-500/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-slate-200 text-sm leading-snug mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-blue-400 font-medium">{cert.issuer}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(cert.issue_date)}</p>
                  {cert.expiry_date && (
                    <p className="text-xs text-amber-400/70 mt-0.5">Expires {formatDate(cert.expiry_date)}</p>
                  )}
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 mt-1 transition-colors">
                      <ExternalLink size={10} /> Verify
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(cert)}
                    className="p-2 rounded-lg glass border border-white/[0.07] text-slate-400 hover:text-blue-400 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(cert.id)}
                    className="p-2 rounded-lg glass border border-white/[0.07] text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {certs.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-500">
              <div className="text-4xl mb-3">🏅</div>
              <p>No certifications yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-2xl border border-white/[0.1] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-xl text-slate-100">
                {editing ? 'Edit Certification' : 'New Certification'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Certification Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required
                  placeholder="e.g. ISTQB Foundation Level" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Issuer *</label>
                  <input value={form.issuer} onChange={e => set('issuer', e.target.value)} required
                    placeholder="e.g. ISTQB" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Issue Date *</label>
                  <input type="month" value={form.issue_date?.slice(0, 7) ?? ''}
                    onChange={e => set('issue_date', e.target.value + '-01')} required
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Expiry Date (optional)</label>
                <input type="month" value={form.expiry_date?.slice(0, 7) ?? ''}
                  onChange={e => set('expiry_date', e.target.value ? e.target.value + '-01' : null)}
                  className={inputClass} />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Credential URL</label>
                <input value={form.credential_url ?? ''} onChange={e => set('credential_url', e.target.value || null)}
                  placeholder="https://…" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Badge Image URL</label>
                <input value={form.image_url ?? ''} onChange={e => set('image_url', e.target.value || null)}
                  placeholder="https://..." className={inputClass} />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Order Index</label>
                <input type="number" value={form.order_index}
                  onChange={e => set('order_index', Number(e.target.value))} className={inputClass} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl glass border border-white/[0.1] text-slate-400 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                             bg-gradient-brand text-white text-sm font-medium disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Cert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
