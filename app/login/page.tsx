'use client'

import { login } from './actions' // Hanya import login
import Link from 'next/link' // Import Link untuk navigasi
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useSearchParams } from 'next/navigation'
import { Landmark, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const { t } = useLanguage() 
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900 py-10">
      
      {/* Tombol Bahasa */}
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
            <h2 className="text-2xl font-bold text-slate-900">{t('app_name')}</h2>
            <p className="text-slate-600 text-sm font-medium">{t('login_subtitle')}</p>
          </div>

          <form className="space-y-5">
            
            {/* INPUT EMAIL & PASSWORD */}
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

            {/* PESAN ERROR / SUKSES */}
            {message && (
              <div className={`p-3 text-sm text-center rounded-xl border font-semibold animate-pulse ${message.includes('berhasil') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {message}
              </div>
            )}

            {/* BUTTONS */}
            <div className="pt-2 space-y-4">
              <button formAction={login} className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                <span className="flex items-center gap-2">{t('login_btn')} <ArrowRight className="w-4 h-4"/></span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Belum punya akun?</span>
                </div>
              </div>

              {/* Link ke halaman Register */}
              <Link href="/register" className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <span className="flex items-center gap-2"><UserPlus className="w-4 h-4 text-slate-500"/> {t('register_btn')}</span>
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