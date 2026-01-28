'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  
  // 1. Hapus sesi di server
  await supabase.auth.signOut()
  
  // 2. Lempar ke Halaman Utama (Landing Page)
  redirect('/')
}