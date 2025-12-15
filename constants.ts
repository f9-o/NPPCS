import { Hospital, Ambulance, WeatherZone, Language } from './types';

export const TEXT = {
  [Language.EN]: {
    title: "National Medical Response",
    dashboard: "Command Center",
    alerts: "Active Alerts",
    details: "Hospital Details",
    forecast: "Predictive ED Load (90 min)",
    occupancy: "Occupancy",
    traffic: "Traffic Index",
    weather: "Weather",
    status: "Status",
    back: "National Map",
    loading: "Calculating Predictions...",
    actions: "Operational Recommendations",
    transfers: "Interfacility Transfer Risk",
    factors: "7-Point Data Fusion",
    layers: {
      hospitals: "Hospitals",
      ambulances: "Live CAD (EMS)",
      weather: "Weather Hazards"
    },
    regions: {
      central: "Central Region",
      western: "Western Region",
      eastern: "Eastern Region"
    }
  },
  [Language.AR]: {
    title: "منصة الاستجابة الطبية الوطنية",
    dashboard: "مركز القيادة والتحكم",
    alerts: "التنبيهات الموقوتة",
    details: "تحليل المستشفى",
    forecast: "التنبؤ بالأحمال (٩٠ دقيقة)",
    occupancy: "الإشغال",
    traffic: "مؤشر الحركة",
    weather: "الطقس",
    status: "الحالة التشغيلية",
    back: "الخريطة الوطنية",
    loading: "جاري حساب التوقعات...",
    actions: "الإجراءات الموصى بها",
    transfers: "توقعات التحويلات البينية",
    factors: "دمج مصادر البيانات الـ ٧",
    layers: {
      hospitals: "المستشفيات",
      ambulances: "الإسعاف (CAD)",
      weather: "مخاطر الطقس"
    },
    regions: {
      central: "المنطقة الوسطى",
      western: "المنطقة الغربية",
      eastern: "المنطقة الشرقية"
    }
  }
};

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    nameEn: 'Central General Hospital',
    nameAr: 'مستشفى المركز العام',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 50, y: 40 },
    capacity: 500,
    currentOccupancy: 350,
    edFlowRate: 45,
    trafficIndex: 82,
    weatherCondition: 'Heatwave',
    status: 'Strain',
    specialties: ['General', 'Respiratory'] // Seasonal flu impacts this
  },
  {
    id: 'h2',
    nameEn: 'King Faisal Specialist',
    nameAr: 'مستشفى الملك فيصل التخصصي',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 45, y: 45 },
    capacity: 800,
    currentOccupancy: 780,
    edFlowRate: 90,
    trafficIndex: 95,
    weatherCondition: 'Heatwave',
    status: 'Critical',
    specialties: ['Trauma', 'Oncology', 'Cardiac'] // Transfers go here
  },
  {
    id: 'h3',
    nameEn: 'Coastal Medical City',
    nameAr: 'مدينة الساحل الطبية',
    regionEn: 'Western',
    regionAr: 'الغربية',
    coordinates: { x: 20, y: 60 },
    capacity: 600,
    currentOccupancy: 200,
    edFlowRate: 20,
    trafficIndex: 30,
    weatherCondition: 'Clear',
    status: 'Normal',
    specialties: ['Infectious Diseases']
  },
  {
    id: 'h4',
    nameEn: 'Eastern Trauma Center',
    nameAr: 'مركز الإصابات الشرقي',
    regionEn: 'Eastern',
    regionAr: 'الشرقية',
    coordinates: { x: 80, y: 30 },
    capacity: 400,
    currentOccupancy: 380,
    edFlowRate: 55,
    trafficIndex: 60,
    weatherCondition: 'Sandstorm',
    status: 'Critical',
    specialties: ['Trauma', 'Respiratory'] // Sandstorm impacts this heavily
  }
];

export const MOCK_AMBULANCES: Ambulance[] = [
  { id: 'a1', status: 'Dispatched', coordinates: { x: 48, y: 42 }, type: 'ALS' },
  { id: 'a2', status: 'Transferring', coordinates: { x: 46, y: 44 }, type: 'ALS' },
  { id: 'a3', status: 'Idle', coordinates: { x: 52, y: 38 }, type: 'BLS' },
  { id: 'a4', status: 'Dispatched', coordinates: { x: 82, y: 32 }, type: 'ALS' },
  { id: 'a5', status: 'Idle', coordinates: { x: 22, y: 62 }, type: 'BLS' },
];

export const WEATHER_ZONES: WeatherZone[] = [
  { id: 'w1', type: 'Heatwave', coordinates: { x: 48, y: 42 }, radius: 15, intensity: 'Severe' },
  { id: 'w2', type: 'Sandstorm', coordinates: { x: 85, y: 25 }, radius: 12, intensity: 'Moderate' },
];
