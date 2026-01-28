'use client' // WAJIB: Agar bisa ganti bahasa

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client' // Gunakan Client Supabase
import { useLanguage } from '@/context/LanguageContext' // Hook Bahasa
import LanguageSwitcher from '@/components/LanguageSwitcher' // Tombol Ganti Bahasa
import { useSearchParams } from 'next/navigation' // Untuk baca success message
import Link from 'next/link'
import { signOut } from '@/app/auth/actions'
import { 
  CreditCard, Users, Baby, FileWarning, Truck, ShieldCheck, 
  Clock, FileText, ChevronRight, ExternalLink, LogOut, ShieldCheck as IconSuccess
} from 'lucide-react'

export default function DashboardPage() {
  const { t } = useLanguage() // Panggil Translate
  const searchParams = useSearchParams()
  const successMessage = searchParams.get('success')
  
  // State untuk Data
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch Data di Sisi Client
  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      // 1. Ambil User
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // 2. Ambil Riwayat Pengajuan
        const { data: reqs } = await supabase
          .from('service_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false })
        
        setRequests(reqs || [])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  // Ambil nama depan
  const username = user?.email?.split('@')[0] || 'Warga'

  // Konfigurasi Menu Layanan (Di dalam component agar bisa ditranslate)
  const services = [
    { title: t('srv_ktp'),   desc: t('srv_ktp_desc'),   href: '/dashboard/service/ktp',        icon: CreditCard,  color: 'text-blue-600',   bg: 'bg-blue-50' },
    { title: t('srv_kk'),    desc: t('srv_kk_desc'),    href: '/dashboard/service/kk',         icon: Users,       color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: t('srv_birth'), desc: t('srv_birth_desc'), href: '/dashboard/service/birth',      icon: Baby,        color: 'text-pink-600',   bg: 'bg-pink-50' },
    { title: t('srv_death'), desc: t('srv_death_desc'), href: '/dashboard/service/death',      icon: FileWarning, color: 'text-red-600',    bg: 'bg-red-50' },
    { title: t('srv_move'),  desc: t('srv_move_desc'),  href: '/dashboard/service/relocation', icon: Truck,       color: 'text-green-600',  bg: 'bg-green-50' },
    { title: t('srv_skck'),  desc: t('srv_skck_desc'),  href: '/dashboard/service/skck',       icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-8 px-6 md:px-10 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Sapaan User */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('dash_hello')}, <span className="text-blue-600 capitalize">{username}</span> 👋
            </h1>
            <p className="text-gray-500">{t('dash_welcome_msg')}</p>
          </div>

          {/* Group Kanan: Status & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            
            <LanguageSwitcher /> {/* Tombol Ganti Bahasa */}

            {/* Badge Status */}
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {t('status_online')}
            </div>

            {/* Tombol Logout */}
            <form action={signOut}>
              <button 
                type="submit"
                className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                title="Keluar dari aplikasi"
              >
                <LogOut className="w-4 h-4" />
                {t('btn_logout')}
              </button>
            </form>

          </div>

        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 space-y-10">

        {/* --- NOTIFIKASI SUKSES --- */}
        {successMessage && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-3 shadow-sm">
            <IconSuccess className="w-5 h-5 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* --- GRID LAYANAN --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">{t('choose_service')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link 
                key={service.title} 
                href={service.href}
                className="group relative p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${service.bg}`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* --- RIWAYAT PENGAJUAN --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gray-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">{t('history_title')}</h2>
          </div>

          {(!requests || requests.length === 0) ? (
            <div className="p-12 rounded-xl bg-white border border-dashed border-gray-300 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('history_empty')}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('tbl_service')}</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('tbl_date')}</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('tbl_status')}</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('tbl_action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{req.service_type}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">#{req.id.slice(0, 8)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(req.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                            ${req.status === 'completed' || req.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' : 
                              req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            
                            {/* Translate Status */}
                            {req.status === 'submitted' ? t('status_processing') : 
                             req.status === 'verified' ? t('status_approved') : 
                             req.status === 'rejected' ? t('status_rejected') : req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {/* TOMBOL LIHAT SURAT */}
                          <Link 
                            href={`/print/${req.id}`}
                            target="_blank" 
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-300 bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                          >
                            {t('btn_view_letter')} <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}