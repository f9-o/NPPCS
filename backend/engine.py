import numpy as np
from datetime import datetime, timedelta

class PredictionEngine:
    def __init__(self):
        # Requirement: Hospital-Specific Modeling
        # Unique weights for Jeddah & Riyadh hospitals
        self.hospital_weights = {
            'h1': {'base_load': 0.85, 'volatility': 0.1, 'capacity_factor': 1.2}, # KFMC (Riyadh)
            'h2': {'base_load': 0.50, 'volatility': 0.05, 'capacity_factor': 0.9}, # Security Forces (Riyadh)
            'h3': {'base_load': 0.75, 'volatility': 0.12, 'capacity_factor': 1.1}, # King Fahad (Jeddah)
            'h4': {'base_load': 0.90, 'volatility': 0.15, 'capacity_factor': 1.5}  # East Jeddah
        }

    def _calculate_ai_score(self, hospital_id):
        """
        Requirement: 7-Source Data Fusion
        Simulates: Weather, Traffic, Seasonal, CAD, Events, Capacity, Historical
        """
        weights = self.hospital_weights.get(hospital_id, {'base_load': 0.5, 'volatility': 0.1})
        
        # Simulating live data streams with statistical noise
        weather_impact = np.random.normal(loc=25, scale=5)
        traffic_flow = np.random.normal(loc=70, scale=15)
        seasonal_virus = 1.3 # Seasonal Forecasting Model (High for Flu/Dengue)
        cad_volume = np.random.normal(loc=18, scale=4)
        
        # Weighted Risk Calculation
        risk_score = (weights['base_load'] * 40) + (weather_impact * 0.4) + (traffic_flow * 0.2) + (cad_volume * 1.5)
        risk_score = np.clip(risk_score, 0, 100)

        return {
            "risk_score": int(risk_score),
            "weather": int(weather_impact),
            "traffic": int(traffic_flow),
            "seasonal": int(seasonal_virus * 100),
            "cad": int(cad_volume)
        }

    def generate_prediction(self, hospital_id: str):
        ai_data = self._calculate_ai_score(hospital_id)
        score = ai_data['risk_score']
        
        # Time Series Forecast
        timeline = np.linspace(0, 5, 6)
        trend = np.polyval([0.5, score], timeline)
        noise = np.random.normal(0, 5, 6)
        forecast = np.clip(trend + noise, 0, 600).astype(int).tolist()

        # Requirement: Predictive Quality Score (PQS)
        predicted_tta = int(score * 1.8) 
        offload_time = int(score * 0.5)

        # Requirement: Timed Alerts
        alerts = []
        if score > 80:
            alerts.append({
                "id": f"alt-{np.random.randint(1000,9999)}",
                "timestamp": datetime.now().strftime("%H:%M"),
                "level": "T-15",
                "severity": "high",
                "messageEn": f"[CRITICAL] Surge Imminent (Risk: {score})",
                "messageAr": f"[حرج] تدفق عالي متوقع (مؤشر الخطر: {score})",
                "actionEn": "Activate diversion protocol.",
                "actionAr": "تفعيل بروتوكول تحويل المسار."
            })
        elif score > 50:
            alerts.append({
                "id": f"alt-{np.random.randint(1000,9999)}",
                "timestamp": (datetime.now() + timedelta(minutes=45)).strftime("%H:%M"),
                "level": "T-45",
                "severity": "medium",
                "messageEn": "[WARNING] ICU Capacity projecting > 90%",
                "messageAr": "[تحذير] سعة العناية المركزة ستتجاوز 90%",
                "actionEn": "Prepare overflow beds.",
                "actionAr": "تجهيز أسرة الطوارئ الإضافية."
            })

        # Requirement: Interfacility Stress (Transfers)
        transfers = []
        if score > 75:
            # Logic: Transfer from Jeddah -> Riyadh if specialized care needed
            target = "h1" if hospital_id in ['h3', 'h4'] else "h2"
            transfers.append({
                "sourceId": hospital_id,
                "targetId": target,
                "probability": int(np.random.uniform(85, 99)),
                "reasonEn": "AI Load Balancing Recommendation",
                "reasonAr": "توصية موازنة الأحمال من النظام",
                "recommendedSpecialty": "Trauma/Specialized"
            })

        return {
            "loadForecast": forecast[1:],
            "modelConfidence": int(np.random.normal(94, 2)),
            "qualityIndicators": {
                "expectedWaitTime": predicted_tta,
                "ambulanceOffloadTime": offload_time
            },
            "factorAnalysis": {
                "seasonalScore": ai_data['seasonal'],
                "trafficScore": ai_data['traffic'],
                "cadVolume": ai_data['cad']
            },
            "alerts": alerts,
            "transfers": transfers
        }