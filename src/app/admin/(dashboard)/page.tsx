// ============================================================
// Admin Dashboard — stats overview
// ============================================================
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { FolderOpen, Code2, Briefcase, Award, Download, User } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const supabase = createServerSupabaseClient()
  const [projects, skills, experiences, certs, profile] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('skills').select('id', { count: 'exact', head: true }),
    supabase.from('experiences').select('id', { count: 'exact', head: true }),
    supabase.from('certifications').select('id', { count: 'exact', head: true }),
    supabase.from('profile').select('name, cv_download_count').single(),
  ])
  return {
    projects:     projects.count ?? 0,
    skills:       skills.count ?? 0,
    experiences:  experiences.count ?? 0,
    certs:        certs.count ?? 0,
    downloads:    profile.data?.cv_download_count ?? 0,
    profileName:  profile.data?.name ?? 'Not set',
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: 'Projects',       value: stats.projects,    icon: FolderOpen, href: '/admin/projects',       color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { label: 'Skills',         value: stats.skills,      icon: Code2,      href: '/admin/skills',          color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Experiences',    value: stats.experiences, icon: Briefcase,  href: '/admin/experience',      color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Certifications', value: stats.certs,       icon: Award,      href: '/admin/certifications',  color: 'text-emerald-400',bg: 'bg-emerald-500/10'},
    { label: 'CV Downloads',   value: stats.downloads,   icon: Download,   href: '/admin/profile',         color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
    { label: 'Profile',        value: stats.profileName, icon: User,       href: '/admin/profile',         color: 'text-pink-400',   bg: 'bg-pink-500/10'   },
  ]

  const quickLinks = [
    { label: 'Add New Project',       href: '/admin/projects?new=1',       icon: FolderOpen },
    { label: 'Update Profile',        href: '/admin/profile',              icon: User },
    { label: 'Add Certification',     href: '/admin/certifications?new=1', icon: Award },
    { label: 'Add Experience',        href: '/admin/experience?new=1',     icon: Briefcase },
  ]

  return (
    <div className="pt-14 lg:pt-0 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-100">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here&apos;s an overview of your portfolio.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href}
            className="glass rounded-2xl p-5 border border-white/[0.07] hover:border-blue-500/20
                       hover:shadow-card transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <div className={`font-display font-bold text-2xl mb-1 ${color}`}>
              {value}
            </div>
            <div className="text-xs text-slate-500">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass rounded-2xl border border-white/[0.07] p-6">
        <h2 className="font-display font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass border border-white/[0.07]
                         text-sm text-slate-300 hover:text-blue-400 hover:border-blue-500/20 transition-all">
              <Icon size={15} className="text-slate-500" /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* View site link */}
      <div className="mt-6 text-center">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-400 transition-colors">
          🌐 View live portfolio →
        </a>
      </div>
    </div>
  )
}
