# Smart India Hackathon (SIH) — Pitch Presentation Deck

## Project: Smriti Sahayak (স্মৃতি সহায়ক)
**AI-Powered Cognitive Gaming and Memory Assistance Platform for Dementia Patients**

---

### Slide 1: Title & Vision
- **Platform Name**: Smriti Sahayak (স্মৃতি সহায়ক)
- **Tagline**: Empowering Dementia Care in North-East India through Culturally Anchored AI, Reminiscence Gaming, and Offline-First Telemetry.
- **Team Focus**: Bridging rural-urban geriatric healthcare disparities using voice-first AI and edge computing.

---

### Slide 2: The Problem (Regional Realities of North-East India)
- **8.8 Million+ Indians** living with dementia, with severe under-diagnosis in remote North-Eastern hills.
- **Key Pain Points**:
  - Acute shortage of geriatric neurologists and clinical therapists in rural NER.
  - Frequent power & cellular internet outages render cloud-dependent healthcare apps useless.
  - Existing cognitive software is English-centric and culturally alien to regional elders.
  - High caregiver burnout during evening sundowning/agitation episodes.

---

### Slide 3: Our Solution — Smriti Sahayak Ecosystem
- **Offline-First Cognitive Gaming**: 4 adaptive neuro-stimulation games (Face Recall, Routine Sequencing, Cultural Matching, Sound Memory).
- **Dynamic Difficulty Adjustment (DDA)**: ML algorithm auto-adjusts timers and hints to prevent patient frustration.
- **Multilingual Voice Assistant ("Smriti")**: Native conversational support in Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिन्दी), and English.
- **Digital Reminiscence Vault**: Grounding photos, grandchildren's voice notes, and 4-7-8 guided breathing for sundowning calmness.
- **Caregiver & Clinician Dashboard**: Longitudinal MMSE-aligned cognitive tracking, reaction speed analytics, and medication compliance logs.

---

### Slide 4: Technology Stack & Innovation
- **Frontend / Client**: Flutter & HTML5/CSS3 (WCAG AAA High Contrast Senior UX, Touch Targets > 56px).
- **Backend**: FastAPI (Python 3.13), REST & WebSocket APIs.
- **Database Architecture**: Local Encrypted SQLite (Offline storage) $\leftrightarrow$ PostgreSQL (Cloud Master) via Delta Sync.
- **AI / ML & Speech**:
  - DDA Latency-Accuracy Exponential Moving Average (EMA) Engine.
  - Longitudinal Cognitive Baseline Index ($CBI$) & MMSE Regression Model.
  - Multilingual Speech-to-Text & Indic Text-to-Speech (TTS).

---

### Slide 5: Live Demonstration Highlights
- **Patient Experience**:
  - Big visual greeting & spoken regional audio alerts for morning medication.
  - Playing the *Family Face Recall Game* featuring real daughter photo (`Priya`) with voice clues and positive reinforcement.
  - One-tap *Calm Me Down* reminiscence mode with peaceful Assam tea garden soundscape & breathing coach.
- **Caregiver Portal**:
  - Real-time reflection of patient actions.
  - 30-Day Cognitive Index graph, Reaction Time latency curves, and MMSE 6-Domain radar chart.
  - Anomaly detection alerts for sudden latency spikes or missed medications.

---

### Slide 6: Clinical Alignment & Mathematical Rigor
- **MMSE Alignment**: Direct mapping across Orientation, Registration, Attention, Recall, Language, and Visual-Spatial domains.
- **Mathematical DDA Formulation**:
  $$P = 0.50 \cdot A + 0.35 \cdot S + 0.15 \cdot (1 - H)$$
  Guarantees gentle support ($40\text{s}$ timeout + audio hints) whenever cognitive hesitation is detected.

---

### Slide 7: Market Potential, Scalability & Roadmap
- **Target Users**: Elderly population, geriatric hospitals, memory care homes, and families of dementia patients across India.
- **Deployment Strategy**:
  - Phase 1: Android tablet pilot in primary health centers (PHCs) across Assam and Meghalaya.
  - Phase 2: Integration with Ayushman Bharat Digital Mission (ABDM) health IDs.
  - Phase 3: Expansion to tribal languages (Bodo, Khasi, Garo, Mizo) and wearable beacon integrations.

---

### Slide 8: Summary & Impact
- **Preserving Dignity**: Transforming sterile medical cognitive testing into heartwarming family reminiscence.
- **100% Offline Reliability**: Works in the most remote hill villages without internet.
- **Caregiver Peace of Mind**: Remote family members stay connected and informed 24/7.
