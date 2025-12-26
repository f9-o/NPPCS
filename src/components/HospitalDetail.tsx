import React, { useState, useEffect } from 'react';
import { Hospital, Language, AIPredictionResponse } from '../types';
import { TEXT } from '../constants';
import { ArrowLeft, TrendingUp, Download, Siren, Activity, RefreshCw, BedDouble, Ambulance, AlertTriangle, CloudRain, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pinIcon = L.divIcon({
    className: 'custom-pin-icon',
    html: `<div style="color:#ef4444;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const fetchPrediction = async (hospitalId: string): Promise<AIPredictionResponse> => {
  const response = await fetch(`/hospitals/${hospitalId}/predict`);
  if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  return response.json();
};

interface HospitalDetailProps {
  hospital: Hospital;
  lang: Language;
  onBack: () => void;
}

const HospitalDetail: React.FC<HospitalDetailProps> = ({ hospital, lang, onBack }) => {
  const t = TEXT[lang];
  const isRtl = lang === Language.AR;
  const [prediction, setPrediction] = useState<AIPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPrediction(hospital.id)
      .then(data => { setPrediction(data); setLoading(false); })
      .catch(err => { console.error(err); setError(err.message); setLoading(false); });
  };

  useEffect(() => { loadData(); }, [hospital.id]);

  if (loading) return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-mono gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          <span>INITIALIZING AI MODEL...</span>
      </div>
  );

  if (error) return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-400 font-mono gap-4">
          <Siren className="w-12 h-12 mb-2" />
          <div className="text-xl font-bold">CONNECTION FAILED</div>
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded border border-slate-700 text-white"><RefreshCw className="w-4 h-4" /> Retry</button>
          <button onClick={onBack} className="text-xs underline text-slate-500">Back</button>
      </div>
  );

  if (!prediction) return null;

  const chartData = prediction.loadForecast.map((val, idx) => ({ time: `+${(idx + 1) * 15}m`, load: val }));
  const sortedAlerts = [...prediction.alerts].sort((a, b) => {
      const severityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
      return severityWeight[b.severity] - severityWeight[a.severity];
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold">{isRtl ? 'العودة للخريطة العامة' : 'Back to Tactical Map'}</span>
        </button>
        <div className="flex gap-3">
            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
                hospital.status === 'Critical' ? 'border-red-500 text-red-500 bg-red-500/10' : 
                hospital.status === 'Strain' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
            }`}>{hospital.status} STATUS</div>
            <button onClick={() => alert("Exporting...")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-300 hover:text-white">
                <Download className="w-3 h-3" /> Export
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-black text-white mb-1">{isRtl ? hospital.nameAr : hospital.nameEn}</h1>
                <div className="text-xs text-slate-400 flex items-center gap-2 mb-4"><MapPin className="w-3 h-3" /> {isRtl ? hospital.regionAr : hospital.regionEn}</div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2"><BedDouble className="w-4 h-4 text-indigo-400"/> {isRtl ? 'إشغال الأسرة' : 'Bed Occupancy'}</span>
                        <span className="text-lg font-bold text-white font-mono">{hospital.currentOccupancy} <span className="text-slate-500 text-xs">/ {hospital.capacity}</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${hospital.status === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${(hospital.currentOccupancy / hospital.capacity) * 100}%` }}></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                        <Ambulance className="w-5 h-5 text-blue-400 mb-1" />
                        <div className="text-xl font-black text-white">{prediction.qualityIndicators.inboundEmsCount}</div>
                        <div className="text-[9px] text-slate-500 uppercase">{isRtl ? 'إسعاف قادم' : 'Inbound EMS'}</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                        <CloudRain className="w-5 h-5 text-teal-400 mb-1" />
                        <div className="text-sm font-bold text-white mt-1">{hospital.weatherCondition}</div>
                        <div className="text-[9px] text-slate-500 uppercase">{isRtl ? 'الطقس' : 'Weather'}</div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden h-48 relative shadow-lg">
                <MapContainer center={[hospital.coordinates.x, hospital.coordinates.y]} zoom={14} style={{ height: "100%", width: "100%", background: '#0f172a' }} zoomControl={false} dragging={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                    <Marker position={[hospital.coordinates.x, hospital.coordinates.y]} icon={pinIcon} />
                </MapContainer>
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-[9px] text-white backdrop-blur z-[400]">LIVE LOCATION</div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-2xl shadow-lg h-64 flex flex-col">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> {isRtl ? 'توقعات الحمل (90 دقيقة)' : 'ED Load Forecast (90min)'}</h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                        <defs><linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" tick={{fontSize: 10}} axisLine={false} />
                        <YAxis stroke="#475569" tick={{fontSize: 10}} axisLine={false} domain={[0, 'dataMax + 50']} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                        <Area type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>
             <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-10"><Activity className="w-24 h-24 text-indigo-500" /></div>
                 <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> AI Recommendation</h3>
                 {prediction.transfers.length > 0 ? (
                     <div>
                         <div className="text-lg font-bold text-white mb-1">{isRtl ? 'يوصى بتحويل الحالات القادمة' : 'Recommended: Divert Incoming Patients'}</div>
                         <div className="text-xs text-indigo-300">Target: {prediction.transfers[0].targetId.toUpperCase()} • Reason: {isRtl ? prediction.transfers[0].reasonAr : prediction.transfers[0].reasonEn}</div>
                     </div>
                 ) : (
                     <div className="text-white font-medium">{isRtl ? 'العمليات مستقرة. لا حاجة للتحويل.' : 'Operations stable. No diversion needed.'}</div>
                 )}
                 <div className="mt-4 pt-3 border-t border-indigo-500/20">
                     <div className="text-[10px] text-indigo-400 uppercase mb-1">Root Cause Analysis</div>
                     <div className="text-xs text-slate-300">{isRtl ? prediction.qualityIndicators.rootCauseAr : prediction.qualityIndicators.rootCauseEn}</div>
                 </div>
             </div>
        </div>
        
        <div className="col-span-12 lg:col-span-3">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-lg h-full flex flex-col">
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2"><Siren className="w-4 h-4 text-red-500 animate-pulse" /> Active Alerts</h3>
                <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {sortedAlerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-xl border relative ${alert.severity === 'high' ? 'bg-red-950/40 border-red-900/80' : alert.severity === 'medium' ? 'bg-amber-950/40 border-amber-900/80' : 'bg-slate-800/50 border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{alert.severity}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-200 mb-1 leading-snug">{isRtl ? alert.messageAr : alert.messageEn}</h4>
                            <div className="text-[10px] text-slate-400 flex items-start gap-1 mt-2 pt-2 border-t border-white/5"><AlertTriangle className="w-3 h-3 shrink-0" /> {isRtl ? alert.actionAr : alert.actionEn}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;