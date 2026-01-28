import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
// Pastikan import ini mengarah ke file tempat Anda menyimpan fungsi updateStatus tadi
import { updateStatus } from './actions' 
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Paperclip, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  MapPin,
  FileCheck,
  ExternalLink
} from 'lucide-react'

export default async function VerifyPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params;
  const supabase = await createClient()

  // 1. Cek Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Ambil Data Lengkap
  const { data: req } = await supabase
    .from('service_requests')
    .select(`
      *,
      users (*),
      request_details (*),
      documents (*)
    `)
    .eq('id', params.id)
    .single()

  if (!req) return notFound()

  // Helper URL Dokumen
  const getDocUrl = (path: string) => {
    return supabase.storage.from('documents').getPublicUrl(path).data.publicUrl
  }

  // Ambil data form detail (JSON)
  const formData = req.request_details[0]?.form_data || {}

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-blue-100 selection:text-blue-900">
      
      {/* BACKGROUND DECORATION (Blob Halus) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/60 rounded-full mix-blend-multiply filter blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-100/60 rounded-full mix-blend-multiply filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* HEADER: Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Verifikasi Permohonan
              <span className="text-xs font-mono font-normal text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded-md">
                ID: {req.id.slice(0, 8)}...
              </span>
            </h1>
            <p className="text-slate-500 text-sm">Tinjau kelengkapan data warga.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI: USER PROFILE & STATUS --- */}
          <div className="space-y-6">
            
            {/* Kartu Profil Warga */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-lg shadow-slate-200/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-blue-500/20">
                  {req.users?.full_name?.charAt(0)}
                </div>
                <h2 className="text-lg font-bold text-slate-800 capitalize">{req.users?.full_name}</h2>
                <p className="text-slate-500 text-sm mb-6">{req.users?.email}</p>
                
                <div className="w-full space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <User className="w-4 h-4 text-blue-500" />
                    <div>
                        <span className="block text-xs text-slate-400 font-bold uppercase">NIK</span>
                        {req.users?.nik || '-'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 pt-2 border-t border-slate-200">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <div>
                        <span className="block text-xs text-slate-400 font-bold uppercase">Alamat</span>
                        {req.users?.address || '-'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 pt-2 border-t border-slate-200">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                        <span className="block text-xs text-slate-400 font-bold uppercase">Tgl Request</span>
                        {new Date(req.submitted_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Status Saat Ini */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Status Terkini</h3>
               <div className={`p-4 rounded-xl border flex items-center gap-3 
                  ${req.status === 'verified' ? 'bg-green-50 border-green-200 text-green-700' : 
                    req.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' : 
                    'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  
                  {req.status === 'verified' ? <CheckCircle2 className="w-8 h-8" /> : 
                   req.status === 'rejected' ? <XCircle className="w-8 h-8" /> : 
                   <FileCheck className="w-8 h-8" />}
                  
                  <div>
                    <div className="font-bold text-lg capitalize">{req.status === 'submitted' ? 'Menunggu' : req.status}</div>
                    <div className="text-xs opacity-80 font-medium">
                      {req.status === 'verified' ? 'Surat telah disetujui.' : 
                       req.status === 'rejected' ? 'Permohonan ditolak.' : 
                       'Menunggu tindakan Admin.'}
                    </div>
                  </div>
               </div>
            </div>

          </div>

          {/* --- KOLOM KANAN: DETAIL FORM & DOKUMEN --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Detail Isi Form */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-lg shadow-slate-200/50">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Data {req.service_type}</h3>
                    <p className="text-slate-500 text-xs">Rincian data yang diinput oleh pemohon</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="group">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 group-hover:text-blue-500 transition-colors">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <div className="text-slate-800 font-medium text-base border-b border-slate-200 pb-1 break-words">
                        {String(value)}
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 2. Lampiran Dokumen */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Lampiran Dokumen</h3>
               </div>

               {req.documents.length === 0 ? (
                 <div className="p-6 bg-slate-50 rounded-xl text-center border border-dashed border-slate-300">
                    <p className="text-slate-500 italic text-sm">Tidak ada dokumen yang diupload.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {req.documents.map((doc: any) => (
                      <div key={doc.id} className="group flex items-center p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
                         <div className="p-3 bg-slate-100 rounded-xl mr-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FileText className="w-6 h-6 text-slate-500" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate capitalize">
                                {doc.file_type.replace(/_/g, ' ')}
                            </p>
                            <a 
                              href={getDocUrl(doc.file_url)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                            >
                              Buka File <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>

            {/* 3. TOMBOL AKSI (Hanya muncul jika status submitted) */}
            {req.status === 'submitted' && (
              <div className="sticky bottom-6 z-20">
                  <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl shadow-blue-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="text-center sm:text-left pl-2">
                        <h3 className="font-bold text-slate-800">Konfirmasi Tindakan</h3>
                        <p className="text-xs text-slate-500">Pilih keputusan untuk permohonan ini.</p>
                     </div>
                     <div className="flex gap-3 w-full sm:w-auto">
                        
                        {/* TOMBOL TOLAK -> Panggil updateStatus('rejected') */}
                        <form action={updateStatus.bind(null, req.id, 'rejected')} className="w-full sm:w-auto">
                          <button className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Tolak
                          </button>
                        </form>
                        
                        {/* TOMBOL TERIMA -> Panggil updateStatus('verified') */}
                        <form action={updateStatus.bind(null, req.id, 'verified')} className="w-full sm:w-auto">
                          <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Setujui
                          </button>
                        </form>

                     </div>
                  </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}