// ============================================================
// Admin Layout — requires auth, sidebar navigation
// ============================================================
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard | Portfolio' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to login if not authenticated
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-6">
        {children}
      </main>
    </div>
  )
}
