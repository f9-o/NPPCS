import { Hospital, Ambulance, WeatherZone, Language } from './types';

export const TEXT = {
  [Language.EN]: {
    title: "National Medical Response",
    dashboard: "Command Center",
    alerts: "Active Alerts",
    details: "Hospital Details",
    forecast: "Predictive ED Load (90 min)",
    layers: { hospitals: "Hospitals", ambulances: "Live CAD (EMS)", weather: "Weather Hazards" }
  },
  [Language.AR]: {
    title: "منصة الاستجابة الطبية الوطنية",
    dashboard: "مركز القيادة والتحكم",
    alerts: "التنبيهات الموقوتة",
    details: "تحليل المستشفى",
    forecast: "التنبؤ بالأحمال (٩٠ دقيقة)",
    layers: { hospitals: "المستشفيات", ambulances: "الإسعاف (CAD)", weather: "مخاطر الطقس" }
  }
};

// إحداثيات حقيقية في الرياض
export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    nameEn: 'Central General Hospital',
    nameAr: 'مستشفى الشميسي العام',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 24.6366, y: 46.7107 }, // خط العرض والطول
    capacity: 500,
    currentOccupancy: 350,
    edFlowRate: 45,
    trafficIndex: 82,
    weatherCondition: 'Heatwave',
    status: 'Strain',
    specialties: ['General', 'Respiratory']
  },
  {
    id: 'h2',
    nameEn: 'King Faisal Specialist',
    nameAr: 'مستشفى الملك فيصل التخصصي',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 24.6734, y: 46.6766 },
    capacity: 800,
    currentOccupancy: 780,
    edFlowRate: 90,
    trafficIndex: 95,
    weatherCondition: 'Heatwave',
    status: 'Critical',
    specialties: ['Trauma', 'Oncology', 'Cardiac']
  },
  {
    id: 'h3',
    nameEn: 'Riyadh Care Hospital',
    nameAr: 'مستشفى رعاية الرياض',
    regionEn: 'East',
    regionAr: 'الشرق',
    coordinates: { x: 24.6946, y: 46.7865 },
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
    nameEn: 'Security Forces Hospital',
    nameAr: 'مستشفى قوى الأمن',
    regionEn: 'Central',
    regionAr: 'الوسطى',
    coordinates: { x: 24.6858, y: 46.7324 },
    capacity: 400,
    currentOccupancy: 380,
    edFlowRate: 55,
    trafficIndex: 60,
    weatherCondition: 'Sandstorm',
    status: 'Critical',
    specialties: ['Trauma', 'Respiratory']
  }
];

export const MOCK_AMBULANCES: Ambulance[] = [
  { id: 'a1', status: 'Dispatched', coordinates: { x: 24.6500, y: 46.7000 }, type: 'ALS' },
  { id: 'a2', status: 'Transferring', coordinates: { x: 24.6800, y: 46.6800 }, type: 'ALS' },
  { id: 'a3', status: 'Idle', coordinates: { x: 24.7000, y: 46.7500 }, type: 'BLS' },
  { id: 'a4', status: 'Dispatched', coordinates: { x: 24.6600, y: 46.7200 }, type: 'ALS' },
  { id: 'a5', status: 'Idle', coordinates: { x: 24.6900, y: 46.6600 }, type: 'BLS' },
];

export const WEATHER_ZONES: WeatherZone[] = [
  { id: 'w1', type: 'Heatwave', coordinates: { x: 24.6700, y: 46.7100 }, radius: 3000, intensity: 'Severe' }, // Radius in meters
  { id: 'w2', type: 'Sandstorm', coordinates: { x: 24.7500, y: 46.8000 }, radius: 5000, intensity: 'Moderate' },
];