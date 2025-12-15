import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Hospital, Language, Alert, PredictionPoint, AIPredictionResponse, TransferPrediction } from '../types';
import { TEXT } from '../constants';
import { generateHospitalPrediction } from '../services/predictionEngine';
import { ArrowLeft, Activity, Users, AlertTriangle, Truck, ArrowRight, Share2, Database, Clock, Cpu } from 'lucide-react';

interface HospitalDetailProps {
  hospital: Hospital;
  lang: Language;
  onBack: () => void;
}

const HospitalDetail: React.FC<HospitalDetailProps> = ({ hospital, lang, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PredictionPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [transfers, setTransfers] = useState<TransferPrediction[]>([]);
  const [kpi, setKpi] = useState({ wait: 0, offload: 0 });
  const [factors, setFactors] = useState({ seasonalScore: 0, trafficScore: 0, cadVolume: 0 });
  const [confidence, setConfidence] = useState(0);

  const t = TEXT[lang];
  const isRtl = lang === Language.AR;

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result: AIPredictionResponse = await generateHospitalPrediction(hospital, new Date());
        if (!mounted) return;

        // Chart Construction
        const now = new Date();
        const historyPoints: PredictionPoint[] = Array.from({ length: 5 }).map((_, i) => ({
          time: new Date(now.getTime() - (5 - i) * 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: Math.max(0, hospital.currentOccupancy - (Math.random() * 50 - 25)),
          type: 'historical'
        }));
        const futurePoints: PredictionPoint[] = result.loadForecast.map((val, i) => ({
          time: new Date(now.getTime() + (i + 1) * 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: val,
          type: 'prediction'
        }));
        setData([...historyPoints, ...futurePoints]);
        
        setKpi({ wait: result.qualityIndicators.expectedWaitTime, offload: result.qualityIndicators.ambulanceOffloadTime });
        setFactors(result.factorAnalysis);
        setAlerts(result.alerts);
        setTransfers(result.transfers);
        setConfidence(result.modelConfidence);

      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
    return () => { mounted = false; };
  }, [hospital]);

  return (
    <div className={`h-full flex flex-col p-6 overflow-y-auto ${isRtl ? 'rtl' : ''} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
             </button>
             <h1 className="text-2xl font-bold text-white">{isRtl ? hospital.nameAr : hospital.nameEn}</h1>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 px-2">
            <span className="font-mono">ID: {hospital.id.toUpperCase()}</span>
            <span>Region: {isRtl ? hospital.regionAr : hospital.regionEn}</span>
            <span className="text-blue-400">Specialties: {hospital.specialties.join(', ')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
            {!loading && (
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Model Confidence
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{confidence}%</span>
                </div>
            )}
            <div className={`px-4 py-2 rounded border text-sm font-bold tracking-widest uppercase ${
                hospital.status === 'Critical' ? 'bg-red-950 border-red-800 text-red-400' :
                hospital.status === 'Strain' ? 'bg-amber-950 border-amber-800 text-amber-400' :
                'bg-emerald-950 border-emerald-800 text-emerald-400'
            }`}>
                {hospital.status}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Data Fusion & Metrics */}
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <KpiCard title="Pred. Wait (TTA)" value={`${kpi.wait} min`} icon={<Clock className="w-4 h-4 text-blue-400"/>} />
            <KpiCard title="EMS Offload" value={`${kpi.offload} min`} icon={<Truck className="w-4 h-4 text-orange-400"/>} warn={kpi.offload > 20} />
            <KpiCard title="Active Census" value={hospital.currentOccupancy} icon={<Users className="w-4 h-4 text-purple-400"/>} />
            <KpiCard title="Reserve Cap" value={`${Math.max(0, Math.round(100 - (hospital.currentOccupancy/hospital.capacity)*100))}%`} icon={<Activity className="w-4 h-4 text-emerald-400"/>} />
          </div>

          {/* 7-Point Factor Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
               <Database className="w-4 h-4" /> {t.factors}
            </h3>
            <div className="space-y-4">
               <FactorBar label="Seasonal Viral Coefficient" value={factors.seasonalScore} color="bg-rose-500" />
               <FactorBar label="Traffic Stress Index" value={factors.trafficScore} color="bg-amber-500" />
               <FactorBar label="Live CAD Volume" value={factors.cadVolume} max={100} color="bg-blue-500" />
               <div className="text-[10px] text-slate-600 mt-2 pt-2 border-t border-slate-800 font-mono">
                  Sources: [WX, EVENT, CAP, HIST, CAD, TRF, SEAS]
               </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Main Chart & Transfers */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-64 relative">
              <h3 className="text-sm font-bold text-slate-300 mb-2">{t.forecast}</h3>
              {loading && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 text-xs text-blue-400 font-mono">COMPUTING REGRESSION...</div>}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                  <ReferenceLine x={data[4]?.time} stroke="#f59e0b" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>

           {/* Interfacility Transfers */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" /> {t.transfers}
              </h3>
              {transfers.length > 0 ? (
                transfers.map((tr, i) => (
                  <div key={i} className="bg-indigo-950/20 border border-indigo-900/50 p-3 rounded-lg flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-indigo-900 text-indigo-300 px-1 rounded">
                                {tr.probability}% PROB
                            </span>
                            <span className="text-xs text-indigo-200 font-bold uppercase">
                                Recommended: {tr.recommendedSpecialty}
                            </span>
                       </div>
                       <div className="text-[10px] text-slate-400 leading-tight">{isRtl ? tr.reasonAr : tr.reasonEn}</div>
                     </div>
                     <ArrowRight className="text-indigo-500 w-4 h-4" />
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded">
                   Network load balanced. No transfer directives.
                </div>
              )}
           </div>
        </div>

        {/* RIGHT COLUMN: Timed Alerts */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 overflow-hidden flex flex-col">
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            {t.alerts}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {alerts.map((alert) => (
               <div key={alert.id} className={`p-3 rounded border-l-2 relative overflow-hidden group ${
                 alert.severity === 'high' ? 'bg-red-950/20 border-red-500' : 
                 alert.severity === 'medium' ? 'bg-amber-950/20 border-amber-500' : 'bg-blue-950/20 border-blue-500'
               }`}>
                 <div className="flex justify-between items-start mb-1">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300`}>
                     {alert.level}
                   </span>
                   <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                 </div>
                 <p className="text-xs font-medium text-slate-200 mb-2 mt-2">
                   {isRtl ? alert.messageAr : alert.messageEn}
                 </p>
                 <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/50">
                   <span className="font-bold text-slate-500 uppercase text-[9px]">Action: </span>
                   {isRtl ? alert.actionAr : alert.actionEn}
                 </div>
               </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon, warn }: any) => (
  <div className={`p-3 rounded-lg border bg-slate-900 ${warn ? 'border-red-900/50 bg-red-950/10' : 'border-slate-800'}`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{title}</span>
      {icon}
    </div>
    <div className={`text-xl font-mono font-bold ${warn ? 'text-red-400' : 'text-slate-200'}`}>{value}</div>
  </div>
);

const FactorBar = ({ label, value, max = 150, color }: any) => (
  <div>
    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.min(100, (value/max)*100)}%` }}></div>
    </div>
  </div>
);

export default HospitalDetail;