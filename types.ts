export enum Language {
  EN = 'en',
  AR = 'ar'
}

export interface Coordinates {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface Hospital {
  id: string;
  nameEn: string;
  nameAr: string;
  regionEn: string;
  regionAr: string;
  coordinates: Coordinates;
  capacity: number;
  currentOccupancy: number;
  edFlowRate: number; // patients per hour
  trafficIndex: number; // 0-100
  weatherCondition: 'Clear' | 'Rain' | 'Sandstorm' | 'Heatwave';
  status: 'Normal' | 'Strain' | 'Critical';
  specialties: string[];
}

export interface Ambulance {
  id: string;
  status: 'Idle' | 'Dispatched' | 'Transferring';
  coordinates: Coordinates;
  type: 'ALS' | 'BLS';
}

export interface WeatherZone {
  id: string;
  type: 'Rain' | 'Sandstorm' | 'Heatwave';
  coordinates: Coordinates;
  radius: number;
  intensity: 'Moderate' | 'Severe';
}

export interface TransferPrediction {
  sourceId: string;
  targetId: string;
  probability: number;
  reasonEn: string;
  reasonAr: string;
  recommendedSpecialty?: string;
}

export interface PredictionPoint {
  time: string;
  value: number;
  type: 'historical' | 'prediction';
}

export interface Alert {
  id: string;
  timestamp: string;
  level: 'T-90' | 'T-45' | 'T-15';
  messageEn: string;
  messageAr: string;
  actionEn: string;
  actionAr: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AIPredictionResponse {
  loadForecast: number[];
  modelConfidence: number;
  qualityIndicators: {
    expectedWaitTime: number;
    ambulanceOffloadTime: number;
  };
  factorAnalysis: {
    seasonalScore: number;
    trafficScore: number;
    cadVolume: number;
  };
  alerts: Alert[];
  transfers: TransferPrediction[];
}

// --- NEW TYPES FOR LIVE MAP ---
export interface LiveMapData {
    ambulances: Ambulance[];
    weatherZones: WeatherZone[];
}