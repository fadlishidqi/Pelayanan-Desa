import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  LogOut, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  ArrowRight,
  Filter
} from 'lucide-react'
import { signOut } from '@/app/auth/actions'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Security Check (Wajib Admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect('/dashboard') 
  }

  // 2. Ambil Statistik
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: requestCount } = await supabase.from('service_requests').select('*', { count: 'exact', head: true })
  const { count: pendingCount } = await supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'submitted')

  // 3. Ambil Daftar Permohonan
  const { data: requests, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      users (full_name, nik, email)
    `)
    .order('submitted_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500 bg-red-50">Error: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-blue-100 selection:text-blue-900">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px]"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-100/40 rounded-full mix-blend-multiply filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* HEADER BAR */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <div className="p-2 bg-blue-600 rounded-lg shadow-md shadow-blue-500/20 text-white">
                 <ShieldAlert className="w-5 h-5" />
               </div>
               Admin Dashboard
             </h1>
             <p className="text-slate-500 text-sm mt-1 ml-11">Pusat Kontrol Layanan Desa Pondok</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-500 gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                System Active
             </div>
             <form action={signOut}>
                <button className="flex items-center gap-2 bg-white border border-red-100 hover:bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow">
                    <LogOut className="w-4 h-4"/> Keluar
                </button>
             </form>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            label="Total Warga" 
            value={userCount || 0} 
            icon={Users} 
            color="bg-blue-500" 
            subColor="bg-blue-50 text-blue-600"
          />
          <StatCard 
            label="Total Surat Masuk" 
            value={requestCount || 0} 
            icon={FileText} 
            color="bg-purple-500" 
            subColor="bg-purple-50 text-purple-600"
          />
          <StatCard 
            label="Perlu Verifikasi" 
            value={pendingCount || 0} 
            icon={Clock} 
            color="bg-amber-500" 
            subColor="bg-amber-50 text-amber-600"
            alert={pendingCount ? true : false}
          />
        </div>

        {/* CONTENT SECTION */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
           
           {/* Table Controls */}
           <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Daftar Permohonan</h2>
                <p className="text-slate-500 text-sm">Kelola pengajuan surat dari warga.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari nama / NIK..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
                 <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                    <Filter className="w-4 h-4" />
                 </button>
              </div>
           </div>

           {/* LIST DATA */}
           {(!requests || requests.length === 0) ? (
              <div className="p-16 text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-700">Belum Ada Data</h3>
                 <p className="text-slate-500">Belum ada warga yang mengajukan surat.</p>
              </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pemohon</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Layanan</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                         <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 bg-white/40">
                      {requests.map((req: any) => (
                         <tr key={req.id} className="group hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                     {req.users?.full_name?.charAt(0) || '?'}
                                  </div>
                                  <div>
                                     <div className="font-bold text-slate-800 text-sm">{req.users?.full_name || 'Tanpa Nama'}</div>
                                     <div className="text-xs text-slate-500">NIK: {req.users?.nik || '-'}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="text-sm font-medium text-slate-700">{req.service_type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <div className="flex items-center text-xs text-slate-500 gap-1.5 bg-white border border-slate-100 px-2.5 py-1 rounded-md w-fit">
                                  <Clock className="w-3 h-3" />
                                  {new Date(req.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                               </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <StatusBadge status={req.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                  
                                  {/* Print Button (Only Verified) */}
                                  {req.status === 'verified' && (
                                     <Link 
                                       href={`/print/${req.id}`} 
                                       target="_blank"
                                       className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
                                       title="Cetak Surat"
                                     >
                                        <Printer className="w-4 h-4" />
                                     </Link>
                                  )}

                                  {/* Detail Button */}
                                  <Link 
                                    href={`/admin/verify/${req.id}`}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                                  >
                                     Proses <ArrowRight className="w-3 h-3" />
                                  </Link>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 pb-8">
           &copy; {new Date().getFullYear()} Sistem Informasi Desa Pondok
        </p>

      </div>
    </div>
  )
}

// --- KOMPONEN KECIL ---

function StatCard({ label, value, icon: Icon, color, subColor, alert }: any) {
   return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
         {alert && (
            <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
         )}
         <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3.5 rounded-xl ${subColor} group-hover:scale-110 transition-transform duration-300`}>
               <Icon className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
               <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-1">{label}</p>
            </div>
         </div>
         {/* Decorative Blob */}
         <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${color}`}></div>
      </div>
   )
}

function StatusBadge({ status }: { status: string }) {
   if (status === 'submitted') {
      return (
         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Menunggu
         </span>
      )
   }
   if (status === 'verified') {
      return (
         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
         </span>
      )
   }
   if (status === 'rejected') {
      return (
         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
            <XCircle className="w-3.5 h-3.5" /> Ditolak
         </span>
      )
   }
   return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">
         {status}
      </span>
   )
}