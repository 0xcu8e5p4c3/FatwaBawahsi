// ============================================================
// API Route: POST /api/contact
// Simplified — no email sending, contact handled directly
// ============================================================
import { NextResponse } from 'next/server'

export async function POST() {
  // Contact is handled via direct links (email, WhatsApp, social)
  // This endpoint is kept as a stub for future use
  return NextResponse.json({ success: true })
}
