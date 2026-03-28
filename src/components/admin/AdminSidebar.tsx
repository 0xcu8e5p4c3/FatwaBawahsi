'use client'
// ============================================================
// Admin Sidebar — navigation + logout
// ============================================================
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, User, Code2, Award, Briefcase, FolderOpen,
  LogOut, Menu, X, ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/admin',                icon: LayoutDashboard },
  { label: 'Profile',         href: '/admin/profile',        icon: User },
  { label: 'Projects',        href: '/admin/projects',       icon: FolderOpen },
  { label: 'Skills',          href: '/admin/skills',         icon: Code2 },
  { label: 'Experience',      href: '/admin/experience',     icon: Briefcase },
  { label: 'Certifications',  href: '/admin/certifications', icon: Award },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/admin/login')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.07]">
        <span className="font-display font-bold text-lg text-gradient">Admin Panel</span>
        <p className="text-xs text-slate-500 mt-0.5">Portfolio Manager</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href} href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                active
                  ? 'bg-blue-500/15 text-blue-400 font-medium border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              )}
            >
              <Icon size={16} className={active ? 'text-blue-400' : 'text-slate-500'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] space-y-1">
        <a
          href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink size={16} className="text-slate-500" /> View Portfolio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
        >
          <LogOut size={16} className="text-slate-500" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 glass-dark border-r border-white/[0.07] flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 glass-dark border-b border-white/[0.07] flex items-center justify-between px-4 h-14">
        <span className="font-display font-bold text-gradient">Admin Panel</span>
        <button onClick={() => setOpen(o => !o)} className="text-slate-400 p-1">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 glass-dark border-r border-white/[0.07] flex flex-col pt-14">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
