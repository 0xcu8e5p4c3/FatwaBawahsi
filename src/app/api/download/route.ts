// ============================================================
// API Route: POST /api/download — track CV download count
// ============================================================
import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    const supabase = createAdminSupabaseClient()

    // Increment download count on profile row
    const { data: profile } = await supabase
      .from('profile')
      .select('id, cv_download_count')
      .single()

    if (profile) {
      await supabase
        .from('profile')
        .update({ cv_download_count: (profile.cv_download_count ?? 0) + 1 })
        .eq('id', profile.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Download track error:', err)
    return NextResponse.json({ error: 'Failed to track download.' }, { status: 500 })
  }
}
