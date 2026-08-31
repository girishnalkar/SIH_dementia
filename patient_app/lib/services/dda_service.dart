/// Real-time Dynamic Difficulty Adjustment (DDA) Engine for Patient Gaming
class DdaEngine {
  static Map<String, dynamic> computeDifficulty({
    required int currentLevel,
    required double latencyMs,
    required bool isCorrect,
    required int hintsUsed,
  }) {
    // Normalized performance: [0.0 - 1.0]
    final accuracyScore = isCorrect ? 1.0 : 0.0;
    final speedScore = ((5000.0 - latencyMs) / 4000.0).clamp(0.0, 1.0);
    final hintPenalty = (hintsUsed * 0.25).clamp(0.0, 0.5);

    final performance = (0.5 * accuracyScore) + (0.35 * speedScore) - hintPenalty;

    int nextLevel = currentLevel;
    if (performance >= 0.75 && currentLevel < 3) {
      nextLevel = currentLevel + 1;
    } else if (performance <= 0.40 && currentLevel > 1) {
      nextLevel = currentLevel - 1;
    }

    final timeouts = {1: 40, 2: 25, 3: 16};
    final hintTimes = {1: 4, 2: 8, 3: 12};

    return {
      'target_level': nextLevel,
      'performance_score': performance,
      'timeout_sec': timeouts[nextLevel] ?? 25,
      'hint_threshold_sec': hintTimes[nextLevel] ?? 8,
    };
  }
}
