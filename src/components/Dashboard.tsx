import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hospital, Language, LiveMapData } from '../types';
import { TEXT, MOCK_AMBULANCES, WEATHER_ZONES } from '../constants';
import { Activity, Shield, Flame, CloudLightning, Stethoscope } from 'lucide-react';

// Custom Markers (CSS Shapes)
const createHospitalIcon = (status: string) => {
    const color = status === 'Critical' ? '#ef4444' : status === 'Strain' ? '#f59e0b' : '#10b981';
    return L.divIcon({
        className: 'custom-hospital-icon',
        html: `<div style="width:30px;height:30px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 0 15px ${color};display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">H</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const ambulanceIcon = L.divIcon({
    className: 'custom-amb-icon',
    html: `<div style="background:#3b82f6;width:12px;height:12px;border:1px solid white;border-radius:2px;"></div>`,
    iconSize: [12, 12]
});

// Auto-Center Map to view Saudi Arabia
const MapReCenter = () => {
  const map = useMap();
  useEffect(() => {
    map.setView([23.5, 43.0], 6); 
  }, [map]);
  return null;
};

interface DashboardProps {
  hospitals: Hospital[];
  lang: Language;
  onSelectHospital: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ hospitals, lang, onSelectHospital }) => {
  const t = TEXT[lang];
  const isRtl = lang === Language.AR;
  const [liveData, setLiveData] = useState<LiveMapData>({ ambulances: MOCK_AMBULANCES, weatherZones: WEATHER_ZONES });

  return (
    <div className="flex w-full h-full bg-slate-950 overflow-hidden relative">
      
      {/* Sidebar: Agencies & List */}
      <div className="w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 p-4 flex flex-col gap-4 z-20 shadow-2xl absolute left-0 top-0 h-full">
          
          {/* Agency Integration Panel */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">
                 {isRtl ? 'الجهات المتصلة' : 'Connected Agencies'}
             </div>
             <div className="grid grid-cols-4 gap-2">
                 <div className="flex flex-col items-center gap-1" title="Red Crescent">
                     <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500"><Stethoscope size={16}/></div>
                     <span className="text-[8px] text-slate-400">EMS</span>
                 </div>
                 <div className="flex flex-col items-center gap-1" title="Civil Defense">
                     <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500"><Flame size={16}/></div>
                     <span className="text-[8px] text-slate-400">FIRE</span>
                 </div>
                 <div className="flex flex-col items-center gap-1" title="Disaster Mgmt">
                     <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500"><Shield size={16}/></div>
                     <span className="text-[8px] text-slate-400">NCM</span>
                 </div>
                 <div className="flex flex-col items-center gap-1" title="Weather">
                     <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center text-teal-500"><CloudLightning size={16}/></div>
                     <span className="text-[8px] text-slate-400">MET</span>
                 </div>
             </div>
             <div className="mt-2 text-center text-[9px] text-emerald-500 font-mono animate-pulse">
                 ● DATA LINK ESTABLISHED
             </div>
          </div>

          {/* Hospital List */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800">
              <Activity className="w-4 h-4 text-indigo-500" /> {isRtl ? 'حالة القطاعات' : 'Sector Status'}
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto flex-1">
            {hospitals.map(h => (
                <button key={h.id} onClick={() => onSelectHospital(h.id)} className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${h.status === 'Critical' ? 'bg-red-950/30 border-red-900/50' : 'bg-emerald-950/30 border-emerald-900/50'}`}>
                    <div className="text-left">
                        <div className="text-sm font-bold text-slate-200">{isRtl ? h.nameAr : h.nameEn}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{isRtl ? h.regionAr : h.regionEn} Region</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${h.status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                </button>
            ))}
          </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative bg-slate-950 ml-80">
          <MapContainer center={[23.5, 43.0]} zoom={6} style={{ height: "100%", width: "100%", background: '#0f172a' }} zoomControl={false}>
            <MapReCenter />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            
            {liveData.weatherZones.map(zone => (
                <Circle key={zone.id} center={[zone.coordinates.x, zone.coordinates.y]} radius={zone.radius} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.15, weight: 0 }} />
            ))}
            
            {hospitals.map(h => (
                <Marker key={h.id} position={[h.coordinates.x, h.coordinates.y]} icon={createHospitalIcon(h.status)} eventHandlers={{ click: () => onSelectHospital(h.id) }} />
            ))}
            
            {liveData.ambulances.map(amb => (
                <Marker key={amb.id} position={[amb.coordinates.x, amb.coordinates.y]} icon={ambulanceIcon} />
            ))}
          </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;