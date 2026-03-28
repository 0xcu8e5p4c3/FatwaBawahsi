// ============================================================
// Main Portfolio Page — Single Page (Server Component)
// ============================================================
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { CertificationsSection } from '@/components/sections/CertificationsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Footer } from '@/components/layout/Footer'
import type { Profile, Skill, Project, Experience, Certification } from '@/types'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

async function getPortfolioData() {
  const supabase = createServerSupabaseClient()

  const [profileRes, skillsRes, projectsRes, experienceRes, certsRes] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('skills').select('*').order('order_index'),
    supabase.from('projects').select('*').order('order_index'),
    supabase.from('experiences').select('*').order('order_index'),
    supabase.from('certifications').select('*').order('order_index'),
  ])

  return {
    profile: profileRes.data as Profile | null,
    skills: (skillsRes.data as Skill[]) ?? [],
    projects: (projectsRes.data as Project[]) ?? [],
    experiences: (experienceRes.data as Experience[]) ?? [],
    certifications: (certsRes.data as Certification[]) ?? [],
  }
}

export default async function HomePage() {
  const { profile, skills, projects, experiences, certifications } = await getPortfolioData()

  return (
    <main className="relative min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Background ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.05] blur-[100px]" />
      </div>

      <Navbar profile={profile} />

      <div className="relative z-10">
        <HeroSection profile={profile} projectsCount={projects.length} certsCount={certifications.length} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <CertificationsSection certifications={certifications} />
        <ContactSection profile={profile} />
      </div>

      <Footer profile={profile} />
    </main>
  )
}
