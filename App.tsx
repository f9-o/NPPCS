import React, { useState, useEffect } from 'react';
import { Hospital, Language } from './types';
import { INITIAL_HOSPITALS, TEXT } from './constants';
import Dashboard from './components/Dashboard';
import HospitalDetail from './components/HospitalDetail';
import { Globe, ShieldCheck, Server } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const t = TEXT[lang];
  const isRtl = lang === Language.AR;
  const selectedHospital = INITIAL_HOSPITALS.find(h => h.id === selectedHospitalId);

  return (
    <div className={`w-screen h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Navbar */}
      <nav className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none tracking-tight text-white">SENTINEL <span className="text-indigo-400 font-mono text-xs">v2.1</span></h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">{t.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right border-r border-slate-800 pr-6">
             <div className="text-lg font-mono text-white font-medium leading-none">
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
             <div className="text-[10px] text-slate-500 uppercase">
               Riyadh HQ Time
             </div>
          </div>

          <button 
            onClick={() => setLang(lang === Language.EN ? Language.AR : Language.EN)}
            className="flex items-center gap-2 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">{lang === Language.EN ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 relative overflow-hidden bg-slate-950">
        {selectedHospital ? (
          <HospitalDetail 
            hospital={selectedHospital} 
            lang={lang} 
            onBack={() => setSelectedHospitalId(null)} 
          />
        ) : (
          <Dashboard 
            hospitals={INITIAL_HOSPITALS} 
            lang={lang} 
            onSelectHospital={setSelectedHospitalId} 
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="h-6 bg-slate-900 border-t border-slate-800 flex items-center px-4 justify-between text-[9px] text-slate-600 uppercase tracking-widest shrink-0 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
            CONNECTED: LOCALHOST:8000
          </span>
          <span className="flex items-center gap-1.5">
             <Server className="w-3 h-3" />
             LATENCY: 12ms
          </span>
        </div>
        <div>
          SENTINEL PREDICTIVE ENGINE • RESTRICTED ACCESS
        </div>
      </footer>

    </div>
  );
};

export default App;