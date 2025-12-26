import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from engine import PredictionEngine

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger("nccps-backend")

app = FastAPI(title="NCCPS Core", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print(" NCCPS MVP SYSTEM ONLINE")
    print(" ACCESS DASHBOARD: http://localhost:8000")
    print("="*50 + "\n")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_engine = PredictionEngine()

@app.get("/hospitals/{hospital_id}/predict")
async def predict_hospital_status(hospital_id: str):
    try:
        return ml_engine.generate_prediction(hospital_id)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI Engine Failure")

if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        file_path = os.path.join("static", full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
             return FileResponse(file_path)
        return FileResponse("static/index.html")