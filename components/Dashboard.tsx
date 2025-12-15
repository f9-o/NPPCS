import React, { useState } from 'react';
import { Hospital, Ambulance, WeatherZone, Language } from '../types';
import { TEXT, MOCK_AMBULANCES, WEATHER_ZONES } from '../constants';
import { Layers, Zap, CloudRain, Thermometer, Truck } from 'lucide-react';

interface DashboardProps {
  hospitals: Hospital[];
  lang: Language;
  onSelectHospital: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ hospitals, lang, onSelectHospital }) => {
  const t = TEXT[lang];
  const isRtl = lang === Language.AR;

  // Layer Toggles
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Layer Controls Panel */}
      <div className="absolute top-6 left-6 z-20 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {isRtl ? 'طبقات الخريطة' : 'Map Layers'}
        </h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer gap-3">
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${showHospitals ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setShowHospitals(!showHospitals)}>
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${showHospitals ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-slate-200">{t.layers.hospitals}</span>
          </label>
          <label className="flex items-center cursor-pointer gap-3">
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${showAmbulances ? 'bg-orange-600' : 'bg-slate-700'}`} onClick={() => setShowAmbulances(!showAmbulances)}>
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${showAmbulances ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-slate-200">{t.layers.ambulances}</span>
          </label>
          <label className="flex items-center cursor-pointer gap-3">
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${showWeather ? 'bg-teal-600' : 'bg-slate-700'}`} onClick={() => setShowWeather(!showWeather)}>
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${showWeather ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-slate-200">{t.layers.weather}</span>
          </label>
        </div>
      </div>

      {/* The Map Container */}
      <div className="relative w-[90%] h-[80%] max-w-5xl max-h-[800px] border border-slate-800 rounded-3xl bg-slate-900/50 shadow-2xl overflow-hidden relative">
        
        {/* 1. Weather Layer (Polygons/Blur) */}
        {showWeather && WEATHER_ZONES.map(zone => (
          <div 
            key={zone.id}
            className={`absolute rounded-full filter blur-xl opacity-30 pointer-events-none animate-pulse`}
            style={{
              left: `${zone.coordinates.x}%`,
              top: `${zone.coordinates.y}%`,
              width: `${zone.radius * 20}px`,
              height: `${zone.radius * 20}px`,
              transform: 'translate(-50%, -50%)',
              background: zone.type === 'Heatwave' ? 'red' : zone.type === 'Sandstorm' ? '#d97706' : '#0ea5e9'
            }}
          />
        ))}

        {/* 2. Ambulances Layer (Moving Dots) */}
        {showAmbulances && MOCK_AMBULANCES.map(amb => (
          <div
            key={amb.id}
            className="absolute transition-all duration-[2000ms] ease-linear z-10"
            style={{
              left: `${amb.coordinates.x}%`,
              top: `${amb.coordinates.y}%`,
            }}
          >
            <div className={`p-1 rounded bg-slate-900 border border-slate-600 shadow-sm flex items-center justify-center transform hover:scale-150 transition-transform`}>
              <Truck className={`w-3 h-3 ${amb.status === 'Dispatched' ? 'text-orange-500 animate-bounce' : 'text-slate-400'}`} />
            </div>
          </div>
        ))}

        {/* 3. Hospitals Layer (Pins) */}
        {showHospitals && hospitals.map((h) => (
          <div
            key={h.id}
            onClick={() => onSelectHospital(h.id)}
            className="absolute cursor-pointer group transition-all duration-300 hover:scale-110 z-20"
            style={{ 
              left: `${h.coordinates.x}%`, 
              top: `${h.coordinates.y}%` 
            }}
          >
            {/* Status Glow */}
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-sm ${
              h.status === 'Critical' ? 'bg-red-500/20 border-red-500 animate-pulse' :
              h.status === 'Strain' ? 'bg-amber-500/20 border-amber-500' :
              'bg-emerald-500/20 border-emerald-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                h.status === 'Critical' ? 'bg-red-500' :
                h.status === 'Strain' ? 'bg-amber-500' :
                'bg-emerald-500'
              }`} />
            </div>

            {/* Label Tooltip */}
            <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity`}>
              {isRtl ? h.nameAr : h.nameEn}
            </div>
          </div>
        ))}
        
        {/* Map Watermark */}
        <div className="absolute bottom-4 right-6 text-slate-700 font-bold text-6xl opacity-20 pointer-events-none select-none">
          KSA
        </div>

      </div>

      {/* Footer Legend */}
      <div className="mt-6 flex gap-8 bg-slate-900/80 px-8 py-3 rounded-full border border-slate-800">
         <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-slate-400">{isRtl ? 'وحدات نشطة' : 'Active Units'}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500"></div>
            <span className="text-xs text-slate-400">{isRtl ? 'تحذير حراري' : 'Heat Warning'}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-600/50 border border-amber-600"></div>
            <span className="text-xs text-slate-400">{isRtl ? 'عاصفة ترابية' : 'Sandstorm'}</span>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;