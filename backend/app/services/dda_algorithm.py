"""
Dynamic Difficulty Adjustment (DDA) Engine for Dementia Cognitive Gaming.
Calculates real-time game parameter matrices based on latency, accuracy, and hesitation entropy.
"""
from typing import Dict, Any, List
import math

class DynamicDifficultyEngine:
    def __init__(self):
        # Baseline difficulty tiers
        self.tiers = {
            1: {"name": "Gentle Support", "timeout_sec": 40, "hint_threshold_sec": 4, "options_count": 2, "audio_assisted": True},
            2: {"name": "Moderate Balanced", "timeout_sec": 25, "hint_threshold_sec": 8, "options_count": 4, "audio_assisted": True},
            3: {"name": "Active Challenge", "timeout_sec": 16, "hint_threshold_sec": 12, "options_count": 4, "audio_assisted": False}
        }

    def compute_difficulty(
        self,
        current_level: int,
        recent_sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Computes the target difficulty level and parameter matrix for the next cognitive game session.
        Uses exponential moving average (EMA) on response latency and error rate.
        """
        if not recent_sessions:
            return self.tiers.get(current_level, self.tiers[2])

        # Extract telemetry metrics
        latencies = [s.get("latency_ms", 2000) for s in recent_sessions[-5:]]
        accuracies = [1 if s.get("is_correct", True) else 0 for s in recent_sessions[-5:]]
        hints = [s.get("hints_used", 0) for s in recent_sessions[-5:]]

        avg_latency = sum(latencies) / len(latencies)
        accuracy_rate = sum(accuracies) / len(accuracies)
        avg_hints = sum(hints) / len(hints)

        # Performance index: [0.0 - 1.0]
        # High accuracy, low latency, and zero hints -> higher score
        normalized_speed = max(0.0, min(1.0, (5000 - avg_latency) / 4000))
        performance_score = (0.5 * accuracy_rate) + (0.35 * normalized_speed) + (0.15 * (1.0 - min(1.0, avg_hints / 3)))

        # Target level selection with hysteresis to prevent oscillation
        if performance_score >= 0.78:
            target_level = min(3, current_level + 1 if performance_score > 0.88 else current_level)
        elif performance_score <= 0.45:
            target_level = max(1, current_level - 1)
        else:
            target_level = current_level

        params = dict(self.tiers[target_level])
        params.update({
            "target_level": target_level,
            "performance_score": round(performance_score, 3),
            "avg_latency_ms": round(avg_latency, 1),
            "accuracy_rate": round(accuracy_rate, 2)
        })
        return params

dda_engine = DynamicDifficultyEngine()
