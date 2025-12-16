import React, { useState, useEffect } from 'react';
import { Hospital, Language, AIPredictionResponse } from '../types';
import { TEXT } from '../constants';
import { ArrowLeft, TrendingUp, Download, ScrollText, Radar, Siren, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';

const fetchPrediction = async (hospitalId: string): Promise<AIPredictionResponse> => {
  const response = await fetch(`http://localhost:8000/hospitals/${hospitalId}/predict`);
  if (!response.ok) throw new Error('Failed to fetch');
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

  useEffect(() => {
    setLoading(true);
    fetchPrediction(hospital.id).then(data => { setPrediction(data); setLoading(false); }).catch(() => setLoading(false));
  }, [hospital.id]);

  if (loading) return <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono">INITIALIZING AI MODEL...</div>;
  if (!prediction) return null;

  const chartData = prediction.loadForecast.map((val, idx) => ({ time: `+${(idx + 1) * 15}m`, load: val }));
  const radarData = [
    { subject: 'Traffic', A: prediction.factorAnalysis.trafficScore, fullMark: 100 },
    { subject: 'Seasonal', A: prediction.factorAnalysis.seasonalScore, fullMark: 150 },
    { subject: 'CAD Vol', A: prediction.factorAnalysis.cadVolume * 5, fullMark: 100 },
    { subject: 'Capacity', A: (hospital.currentOccupancy / hospital.capacity) * 100, fullMark: 100 },
    { subject: 'Staffing', A: 70, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold">{isRtl ? 'العودة للخريطة' : 'Back to Tactical Map'}</span>
        </button>
        <button onClick={() => alert("Simulating Export...")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-300 hover:text-white">
            <Download className="w-3 h-3" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Radar Chart & Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-black text-white mb-1">{isRtl ? hospital.nameAr : hospital.nameEn}</h2>
                <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> Region: {isRtl ? hospital.regionAr : hospital.regionEn}
                </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-lg">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2"><Radar className="w-4 h-4 text-indigo-500" /> Saturation Analysis</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <RechartsRadar name="Data" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Forecast Graph */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> 90-Minute AI Forecast</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" tick={{fontSize: 10}} axisLine={false} />
                  <YAxis stroke="#475569" tick={{fontSize: 10}} axisLine={false} domain={[0, 'dataMax + 50']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Area type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Active Alerts */}
        <div className="col-span-12 lg:col-span-3">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-lg">
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2"><Siren className="w-4 h-4 text-red-500 animate-pulse" /> Active Alerts</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {prediction.alerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-xl border ${alert.severity === 'high' ? 'bg-red-950/30 border-red-900/50' : 'bg-indigo-950/30 border-indigo-900/50'}`}>
                            <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">{alert.level}</div>
                            <h4 className="text-xs font-bold text-slate-200 mb-1">{isRtl ? alert.messageAr : alert.messageEn}</h4>
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