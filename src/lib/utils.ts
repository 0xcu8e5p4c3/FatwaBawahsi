// ============================================================
// Utility Helpers
// ============================================================
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format date: "January 2024" */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/** Truncate text */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

/** Role badge color mapping */
export const roleBadgeStyles: Record<string, string> = {
  BA:           'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  SA:           'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  QA:           'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  'QA Engineer':'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  'Full Stack': 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
}

/** Skill category icon mapping */
export const categoryIcons: Record<string, string> = {
  'Business Analysis': '📊',
  'System Analysis':   '🏗️',
  'QA Testing':        '🧪',
  'QA Engineering':    '⚙️',
  'Tools & Platforms': '🛠️',
  'Methodologies':     '📋',
}

/** Skill category color mapping */
export const categoryColors: Record<string, string> = {
  'Business Analysis': 'from-violet-500/20 to-violet-500/5 border-violet-500/20',
  'System Analysis':   'from-orange-500/20 to-orange-500/5 border-orange-500/20',
  'QA Testing':        'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
  'QA Engineering':    'from-blue-500/20 to-blue-500/5 border-blue-500/20',
  'Tools & Platforms': 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
  'Methodologies':     'from-amber-500/20 to-amber-500/5 border-amber-500/20',
}
