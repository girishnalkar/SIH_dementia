"""
Standalone Test Runner using standard library unittest for Smriti Sahayak Tri-Portal.
"""
import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.dda_algorithm import dda_engine
from app.services.ml_cognitive_engine import cognitive_engine
from app.services.speech_service import speech_service
from app.main import (
    app,
    get_doctor_patients,
    get_prescriptions,
    create_prescription,
    PrescriptionCreatePayload,
    post_caregiver_message,
    CaregiverMessagePayload,
    generate_clinical_report,
    ReportRequestPayload,
    add_clinical_note,
    ClinicalNotePayload
)

class TestSmritiServices(unittest.TestCase):

    def test_dda_gentle_support_on_high_latency(self):
        """Verify that high latency and hints trigger gentle support DDA tier"""
        sessions = [
            {"latency_ms": 6000, "is_correct": False, "hints_used": 2},
            {"latency_ms": 5500, "is_correct": True, "hints_used": 1}
        ]
        result = dda_engine.compute_difficulty(current_level=2, recent_sessions=sessions)
        self.assertEqual(result["target_level"], 1)
        self.assertEqual(result["timeout_sec"], 40)
        self.assertEqual(result["hint_threshold_sec"], 4)

    def test_dda_high_engagement_on_fast_accurate_response(self):
        """Verify that rapid accurate responses increase game engagement tier"""
        sessions = [
            {"latency_ms": 1100, "is_correct": True, "hints_used": 0},
            {"latency_ms": 1200, "is_correct": True, "hints_used": 0}
        ]
        result = dda_engine.compute_difficulty(current_level=2, recent_sessions=sessions)
        self.assertGreaterEqual(result["target_level"], 2)
        self.assertGreater(result["performance_score"], 0.8)

    def test_cognitive_engine_scoring_and_anomaly(self):
        """Verify MMSE score estimation and anomaly detection on latency variance"""
        scores = [85.0, 90.0, 80.0]
        latencies = [1200.0, 1300.0, 1250.0]
        compliance = 0.95

        res = cognitive_engine.compute_cognitive_index(scores, latencies, compliance)
        self.assertTrue(70.0 <= res["cognitive_index"] <= 95.0)
        self.assertTrue(20.0 <= res["estimated_mmse"] <= 28.0)
        self.assertFalse(res["anomaly_detected"])

        # Test anomaly trigger with high latency variance
        erratic_latencies = [1200.0, 4800.0, 1100.0, 5200.0]
        anomaly_res = cognitive_engine.compute_cognitive_index(scores, erratic_latencies, compliance)
        self.assertTrue(anomaly_res["anomaly_detected"])

    def test_speech_service_intent_and_grounding(self):
        """Verify voice sentiment parsing and agitation grounding trigger"""
        res = speech_service.process_voice_query("Where am I? I feel lost and confused.", "en")
        self.assertEqual(res["intent"], "confusion_grounding")
        self.assertTrue(res["requires_grounding"])
        self.assertLess(res["sentiment_score"], 0.5)

    def test_doctor_portal_multi_patients(self):
        """Verify doctor can retrieve multi-patient registry"""
        patients = get_doctor_patients()
        self.assertGreaterEqual(len(patients), 3)
        patient_ids = [p["id"] for p in patients]
        self.assertIn("PAT-7401", patient_ids)
        self.assertIn("PAT-7402", patient_ids)
        self.assertIn("PAT-7403", patient_ids)

    def test_doctor_prescription_creation_and_sync(self):
        """Verify doctor can write prescription with multilingual audio instructions"""
        payload = PrescriptionCreatePayload(
            patient_id="PAT-7401",
            name="Rivastigmine Patch",
            dose="4.6 mg / 24 hr",
            frequency="Once Daily",
            time="09:00 AM",
            clinical_rationale="Transdermal cholinesterase inhibitor",
            instructions_en="Apply 1 skin patch on upper arm daily.",
            instructions_as="প্ৰতিদিনে বাহুত ১টা ঔষধৰ পটি লগাওক।",
            instructions_hi="प्रतिदिन बांह पर 1 पैच लगाएं।"
        )
        res = create_prescription(payload)
        self.assertEqual(res["status"], "created")
        self.assertIn("rx-", res["prescription"]["id"])

        # Verify it is in patient's prescription list
        rxs = get_prescriptions("PAT-7401")
        rx_names = [r["name"] for r in rxs]
        self.assertIn("Rivastigmine Patch", rx_names)

    def test_caregiver_doctor_messaging(self):
        """Verify caregiver and doctor bidirectional communication channel"""
        msg_payload = CaregiverMessagePayload(
            patient_id="PAT-7401",
            sender_role="caregiver",
            sender_name="Priya Hazarika (Daughter)",
            message="Doctor, Baba slept well last night after the 8 PM medicine.",
            urgency="normal"
        )
        res = post_caregiver_message(msg_payload)
        self.assertEqual(res["status"], "sent")
        self.assertEqual(res["message"]["sender_name"], "Priya Hazarika (Daughter)")

    def test_clinical_report_generation(self):
        """Verify synthesis of clinical telemetry into medical report"""
        rep_payload = ReportRequestPayload(patient_id="PAT-7401")
        report = generate_clinical_report(rep_payload)
        self.assertIn("REP-SMRI-", report["report_id"])
        self.assertEqual(report["patient"]["name"], "Biren Hazarika")
        self.assertIn("composite_cognitive_index", report["telemetry_metrics"])
        self.assertGreater(len(report["active_prescriptions"]), 0)
        self.assertGreater(len(report["recommendations"]), 0)

if __name__ == '__main__':
    unittest.main()
