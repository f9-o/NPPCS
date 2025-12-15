import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from engine import PredictionEngine

# إعداد اللوجز
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentinel-backend")

app = FastAPI(title="Sentinel Predictive Engine", version="2.1.0")

# تفعيل الـ CORS (للاحتياط)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تهيئة محرك الذكاء الاصطناعي
ml_engine = PredictionEngine()

# --- API Routes (نقاط البيانات) ---

@app.get("/api/health") # غيرنا المسار ليكون تحت api
def health_check():
    return {"status": "online", "system": "Sentinel v2.1", "mode": "Integrated"}

@app.get("/hospitals/{hospital_id}/predict")
async def predict_hospital_status(hospital_id: str):
    try:
        logger.info(f"Generating prediction for: {hospital_id}")
        prediction_result = ml_engine.generate_prediction(hospital_id)
        return prediction_result
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI Engine Failure")

# --- Frontend Serving (عرض الموقع) ---

# التأكد من وجود المجلد static (الذي أنشأناه في الـ Dockerfile)
if os.path.exists("static"):
    # 1. ربط ملفات الجافاسكريبت والـ CSS
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    # 2. أي طلب آخر غير الـ API، أرسل له ملف index.html (ليعمل React Router)
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # إذا كان الطلب لملف موجود (مثل أيقونة)، اخدمه مباشرة
        file_path = os.path.join("static", full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
             return FileResponse(file_path)
        
        # وإلا، أرسل الصفحة الرئيسية للموقع
        return FileResponse("static/index.html")
else:
    logger.warning("Static folder not found. Running in API-only mode.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)