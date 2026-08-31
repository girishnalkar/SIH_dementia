"""
FastAPI Backend Application for Smriti Sahayak (স্মৃতি সহায়ক).
Provides REST endpoints for Tri-Portal Architecture with Role-Based Access Control (RBAC):
1. Patient Mobile Companion (Cognitive Games, DDA, Voice Grounding, Med Confirmations)
2. Caregiver / Family Portal (Live Monitoring, Reminiscence Vault, Doctor Messaging)
3. Doctor / Clinician Portal (Clinical Telemetry, MMSE Radar, Prescription Desk, Clinical Notes, Report Synthesis)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time
import uuid

from app.services.dda_algorithm import dda_engine
from app.services.ml_cognitive_engine import cognitive_engine
from app.services.speech_service import speech_service

app = FastAPI(
    title="Smriti Sahayak Tri-Portal API",
    description="AI Cognitive Gaming, Memory Assistance, Caregiver Family Desk, and Dementia Clinical Telemetry Platform with RBAC",
    version="2.1.0"
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
class LoginPayload(BaseModel):
    role: str # 'patient' | 'caregiver' | 'doctor'
    username: Optional[str] = None
    password: Optional[str] = None
    patient_id: Optional[str] = "PAT-7401"

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
    language: str = "en"

class PrescriptionCreatePayload(BaseModel):
    patient_id: str = "PAT-7401"
    name: str
    dose: str
    frequency: str = "Once Daily"
    time: str = "08:30 AM"
    color: str = "#3b82f6"
    shape: str = "round"
    clinical_rationale: str = "Cognitive enhancement & symptom management"
    instructions_en: str = "Take with morning water."
    instructions_as: Optional[str] = "ৰাতিপুৱা পানীৰে সৈতে লওক।"
    instructions_bn: Optional[str] = "সকালে জল দিয়ে খান।"
    instructions_hi: Optional[str] = "सुबह पानी के साथ लें।"

class ClinicalNotePayload(BaseModel):
    patient_id: str = "PAT-7401"
    doctor_name: str = "Dr. H. Baruah, MD"
    consult_type: str = "Routine Longitudinal Follow-up"
    mmse_in_clinic: int = 22
    cdr_score: float = 1.0 # Clinical Dementia Rating
    fast_stage: str = "Stage 3 (Mild Cognitive Impairment / Early AD)"
    clinical_observations: str
    therapeutic_plan: str

class CaregiverMessagePayload(BaseModel):
    patient_id: str = "PAT-7401"
    sender_role: str = "caregiver" # 'caregiver' | 'doctor'
    sender_name: str = "Priya Hazarika (Daughter)"
    message: str
    urgency: str = "normal" # 'normal' | 'urgent'

class VaultItemPayload(BaseModel):
    patient_id: str = "PAT-7401"
    title: str
    relation: str
    image_url: str = "assets/family.jpg"
    audio_en: str
    audio_as: Optional[str] = None
    audio_bn: Optional[str] = None
    audio_hi: Optional[str] = None
    calming_anchor: bool = True

class ReportRequestPayload(BaseModel):
    patient_id: str = "PAT-7401"
    include_raw_telemetry: bool = True

class QuizQuestionPayload(BaseModel):
    patient_id: str = "PAT-7401"
    question_text: str
    options: List[str]
    correct_option: str
    hint: Optional[str] = None
    category: str = "Family Trivia"
    created_by: str = "Priya Hazarika (Daughter)"

# -----------------------------------------------------------------------------
# In-Memory DB Store (Multi-Patient & Tri-Portal Registry)
# -----------------------------------------------------------------------------
DB_USERS = {
    "doctor": {
        "id": "DOC-108",
        "role": "doctor",
        "name": "Dr. H. Baruah, MD (Neurology), DM",
        "email": "dr.baruah@neuro.care",
        "license": "MCI-78401",
        "facility": "Guwahati Neurological Center",
        "token": "tok_doc_99a8b7"
    },
    "caregiver": {
        "id": "CG-7401",
        "role": "caregiver",
        "name": "Priya Hazarika (Daughter)",
        "email": "priya@smriti.care",
        "relation": "Daughter & Primary Caregiver",
        "token": "tok_cg_44f3e2"
    },
    "patient": {
        "id": "PAT-7401",
        "role": "patient",
        "name": "Biren Hazarika (Biren Babu)",
        "age": 74,
        "token": "tok_pat_11d2c3"
    }
}

DB_PATIENTS: Dict[str, Dict[str, Any]] = {
    "PAT-7401": {
        "id": "PAT-7401",
        "name": "Biren Hazarika",
        "age": 74,
        "gender": "Male",
        "stage": "Mild-Moderate Dementia (AD Stage 3)",
        "location": "Guwahati, Assam",
        "primary_caregiver": "Priya Hazarika (Daughter)",
        "caregiver_contact": "+91 98640 12345",
        "attending_physician": "Dr. H. Baruah, MD",
        "baseline_cognitive_index": 78.0,
        "mmse_score": 22,
        "reaction_history_ms": [1200, 1350, 1420, 1500, 1420],
        "game_scores": [80, 75, 85, 78, 82],
        "med_compliance_rate": 0.94,
        "gps_status": {
            "status": "safe",
            "zone": "Guwahati Home Perimeter (Sector 4)",
            "battery_pct": 88,
            "last_ping": "2 mins ago"
        }
    },
    "PAT-7402": {
        "id": "PAT-7402",
        "name": "Anjali Devi",
        "age": 71,
        "gender": "Female",
        "stage": "Early Mild Cognitive Impairment",
        "location": "Jorhat, Assam",
        "primary_caregiver": "Rahul Devi (Son)",
        "caregiver_contact": "+91 98640 54321",
        "attending_physician": "Dr. H. Baruah, MD",
        "baseline_cognitive_index": 84.0,
        "mmse_score": 25,
        "reaction_history_ms": [950, 1020, 980, 1050, 990],
        "game_scores": [88, 85, 92, 90, 89],
        "med_compliance_rate": 0.98,
        "gps_status": {
            "status": "safe",
            "zone": "Jorhat Tea Estate Residence",
            "battery_pct": 92,
            "last_ping": "5 mins ago"
        }
    },
    "PAT-7403": {
        "id": "PAT-7403",
        "name": "Naren Phukan",
        "age": 79,
        "gender": "Male",
        "stage": "Moderate Dementia (AD Stage 4)",
        "location": "Dibrugarh, Assam",
        "primary_caregiver": "Kabita Phukan (Spouse)",
        "caregiver_contact": "+91 98640 98765",
        "attending_physician": "Dr. H. Baruah, MD",
        "baseline_cognitive_index": 62.0,
        "mmse_score": 17,
        "reaction_history_ms": [2100, 2400, 2600, 2300, 2550],
        "game_scores": [60, 58, 65, 62, 59],
        "med_compliance_rate": 0.86,
        "gps_status": {
            "status": "wander_alert",
            "zone": "Near Dibrugarh Park (Outside primary boundary)",
            "battery_pct": 45,
            "last_ping": "Just now"
        }
    }
}

DB_PRESCRIPTIONS: Dict[str, List[Dict[str, Any]]] = {
    "PAT-7401": [
        {
            "id": "rx-101",
            "name": "Donepezil Hydrochloride",
            "dose": "5 mg - 1 Tablet",
            "frequency": "Once Daily (Morning)",
            "time": "08:30 AM",
            "color": "#3b82f6",
            "shape": "round",
            "prescribed_by": "Dr. H. Baruah, MD",
            "date_prescribed": "2026-08-15",
            "clinical_rationale": "Acetylcholinesterase inhibitor for memory stabilization",
            "instructions": {
                "en": "Take 1 blue tablet after morning tea with water.",
                "as": "ৰাতিপুৱাৰ চাহ খোৱাৰ পিছত ১টা নীলা টেবলেট পানীৰে সৈতে লওক।",
                "bn": "সকালের চা পানের পর ১টি নীল ট্যাবলেট জল দিয়ে নিন।",
                "hi": "सुबह की चाय के बाद 1 नीली गोली पानी के साथ लें।"
            }
        },
        {
            "id": "rx-102",
            "name": "Amlodipine Besylate",
            "dose": "5 mg - 1 Tablet",
            "frequency": "Once Daily (Afternoon)",
            "time": "01:30 PM",
            "color": "#f59e0b",
            "shape": "oval",
            "prescribed_by": "Dr. H. Baruah, MD",
            "date_prescribed": "2026-07-20",
            "clinical_rationale": "Blood pressure management to prevent vascular cognitive decline",
            "instructions": {
                "en": "Take after afternoon lunch with water.",
                "as": "দুপৰীয়াৰ আহাৰৰ পিছত পানীৰে সৈতে লওক।",
                "bn": "দুপুরের খাবারের পর জল দিয়ে খান।",
                "hi": "दोपहर के भोजन के बाद पानी के साथ लें।"
            }
        },
        {
            "id": "rx-103",
            "name": "Memantine HCl",
            "dose": "10 mg - 1 Tablet",
            "frequency": "Once Daily (Evening)",
            "time": "08:00 PM",
            "color": "#10b981",
            "shape": "round",
            "prescribed_by": "Dr. H. Baruah, MD",
            "date_prescribed": "2026-08-01",
            "clinical_rationale": "NMDA receptor antagonist to protect against glutamate excitotoxicity",
            "instructions": {
                "en": "Take with dinner before night rest.",
                "as": "নিশাৰ আহাৰৰ সৈতে শোৱাৰ আগতে লওক।",
                "bn": "রাতের খাবারের সাথে ঘুমানোর আগে নিন।",
                "hi": "रात के खाने के साथ सोने से पहले लें।"
            }
        }
    ]
}

DB_CLINICAL_NOTES: Dict[str, List[Dict[str, Any]]] = {
    "PAT-7401": [
        {
            "id": "note-1",
            "date": "2026-08-25",
            "doctor_name": "Dr. H. Baruah, MD",
            "consult_type": "Monthly Telemetry Review & In-Clinic Check",
            "mmse_score": 22,
            "fast_stage": "Stage 3 (Mild Cognitive Impairment / Early AD)",
            "cdr_score": 1.0,
            "observations": "Patient oriented to person and city, occasional temporal disorientation regarding day of the week. Shows marked engagement with family photo recall and cultural music stimuli. Reaction latency is within acceptable 1.4s window.",
            "plan": "Continue Donepezil 5mg AM, Memantine 10mg PM. Encourage daily 15-minute Reminiscence breathing sessions at 6:30 PM to curb sundowning."
        }
    ]
}

DB_MESSAGES: Dict[str, List[Dict[str, Any]]] = {
    "PAT-7401": [
        {
            "id": "msg-1",
            "sender_role": "caregiver",
            "sender_name": "Priya Hazarika (Daughter)",
            "time": "Yesterday, 04:30 PM",
            "message": "Namaskar Dr. Baruah. Baba had a mild episode of evening confusion around 6 PM yesterday. We used the 'Calm Me Down' reminiscence mode and it helped soothe him.",
            "urgency": "normal"
        },
        {
            "id": "msg-2",
            "sender_role": "doctor",
            "sender_name": "Dr. H. Baruah, MD",
            "time": "Yesterday, 05:15 PM",
            "message": "Good evening Priya. Excellent proactive response. The 6 PM agitation aligns with mild sundowning. Keep the living room brightly lit from 5:30 PM and ensure he takes the Memantine dose promptly at 8:00 PM.",
            "urgency": "normal"
        }
    ]
}

DB_VAULT: Dict[str, List[Dict[str, Any]]] = {
    "PAT-7401": [
        {
            "id": "vault-1",
            "title": "Priya (Daughter)",
            "relation": "Daughter",
            "image": "assets/daughter.jpg",
            "audioText": {
                "en": "This is your beloved daughter Priya. She lives in Guwahati and calls you every morning.",
                "as": "এয়া আপোনাৰ মৰমৰ জীয়াৰী প্ৰিয়া। তেওঁ গুৱাহাটীত থাকে আৰু প্ৰতিদিনে ৰাতিপুৱা আপোনাক ফোন কৰে।",
                "bn": "এটি আপনার মেয়ে প্রিয়া। সে গুয়াহাটিতে থাকে এবং প্রতিদিন ফোন করে।",
                "hi": "यह आपकी बेटी प्रिया है। वह गुवाहाटी में रहती है और रोज फोन करती है।"
            },
            "calmingAnchor": True
        },
        {
            "id": "vault-2",
            "title": "Family Tea on Veranda",
            "relation": "Family Gathering",
            "image": "assets/family.jpg",
            "audioText": {
                "en": "Here is your whole family enjoying morning tea in the hills. Everyone loves and cares for you.",
                "as": "পাহাৰৰ বাৰান্দাত আপোনাৰ সমগ্ৰ পৰিয়ালে চাহ খাই আনন্দ কৰিছে। সকলোৱে আপোনাক বহুত ভাল পায়।",
                "bn": "পাহাড়ের বারান্দায় পুরো পরিবার একসাথে চা খাচ্ছে। সবাই আপনাকে ভালোবাসে।",
                "hi": "पहाड़ी बरामदे में पूरा परिवार चाय पी रहा है। सब आपसे बहुत प्यार करते हैं।"
            },
            "calmingAnchor": True
        },
        {
            "id": "vault-3",
            "title": "Assam Tea Garden",
            "relation": "Childhood Memory",
            "image": "assets/assam_tea.jpg",
            "audioText": {
                "en": "The beautiful green tea gardens of Assam where you spent peaceful morning walks.",
                "as": "অসমৰ অনুপম সেউজীয়া চাহ বাগিচা, য’ত আপুনি শান্তিপূৰ্ণ ৰাতিপুৱাৰ ভ্ৰমণ কৰিছিল।",
                "bn": "আসামের সুন্দর চা বাগান যেখানে আপনি সকালে হাঁটতেন।",
                "hi": "असम के सुंदर चाय बागान जहाँ आप सुबह सैर करते थे।"
            },
            "calmingAnchor": True
        },
        {
            "id": "vault-4",
            "title": "Biren Babu",
            "relation": "Self Portrait",
            "image": "assets/elder_dadu.jpg",
            "audioText": {
                "en": "This is you, Biren Hazarika. You are a respected teacher and loved by all.",
                "as": "এয়া আপুনি, শ্ৰীযুত বীৰেন হাজৰিকা। আপুনি এজন সন্মানীয় শিক্ষক আৰু সকলোৰে শ্ৰদ্ধাৰ।",
                "bn": "এটি আপনি, শ্রীবীরেন হাজারিকা। আপনি একজন সম্মানিত শিক্ষক এবং সবাই আপনাকে শ্রদ্ধা করে।",
                "hi": "यह आप हैं, श्री बीरेन हजारिका। आप एक सम्मानित शिक्षक हैं और सब आपका आदर करते हैं।"
            },
            "calmingAnchor": True
        }
    ]
}

# -----------------------------------------------------------------------------
# Authentication & Access Control
# -----------------------------------------------------------------------------
@app.post("/api/auth/login")
def authenticate_user(payload: LoginPayload):
    role = payload.role.lower()
    if role not in DB_USERS:
        raise HTTPException(status_code=400, detail="Invalid role specified. Must be 'patient', 'caregiver', or 'doctor'.")
    
    user = DB_USERS[role]
    return {
        "status": "authenticated",
        "role": user["role"],
        "token": user["token"],
        "user_profile": user,
        "patient_id": payload.patient_id or "PAT-7401"
    }

# -----------------------------------------------------------------------------
# Generic & Patient Endpoints
# -----------------------------------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Smriti Sahayak Tri-Portal Engine",
        "active_patients_count": len(DB_PATIENTS),
        "timestamp": time.time()
    }

@app.get("/api/patient/profile")
def get_patient_profile(patient_id: str = "PAT-7401"):
    patient = DB_PATIENTS.get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.post("/api/games/session/log")
def log_game_session(payload: GameSessionPayload):
    patient = DB_PATIENTS.get(payload.patient_id, DB_PATIENTS["PAT-7401"])
    patient["game_scores"].append(payload.score)
    patient["reaction_history_ms"].append(payload.latency_ms)

    # Compute next DDA parameters
    recent_sessions = [{
        "latency_ms": payload.latency_ms,
        "is_correct": payload.is_correct,
        "hints_used": payload.hints_used
    }]
    next_dda = dda_engine.compute_difficulty(current_level=2, recent_sessions=recent_sessions)
    
    return {
        "status": "logged",
        "patient_id": payload.patient_id,
        "next_game_dda": next_dda,
        "recorded_at": time.time()
    }

@app.get("/api/analytics/cognitive_summary")
def get_cognitive_summary(patient_id: str = "PAT-7401"):
    patient = DB_PATIENTS.get(patient_id, DB_PATIENTS["PAT-7401"])
    summary = cognitive_engine.compute_cognitive_index(
        recent_game_scores=patient["game_scores"][-10:],
        reaction_latencies_ms=patient["reaction_history_ms"][-10:],
        med_compliance_rate=patient["med_compliance_rate"]
    )
    summary["patient_name"] = patient["name"]
    summary["patient_id"] = patient["id"]
    return summary

@app.post("/api/sync/delta")
def sync_offline_delta(payload: SyncDeltaPayload):
    patient = DB_PATIENTS.get(payload.patient_id, DB_PATIENTS["PAT-7401"])
    for session in payload.offline_game_sessions:
        patient["game_scores"].append(session.score)
        patient["reaction_history_ms"].append(session.latency_ms)

    return {
        "sync_status": "success",
        "merged_sessions_count": len(payload.offline_game_sessions),
        "server_timestamp": time.time(),
        "updated_cognitive_summary": cognitive_engine.compute_cognitive_index(
            recent_game_scores=patient["game_scores"][-10:],
            reaction_latencies_ms=patient["reaction_history_ms"][-10:],
            med_compliance_rate=patient["med_compliance_rate"]
        )
    }

@app.post("/api/voice/process")
def process_voice(payload: VoiceQueryPayload):
    return speech_service.process_voice_query(
        transcript=payload.transcript,
        lang=payload.language
    )

# -----------------------------------------------------------------------------
# Doctor Portal Endpoints
# -----------------------------------------------------------------------------
@app.get("/api/doctor/patients")
def get_doctor_patients():
    return [
        {
            "id": p["id"],
            "name": p["name"],
            "age": p["age"],
            "gender": p["gender"],
            "stage": p["stage"],
            "location": p["location"],
            "primary_caregiver": p["primary_caregiver"],
            "cognitive_index": p["baseline_cognitive_index"],
            "mmse_score": p["mmse_score"],
            "compliance_rate": p["med_compliance_rate"],
            "gps_status": p["gps_status"]
        }
        for p in DB_PATIENTS.values()
    ]

@app.get("/api/doctor/prescriptions")
def get_prescriptions(patient_id: str = "PAT-7401"):
    return DB_PRESCRIPTIONS.get(patient_id, [])

@app.post("/api/doctor/prescriptions")
def create_prescription(payload: PrescriptionCreatePayload):
    rx_id = f"rx-{uuid.uuid4().hex[:6]}"
    new_rx = {
        "id": rx_id,
        "name": payload.name,
        "dose": payload.dose,
        "frequency": payload.frequency,
        "time": payload.time,
        "color": payload.color,
        "shape": payload.shape,
        "prescribed_by": "Dr. H. Baruah, MD",
        "date_prescribed": time.strftime("%Y-%m-%d"),
        "clinical_rationale": payload.clinical_rationale,
        "instructions": {
            "en": payload.instructions_en,
            "as": payload.instructions_as or payload.instructions_en,
            "bn": payload.instructions_bn or payload.instructions_en,
            "hi": payload.instructions_hi or payload.instructions_en
        }
    }
    if payload.patient_id not in DB_PRESCRIPTIONS:
        DB_PRESCRIPTIONS[payload.patient_id] = []
    DB_PRESCRIPTIONS[payload.patient_id].append(new_rx)
    return {"status": "created", "prescription": new_rx}

@app.delete("/api/doctor/prescriptions/{rx_id}")
def delete_prescription(rx_id: str, patient_id: str = "PAT-7401"):
    if patient_id in DB_PRESCRIPTIONS:
        DB_PRESCRIPTIONS[patient_id] = [r for r in DB_PRESCRIPTIONS[patient_id] if r["id"] != rx_id]
    return {"status": "deleted", "rx_id": rx_id}

@app.get("/api/doctor/clinical_notes")
def get_clinical_notes(patient_id: str = "PAT-7401"):
    return DB_CLINICAL_NOTES.get(patient_id, [])

@app.post("/api/doctor/clinical_notes")
def add_clinical_note(payload: ClinicalNotePayload):
    note_id = f"note-{uuid.uuid4().hex[:6]}"
    new_note = {
        "id": note_id,
        "date": time.strftime("%Y-%m-%d"),
        "doctor_name": payload.doctor_name,
        "consult_type": payload.consult_type,
        "mmse_score": payload.mmse_in_clinic,
        "fast_stage": payload.fast_stage,
        "cdr_score": payload.cdr_score,
        "observations": payload.clinical_observations,
        "plan": payload.therapeutic_plan
    }
    if payload.patient_id not in DB_CLINICAL_NOTES:
        DB_CLINICAL_NOTES[payload.patient_id] = []
    DB_CLINICAL_NOTES[payload.patient_id].insert(0, new_note)
    
    if payload.patient_id in DB_PATIENTS:
        DB_PATIENTS[payload.patient_id]["mmse_score"] = payload.mmse_in_clinic
        DB_PATIENTS[payload.patient_id]["stage"] = payload.fast_stage

    return {"status": "created", "note": new_note}

@app.post("/api/doctor/generate_report")
def generate_clinical_report(payload: ReportRequestPayload):
    patient = DB_PATIENTS.get(payload.patient_id, DB_PATIENTS["PAT-7401"])
    rxs = DB_PRESCRIPTIONS.get(payload.patient_id, [])
    notes = DB_CLINICAL_NOTES.get(payload.patient_id, [])
    summary = cognitive_engine.compute_cognitive_index(
        recent_game_scores=patient["game_scores"][-10:],
        reaction_latencies_ms=patient["reaction_history_ms"][-10:],
        med_compliance_rate=patient["med_compliance_rate"]
    )

    report = {
        "report_id": f"REP-SMRI-{uuid.uuid4().hex[:8].upper()}",
        "generated_at": time.strftime("%d %B %Y, %H:%M IST"),
        "facility": "Guwahati Neurological & Geriatric Cognitive Health Center",
        "physician": "Dr. H. Baruah, MD (Neurology), DM",
        "patient": {
            "id": patient["id"],
            "name": patient["name"],
            "age": patient["age"],
            "gender": patient["gender"],
            "stage": patient["stage"],
            "primary_caregiver": patient["primary_caregiver"]
        },
        "telemetry_metrics": {
            "composite_cognitive_index": summary["cognitive_index"],
            "estimated_mmse": summary["estimated_mmse"],
            "mean_reaction_latency_ms": summary["latency_mean_ms"],
            "latency_variance": summary["latency_variance"],
            "anomaly_detected": summary["anomaly_detected"],
            "medication_compliance_rate": f"{int(patient['med_compliance_rate'] * 100)}%"
        },
        "active_prescriptions": [
            f"{r['name']} ({r['dose']}) - {r['frequency']}" for r in rxs
        ],
        "latest_clinical_notes": notes[0] if notes else None,
        "recommendations": [
            "Maintain consistent daily schedule and morning medication compliance.",
            "Continue twice-daily Smriti Sahayak cognitive games (Family Face Recall & Routine Sequencing).",
            "Perform guided 4-7-8 reminiscence breathing sessions at 6:30 PM to curb sundowning agitation.",
            "Follow-up in-clinic cognitive assessment scheduled in 60 days."
        ]
    }
    return report

DB_QUIZ_QUESTIONS: Dict[str, List[Dict[str, Any]]] = {
    "PAT-7401": [
        {
            "id": "quiz-1",
            "question": "What is the name of your sweet granddaughter who loves tea gardens?",
            "options": ["Ananya", "Pooja", "Sunita", "Ritu"],
            "correct_option": "Ananya",
            "hint": "Her name starts with A and she calls you Dadu!",
            "category": "Family Trivia",
            "created_by": "Priya Hazarika (Daughter)"
        },
        {
            "id": "quiz-2",
            "question": "Which historic college in Guwahati did you teach mathematics for 32 years?",
            "options": ["Cotton College (University)", "Tezpur University", "Jorhat Engineering", "Gauhati Medical"],
            "correct_option": "Cotton College (University)",
            "hint": "Located near Dighalipukhuri in Panbazar.",
            "category": "Career & Identity",
            "created_by": "Priya Hazarika (Daughter)"
        },
        {
            "id": "quiz-3",
            "question": "What is Priya's favorite homemade sweet you prepared on Bihu?",
            "options": ["Narikol Laru (Coconut Sweet)", "Rasgulla", "Kaju Katli", "Sandesh"],
            "correct_option": "Narikol Laru (Coconut Sweet)",
            "hint": "Made with freshly grated coconut and fragrant jaggery.",
            "category": "Family Memories",
            "created_by": "Priya Hazarika (Daughter)"
        },
        {
            "id": "quiz-4",
            "question": "What is the color of the front garden gate of your Guwahati residence?",
            "options": ["Forest Green", "Bright Red", "Sky Blue", "Golden Yellow"],
            "correct_option": "Forest Green",
            "hint": "It matches the green color of your tea hedge garden.",
            "category": "Home Familiarity",
            "created_by": "Priya Hazarika (Daughter)"
        }
    ]
}

# -----------------------------------------------------------------------------
# Caregiver & Communication Endpoints
# -----------------------------------------------------------------------------
@app.get("/api/caregiver/quiz_questions")
def get_caregiver_quiz_questions(patient_id: str = "PAT-7401"):
    return DB_QUIZ_QUESTIONS.get(patient_id, [])

@app.post("/api/caregiver/quiz_questions")
def add_caregiver_quiz_question(payload: QuizQuestionPayload):
    q_id = f"quiz-{uuid.uuid4().hex[:6]}"
    new_question = {
        "id": q_id,
        "question": payload.question_text,
        "options": payload.options,
        "correct_option": payload.correct_option,
        "hint": payload.hint or "Think about your family members.",
        "category": payload.category,
        "created_by": payload.created_by
    }
    if payload.patient_id not in DB_QUIZ_QUESTIONS:
        DB_QUIZ_QUESTIONS[payload.patient_id] = []
    DB_QUIZ_QUESTIONS[payload.patient_id].append(new_question)
    return {"status": "created", "question": new_question}

@app.delete("/api/caregiver/quiz_questions/{question_id}")
def delete_caregiver_quiz_question(question_id: str, patient_id: str = "PAT-7401"):
    if patient_id in DB_QUIZ_QUESTIONS:
        DB_QUIZ_QUESTIONS[patient_id] = [q for q in DB_QUIZ_QUESTIONS[patient_id] if q["id"] != question_id]
    return {"status": "deleted", "question_id": question_id}

@app.get("/api/caregiver/messages")
def get_caregiver_messages(patient_id: str = "PAT-7401"):
    return DB_MESSAGES.get(patient_id, [])

@app.post("/api/caregiver/messages")
def post_caregiver_message(payload: CaregiverMessagePayload):
    msg_id = f"msg-{uuid.uuid4().hex[:6]}"
    new_msg = {
        "id": msg_id,
        "sender_role": payload.sender_role,
        "sender_name": payload.sender_name,
        "time": "Just now",
        "message": payload.message,
        "urgency": payload.urgency
    }
    if payload.patient_id not in DB_MESSAGES:
        DB_MESSAGES[payload.patient_id] = []
    DB_MESSAGES[payload.patient_id].append(new_msg)
    return {"status": "sent", "message": new_msg}

@app.get("/api/vault/items")
def get_vault_items(patient_id: str = "PAT-7401"):
    return DB_VAULT.get(patient_id, [])

@app.post("/api/vault/items")
def add_vault_item(payload: VaultItemPayload):
    item_id = f"vault-{uuid.uuid4().hex[:6]}"
    new_item = {
        "id": item_id,
        "title": payload.title,
        "relation": payload.relation,
        "image": payload.image_url,
        "audioText": {
            "en": payload.audio_en,
            "as": payload.audio_as or payload.audio_en,
            "bn": payload.audio_bn or payload.audio_en,
            "hi": payload.audio_hi or payload.audio_en
        },
        "calmingAnchor": payload.calming_anchor
    }
    if payload.patient_id not in DB_VAULT:
        DB_VAULT[payload.patient_id] = []
    DB_VAULT[payload.patient_id].append(new_item)
    return {"status": "added", "item": new_item}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
