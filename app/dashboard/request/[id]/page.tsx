import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
          &larr; Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Detail Pengajuan: {request.service_type}
        </h1>
        <p className="text-gray-500">ID Tiket: {request.id}</p>
      </div>

      {/* Status Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status Terkini</h3>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-bold
            ${request.status === 'completed' ? 'bg-green-100 text-green-800' : 
              request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'}`}>
            {request.status.toUpperCase()}
          </span>
          <span className="ml-4 text-sm text-gray-500">
            Terakhir diupdate: {new Date(request.updated_at).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Informasi Pengajuan */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-6">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Data Formulir
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* Loop data JSON dari request_details */}
            {request.request_details?.[0]?.form_data && 
              Object.entries(request.request_details[0].form_data).map(([key, value]) => (
              <div key={key} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace('_', ' ')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {String(value)}
                </dd>
              </div>
            ))}
            
            {/* Catatan Admin jika ada */}
            {request.request_details?.[0]?.notes && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-yellow-50">
                <dt className="text-sm font-medium text-yellow-800">
                  Catatan Petugas
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {request.request_details[0].notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Dokumen Lampiran */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Dokumen Lampiran
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {request.documents?.map((doc: any) => (
            <li key={doc.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{doc.file_type || 'Dokumen'}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-xs text-gray-500">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
              </div>
              {/* Tombol Download/View (Perlu fungsi download nanti, sementara link dummy/text) */}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Tersimpan
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}