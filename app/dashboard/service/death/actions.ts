'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitDeath(formData: FormData) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return redirect('/login')

    const files = formData.getAll('documents') as File[]

    // Validasi File
    if (!files || files.length === 0 || files[0].size === 0) {
      return redirect('/dashboard/service/death?error=Mohon upload dokumen persyaratan')
    }

    // Ambil Data Lengkap Almarhum
    const dataKematian = {
      deceased_name: formData.get('deceased_name'),
      deceased_nik: formData.get('deceased_nik'),
      deceased_age: formData.get('deceased_age'),
      death_date: formData.get('death_date'),
      death_time: formData.get('death_time'),
      death_place: formData.get('death_place'),
      death_cause: formData.get('death_cause'),
      relation: formData.get('relation'),
    }

    // Insert Request Utama
    const { data: request, error: reqError } = await supabase
      .from('service_requests')
      .insert({
        user_id: user.id,
        service_type: 'Akta Kematian',
        status: 'submitted',
      })
      .select()
      .single()

    if (reqError) throw new Error(reqError.message)

    // Insert Detail (Data Jenazah)
    await supabase.from('request_details').insert({
      request_id: request.id,
      form_data: dataKematian
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
            file_type: 'Lampiran Kematian'
          })
        }
      }
    }

  } catch (err: any) {
    return redirect(`/dashboard/service/death?error=${encodeURIComponent(err.message || 'Terjadi kesalahan sistem')}`)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=Laporan Kematian Berhasil Dikirim')
}