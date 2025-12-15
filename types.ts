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
  specialties: string[]; // e.g., "Trauma", "Respiratory", "Pediatric"
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
  coordinates: Coordinates; // Center
  radius: number; // Size of the hazard
  intensity: 'Moderate' | 'Severe';
}

export interface TransferPrediction {
  sourceId: string;
  targetId: string;
  probability: number; // 0-100
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
  modelConfidence: number; // 0-100% Score
  qualityIndicators: {
    expectedWaitTime: number; // TTA
    ambulanceOffloadTime: number;
  };
  factorAnalysis: {
    seasonalScore: number; // Impact of seasonal diseases
    trafficScore: number;
    cadVolume: number;
  };
  alerts: Alert[];
  transfers: TransferPrediction[];
}