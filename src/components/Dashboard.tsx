import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Polyline, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hospital, Language, LiveMapData } from '../types';
import { TEXT, MOCK_AMBULANCES, WEATHER_ZONES, TRAFFIC_ROUTES } from '../constants';
import { Activity, Shield, Flame, CloudLightning, Stethoscope } from 'lucide-react';

const createHospitalIcon = (status: string) => {
    const color = status === 'Critical' ? '#ef4444' : status === 'Strain' ? '#f59e0b' : '#10b981';
    return L.divIcon({
        className: 'custom-hospital-icon',
        html: `<div style="width:30px;height:30px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 0 20px ${color};display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-family:sans-serif;">H</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const ambulanceIcon = L.divIcon({
    className: 'custom-amb-icon',
    html: `<div style="color:#3b82f6;filter:drop-shadow(0 0 5px #3b82f6);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><line x1="9" x2="9" y1="19" y2="19"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const MapReCenter = () => {
  const map = useMap();
  useEffect(() => { map.setView([23.5, 43.0], 6); }, [map]);
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
  const [liveData] = useState<LiveMapData>({ 
      ambulances: MOCK_AMBULANCES, 
      weatherZones: WEATHER_ZONES,
      trafficRoutes: TRAFFIC_ROUTES 
  });

  return (
    <div className="flex w-full h-full bg-slate-950 overflow-hidden relative">
      <div className="w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 p-4 flex flex-col gap-4 z-20 shadow-2xl absolute left-0 top-0 h-full">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">{isRtl ? 'الجهات المتصلة' : 'Connected Agencies'}</div>
             <div className="grid grid-cols-4 gap-2">
                 <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500"><Stethoscope size={16}/></div><span className="text-[8px] text-slate-400">EMS</span></div>
                 <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500"><Flame size={16}/></div><span className="text-[8px] text-slate-400">FIRE</span></div>
                 <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500"><Shield size={16}/></div><span className="text-[8px] text-slate-400">NCM</span></div>
                 <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center text-teal-500"><CloudLightning size={16}/></div><span className="text-[8px] text-slate-400">MET</span></div>
             </div>
             <div className="mt-2 text-center text-[9px] text-emerald-500 font-mono animate-pulse">● DATA LINK ESTABLISHED</div>
          </div>
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800"><Activity className="w-4 h-4 text-indigo-500" /> {isRtl ? 'حالة القطاعات' : 'Sector Status'}</div>
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 custom-scrollbar">
            {hospitals.map(h => (
                <button key={h.id} onClick={() => onSelectHospital(h.id)} className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${h.status === 'Critical' ? 'bg-red-950/30 border-red-900/50 hover:bg-red-900/40' : 'bg-emerald-950/30 border-emerald-900/50 hover:bg-emerald-900/40'}`}>
                    <div className="text-left">
                        <div className="text-sm font-bold text-slate-200">{isRtl ? h.nameAr : h.nameEn}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{isRtl ? h.regionAr : h.regionEn} Region</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${h.status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                </button>
            ))}
          </div>
      </div>

      <div className="flex-1 relative bg-slate-950 ml-80">
          <MapContainer center={[23.5, 43.0]} zoom={6} style={{ height: "100%", width: "100%", background: '#0f172a' }} zoomControl={false}>
            <MapReCenter />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            
            {liveData.trafficRoutes.map(route => (
                <Polyline key={route.id} positions={route.coordinates} pathOptions={{ color: route.color, weight: 3, opacity: 0.6, dashArray: route.status === 'Congested' ? '5, 10' : undefined }} />
            ))}

            {liveData.weatherZones.map(zone => (
                <Circle key={zone.id} center={[zone.coordinates.x, zone.coordinates.y]} radius={zone.radius} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1, weight: 1, dashArray: '4, 4' }} />
            ))}

            {liveData.ambulances.map(amb => (
                <Marker key={amb.id} position={[amb.coordinates.x, amb.coordinates.y]} icon={ambulanceIcon}>
                     <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.9} className="custom-tooltip">
                        <div className="text-xs font-bold text-slate-800">EMS {amb.id}</div>
                        <div className="text-[10px] text-slate-600">{amb.status}</div>
                    </LeafletTooltip>
                </Marker>
            ))}

            {hospitals.map(h => (
                <Marker key={h.id} position={[h.coordinates.x, h.coordinates.y]} icon={createHospitalIcon(h.status)} eventHandlers={{ click: () => onSelectHospital(h.id) }} zIndexOffset={1000}>
                    <LeafletTooltip direction="top" offset={[0, -20]} opacity={1} className="custom-tooltip-dark">
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-white min-w-[120px]">
                            <div className="font-bold text-xs mb-1">{isRtl ? h.nameAr : h.nameEn}</div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Occupancy:</span>
                                <span className={h.status === 'Critical' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{Math.round((h.currentOccupancy/h.capacity)*100)}%</span>
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{h.status}</div>
                        </div>
                    </LeafletTooltip>
                </Marker>
            ))}
          </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;