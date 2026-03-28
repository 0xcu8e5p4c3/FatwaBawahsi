// ============================================================
// Global TypeScript Types
// ============================================================

export interface Profile {
  id: string
  name: string
  title: string
  tagline: string
  summary: string
  photo_url: string | null
  cv_url: string | null
  cv_download_count: number
  email: string
  phone: string | null
  location: string
  linkedin_url: string | null
  github_url: string | null
  instagram_url: string | null
  available: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  category: string
  name: string
  icon: string | null
  proficiency: number
  order_index: number
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  role: 'BA' | 'SA' | 'QA' | 'QA Engineer' | 'Full Stack'
  tech_stack: string[]
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  featured: boolean
  order_index: number
  created_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  type: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string
  order_index: number
  created_at: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_url: string | null
  image_url: string | null
  order_index: number
  created_at: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export type RoleFilter = 'all' | 'BA' | 'SA' | 'QA' | 'QA Engineer'
