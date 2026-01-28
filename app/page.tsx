'use client' // WAJIB ADA DI BARIS PERTAMA

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client' // Pastikan punya ini (client version)
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  Landmark, CreditCard, Users, Baby, FileWarning, ShieldCheck, Truck, 
  LayoutDashboard, FileText, ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  const { t } = useLanguage() // Panggil Hook Bahasa
  const [user, setUser] = useState<any>(null)

  // Cek User Login di sisi Client
  useEffect(() => {
    const supabase = createClient()
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- BACKGROUND GRADIENTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-slate-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      {/* --- GLASS NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/40 bg-white/60 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-700 to-sky-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-bold text-xl tracking-tight text-slate-900 leading-none">
                  {t('app_name')}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {t('kabupaten')}
                </span>
              </div>
            </div>

            {/* Auth Buttons + Switcher */}
            <div className="flex gap-4 items-center">
              <LanguageSwitcher /> {/* Tombol Switch Bahasa */}
              
              {user ? (
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-sm font-medium text-slate-600 bg-white/50 px-3 py-1 rounded-full border border-white/60">
                      {t('hello')}, {user.email?.split('@')[0]}
                    </span>
                    <Link 
                      href="/dashboard" 
                      className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                    >
                      Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition-colors">
                    {t('login_btn')}
                  </Link>
                  <Link 
                    href="/login" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                  >
                    {t('register_btn')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-44 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md text-blue-700 text-sm font-semibold mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
          </span>
          {t('hero_badge')}
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15] text-slate-900">
          {t('hero_title_1')} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400">
            {t('hero_title_2')}
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('hero_desc')}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href={user ? "/dashboard" : "/login"} 
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl text-lg transition-all hover:bg-blue-700 hover:scale-105 shadow-xl shadow-blue-200"
          >
            {user ? <LayoutDashboard className="w-5 h-5"/> : <FileText className="w-5 h-5"/>}
            {user ? t('hero_cta_dashboard') : t('hero_cta_start')}
          </Link>
          <a href="#layanan" className="px-8 py-4 bg-white/60 text-slate-700 font-bold rounded-2xl border border-white/80 hover:bg-white/80 backdrop-blur-md transition-all text-lg shadow-sm hover:shadow-md">
            {t('hero_cta_services')}
          </a>
        </div>
      </section>

      {/* --- LAYANAN (GLASS CARDS) --- */}
      <section id="layanan" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">{t('services_title')}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{t('services_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard Icon={CreditCard} color="text-blue-600" bg="bg-blue-50" title={t('srv_ktp')} desc={t('srv_ktp_desc')} />
            <ServiceCard Icon={Users} color="text-sky-600" bg="bg-sky-50" title={t('srv_kk')} desc={t('srv_kk_desc')} />
            <ServiceCard Icon={Baby} color="text-teal-600" bg="bg-teal-50" title={t('srv_birth')} desc={t('srv_birth_desc')} />
            <ServiceCard Icon={FileWarning} color="text-red-600" bg="bg-red-50" title={t('srv_death')} desc={t('srv_death_desc')} />
            <ServiceCard Icon={ShieldCheck} color="text-indigo-600" bg="bg-indigo-50" title={t('srv_skck')} desc={t('srv_skck_desc')} />
            <ServiceCard Icon={Truck} color="text-slate-600" bg="bg-slate-100" title={t('srv_move')} desc={t('srv_move_desc')} />
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative z-10 py-16 border-y border-white/40 bg-white/30 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="1,200+" label={t('stat_label_1')} />
            <StatItem number="500+" label={t('stat_label_2')} />
            <StatItem number="24 Jam" label={t('stat_label_3')} />
            <StatItem number="100%" label={t('stat_label_4')} />
         </div>
      </section>

      {/* --- FLOW SECTION --- */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-16 text-slate-900">{t('flow_title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FlowItem step="1" title={t('flow_step_1_title')} desc={t('flow_step_1_desc')} />
              <FlowItem step="2" title={t('flow_step_2_title')} desc={t('flow_step_2_desc')} />
              <FlowItem step="3" title={t('flow_step_3_title')} desc={t('flow_step_3_desc')} />
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <Landmark className="w-5 h-5 text-slate-400" />
             <span className="font-bold text-slate-600">{t('footer_gov')}</span>
          </div>
          <p className="text-slate-500 text-sm mb-2">{t('footer_address')}</p>
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} {t('app_name')}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// --- KOMPONEN KECIL ---

function ServiceCard({ Icon, title, desc, color, bg }: any) {
  return (
    <div className="group p-8 rounded-3xl bg-white/60 border border-white/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function StatItem({ number, label }: any) {
    return (
        <div>
            <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-blue-700 to-sky-500 mb-2">{number}</div>
            <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{label}</div>
        </div>
    )
}

function FlowItem({ step, title, desc }: any) {
    return (
      <div className="p-6 group">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600 border border-blue-50 group-hover:scale-110 transition-transform">{step}</div>
          <h3 className="font-bold text-xl mb-2 text-slate-800">{title}</h3>
          <p className="text-slate-500">{desc}</p>
      </div>
    )
}