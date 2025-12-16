export enum Language {
  EN = 'en',
  AR = 'ar'
}

export interface Coordinates {
  x: number;
  y: number;
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
  edFlowRate: number;
  trafficIndex: number;
  weatherCondition: string;
  status: 'Normal' | 'Strain' | 'Critical';
  specialties: string[];
}

export interface Ambulance {
  id: string;
  status: string;
  coordinates: Coordinates;
  type: string;
}

export interface WeatherZone {
  id: string;
  type: string;
  coordinates: Coordinates;
  radius: number;
  intensity: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  level: string;
  messageEn: string;
  messageAr: string;
  actionEn: string;
  actionAr: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Transfer {
  sourceId: string;
  targetId: string;
  probability: number;
  reasonEn: string;
  reasonAr: string;
  recommendedSpecialty: string;
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
  transfers: Transfer[];
}

export interface LiveMapData {
    ambulances: Ambulance[];
    weatherZones: WeatherZone[];
}