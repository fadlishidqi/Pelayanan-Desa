'use client' // 1. Wajib Client Component

import { login, signup } from './actions'
import { useLanguage } from '@/context/LanguageContext' // 2. Import Hook Bahasa
import LanguageSwitcher from '@/components/LanguageSwitcher' // 3. Import Tombol
import { useSearchParams } from 'next/navigation' // 4. Untuk ambil pesan error
import { Landmark, Mail, Lock, ArrowRight, UserPlus, User, MapPin, CreditCard } from 'lucide-react'

export default function LoginPage() {
  // 5. Gunakan Hook
  const { t } = useLanguage() 
  const searchParams = useSearchParams()
  const message = searchParams.get('message') // Ambil pesan error

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900 py-10">
      
      {/* 6. TOMBOL GANTI BAHASA (Pojok Kanan Atas) */}
      <div className="absolute top-5 right-5 z-50">
        <LanguageSwitcher />
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-slate-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 border border-white rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden p-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 mb-3 text-white">
              <Landmark className="w-6 h-6" />
            </div>
            {/* 7. Ganti Teks Hardcode dengan t('key') */}
            <h2 className="text-2xl font-bold text-slate-900">{t('app_name')}</h2>
            <p className="text-slate-600 text-sm font-medium">{t('login_subtitle')}</p>
          </div>

          <form className="space-y-5">
            
            {/* --- INPUT UTAMA (LOGIN & DAFTAR) --- */}
            <div className="space-y-4">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder={t('email_ph')} 
                  className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none font-medium" 
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  placeholder={t('password_ph')} 
                  className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none font-medium" 
                />
              </div>
            </div>

            {/* --- INPUT TAMBAHAN (KHUSUS DAFTAR) --- */}
            <div className="pt-5 border-t border-slate-200">
               <div className="flex items-center justify-center mb-4">
                 <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                   {t('register_note')}
                 </span>
               </div>
               
               <div className="space-y-4">
                  {/* INPUT NIK */}
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                    </div>
                    <input 
                      name="nik" 
                      type="text" 
                      maxLength={16}
                      placeholder={t('lbl_nik') || "Nomor Induk Kependudukan (NIK)"} 
                      className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm font-medium" 
                    />
                  </div>

                  {/* INPUT NAMA */}
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input 
                      name="full_name" 
                      type="text" 
                      placeholder={t('lbl_fullname')} 
                      className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm font-medium" 
                    />
                  </div>

                  {/* INPUT ALAMAT */}
                  <div className="group relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-500" />
                    </div>
                    <textarea 
                      name="address" 
                      rows={2} 
                      placeholder={t('lbl_address_ph')} 
                      className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm resize-none font-medium" 
                    />
                  </div>
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
              <button formAction={login} className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                <span className="flex items-center gap-2">{t('login_btn')} <ArrowRight className="w-4 h-4"/></span>
              </button>

              <button formAction={signup} className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <span className="flex items-center gap-2"><UserPlus className="w-4 h-4 text-slate-500"/> {t('register_btn')}</span>
              </button>
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