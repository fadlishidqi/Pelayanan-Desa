'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitSKCK(formData: FormData) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return redirect('/login')

    const files = formData.getAll('documents') as File[]

    // Validasi File
    if (!files || files.length === 0 || files[0].size === 0) {
      return redirect('/dashboard/service/skck?error=Mohon upload dokumen persyaratan')
    }

    // Ambil Data Form
    const necessity = formData.get('necessity') as string // Keperluan

    // Insert Request Utama
    const { data: request, error: reqError } = await supabase
      .from('service_requests')
      .insert({
        user_id: user.id,
        service_type: 'Pengantar SKCK',
        status: 'submitted',
      })
      .select()
      .single()

    if (reqError) throw new Error(reqError.message)

    // Insert Detail
    await supabase.from('request_details').insert({
      request_id: request.id,
      form_data: { necessity: necessity } // Simpan keperluan dalam JSON
    })

    // Upload Files
    for (const file of files) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${request.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: upErr } = await supabase.storage.from('documents').upload(fileName, file)
        
        if (!upErr) {
          await supabase.from('documents').insert({
            request_id: request.id,
            file_url: fileName,
            file_type: 'Lampiran SKCK'
          })
        }
      }
    }

  } catch (err: any) {
    return redirect(`/dashboard/service/skck?error=${encodeURIComponent(err.message || 'Terjadi kesalahan sistem')}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=Pengantar SKCK Berhasil Diajukan')
}