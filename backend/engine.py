import numpy as np
import random
from datetime import datetime, timedelta

class PredictionEngine:
    def __init__(self):
        # Hospital-Specific Modeling: Weighted factors
        self.hospital_weights = {
            'h1': {'base_load': 0.85, 'volatility': 0.1, 'capacity_factor': 1.2},
            'h2': {'base_load': 0.50, 'volatility': 0.05, 'capacity_factor': 0.9},
            'h3': {'base_load': 0.75, 'volatility': 0.12, 'capacity_factor': 1.1},
            'h4': {'base_load': 0.90, 'volatility': 0.15, 'capacity_factor': 1.5},
            # New Hospitals
            'h5': {'base_load': 0.60, 'volatility': 0.08, 'capacity_factor': 1.0},
            'h6': {'base_load': 0.40, 'volatility': 0.04, 'capacity_factor': 0.8},
            'h7': {'base_load': 0.70, 'volatility': 0.10, 'capacity_factor': 1.1},
            'h8': {'base_load': 0.55, 'volatility': 0.06, 'capacity_factor': 1.3}
        }

    def _calculate_ai_score(self, hospital_id):
        # Default to average if ID not found
        weights = self.hospital_weights.get(hospital_id, {'base_load': 0.5, 'volatility': 0.1})
        
        weather_impact = np.random.normal(loc=25, scale=5)
        traffic_flow = np.random.normal(loc=70, scale=15)
        cad_volume = np.random.normal(loc=18, scale=4)
        
        risk_score = (weights['base_load'] * 40) + (weather_impact * 0.4) + (traffic_flow * 0.2) + (cad_volume * 1.5)
        risk_score = np.clip(risk_score, 0, 100)

        return {
            "risk_score": int(risk_score),
            "weather": int(weather_impact),
            "traffic": int(traffic_flow),
            "cad": int(cad_volume)
        }

    def generate_prediction(self, hospital_id: str):
        ai_data = self._calculate_ai_score(hospital_id)
        score = ai_data['risk_score']
        
        timeline = np.linspace(0, 5, 6)
        trend = np.polyval([0.5, score], timeline)
        noise = np.random.normal(0, 5, 6)
        forecast = np.clip(trend + noise, 0, 600).astype(int).tolist()

        predicted_tta = int(score * 1.8) 
        offload_time = int(score * 0.5)
        inbound_ems = int((score / 100) * 8) + random.randint(0, 2)

        root_cause_en = "Normal Operations"
        root_cause_ar = "العمليات طبيعية"
        
        if score > 80:
            root_cause_en = "Compound Factor: Severe Weather + High Traffic Influx"
            root_cause_ar = "عامل مركب: سوء الأحوال الجوية + تدفق مروري عالي"
        elif score > 60:
            root_cause_en = "High ED Walk-in Volume"
            root_cause_ar = "ارتفاع عدد المراجعين (Walk-in) للطوارئ"

        alerts = []
        if score > 80:
            alerts.append({
                "id": f"alt-crit",
                "timestamp": datetime.now().strftime("%H:%M"),
                "level": "T-15",
                "severity": "high",
                "messageEn": f"CRITICAL SURGE: Capacity > 95%",
                "messageAr": f"تدفق حرج: السعة تجاوزت 95%",
                "actionEn": "Divert all non-critical BLS.",
                "actionAr": "تحويل جميع الحالات غير الحرجة."
            })
        if score > 50:
            alerts.append({
                "id": f"alt-warn",
                "timestamp": (datetime.now() + timedelta(minutes=45)).strftime("%H:%M"),
                "level": "T-45",
                "severity": "medium",
                "messageEn": "ICU Saturation Warning",
                "messageAr": "تحذير تشبع العناية المركزة",
                "actionEn": "Prepare overflow area.",
                "actionAr": "تجهيز منطقة الفائض."
            })
        
        alerts.append({
            "id": f"alt-info",
            "timestamp": datetime.now().strftime("%H:%M"),
            "level": "INFO",
            "severity": "low",
            "messageEn": "Weather Advisory in Effect",
            "messageAr": "تنبيه جوي ساري المفعول",
            "actionEn": "Monitor incoming traffic.",
            "actionAr": "مراقبة الحركة القادمة."
        })

        transfers = []
        if score > 75:
            target = "h1" if hospital_id in ['h3', 'h4', 'h7', 'h8'] else "h2"
            transfers.append({
                "sourceId": hospital_id,
                "targetId": target,
                "probability": int(np.random.uniform(85, 99)),
                "reasonEn": "Capacity Saturation",
                "reasonAr": "تشبع السعة السريرية",
                "recommendedSpecialty": "Trauma"
            })

        return {
            "loadForecast": forecast[1:],
            "modelConfidence": int(np.random.normal(94, 2)),
            "qualityIndicators": {
                "expectedWaitTime": predicted_tta,
                "ambulanceOffloadTime": offload_time,
                "inboundEmsCount": inbound_ems,
                "rootCauseEn": root_cause_en,
                "rootCauseAr": root_cause_ar
            },
            "alerts": alerts,
            "transfers": transfers
        }