'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitBirth(formData: FormData) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return redirect('/login')

    const files = formData.getAll('documents') as File[]
    
    // Validasi File
    if (!files || files.length === 0 || files[0].size === 0) {
      return redirect('/dashboard/service/birth?error=Mohon upload dokumen persyaratan')
    }

    const dataAnak = {
      child_name: formData.get('child_name'),
      birth_place: formData.get('birth_place'),
      birth_date: formData.get('birth_date'),
      gender: formData.get('gender'),
      father_name: formData.get('father_name'),
      mother_name: formData.get('mother_name'),
    }

    // Insert Request
    const { data: request, error: reqError } = await supabase
      .from('service_requests')
      .insert({
        user_id: user.id,
        service_type: 'Akta Kelahiran',
        status: 'submitted',
      })
      .select()
      .single()

    if (reqError) throw new Error(reqError.message)

    // Insert Detail
    await supabase.from('request_details').insert({
      request_id: request.id,
      form_data: dataAnak
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
            file_type: 'Lampiran Lahir'
          })
        }
      }
    }

  } catch (err: any) {
    // Redirect dengan pesan error yang bersih
    return redirect(`/dashboard/service/birth?error=${encodeURIComponent(err.message || 'Terjadi kesalahan sistem')}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=Pengajuan Akta Lahir Berhasil')
}