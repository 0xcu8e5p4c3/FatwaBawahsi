'use client'
// ============================================================
// Admin — Profile CRUD (name, photo, CV, social links)
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { Loader2, Save, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Profile } from '@/types'

const EMPTY_PROFILE: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'cv_download_count'> = {
  name: '', title: '', tagline: '', summary: '', photo_url: null, cv_url: null,
  email: '', phone: null, location: '', linkedin_url: null, github_url: null,
  instagram_url: null, available: true,
}

export default function AdminProfile() {
  const [profile,   setProfile]   = useState<Profile | null>(null)
  const [form,      setForm]      = useState<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'cv_download_count'>>(EMPTY_PROFILE)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)

  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    const { data } = await supabase.from('profile').select('*').single()
    if (data) { setProfile(data); setForm(data) }
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = { ...form, updated_at: new Date().toISOString() }

    const { error } = profile
      ? await supabase.from('profile').update(payload).eq('id', profile.id)
      : await supabase.from('profile').insert(payload)

    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success('Profile saved!'); fetchProfile() }
  }

  const set = (key: string, val: string | boolean | null) =>
    setForm(f => ({ ...f, [key]: val }))

  const inputClass = `w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/[0.08]
    focus:outline-none focus:border-blue-500/40 placeholder-slate-600`
  const labelClass = `block text-xs text-slate-400 mb-1.5`

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-500 pt-14 lg:pt-0">
      <Loader2 size={24} className="animate-spin" />
    </div>
  )

  return (
    <div className="pt-14 lg:pt-0 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-100">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal information and social links.</p>
        {profile && (
          <p className="text-xs text-slate-600 mt-1">CV Downloads: <span className="text-emerald-400">{profile.cv_download_count}</span></p>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="glass rounded-2xl border border-white/[0.07] p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-200">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your Name" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Professional Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Business Analyst · QA Engineer" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Short tagline for hero section" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Professional Summary</label>
            <textarea value={form.summary} onChange={e => set('summary', e.target.value)}
              rows={5} placeholder="Write your professional summary here…"
              className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" checked={form.available}
              onChange={e => set('available', e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500" />
            <label htmlFor="available" className="text-sm text-slate-400 cursor-pointer">
              Available for new opportunities
            </label>
          </div>
        </div>

        {/* Contact Info */}
        <div className="glass rounded-2xl border border-white/[0.07] p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-200">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={form.phone ?? ''} onChange={e => set('phone', e.target.value || null)} placeholder="+62 812-xxxx-xxxx" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Jakarta, Indonesia" className={inputClass} />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass rounded-2xl border border-white/[0.07] p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-200">Social Links</h2>
          {[
            { key: 'linkedin_url',  label: 'LinkedIn URL',  placeholder: 'https://linkedin.com/in/...' },
            { key: 'github_url',    label: 'GitHub URL',    placeholder: 'https://github.com/...' },
            { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                value={(form as Record<string, unknown>)[key] as string ?? ''}
                onChange={e => set(key, e.target.value || null)}
                placeholder={placeholder}
                className={inputClass} />
            </div>
          ))}
        </div>

        {/* Photo & CV URLs */}
        <div className="glass rounded-2xl border border-white/[0.07] p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-200">Photo & CV URLs</h2>
          <div>
            <label className={labelClass}>Profile Photo URL</label>
            {form.photo_url && (
              <p className="text-xs text-slate-500 mb-2">Current: <a href={form.photo_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View photo</a></p>
            )}
            <input value={form.photo_url ?? ''} onChange={e => set('photo_url', e.target.value || null)} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CV / Resume URL (PDF)</label>
            {form.cv_url && (
              <p className="text-xs text-slate-500 mb-2">Current: <a href={form.cv_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View CV</a></p>
            )}
            <input value={form.cv_url ?? ''} onChange={e => set('cv_url', e.target.value || null)} placeholder="https://..." className={inputClass} />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                     bg-gradient-brand text-white font-medium shadow-glow-blue
                     hover:opacity-90 disabled:opacity-60 transition-all">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Profile</>}
        </button>
      </form>
    </div>
  )
}
