'use client'

import { submitRelocation } from './actions'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeft, UploadCloud, Truck, X, FileText, MapPin, Users, Briefcase, Loader2
} from 'lucide-react'

export default function RelocationPage() {
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
    await submitRelocation(formData)
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-slate-200 selection:text-slate-900 py-12 px-4">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gray-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors group font-medium">
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
              <span className="p-2 bg-slate-700 rounded-xl text-white shadow-lg shadow-slate-500/20">
                <Truck className="w-6 h-6" />
              </span>
              {t('srv_move')}
            </h1>
            <p className="text-slate-500 mt-2 ml-14">{t('srv_move_desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-700"><MapPin className="w-4 h-4"/></div>
                    <h3 className="font-bold text-slate-700 uppercase tracking-wide text-sm">{t('lbl_move_detail')}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Alasan Pindah */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('lbl_move_reason')}</label>
                        <div className="relative mt-1">
                            <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <select 
                                name="move_reason" 
                                className="w-full pl-9 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/50 outline-none font-medium appearance-none"
                            >
                                <option value="Pekerjaan">{t('opt_move_work')}</option>
                                <option value="Pendidikan">{t('opt_move_edu')}</option>
                                <option value="Ikut Suami/Istri">{t('opt_move_spouse')}</option>
                                <option value="Rumah Baru">{t('opt_move_new_house')}</option>
                                <option value="Lainnya">{t('opt_move_other')}</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Jumlah Pengikut */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('lbl_family_count')}</label>
                        <div className="relative mt-1">
                            <Users className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                name="family_count" 
                                type="number" 
                                min="0" 
                                defaultValue="0"
                                required 
                                className="w-full pl-9 pr-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/50 outline-none font-medium" 
                            />
                        </div>
                    </div>
                </div>

                {/* Alamat Tujuan */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('lbl_dest_address')}</label>
                    <textarea 
                        name="destination_address" 
                        required 
                        rows={3} 
                        placeholder={t('ph_dest_address')} 
                        className="w-full mt-1 px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/50 outline-none font-medium resize-none placeholder:text-slate-400" 
                    />
                </div>
            </div>

            <hr className="border-dashed border-slate-200" />

            {/* UPLOAD */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">{t('form_upload_title')}</label>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">{t('form_upload_badge')}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 mb-2">
                 {t('form_move_upload_instruction')}
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                  ${files.length > 0 ? 'bg-slate-50/50 border-slate-400' : 'bg-white border-slate-300 hover:border-slate-500 hover:bg-slate-50'}
                `}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*,.pdf" />
                
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold">{t('form_drag_drop')}</p>
                    <p className="text-slate-400 text-xs mt-1">{t('lbl_ktp_kk')}</p>
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
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50"
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