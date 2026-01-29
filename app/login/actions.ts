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
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')

  // 3. LOGIKA PENGALIHAN (REDIRECT)
  if (userData?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. Ambil data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const address = formData.get('address') as string
  const nik = formData.get('nik') as string // Tambahkan NIK

  // 2. Validasi Sederhana
  // Redirect error ke /register (BUKAN /login)
  if (password.length < 6) return redirect('/register?message=Password minimal 6 karakter')
  if (!fullName) return redirect('/register?message=Nama Lengkap wajib diisi')
  if (!address) return redirect('/register?message=Alamat wajib diisi')
  if (!nik) return redirect('/register?message=NIK wajib diisi')

  // 3. Daftar ke Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        address: address,
        nik: nik, // Simpan NIK juga ke metadata jika perlu
      },
    },
  })

  if (error) {
    // Redirect error ke /register
    return redirect(`/register?message=${encodeURIComponent(error.message)}`)
  }

  // Jika sukses, baru lempar ke Login
  return redirect('/login?message=Akun berhasil dibuat! Silakan Login.')
}