# Technical Architecture & Database Design Specifications

## 1. Architectural Overview
Smriti Sahayak operates as a distributed, offline-first health IoT and mobile tele-monitoring platform designed for high fault-tolerance in low-bandwidth environments.

```
+-------------------------------------------------------------------------+
|                         PATIENT MOBILE CLIENT                           |
|  (Flutter / Android / PWA - WCAG AAA High Contrast Senior Accessible)   |
|                                                                         |
|  +---------------------+  +--------------------+  +------------------+  |
|  |  Cognitive Games    |  |  Reminiscence Vault|  | Voice Assistant  |  |
|  |  - Face Recall      |  |  - Family Photos   |  | - Multilingual   |  |
|  |  - Sequencing       |  |  - Audio Notes     |  | - Sentiment AI   |  |
|  |  - Cultural Match   |  |  - Calm Breathing  |  | - Spoken Alarms  |  |
|  +----------+----------+  +---------+----------+  +--------+---------+  |
|             |                       |                      |            |
|             +-----------------------+----------------------+            |
|                                     |                                   |
|                        +------------v------------+                      |
|                        |   Local SQLite Storage  |                      |
|                        |   (Encrypted SQLCipher) |                      |
|                        +------------+------------+                      |
|                                     |                                   |
|                        +------------v------------+                      |
|                        |    Delta Sync Worker    |                      |
|                        +------------+------------+                      |
+-------------------------------------|-----------------------------------+
                                      | (HTTPS / WSS JSON Delta Sync)
+-------------------------------------v-----------------------------------+
|                         FASTAPI CLOUD BACKEND                           |
|                                                                         |
|  +--------------------+  +---------------------+  +------------------+  |
|  |  Auth & Patient API|  |  AI DDA Microservice|  |  Cognitive Trend |  |
|  |  - JWT Tokens      |  |  - Dynamic Tiers    |  |  - MMSE Regress  |  |
|  |  - RBAC            |  |  - Latency Analysis |  |  - Anomaly Flag  |  |
|  +----------+---------+  +----------+----------+  +--------+---------+  |
|             |                       |                      |            |
|             +-----------------------+----------------------+            |
|                                     |                                   |
|                        +------------v------------+                      |
|                        |   PostgreSQL Master DB  |                      |
|                        +-------------------------+                      |
+-------------------------------------^-----------------------------------+
                                      | (REST / WebSocket Analytics)
+-------------------------------------|-----------------------------------+
|                     CAREGIVER & CLINICIAN CONSOLE                       |
|  (Chart.js Cognitive Graphs, Anomaly Feeds, Med Protocols, Vault Admin) |
+-------------------------------------------------------------------------+
```

---

## 2. Relational Database Schema (PostgreSQL / SQLite)

### 2.1 Table: `patients`
```sql
CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    age INT NOT NULL,
    diagnosis_stage VARCHAR(64) NOT NULL, -- e.g., 'Mild-Moderate AD Stage 3'
    primary_language VARCHAR(10) DEFAULT 'as', -- 'as', 'bn', 'hi', 'mni', 'en'
    location VARCHAR(120),
    caregiver_id VARCHAR(36) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Table: `game_sessions` (Telemetry & DDA Input)
```sql
CREATE TABLE game_sessions (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    game_type VARCHAR(32) NOT NULL, -- 'face_recall', 'sequencing', 'cultural_match', 'sound_memory'
    dda_tier INT NOT NULL DEFAULT 2, -- 1 (Gentle), 2 (Moderate), 3 (Active)
    score NUMERIC(5, 2) NOT NULL,
    latency_ms NUMERIC(8, 2) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    hints_used INT DEFAULT 0,
    recorded_at TIMESTAMP NOT NULL,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Table: `medication_schedules`
```sql
CREATE TABLE medication_schedules (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(120) NOT NULL,
    dosage VARCHAR(64) NOT NULL,
    scheduled_time TIME NOT NULL,
    pill_color VARCHAR(20),
    instructions_json JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE
);
```

### 2.4 Table: `medication_compliance_logs`
```sql
CREATE TABLE medication_compliance_logs (
    id VARCHAR(36) PRIMARY KEY,
    medication_id VARCHAR(36) REFERENCES medication_schedules(id) ON DELETE CASCADE,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'taken_on_time', 'delayed', 'missed'
    confirmed_by VARCHAR(32) NOT NULL, -- 'patient_voice', 'patient_tap', 'caregiver'
    confirmed_at TIMESTAMP
);
```

### 2.5 Table: `reminiscence_vault`
```sql
CREATE TABLE reminiscence_vault (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    relationship_tag VARCHAR(64) NOT NULL,
    image_url TEXT NOT NULL,
    audio_memo_url TEXT,
    localized_stories JSONB NOT NULL,
    is_calming_anchor BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Offline-First Conflict-Free Delta Synchronization Protocol

1. **Local Writes**: Every patient action (completing a face recall trial, tapping "I Took It", recording voice check-in) is immediately committed to local SQLite with a client monotonic timestamp `t_client` and `sync_status = 'pending'`.
2. **Connectivity Polling**: A lightweight background daemon checks endpoint reachability every 60 seconds (or on network transition events).
3. **Payload Compression & Batch Sync**: Pending records are bundled into a JSON delta payload:
   ```json
   {
     "patient_id": "PAT-7401",
     "last_sync_timestamp": 1788160000.0,
     "game_sessions": [...],
     "med_logs": [...]
   }
   ```
4. **Idempotent Cloud Ingestion**: The FastAPI endpoint `/api/sync/delta` processes records via `ON CONFLICT (id) DO NOTHING` to ensure idempotency.
5. **Server Ack & Local Purge**: Server returns timestamp ACK; client updates synced records to `sync_status = 'synced'`.
