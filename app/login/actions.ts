'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Proses Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent('Email atau Password salah')}`)
  }

  if (!data.user) {
    return redirect('/login?message=Terjadi kesalahan sistem')
  }

  // 2. CEK ROLE (JABATAN) USER
  // Ambil data dari tabel 'users' berdasarkan ID yang login
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')

  // 3. LOGIKA PENGALIHAN (REDIRECT)
  if (userData?.role === 'admin') {
    // Jika Admin -> Masuk ke Dashboard Admin
    redirect('/admin')
  } else {
    // Jika Warga (User) -> Masuk ke Dashboard Warga
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. Ambil semua data dari Form
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string // Baru
  const address = formData.get('address') as string   // Baru

  // 2. Validasi Sederhana
  if (password.length < 6) return redirect('/login?message=Password minimal 6 karakter')
  if (!fullName) return redirect('/login?message=Nama Lengkap wajib diisi untuk pendaftaran')
  if (!address) return redirect('/login?message=Alamat wajib diisi untuk pendaftaran')

  // 3. Daftar ke Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Kirim data tambahan (Metadata) ke Trigger Database
      data: {
        full_name: fullName,
        address: address,
      },
    },
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/login?message=Akun berhasil dibuat! Silakan Login.')
}