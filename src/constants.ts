import { Hospital, Ambulance, WeatherZone, Language, TrafficRoute } from './types';

export const TEXT = {
  [Language.EN]: {
    title: "National Command Center for Patient Safety",
    dashboard: "Command Dashboard",
    layers: { hospitals: "Medical Facilities", ambulances: "Joint Field Units", weather: "Environmental Hazards" }
  },
  [Language.AR]: {
    title: "مركز القيادة الوطني لسلامة المرضى",
    dashboard: "لوحة القيادة",
    layers: { hospitals: "المنشآت الطبية", ambulances: "الوحدات الميدانية المشتركة", weather: "المخاطر البيئية" }
  }
};

export const INITIAL_HOSPITALS: Hospital[] = [
  // --- RIYADH SECTOR ---
  { id: 'h1', nameEn: 'KFMC (Riyadh)', nameAr: 'مدينة الملك فهد الطبية', regionEn: 'Central', regionAr: 'الوسطى', coordinates: { x: 24.6923, y: 46.7226 }, capacity: 1200, currentOccupancy: 1150, edFlowRate: 110, trafficIndex: 95, weatherCondition: 'Clear', status: 'Critical', specialties: ['Trauma', 'Burn Unit'] },
  { id: 'h2', nameEn: 'Security Forces Hosp.', nameAr: 'مستشفى قوى الأمن', regionEn: 'Central', regionAr: 'الوسطى', coordinates: { x: 24.6858, y: 46.7324 }, capacity: 500, currentOccupancy: 300, edFlowRate: 45, trafficIndex: 60, weatherCondition: 'Clear', status: 'Normal', specialties: ['General', 'Surgery'] },
  { id: 'h5', nameEn: 'King Salman Hospital', nameAr: 'مستشفى الملك سلمان', regionEn: 'Central', regionAr: 'الوسطى', coordinates: { x: 24.7136, y: 46.6753 }, capacity: 600, currentOccupancy: 450, edFlowRate: 70, trafficIndex: 80, weatherCondition: 'Dusty', status: 'Strain', specialties: ['General'] },
  { id: 'h6', nameEn: 'Riyadh Care Hospital', nameAr: 'مستشفى رعاية الرياض', regionEn: 'Central', regionAr: 'الوسطى', coordinates: { x: 24.6500, y: 46.7500 }, capacity: 400, currentOccupancy: 200, edFlowRate: 30, trafficIndex: 40, weatherCondition: 'Clear', status: 'Normal', specialties: ['Family'] },

  // --- JEDDAH SECTOR ---
  { id: 'h3', nameEn: 'King Fahad General', nameAr: 'مستشفى الملك فهد العام', regionEn: 'Western', regionAr: 'الغربية', coordinates: { x: 21.5645, y: 39.1722 }, capacity: 900, currentOccupancy: 880, edFlowRate: 95, trafficIndex: 88, weatherCondition: 'Heatwave', status: 'Strain', specialties: ['Infectious', 'Respiratory'] },
  { id: 'h4', nameEn: 'East Jeddah Hospital', nameAr: 'مستشفى شرق جدة', regionEn: 'Western', regionAr: 'الغربية', coordinates: { x: 21.5200, y: 39.2200 }, capacity: 400, currentOccupancy: 390, edFlowRate: 60, trafficIndex: 40, weatherCondition: 'Heatwave', status: 'Critical', specialties: ['Trauma'] },
  { id: 'h7', nameEn: 'Soliman Fakeeh', nameAr: 'مستشفى سليمان فقيه', regionEn: 'Western', regionAr: 'الغربية', coordinates: { x: 21.5400, y: 39.1500 }, capacity: 700, currentOccupancy: 600, edFlowRate: 85, trafficIndex: 90, weatherCondition: 'Humid', status: 'Strain', specialties: ['Cardiology'] },
  { id: 'h8', nameEn: 'King Abdulaziz Univ.', nameAr: 'جامعة الملك عبدالعزيز', regionEn: 'Western', regionAr: 'الغربية', coordinates: { x: 21.4880, y: 39.2430 }, capacity: 1000, currentOccupancy: 500, edFlowRate: 50, trafficIndex: 20, weatherCondition: 'Clear', status: 'Normal', specialties: ['Research', 'Oncology'] }
];

export const MOCK_AMBULANCES: Ambulance[] = [
  { id: 'RC-101', status: 'Dispatched', coordinates: { x: 24.7000, y: 46.7000 }, type: 'ALS' },
  { id: 'RC-105', status: 'Transferring', coordinates: { x: 24.6900, y: 46.7100 }, type: 'MICU' },
  { id: 'CD-55', status: 'Idle', coordinates: { x: 21.5500, y: 39.1800 }, type: 'Rescue' },
  { id: 'RC-202', status: 'Transferring', coordinates: { x: 24.6800, y: 46.7500 }, type: 'BLS' },
  { id: 'RC-303', status: 'Dispatched', coordinates: { x: 21.5300, y: 39.2000 }, type: 'ALS' },
];

export const WEATHER_ZONES: WeatherZone[] = [
  { id: 'w1', type: 'Heatwave', coordinates: { x: 21.5433, y: 39.1728 }, radius: 15000, intensity: 'Severe' },
  { id: 'w2', type: 'Sandstorm', coordinates: { x: 24.8000, y: 46.8000 }, radius: 8000, intensity: 'Moderate' },
];

export const TRAFFIC_ROUTES: TrafficRoute[] = [
    { id: 'r1', name: 'Riyadh Ring Rd', coordinates: [[24.8, 46.6], [24.7, 46.8], [24.6, 46.7]], status: 'Congested', color: '#ef4444' },
    { id: 'r2', name: 'King Fahd Rd', coordinates: [[24.65, 46.7], [24.75, 46.72]], status: 'Moderate', color: '#f59e0b' },
    { id: 'j1', name: 'Jeddah Corniche', coordinates: [[21.6, 39.1], [21.5, 39.15], [21.4, 39.18]], status: 'Clear', color: '#10b981' },
    { id: 'j2', name: 'Haramain Hwy', coordinates: [[21.5, 39.25], [21.6, 39.22]], status: 'Congested', color: '#ef4444' }
];