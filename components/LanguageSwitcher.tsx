'use client'

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex bg-white/20 backdrop-blur-md p-1 rounded-lg border border-white/30 shadow-sm">
      <button
        onClick={() => setLanguage('id')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'id' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        🇮🇩 ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
          language === 'en' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}