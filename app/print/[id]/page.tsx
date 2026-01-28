import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'

export default async function PrintSuratPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params;
  const supabase = await createClient()

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Ambil Data Request Lengkap
  const { data: request } = await supabase
    .from('service_requests')
    .select(`
      *,
      users (*),
      request_details (*)
    `)
    .eq('id', params.id)
    .single()

  if (!request) return notFound()

  // 3. Logika Keamanan
  const { data: isAdmin } = await supabase.rpc('is_admin')
  const isOwner = request.user_id === user.id

  if (!isAdmin && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold text-red-600">Akses Ditolak</h1>
      </div>
    )
  }

  // 4. Helper Data
  const detail = request.request_details?.[0]?.form_data || {}
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    // Gunakan max-w A4, dan font serif (Times New Roman style)
    <div className="max-w-[210mm] mx-auto bg-white p-8 min-h-screen text-black font-serif text-base leading-normal">
      
      {/* --- TOMBOL PRINT (Hidden saat diprint) --- */}
      <div className="print:hidden mb-6 flex justify-between bg-gray-50 p-3 rounded border border-gray-300 items-center">
        <span className="text-sm font-sans text-gray-600">Preview Cetak (A4)</span>
        <button 
          id="print-btn" 
          className="bg-gray-900 text-white px-4 py-2 rounded font-sans hover:bg-black text-sm flex items-center gap-2"
        >
          🖨️ Cetak
        </button>
      </div>

      {/* ================== KOP SURAT ================== */}
      <div className="text-center border-b-[3px] border-double border-black pb-3 mb-6">
        <h3 className="text-lg font-bold uppercase tracking-wide">Pemerintah Kabupaten Wonogiri</h3>
        <h2 className="text-xl font-bold uppercase tracking-wide">Kecamatan Ngadirojo</h2>
        <h1 className="text-2xl font-extrabold uppercase tracking-widest mt-1">Desa Pondok</h1>
        <p className="text-sm italic mt-1">Jl. Jendral Sudirman No. 147 A</p>
      </div>

      {/* ================== JUDUL SURAT ================== */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold underline uppercase tracking-wider">
          {request.service_type === 'SKCK' ? 'SURAT PENGANTAR SKCK' : 
           request.service_type === 'Relocation' ? 'SURAT KETERANGAN PINDAH' :
           request.service_type === 'Birth Certificate' ? 'SURAT KETERANGAN KELAHIRAN' :
           request.service_type === 'Death Certificate' ? 'SURAT KETERANGAN KEMATIAN' :
           `SURAT PENGANTAR ${request.service_type.toUpperCase()}`}
        </h2>
        <p className="text-sm">Nomor: 470 / {request.id.slice(0,4)} / PDP / {new Date().getFullYear()}</p>
      </div>

      {/* ================== ISI SURAT ================== */}
      <div className="text-justify leading-relaxed">
        <p className="mb-4 indent-8">
          Yang bertanda tangan di bawah ini Kepala Desa Pondok, Kecamatan Ngadirojo, Kabupaten Wonogiri, menerangkan dengan sebenarnya bahwa:
        </p>

        {/* --- LOGIKA TAMPILAN PER LAYANAN --- */}

        {/* KASUS A: AKTA KELAHIRAN */}
        {request.service_type === 'Birth Certificate' ? (
           <>
             <p className="mb-2">Telah lahir seorang anak {detail.Jenis_Kelamin_Anak}:</p>
             <table className="w-full mb-4 ml-4">
              <tbody>
                <tr className="align-top"><td className="w-48 py-1">Nama Anak</td><td>:</td><td className="font-bold uppercase">{detail.Nama_Anak}</td></tr>
                <tr className="align-top"><td className="py-1">Tempat/Tgl Lahir</td><td>:</td><td>{detail.Tempat_Lahir}, {formatDate(detail.Tanggal_Lahir)}</td></tr>
                <tr className="align-top"><td className="py-1">Anak dari (Ayah)</td><td>:</td><td>{detail.Nama_Ayah}</td></tr>
                <tr className="align-top"><td className="py-1">dan (Ibu)</td><td>:</td><td>{detail.Nama_Ibu}</td></tr>
              </tbody>
            </table>
            <p className="indent-8">Surat keterangan ini dibuat atas permintaan orang tua kandung untuk keperluan penerbitan <b>Akta Kelahiran</b> di Dinas Kependudukan dan Pencatatan Sipil.</p>
           </>

        /* KASUS B: SURAT KEMATIAN */
        ) : request.service_type === 'Death Certificate' ? (
            <>
             <p className="mb-2">Telah meninggal dunia seorang warga kami:</p>
             <table className="w-full mb-4 ml-4">
              <tbody>
                <tr className="align-top"><td className="w-48 py-1">Nama Almarhum</td><td>:</td><td className="font-bold uppercase">{detail.Nama_Almarhum}</td></tr>
                <tr className="align-top"><td className="py-1">NIK</td><td>:</td><td>{detail.NIK_Almarhum}</td></tr>
                <tr className="align-top"><td className="py-1">Umur</td><td>:</td><td>{detail.Umur} Tahun</td></tr>
                <tr className="align-top"><td className="py-1">Tanggal Meninggal</td><td>:</td><td>{formatDate(detail.Tanggal_Meninggal)}, Pukul {detail.Waktu_Meninggal} WIB</td></tr>
                <tr className="align-top"><td className="py-1">Tempat</td><td>:</td><td>{detail.Tempat_Meninggal}</td></tr>
                <tr className="align-top"><td className="py-1">Penyebab</td><td>:</td><td>{detail.Penyebab}</td></tr>
              </tbody>
            </table>
            <p className="indent-8">Surat ini dibuat berdasarkan laporan dari saudara <b>{request.users?.full_name}</b> selaku {detail.Hubungan_Pelapor} almarhum/almarhumah.</p>
           </>

        /* KASUS C: SKCK */
        ) : request.service_type === 'SKCK' ? (
            <>
             <table className="w-full mb-4 ml-4">
              <tbody>
                <tr className="align-top"><td className="w-48 py-1">Nama Lengkap</td><td className="w-4">:</td><td className="font-bold uppercase">{request.users?.full_name}</td></tr>
                <tr className="align-top"><td className="py-1">NIK</td><td>:</td><td>{request.users?.nik || '-'}</td></tr>
                <tr className="align-top"><td className="py-1">Jenis Kelamin</td><td>:</td><td>Laki-laki / Perempuan</td></tr>
                <tr className="align-top"><td className="py-1">Alamat</td><td>:</td><td>Desa Pondok, Kec. Ngadirojo</td></tr>
              </tbody>
            </table>
            <p className="mb-3 text-justify indent-8">
              Orang tersebut di atas adalah benar-benar warga penduduk kami dan berdasarkan catatan data yang ada pada kami, yang bersangkutan:
            </p>
            <div className="text-center font-bold mb-3 uppercase border-y border-black py-1 mx-16 tracking-widest">
                BERKELAKUAN BAIK
            </div>
            <p className="mb-2 indent-8">
                Dan tidak pernah tersangkut perkara Polisi / Kriminalitas di desa kami. Surat pengantar ini diberikan untuk keperluan:
            </p>
            <p className="font-bold ml-8 mb-4 uppercase">
                &quot; {detail.Keperluan} &quot;
            </p>
           </>

        /* KASUS D: SURAT PINDAH (RELOCATION) */
        ) : request.service_type === 'Relocation' ? (
            <>
             <table className="w-full mb-4 ml-4">
              <tbody>
                <tr className="align-top"><td className="w-48 py-1">Nama Lengkap</td><td className="w-4">:</td><td className="font-bold uppercase">{request.users?.full_name}</td></tr>
                <tr className="align-top"><td className="py-1">NIK</td><td>:</td><td>{request.users?.nik || '-'}</td></tr>
                <tr className="align-top"><td className="py-1">Alamat Asal</td><td>:</td><td>Desa Pondok, Kec. Ngadirojo</td></tr>
              </tbody>
            </table>
            <p className="mb-2">Bermaksud mengajukan permohonan <b>PINDAH DOMISILI</b> ke alamat tujuan:</p>
            <div className="border border-black p-3 mb-4 font-bold bg-gray-50/50 uppercase text-sm">
                {detail.Alamat_Tujuan}
            </div>
            <table className="w-full mb-4 ml-4">
                <tbody>
                    <tr><td className="w-48">Alasan Pindah</td><td>:</td><td>{detail.Alasan_Pindah}</td></tr>
                    <tr><td>Jumlah Pengikut</td><td>:</td><td>{detail.Jumlah_Pengikut}</td></tr>
                </tbody>
            </table>
           </>

        /* KASUS E: DEFAULT (KTP, KK, DLL) */
        ) : (
          <>
            <table className="w-full mb-4 ml-4">
              <tbody>
                <tr className="align-top"><td className="w-48 py-1">Nama Lengkap</td><td className="w-4">:</td><td className="font-bold uppercase">{request.users?.full_name}</td></tr>
                <tr className="align-top"><td className="py-1">NIK</td><td>:</td><td>{request.users?.nik || '-'}</td></tr>
                <tr className="align-top"><td className="py-1">Alamat</td><td>:</td><td>Desa Pondok, Kec. Ngadirojo</td></tr>
                <tr className="align-top"><td className="py-1">Keperluan</td><td>:</td><td>Pengurusan {request.service_type}</td></tr>
              </tbody>
            </table>
            <p className="mb-4 indent-8">
              Orang tersebut di atas adalah benar-benar warga penduduk kami yang berdomisili di alamat tersebut. Surat pengantar ini diberikan untuk dipergunakan sebagaimana mestinya.
            </p>
          </>
        )}

        <p className="mt-4 indent-8">
          Demikian surat keterangan ini dibuat untuk dapat dipergunakan sesuai dengan peruntukannya.
        </p>
      </div>

      {/* ================== TANDA TANGAN ================== */}
      <div className="mt-12 flex justify-end">
        <div className="text-center w-64">
          <p className="mb-1">Pondok, {today}</p>
          <p className="mb-20 font-bold">Kepala Desa Pondok</p>
          <p className="font-bold underline uppercase">Sularno</p>
        </div>
      </div>

      {/* Script Auto Print */}
      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('print-btn').addEventListener('click', () => window.print());
      `}} />
      
      {/* CSS Layout Print: Margin 2.5cm, Hide Button */}
      <style>{`
        @media print {
          @page { margin: 2cm 2.5cm; size: A4; }
          body { background: white; color: black; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}