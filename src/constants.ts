import { Hospital, Ambulance, WeatherZone, Language } from './types';

export const TEXT = {
  [Language.EN]: {
    title: "National Joint Operations Center",
    dashboard: "Command Dashboard",
    layers: { hospitals: "Medical Facilities", ambulances: "Joint Field Units", weather: "Environmental Hazards" }
  },
  [Language.AR]: {
    title: "مركز العمليات المشتركة الوطني",
    dashboard: "لوحة القيادة",
    layers: { hospitals: "المنشآت الطبية", ambulances: "الوحدات الميدانية المشتركة", weather: "المخاطر البيئية" }
  }
};

export const INITIAL_HOSPITALS: Hospital[] = [
  // --- RIYADH SECTOR ---
  {
    id: 'h1',
    nameEn: 'KFMC (Riyadh)',
    nameAr: 'مدينة الملك فهد الطبية (الرياض)',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 24.6923, y: 46.7226 },
    capacity: 1200,
    currentOccupancy: 1150,
    edFlowRate: 110,
    trafficIndex: 95,
    weatherCondition: 'Clear',
    status: 'Critical',
    specialties: ['Trauma', 'Burn Unit']
  },
  {
    id: 'h2',
    nameEn: 'Security Forces Hosp. (Riyadh)',
    nameAr: 'مستشفى قوى الأمن (الرياض)',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 24.6858, y: 46.7324 },
    capacity: 500,
    currentOccupancy: 300,
    edFlowRate: 45,
    trafficIndex: 60,
    weatherCondition: 'Clear',
    status: 'Normal',
    specialties: ['General', 'Surgery']
  },
  // --- JEDDAH SECTOR ---
  {
    id: 'h3',
    nameEn: 'King Fahad General (Jeddah)',
    nameAr: 'مستشفى الملك فهد العام (جدة)',
    regionEn: 'Western',
    regionAr: 'الغربية',
    coordinates: { x: 21.5645, y: 39.1722 },
    capacity: 900,
    currentOccupancy: 880,
    edFlowRate: 95,
    trafficIndex: 88,
    weatherCondition: 'Heatwave',
    status: 'Strain',
    specialties: ['Infectious', 'Respiratory']
  },
  {
    id: 'h4',
    nameEn: 'East Jeddah Hospital',
    nameAr: 'مستشفى شرق جدة',
    regionEn: 'Western',
    regionAr: 'الغربية',
    coordinates: { x: 21.5200, y: 39.2200 },
    capacity: 400,
    currentOccupancy: 390,
    edFlowRate: 60,
    trafficIndex: 40,
    weatherCondition: 'Heatwave',
    status: 'Critical',
    specialties: ['Trauma']
  }
];

export const MOCK_AMBULANCES: Ambulance[] = [
  { id: 'RC-101', status: 'Dispatched', coordinates: { x: 24.7000, y: 46.7000 }, type: 'ALS' },
  { id: 'CD-55', status: 'Idle', coordinates: { x: 21.5500, y: 39.1800 }, type: 'Rescue' },
  { id: 'RC-202', status: 'Transferring', coordinates: { x: 24.6800, y: 46.7500 }, type: 'BLS' },
];

export const WEATHER_ZONES: WeatherZone[] = [
  { id: 'w1', type: 'Heatwave', coordinates: { x: 21.5433, y: 39.1728 }, radius: 15000, intensity: 'Severe' },
  { id: 'w2', type: 'Sandstorm', coordinates: { x: 24.8000, y: 46.8000 }, radius: 8000, intensity: 'Moderate' },
];