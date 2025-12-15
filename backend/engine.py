import random
import numpy as np
from datetime import datetime, timedelta

class PredictionEngine:
    def __init__(self):
        # Mock historical patterns (Weights)
        self.seasonal_weights = {
            'h1': 1.2, # Central General - High Flu impact
            'h2': 1.0, # King Faisal - Steady
            'h3': 0.8, # Coastal - Less variance
            'h4': 1.5  # Eastern - Sandstorm sensitive
        }
        
    def _simulate_7_sources(self, hospital_id):
        """
        Simulates the data fusion from 7 live sources as requested in the RFP.
        """
        # 1. Weather Impact (Simulated based on region logic)
        weather_stress = random.uniform(0, 20) if hospital_id == 'h4' else random.uniform(0, 5)
        
        # 2. Traffic Index (Live API Mock)
        traffic_load = random.randint(40, 95)
        
        # 3. Seasonal Viral Load (Flu/Respiratory Season)
        seasonal_factor = self.seasonal_weights.get(hospital_id, 1.0) * random.uniform(0.9, 1.1)
        
        # 4. CAD (Computer Aided Dispatch) Volume
        active_ambulances = random.randint(5, 25)
        
        return {
            "weather": weather_stress,
            "traffic": traffic_load,
            "seasonal": seasonal_factor,
            "cad": active_ambulances
        }

    def generate_prediction(self, hospital_id: str):
        """
        Generates the full AIPredictionResponse object matching the TypeScript interface.
        """
        
        # Get live factors
        factors = self._simulate_7_sources(hospital_id)
        
        # --- Logic 1: Load Forecasting (Next 90 mins) ---
        # Using a simple random walk with drift based on factors
        base_load = 300 # Base occupancy
        forecast = []
        current_val = base_load + factors['traffic']
        
        for _ in range(5): # 5 data points into the future
            change = np.random.normal(0, 10) # Random noise
            current_val += change * factors['seasonal']
            forecast.append(int(max(0, current_val)))

        # --- Logic 2: Quality Indicators (Predictive Quality Score) ---
        # TTA (Time to Assessment) increases with Load
        predicted_tta = int((forecast[-1] / 10) * factors['seasonal'])
        offload_time = int(random.uniform(10, 45))

        # --- Logic 3: Timed Alerts Engine ---
        alerts = []
        # T-90 Alert
        if factors['seasonal'] > 1.3:
             alerts.append({
                "id": f"alt-{random.randint(1000,9999)}",
                "timestamp": (datetime.now() + timedelta(minutes=90)).strftime("%H:%M"),
                "level": "T-90",
                "severity": "medium",
                "messageEn": "Predictive Surge: Respiratory inflow expected.",
                "messageAr": "توقعات بارتفاع الحالات التنفسية.",
                "actionEn": "Activate overflow zone B.",
                "actionAr": "تفعيل منطقة الطوارئ ب."
            })
        
        # T-15 Critical Alert (if Traffic + Load is high)
        if factors['traffic'] > 80:
            alerts.append({
                "id": f"alt-{random.randint(1000,9999)}",
                "timestamp": (datetime.now() + timedelta(minutes=15)).strftime("%H:%M"),
                "level": "T-15",
                "severity": "high",
                "messageEn": "CRITICAL: Mass casualty traffic incident probable.",
                "messageAr": "حرج: احتمالية وصول إصابات حادث مروري.",
                "actionEn": "Clear trauma bays 1-4 immediately.",
                "actionAr": "إخلاء غرف الإنعاش 1-4 فوراً."
            })

        # --- Logic 4: Interfacility Transfers ---
        # Predict if patients need to move FROM this hospital TO another
        transfers = []
        if predicted_tta > 60: # If wait time is too long
            transfers.append({
                "sourceId": hospital_id,
                "targetId": "h2" if hospital_id != "h2" else "h1", # Logic: Refer to King Faisal usually
                "probability": random.randint(70, 95),
                "reasonEn": "Capacity Saturation (TTA > 60m)",
                "reasonAr": "تشبع السعة (وقت الانتظار > 60 دقيقة)",
                "recommendedSpecialty": "Trauma"
            })

        # Construct Final JSON
        response = {
            "loadForecast": forecast,
            "modelConfidence": random.randint(85, 98), # Mock accuracy score
            "qualityIndicators": {
                "expectedWaitTime": predicted_tta,
                "ambulanceOffloadTime": offload_time
            },
            "factorAnalysis": {
                "seasonalScore": int(factors['seasonal'] * 100),
                "trafficScore": factors['traffic'],
                "cadVolume": factors['cad']
            },
            "alerts": alerts,
            "transfers": transfers
        }
        
        return response