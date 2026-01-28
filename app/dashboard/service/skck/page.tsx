'use client'

import { submitSKCK } from './actions'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeft, UploadCloud, ShieldCheck, X, FileText, Briefcase, Loader2
} from 'lucide-react'

export default function SKCKPage() {
  const { t } = useLanguage()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }
  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/') || f.type === 'application/pdf')
    setFiles(prev => [...prev, ...validFiles])
    const newPreviews = validFiles.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : 'pdf')
    setPreviews(prev => [...prev, ...newPreviews])
  }
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.delete('documents')
    files.forEach(file => formData.append('documents', file))
    await submitSKCK(formData)
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 py-12 px-4">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors group font-medium">
            <div className="p-2 bg-white/50 rounded-lg mr-2 group-hover:bg-white border border-transparent group-hover:border-slate-200 shadow-sm transition-all">
                <ArrowLeft className="w-4 h-4" />
            </div>
            {t('back_to_dash')}
            </Link>
            <LanguageSwitcher />
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden">
          
          <div className="p-8 border-b border-slate-100 bg-white/40">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6" />
              </span>
              {t('srv_skck')}
            </h1>
            <p className="text-slate-500 mt-2 ml-14">{t('srv_skck_desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-indigo-100 rounded text-indigo-700"><Briefcase className="w-4 h-4"/></div>
                    <h3 className="font-bold text-slate-700 uppercase tracking-wide text-sm">{t('lbl_necessity_detail')}</h3>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('lbl_skck_necessity')}</label>
                    <input 
                      name="necessity" 
                      type="text" 
                      required 
                      placeholder={t('ph_skck_necessity')} 
                      className="w-full mt-1 px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400" 
                    />
                </div>
            </div>

            <hr className="border-dashed border-slate-200" />

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">{t('form_upload_title')}</label>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-bold">{t('form_upload_badge')}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 mb-2">
                 {t('form_skck_upload_instruction')}
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                  ${files.length > 0 ? 'bg-indigo-50/50 border-indigo-400' : 'bg-white border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'}
                `}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*,.pdf" />
                
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold">{t('form_drag_drop')}</p>
                    <p className="text-slate-400 text-xs mt-1">{t('lbl_skck_docs_short')}</p>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative group bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
                      <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-1 relative">
                        {previews[index] === 'pdf' ? <FileText className="w-8 h-8 text-slate-400" /> : <img src={previews[index]} className="w-full h-full object-cover" />}
                      </div>
                      <p className="text-[10px] text-slate-600 truncate font-bold">{file.name}</p>
                      <button type="button" onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"><X className="w-3 h-3"/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || files.length === 0}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('btn_sending')}</> : t('btn_submit')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}