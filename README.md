# 🧠 Smriti Sahayak (স্মৃতি সহায়ক)
### AI-Powered Cognitive Gaming, Reminiscence Memory Assistance, and Dementia Care Platform

[![Smart India Hackathon](https://img.shields.io/badge/SIH-Problem%20Statement%201-blue.svg)](docs/SIH_Project_Report.md)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](backend/)
[![Offline First](https://img.shields.io/badge/Offline--First-SQLite%20Sync-orange.svg)](docs/Architecture_Design.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end digital health ecosystem engineered for elderly individuals experiencing cognitive decline, memory loss, and dementia—specifically optimized for low-connectivity environments such as the **North Eastern Region (NER)** of India.

---

## 🌟 Key Features

1. **👴 Senior-Accessible Patient UI (WCAG AAA)**
   - High contrast, large touch targets (>56px), gentle chime audio feedback.
   - Multilingual voice support in **Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिन्दी), and English**.
   - Spoken daily medication and routine alerts with 1-tap confirmation.

2. **🎮 4 Adaptive Cognitive Games with Real-time DDA**
   - **Family Face Recall ("Mukhobayav")**: Recognizes loved ones with voice clues and emotional anchors.
   - **Daily Routine Sequencing ("Dainik Kram")**: Chronological 4-step task ordering.
   - **Cultural Artifact Match ("Sanskriti Mel")**: Regional symbol pairs (Japi 👒, Gamosa 🧣, Brass Bell 🔔, Flute 🪈).
   - **Sound & Echo Memory ("Dhwani Smriti")**: Auditory recognition of regional soundscapes.
   - **Dynamic Difficulty Adjustment (DDA)**: Adapts time windows ($16\text{s} - 40\text{s}$) and hint thresholds based on patient hesitation and accuracy.

3. **🌅 Reminiscence Memory Vault & "Calm Me Down" Therapy**
   - Guided 4-7-8 breathing circle with relaxing ambient soundscapes.
   - Familiar family photo stories and recorded voice notes from loved ones to de-escalate evening **sundowning agitation**.

4. **📊 Remote Caregiver & Clinician Dashboard**
   - 30-Day Cognitive Baseline trajectory and reaction latency curves (Chart.js).
   - **MMSE 6-Domain Radar Chart** (Orientation, Registration, Attention, Recall, Language, Spatial).
   - Automated anomaly detection feed (reaction latency spikes, missed medication flags).

5. **🔄 100% Offline-First Architecture**
   - Local encrypted SQLite storage on patient devices with conflict-free delta sync to PostgreSQL when internet is available.

---

## 🏗️ Project Architecture

```
d:/SIH/
├── web_app/                    # Patient App & Caregiver Portal
│   ├── index.html              # Single Page Application
│   ├── styles.css              # Senior-accessible design system
│   ├── app.js                  # Game logic, Web Audio synthesizer & state store
│   └── assets/                 # High-resolution family & cultural media
├── backend/                    # FastAPI Microservices & AI Engines
│   ├── app/
│   │   ├── main.py             # FastAPI REST & sync endpoints
│   │   └── services/
│   │       ├── dda_algorithm.py # Dynamic Difficulty Adjustment (EMA) engine
│   │       ├── ml_cognitive_engine.py # Cognitive decline & MMSE modeling
│   │       └── speech_service.py # Multilingual speech & sentiment processor
│   ├── tests/
│   │   └── run_tests.py        # Automated test suite
│   └── requirements.txt
└── docs/                       # SIH Hackathon Documentation
    ├── SIH_Project_Report.md   # Comprehensive 15-page project & clinical report
    ├── Architecture_Design.md  # Detailed architecture & database schema
    └── Pitch_Presentation_Deck.md # 8-slide presentation deck for SIH jury
```

---

## 🚀 Quick Start Guide

### 1. Run the Web Application
```bash
cd web_app
python -m http.server 8080
```
Open **`http://localhost:8080`** in your browser.

### 2. Run the Backend API
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### 3. Run Backend Unit Tests
```bash
cd backend
python tests/run_tests.py
```

---

## 📑 Documentation
- [SIH Project Report](docs/SIH_Project_Report.md)
- [Architecture & Database Design](docs/Architecture_Design.md)
- [Pitch Presentation Deck](docs/Pitch_Presentation_Deck.md)

---

## 📜 License
This project is licensed under the MIT License.
