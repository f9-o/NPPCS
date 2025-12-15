import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // استيراد ستايل الخريطة
import L from 'leaflet';
import { Hospital, Language, LiveMapData } from '../types';
import { TEXT, MOCK_AMBULANCES, WEATHER_ZONES } from '../constants';
import { Layers, Truck, AlertTriangle } from 'lucide-react';

// إصلاح مشكلة أيقونات Leaflet الافتراضية
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// أيقونة مخصصة للمستشفيات
const createHospitalIcon = (status: string) => {
    const color = status === 'Critical' ? '#ef4444' : status === 'Strain' ? '#f59e0b' : '#10b981';
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

// أيقونة مخصصة للإسعاف
const ambulanceIcon = L.divIcon({
    className: 'custom-amb-icon',
    html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [14, 14]
});

interface DashboardProps {
  hospitals: Hospital[];
  lang: Language;
  onSelectHospital: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ hospitals, lang, onSelectHospital }) => {
  const t = TEXT[lang];
  const isRtl = lang === Language.AR;

  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  // حالة البيانات الحية
  const [liveData, setLiveData] = useState<LiveMapData>({
      ambulances: MOCK_AMBULANCES,
      weatherZones: WEATHER_ZONES
  });

  // محاكاة حركة الإسعاف
  useEffect(() => {
    const interval = setInterval(() => {
        setLiveData(prev => {
            const movedAmbulances = prev.ambulances.map(amb => ({
                ...amb,
                coordinates: {
                    x: amb.coordinates.x + (Math.random() - 0.5) * 0.002, // تحريك بسيط جداً بالإحداثيات
                    y: amb.coordinates.y + (Math.random() - 0.5) * 0.002
                },
                status: amb.status
            }));
            return { ...prev, ambulances: movedAmbulances };
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      
      {/* لوحة التحكم بالطبقات */}
      <div className="absolute top-6 left-6 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {isRtl ? 'طبقات الخريطة' : 'Map Layers'}
        </h3>
        <div className="space-y-3">
            {/* أزرار التحكم */}
            {[
                { label: t.layers.hospitals, state: showHospitals, setter: setShowHospitals, color: 'bg-emerald-500' },
                { label: t.layers.ambulances, state: showAmbulances, setter: setShowAmbulances, color: 'bg-blue-500' },
                { label: t.layers.weather, state: showWeather, setter: setShowWeather, color: 'bg-red-500' }
            ].map((btn, idx) => (
                <label key={idx} className="flex items-center cursor-pointer gap-3">
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors ${btn.state ? 'bg-slate-600' : 'bg-slate-800'}`} onClick={() => btn.setter(!btn.state)}>
                    <div className={`w-3 h-3 ${btn.color} rounded-full shadow-md transform transition-transform ${btn.state ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{btn.label}</span>
                </label>
            ))}
        </div>
      </div>

      {/* حاوية الخريطة الحقيقية */}
      <div className="relative w-[95%] h-[90%] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <MapContainer 
            center={[24.68, 46.72]} // منتصف الرياض
            zoom={12} 
            style={{ height: "100%", width: "100%", background: '#0f172a' }}
            zoomControl={false}
          >
            {/* طبقة الخريطة المظلمة (CartoDB Dark Matter) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            />

            {/* طبقة الطقس (دوائر) */}
            {showWeather && liveData.weatherZones.map(zone => (
                <Circle 
                    key={zone.id}
                    center={[zone.coordinates.x, zone.coordinates.y]}
                    radius={zone.radius}
                    pathOptions={{ 
                        color: zone.type === 'Heatwave' ? 'red' : 'orange', 
                        fillColor: zone.type === 'Heatwave' ? 'red' : 'orange', 
                        fillOpacity: 0.3,
                        weight: 0
                    }}
                />
            ))}

            {/* طبقة المستشفيات */}
            {showHospitals && hospitals.map(h => (
                <Marker 
                    key={h.id} 
                    position={[h.coordinates.x, h.coordinates.y]}
                    icon={createHospitalIcon(h.status)}
                    eventHandlers={{ click: () => onSelectHospital(h.id) }}
                >
                    <Popup className="custom-popup">
                        <div className="text-slate-900 font-bold text-sm text-center">
                            {isRtl ? h.nameAr : h.nameEn}
                            <div className={`text-xs mt-1 ${h.status === 'Critical' ? 'text-red-600' : 'text-emerald-600'}`}>{h.status}</div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* طبقة الإسعاف */}
            {showAmbulances && liveData.ambulances.map(amb => (
                <Marker 
                    key={amb.id} 
                    position={[amb.coordinates.x, amb.coordinates.y]}
                    icon={ambulanceIcon}
                >
                     <Popup>{amb.id} - {amb.status}</Popup>
                </Marker>
            ))}

          </MapContainer>

          {/* تم حذف كلمة KSA من هنا */}
      </div>
    </div>
  );
};

export default Dashboard;