'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitRelocation(formData: FormData) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return redirect('/login')

    const files = formData.getAll('documents') as File[]

    // Validasi File
    if (!files || files.length === 0 || files[0].size === 0) {
      return redirect('/dashboard/service/relocation?error=Mohon upload dokumen persyaratan')
    }

    // Ambil Data Pindah
    const dataPindah = {
      move_reason: formData.get('move_reason'),
      destination_address: formData.get('destination_address'),
      family_count: formData.get('family_count'),
    }

    // Insert Request Utama
    const { data: request, error: reqError } = await supabase
      .from('service_requests')
      .insert({
        user_id: user.id,
        service_type: 'Surat Pindah',
        status: 'submitted',
      })
      .select()
      .single()

    if (reqError) throw new Error(reqError.message)

    // Insert Detail
    await supabase.from('request_details').insert({
      request_id: request.id,
      form_data: dataPindah
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
            file_type: 'Lampiran Pindah'
          })
        }
      }
    }

  } catch (err: any) {
    return redirect(`/dashboard/service/relocation?error=${encodeURIComponent(err.message || 'Terjadi kesalahan sistem')}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=Pengajuan Surat Pindah Berhasil')
}