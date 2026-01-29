import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { FileText, Lock, ArrowLeft, ExternalLink } from 'lucide-react'

export default async function RequestDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params;
  const supabase = await createClient()

  // Ambil detail request + dokumen terkait
  const { data: request } = await supabase
    .from('service_requests')
    .select(`
      *,
      request_details (*),
      documents (*)
    `)
    .eq('id', params.id)
    .single()

  if (!request) return notFound()

  // --- LOGIKA PROTEKSI AKSES ---
  // Jika status masih 'submitted' atau belum 'verified'/'completed', 
  // kita batasi tampilannya atau arahkan kembali.
  const isAccessible = request.status === 'verified' || request.status === 'completed';

  // Helper URL Dokumen (Sama dengan logic di halaman Admin)
  const getDocUrl = (path: string) => {
    if (!path) return "#";
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const encodedPath = cleanPath.split('/').map(s => encodeURIComponent(s)).join('/');
    return supabase.storage.from('documents').getPublicUrl(encodedPath).data.publicUrl;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-4">
          Detail Pengajuan: {request.service_type}
        </h1>
        <p className="text-slate-500 text-sm">ID Tiket: {request.id}</p>
      </div>

      {/* Status Card */}
      <div className={`rounded-2xl p-6 mb-6 border shadow-sm ${
        request.status === 'verified' ? 'bg-green-50 border-green-100' : 
        request.status === 'rejected' ? 'bg-red-50 border-red-100' : 
        'bg-amber-50 border-amber-100'
      }`}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Status Terkini</h3>
        <div className="flex items-center justify-between">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm
            ${request.status === 'verified' || request.status === 'completed' ? 'bg-green-600 text-white' : 
              request.status === 'rejected' ? 'bg-red-600 text-white' : 
              'bg-amber-500 text-white'}`}>
            {request.status.toUpperCase() === 'SUBMITTED' ? 'MENUNGGU VERIFIKASI' : request.status.toUpperCase()}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Update: {new Date(request.updated_at).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Informasi Pengajuan */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200 mb-6">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Data Formulir</h3>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-y-4">
            {request.request_details?.[0]?.form_data && 
              Object.entries(request.request_details[0].form_data).map(([key, value]) => (
              <div key={key} className="border-b border-slate-100 pb-2">
                <dt className="text-xs font-bold text-slate-400 uppercase">{key.replace(/_/g, ' ')}</dt>
                <dd className="text-slate-800 font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Dokumen Lampiran - DIBATASI JIKA BELUM VERIFIED */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Dokumen Hasil / Lampiran</h3>
          {!isAccessible && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
              <Lock className="w-3 h-3" /> TERKUNCI
            </span>
          )}
        </div>

        {!isAccessible ? (
          /* Tampilan saat Terkunci */
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-800">Dokumen Belum Tersedia</h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
              Anda baru dapat mengakses dokumen setelah permohonan Anda diverifikasi oleh petugas.
            </p>
          </div>
        ) : (
          /* Tampilan saat sudah Terverifikasi */
          <ul className="divide-y divide-slate-100">
            {request.documents?.map((doc: any) => (
              <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 capitalize">{doc.file_type.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Diunggah: {new Date(doc.uploaded_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <a 
                  href={getDocUrl(doc.file_url)}
                  target="_blank"
                  className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200"
                >
                  Lihat <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}