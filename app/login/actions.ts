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

  // 2. Cek Role User
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user?.id)
    .single()

  revalidatePath('/', 'layout')

  if (userData?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. AMBIL DATA DARI FORM (Pastikan nama sesuai dengan input di page.tsx)
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const address = formData.get('address') as string
  const nik = formData.get('nik') as string // <--- Wajib ada

  // 2. Validasi
  if (password.length < 6) return redirect('/register?message=Password minimal 6 karakter')
  if (!fullName) return redirect('/register?message=Nama Lengkap wajib diisi')
  if (!nik) return redirect('/register?message=NIK wajib diisi')
  if (!address) return redirect('/register?message=Alamat wajib diisi')

  // 3. DAFTAR KE SUPABASE (PENTING: Masukkan ke options -> data)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        address: address,
        nik: nik, // <--- Data ini yang akan dibaca oleh Trigger Database
      },
    },
  })

  if (error) {
    return redirect(`/register?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/login?message=Akun berhasil dibuat! Silakan Login.')
}