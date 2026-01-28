'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitKtp(formData: FormData) {
  const supabase = await createClient()

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Ambil Data Form
  const reason = formData.get('reason') as string
  // AMBIL BANYAK FILE (gunakan getAll)
  const files = formData.getAll('documents') as File[]

  // Validasi sederhana
  if (!files || files.length === 0 || files[0].size === 0) {
    return redirect('/service/ktp?error=Minimal upload 1 dokumen')
  }

  // 3. Buat Request Baru di Database
  const { data: request, error: reqError } = await supabase
    .from('service_requests')
    .insert({
      user_id: user.id,
      service_type: 'Pembuatan KTP',
      status: 'submitted',
    })
    .select()
    .single()

  if (reqError) {
    return redirect(`/service/ktp?error=${encodeURIComponent(reqError.message)}`)
  }

  // 4. Simpan Detail Form (JSON)
  await supabase.from('request_details').insert({
    request_id: request.id,
    form_data: { reason: reason } // Simpan alasan pengajuan
  })

  // 5. UPLOAD SEMUA FILE (Looping)
  for (const file of files) {
    if (file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${request.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload ke Storage Supabase
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (!uploadError) {
        // Jika sukses upload, simpan linknya di tabel documents
        await supabase.from('documents').insert({
          request_id: request.id,
          file_url: fileName,
          file_type: 'Lampiran KTP'
        })
      }
    }
  }

  // 6. Selesai
  revalidatePath('/dashboard')
  redirect('/dashboard?success=Pengajuan KTP Berhasil')
}