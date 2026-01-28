import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // --- BAGIAN INI KITA UBAH UNTUK CEK ERROR ---
  const { data: userProfile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // CETAK HASILNYA DI TERMINAL VS CODE
  console.log("=== DEBUG ADMIN ===")
  console.log("Email Login:", user.email)
  console.log("Data Profil Database:", userProfile)
  console.log("Error Database:", error)
  console.log("===================")
  // ----------------------------------------------

  // Cek apakah role BUKAN admin
  // (Perhatikan tanda ? di userProfile?.role untuk mencegah error jika data null)
  if (!userProfile || userProfile.role !== 'admin') {
     // ... (Kode tampilan akses ditolak biarkan sama seperti sebelumnya)
     return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
            <p>Data Role Anda: <b>{userProfile?.role || 'Tidak Ditemukan (NULL)'}</b></p>
            <p>Error: {error?.message || 'Tidak ada error'}</p>
            <Link href="/dashboard" className="text-blue-600 mt-4 underline">Kembali</Link>
        </div>
     )
  }

  return (
    // ... (Kode return layout admin yang asli biarkan di sini)
    <div className="min-h-screen bg-gray-100">
        {/* Navbar dll */}
        {children}
    </div>
  )
}