import { Hospital, AIPredictionResponse } from "../types";

const API_URL = "http://localhost:8000";

export const generateHospitalPrediction = async (
  hospital: Hospital,
  currentTime: Date
): Promise<AIPredictionResponse> => {
  try {
    // Call the Python FastAPI Backend
    const response = await fetch(`${API_URL}/hospitals/${hospital.id}/predict`);
    
    if (!response.ok) {
      throw new Error(`Backend Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate/Transform data if necessary (Schema is 1:1 match currently)
    return data as AIPredictionResponse;

  } catch (error) {
    console.error("Failed to fetch prediction from AI Engine:", error);
    
    // Fallback: Return a 'System Offline' state structure to prevent UI crash
    // In production, this would trigger a global error toast
    return {
      loadForecast: [0, 0, 0],
      modelConfidence: 0,
      qualityIndicators: { expectedWaitTime: 0, ambulanceOffloadTime: 0 },
      factorAnalysis: { seasonalScore: 0, trafficScore: 0, cadVolume: 0 },
      alerts: [{
        id: 'err', timestamp: 'NOW', level: 'T-90', severity: 'high',
        messageEn: "Connection to AI Engine lost.",
        messageAr: "فقد الاتصال بمحرك الذكاء الاصطناعي.",
        actionEn: "Check local server status.",
        actionAr: "تحقق من حالة السيرفر المحلي."
      }],
      transfers: []
    };
  }
};