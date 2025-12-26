import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { INITIAL_HOSPITALS, TEXT } from './constants';
import Dashboard from './components/Dashboard';
import HospitalDetail from './components/HospitalDetail';
import { Globe, Maximize, Volume2, VolumeX, Server, AlertTriangle } from 'lucide-react';

// لاحظ: حذفنا سطر الاستيراد import logoImg...

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastAlertTime, setLastAlertTime] = useState(0);

  const speakAlert = (text: string) => {
    if (!soundEnabled || !window.speechSynthesis) return;
    if (Date.now() - lastAlertTime > 15000) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        setLastAlertTime(Date.now());
    }
  };

  useEffect(() => {
    const criticalHospital = INITIAL_HOSPITALS.find(h => h.status === 'Critical');
    if (criticalHospital) {
        speakAlert(`Attention. Critical status detected at ${criticalHospital.nameEn}.`);
    }
  }, [selectedHospitalId]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const t = TEXT[lang];
  const isRtl = lang === Language.AR;
  const selectedHospital = INITIAL_HOSPITALS.find(h => h.id === selectedHospitalId);

  return (
    <div className={`w-screen h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>

      {/* Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            {/* التغيير هنا: استخدمنا الرابط المباشر للصورة 
                Vite سيجلبها تلقائياً من مجلد public 
            */}
            <img 
                src="/logo.png" 
                alt="NCCPS Logo" 
                className="relative h-10 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
            />
          </div>
          
          <div>
            <h1 className="font-black text-xl leading-none tracking-tight text-white flex items-center gap-2">
              NPPCS <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 px-1.5 rounded text-[10px] font-mono">v3.3 ENTERPRISE</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">{t.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded border transition-colors ${soundEnabled ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
             {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button onClick={toggleFullScreen} className="p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400">
            <Maximize className="w-5 h-5" />
          </button>
          
          <button onClick={() => setLang(lang === Language.EN ? Language.AR : Language.EN)} className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-xs">
            <Globe className="w-4 h-4 text-slate-400" />
            {lang === Language.EN ? 'EN' : 'عربي'}
          </button>
        </div>
      </nav>

      {/* Ticker */}
      <div className="bg-red-950/40 border-b border-red-900/30 h-7 flex items-center overflow-hidden relative backdrop-blur-md">
        <div className="absolute left-0 bg-red-900 px-3 h-full flex items-center z-10 font-black text-[10px] text-white uppercase tracking-widest border-r border-red-700 shadow-xl">
            <AlertTriangle className="w-3 h-3 mr-2" /> LIVE FEED
        </div>
        <div className="whitespace-nowrap animate-marquee flex items-center gap-20 text-[10px] font-mono text-red-200/90 font-bold">
            <span>[ALERT] SANDSTORM DETECTED IN RIYADH SECTOR 4</span>
            <span>[EMS] RED CRESCENT UNIT 101 RESPONDING TO TRAUMA CODE</span>
            <span>[SYSTEM] AI FORECAST CONFIDENCE 98%</span>
            <span>[CIVIL DEFENSE] HEATWAVE WARNING IN JEDDAH SECTOR</span>
        </div>
      </div>

      <main className="flex-1 relative overflow-hidden bg-slate-950">
        {selectedHospital ? (
          <HospitalDetail hospital={selectedHospital} lang={lang} onBack={() => setSelectedHospitalId(null)} />
        ) : (
          <Dashboard hospitals={INITIAL_HOSPITALS} lang={lang} onSelectHospital={setSelectedHospitalId} />
        )}
      </main>
      
      <footer className="h-6 bg-slate-900 border-t border-slate-800 flex items-center px-4 justify-between text-[9px] text-slate-500 uppercase tracking-widest shrink-0 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM: ONLINE
          </span>
          <span className="flex items-center gap-1.5"><Server className="w-3 h-3" /> 8ms</span>
        </div>
        <div>SECURE CONNECTION // LOCALHOST</div>
      </footer>
    </div>
  );
};

export default App;