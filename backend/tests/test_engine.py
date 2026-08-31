"""
Unit and Integration Tests for Smriti Sahayak AI & Backend Services
"""
import pytest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.dda_algorithm import dda_engine
from app.services.ml_cognitive_engine import cognitive_engine
from app.services.speech_service import speech_service

def test_dda_gentle_support_on_high_latency():
    """Verify that high latency and hints trigger gentle support DDA tier"""
    sessions = [
        {"latency_ms": 6000, "is_correct": False, "hints_used": 2},
        {"latency_ms": 5500, "is_correct": True, "hints_used": 1}
    ]
    result = dda_engine.compute_difficulty(current_level=2, recent_sessions=sessions)
    assert result["target_level"] == 1
    assert result["timeout_sec"] == 40
    assert result["hint_threshold_sec"] == 4

def test_dda_high_engagement_on_fast_accurate_response():
    """Verify that rapid accurate responses increase game engagement tier"""
    sessions = [
        {"latency_ms": 1100, "is_correct": True, "hints_used": 0},
        {"latency_ms": 1200, "is_correct": True, "hints_used": 0}
    ]
    result = dda_engine.compute_difficulty(current_level=2, recent_sessions=sessions)
    assert result["target_level"] >= 2
    assert result["performance_score"] > 0.8

def test_cognitive_engine_scoring_and_anomaly():
    """Verify MMSE score estimation and anomaly detection on latency variance"""
    scores = [85.0, 90.0, 80.0]
    latencies = [1200.0, 1300.0, 1250.0]
    compliance = 0.95

    res = cognitive_engine.compute_cognitive_index(scores, latencies, compliance)
    assert 70.0 <= res["cognitive_index"] <= 95.0
    assert 20.0 <= res["estimated_mmse"] <= 28.0
    assert not res["anomaly_detected"]

    # Test anomaly trigger with high latency variance
    erratic_latencies = [1200.0, 4800.0, 1100.0, 5200.0]
    anomaly_res = cognitive_engine.compute_cognitive_index(scores, erratic_latencies, compliance)
    assert anomaly_res["anomaly_detected"]

def test_speech_service_intent_and_grounding():
    """Verify voice sentiment parsing and agitation grounding trigger"""
    res = speech_service.process_voice_query("Where am I? I feel lost and confused.", "en")
    assert res["intent"] == "confusion_grounding"
    assert res["requires_grounding"] is True
    assert res["sentiment_score"] < 0.5
