'use client'

import { signup } from '../login/actions' // Import signup dari folder login
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useSearchParams } from 'next/navigation'
import { Landmark, Mail, Lock, UserPlus, User, MapPin, CreditCard, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const { t } = useLanguage() 
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900 py-10">
      
      <div className="absolute top-5 right-5 z-50">
        <LanguageSwitcher />
      </div>

      {/* Background Animation (Sama dengan Login agar konsisten) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[500px] h-[500px] bg-blue-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="bg-white/90 border border-white rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden p-8">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 mb-3 text-white">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Akun</h2>
            <p className="text-slate-600 text-sm font-medium">Lengkapi data diri Anda untuk mengakses layanan</p>
          </div>

          <form className="space-y-4">
            
            {/* EMAIL & PASSWORD */}
            <div className="grid grid-cols-1 gap-4">
               <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input name="email" type="email" required placeholder={t('email_ph')} className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm font-medium" />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input name="password" type="password" required placeholder={t('password_ph')} className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="py-2">
               <div className="border-t border-slate-200"></div>
            </div>

            {/* DATA PRIBADI */}
             <div className="space-y-4">
                {/* INPUT NIK */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-500" />
                  </div>
                  <input name="nik" type="text" maxLength={16} required placeholder={t('lbl_nik') || "Nomor Induk Kependudukan (NIK)"} className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm font-medium" />
                </div>

                {/* INPUT NAMA */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input name="full_name" type="text" required placeholder={t('lbl_fullname')} className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm font-medium" />
                </div>

                {/* INPUT ALAMAT */}
                <div className="group relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-500" />
                  </div>
                  <textarea name="address" rows={2} required placeholder={t('lbl_address_ph')} className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm resize-none font-medium" />
                </div>
             </div>

            {/* ERROR MESSAGE */}
            {message && (
              <div className="p-3 text-sm text-center rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold animate-pulse">
                {message}
              </div>
            )}

            {/* BUTTONS */}
            <div className="pt-2 space-y-3">
              <button formAction={signup} className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                <span className="flex items-center gap-2">{t('register_btn')} <UserPlus className="w-4 h-4"/></span>
              </button>

              <Link href="/login" className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-slate-600 bg-transparent hover:bg-slate-50 transition-all">
                <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Kembali ke Login</span>
              </Link>
            </div>

          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          &copy; {new Date().getFullYear()} {t('app_name')}.
        </p>
      </div>
    </div>
  )
}