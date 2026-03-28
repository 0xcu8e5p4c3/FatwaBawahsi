'use client'
// ============================================================
// Footer
// ============================================================
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'
import type { Profile } from '@/types'

interface FooterProps { profile: Profile | null }

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-white/[0.07] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          © {year} <span className="text-slate-300">{profile?.name ?? 'Portfolio'}</span>. Built with Next.js & Supabase.
        </p>
        <div className="flex items-center gap-4">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
               className="text-slate-500 hover:text-blue-400 transition-colors">
              <Github size={18} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
               className="text-slate-500 hover:text-blue-400 transition-colors">
              <Linkedin size={18} />
            </a>
          )}
          {profile?.instagram_url && (
            <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
               className="text-slate-500 hover:text-blue-400 transition-colors">
              <Instagram size={18} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`}
               className="text-slate-500 hover:text-blue-400 transition-colors">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
