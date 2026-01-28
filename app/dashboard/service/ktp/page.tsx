'use client'

import { submitKtp } from './actions'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeft, UploadCloud, FileText, X, CheckCircle2, Loader2 
} from 'lucide-react'

export default function KtpServicePage() {
  const { t } = useLanguage()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')
    setFiles(prev => [...prev, ...validFiles])
    const newPreviews = validFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return 'pdf'
    })
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
    files.forEach(file => {
      formData.append('documents', file)
    })
    await submitKtp(formData)
  }

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900 py-12 px-4">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-sky-200/60 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors group font-medium">
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
              <span className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <FileText className="w-6 h-6" />
              </span>
              {t('srv_ktp')}
            </h1>
            <p className="text-slate-500 mt-2 ml-14">{t('srv_ktp_desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
              <div className="shrink-0 pt-1">
                 <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                 </div>
              </div>
              <div className="text-sm text-blue-800">
                <strong className="block mb-1 font-bold">{t('lbl_supporting_docs') || "Dokumen Wajib:"}</strong>
                <ul className="list-disc list-inside space-y-1 text-blue-700/80">
                  <li>{t('doc_rt_letter') || "Surat Pengantar RT/RW (Scan/Foto)"}</li>
                  <li>{t('doc_kk_scan') || "Kartu Keluarga / KK (Scan/Foto)"}</li>
                  <li>{t('doc_birth_cert_opt') || "Akte Kelahiran (Opsional)"}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                {t('lbl_necessity_type') || "Jenis Permohonan"}
              </label>
              <div className="relative">
                 <select id="reason" name="reason" className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium transition-shadow cursor-pointer">
                  {/* These options also need keys in translations.ts */}
                  <option value="Baru">{t('opt_ktp_new') || "Buat Baru (Pemula 17 th)"}</option>
                  <option value="Hilang">{t('opt_ktp_lost') || "Mengganti KTP Hilang"}</option>
                  <option value="Rusak">{t('opt_ktp_damaged') || "Mengganti KTP Rusak"}</option>
                  <option value="Update">{t('opt_ktp_update') || "Perubahan Data"}</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">{t('form_upload_title')}</label>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-bold">{t('form_upload_badge')}</span>
              </div>
              
              <div 
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50 scale-[0.99]' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'} ${files.length > 0 ? 'bg-slate-50/50' : 'bg-white'}`}
              >
                <input type="file" name="documents" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*,.pdf" />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className={`p-4 rounded-full bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110 ${isDragging ? 'scale-110' : ''}`}><UploadCloud className="w-8 h-8" /></div>
                  <p className="text-slate-700 font-semibold">{t('form_drag_drop')}</p>
                  <p className="text-slate-400 text-xs mt-1">{t('form_drag_desc') || "Bisa upload banyak sekaligus (JPG, PNG, PDF)"}</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {files.map((file, index) => (
                    <div key={index} className="relative group bg-white border border-slate-200 p-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                      <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-2 relative">
                        {previews[index] === 'pdf' ? <FileText className="w-10 h-10 text-slate-400" /> : <img src={previews[index]} className="w-full h-full object-cover" />}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm uppercase">{file.name.split('.').pop()}</div>
                      </div>
                      <p className="text-xs text-slate-600 truncate font-medium px-1">{file.name}</p>
                      <p className="text-[10px] text-slate-400 px-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md transform hover:scale-110"><X className="w-3 h-3"/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || files.length === 0}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('btn_sending')}</> : t('btn_submit')}
              </button>
            </div>

          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          {t('msg_ensure_valid') || "Pastikan data yang Anda kirim sudah benar dan valid."}
        </p>

      </div>
    </div>
  )
}