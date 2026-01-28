'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateStatus(requestId: string, newStatus: 'verified' | 'rejected') {
  const supabase = await createClient()

  // 1. Cek Admin
  const { data: { user } } = await supabase.auth.getUser()
  const isBoleh = await supabase.rpc('is_admin')
  
  if (!user || !isBoleh) {
    // Jangan return object, tapi redirect atau throw
    redirect('/login')
  }

  // 2. Update Status
  const { error } = await supabase
    .from('service_requests')
    .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
    })
    .eq('id', requestId)

  if (error) {
    console.error(error)
    throw new Error('Gagal update status di database')
  }

  // 3. Catat Log (Opsional)
  await supabase.from('admin_logs').insert({
    admin_id: user?.id,
    request_id: requestId,
    action: newStatus,
    timestamp: new Date().toISOString()
  })

  // 4. Sukses -> Redirect
  revalidatePath('/admin')
  redirect('/admin')
}