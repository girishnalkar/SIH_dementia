"""
FastAPI Backend Application for Smriti Sahayak (স্মৃতি সহায়ক).
Provides REST endpoints for Patient Mobile Clients, Caregiver Portals, AI DDA, and Offline Delta Sync.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time

from app.services.dda_algorithm import dda_engine
from app.services.ml_cognitive_engine import cognitive_engine
from app.services.speech_service import speech_service

app = FastAPI(
    title="Smriti Sahayak API",
    description="AI Cognitive Gaming, Memory Assistance, and Dementia Clinical Telemetry Platform",
    version="1.0.0"
)

# Enable CORS for Web and Mobile Clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Data Models
# -----------------------------------------------------------------------------
class GameSessionPayload(BaseModel):
    patient_id: str = "PAT-7401"
    game_type: str = "face_recall" # face_recall | sequencing | cultural_match | sound_memory
    score: float = 10.0
    latency_ms: float = 1420.0
    is_correct: bool = True
    hints_used: int = 0
    client_timestamp: float = Field(default_factory=time.time)

class MedicationConfirmPayload(BaseModel):
    medication_id: str
    patient_id: str = "PAT-7401"
    confirmed_by: str = "patient_voice" # patient_tap | patient_voice | caregiver

class SyncDeltaPayload(BaseModel):
    patient_id: str = "PAT-7401"
    last_sync_timestamp: float
    offline_game_sessions: List[GameSessionPayload] = []
    offline_med_logs: List[Dict[str, Any]] = []

class VoiceQueryPayload(BaseModel):
    transcript: str
    language: str = "as"

# -----------------------------------------------------------------------------
# In-Memory DB Mock Store (Simulating PostgreSQL)
# -----------------------------------------------------------------------------
DB_PATIENT = {
    "id": "PAT-7401",
    "name": "Biren Hazarika",
    "age": 74,
    "stage": "Mild-Moderate Dementia (AD Stage 3)",
    "location": "Guwahati, Assam",
    "baseline_cognitive_index": 78.0,
    "reaction_history_ms": [1200, 1350, 1420, 1500, 1420],
    "game_scores": [80, 75, 85, 78, 82],
    "med_compliance_rate": 0.94
}

# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Smriti Sahayak Backend Engine",
        "timestamp": time.time()
    }

@app.get("/api/patient/profile")
def get_patient_profile():
    return DB_PATIENT

@app.post("/api/games/session/log")
def log_game_session(payload: GameSessionPayload):
    DB_PATIENT["game_scores"].append(payload.score)
    DB_PATIENT["reaction_history_ms"].append(payload.latency_ms)

    # Compute next DDA parameters
    recent_sessions = [{
        "latency_ms": payload.latency_ms,
        "is_correct": payload.is_correct,
        "hints_used": payload.hints_used
    }]
    next_dda = dda_engine.compute_difficulty(current_level=2, recent_sessions=recent_sessions)
    
    return {
        "status": "logged",
        "next_game_dda": next_dda,
        "recorded_at": time.time()
    }

@app.get("/api/analytics/cognitive_summary")
def get_cognitive_summary():
    summary = cognitive_engine.compute_cognitive_index(
        recent_game_scores=DB_PATIENT["game_scores"][-10:],
        reaction_latencies_ms=DB_PATIENT["reaction_history_ms"][-10:],
        med_compliance_rate=DB_PATIENT["med_compliance_rate"]
    )
    return summary

@app.post("/api/sync/delta")
def sync_offline_delta(payload: SyncDeltaPayload):
    """
    Bi-directional synchronization endpoint for offline SQLite client sync.
    """
    for session in payload.offline_game_sessions:
        DB_PATIENT["game_scores"].append(session.score)
        DB_PATIENT["reaction_history_ms"].append(session.latency_ms)

    return {
        "sync_status": "success",
        "merged_sessions_count": len(payload.offline_game_sessions),
        "server_timestamp": time.time(),
        "updated_cognitive_summary": cognitive_engine.compute_cognitive_index(
            recent_game_scores=DB_PATIENT["game_scores"][-10:],
            reaction_latencies_ms=DB_PATIENT["reaction_history_ms"][-10:],
            med_compliance_rate=DB_PATIENT["med_compliance_rate"]
        )
    }

@app.post("/api/voice/process")
def process_voice(payload: VoiceQueryPayload):
    return speech_service.process_voice_query(
        transcript=payload.transcript,
        lang=payload.language
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
