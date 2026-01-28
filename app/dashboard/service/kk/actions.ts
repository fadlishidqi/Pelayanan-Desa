'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitKK(formData: FormData) {
  const supabase = await createClient()

  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Ambil Data
  const reason = formData.get('reason') as string
  const files = formData.getAll('documents') as File[]

  // Validasi
  if (!files || files.length === 0 || files[0].size === 0) {
    return redirect('/services/kk?error=Minimal upload 1 dokumen')
  }

  // 3. Buat Request Baru (Kartu Keluarga)
  const { data: request, error: reqError } = await supabase
    .from('service_requests')
    .insert({
      user_id: user.id,
      service_type: 'Kartu Keluarga', // <--- Bedanya disini
      status: 'submitted',
    })
    .select()
    .single()

  if (reqError) {
    return redirect(`/services/kk?error=${encodeURIComponent(reqError.message)}`)
  }

  // 4. Simpan Detail Form
  await supabase.from('request_details').insert({
    request_id: request.id,
    form_data: { reason: reason }
  })

  // 5. Upload Loop
  for (const file of files) {
    if (file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${request.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (!uploadError) {
        await supabase.from('documents').insert({
          request_id: request.id,
          file_url: fileName,
          file_type: 'Lampiran KK'
        })
      }
    }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=Pengajuan KK Berhasil')
}