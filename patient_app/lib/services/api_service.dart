import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/patient_models.dart';

class ApiService {
  // Use 10.0.2.2 for Android emulator, or localhost for Windows/Web
  static const String baseUrl = 'http://127.0.0.1:8000';

  static Future<Map<String, dynamic>?> logGameSession({
    required String patientId,
    required String gameType,
    required double score,
    required double latencyMs,
    required bool isCorrect,
    required int hintsUsed,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/api/games/session/log');
      final res = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'patient_id': patientId,
          'game_type': gameType,
          'score': score,
          'latency_ms': latencyMs,
          'is_correct': isCorrect,
          'hints_used': hintsUsed,
        }),
      ).timeout(const Duration(seconds: 3));

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (_) {
      // Offline fallback
    }
    return null;
  }

  static Future<List<MedicationItem>> fetchPrescriptions(String patientId) async {
    try {
      final url = Uri.parse('$baseUrl/api/doctor/prescriptions?patient_id=$patientId');
      final res = await http.get(url).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        return data.map((json) {
          return MedicationItem(
            id: json['id'] ?? 'rx-default',
            name: json['name'] ?? 'Donepezil',
            dose: json['dose'] ?? '5 mg',
            time: json['time'] ?? '08:30 AM',
            mealTiming: json['meal_timing'] ?? 'After Morning Meal / Tea',
            colorHex: 0xFF3B82F6,
            instructions: Map<String, String>.from(json['instructions'] ?? {}),
          );
        }).toList();
      }
    } catch (_) {
      // Offline fallback to local preset
    }
    return [MedicationItem.donepezil()];
  }

  static Future<List<QuizQuestionItem>> fetchQuizQuestions(String patientId) async {
    try {
      final url = Uri.parse('$baseUrl/api/caregiver/quiz_questions?patient_id=$patientId');
      final res = await http.get(url).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        if (data.isNotEmpty) {
          return data.map((json) => QuizQuestionItem.fromJson(json)).toList();
        }
      }
    } catch (_) {
      // Offline fallback
    }
    return [
      QuizQuestionItem(
        id: 'quiz-1',
        question: 'What is the name of your sweet granddaughter who loves tea gardens?',
        options: ['Ananya', 'Pooja', 'Sunita', 'Ritu'],
        correctOption: 'Ananya',
        hint: 'Her name starts with A and she calls you Dadu!',
        category: 'Family Members',
        createdBy: 'Priya Hazarika (Daughter)',
      ),
      QuizQuestionItem(
        id: 'quiz-2',
        question: 'Which historic college in Guwahati did you teach mathematics for 32 years?',
        options: ['Cotton College (University)', 'Tezpur University', 'Jorhat Engineering', 'Gauhati Medical'],
        correctOption: 'Cotton College (University)',
        hint: 'Located near Dighalipukhuri in Panbazar.',
        category: 'Career & Identity',
        createdBy: 'Priya Hazarika (Daughter)',
      ),
      QuizQuestionItem(
        id: 'quiz-3',
        question: 'What is Priya\'s favorite homemade sweet you prepared on Bihu?',
        options: ['Narikol Laru (Coconut Sweet)', 'Rasgulla', 'Kaju Katli', 'Sandesh'],
        correctOption: 'Narikol Laru (Coconut Sweet)',
        hint: 'Made with freshly grated coconut and fragrant jaggery.',
        category: 'Family Memories',
        createdBy: 'Priya Hazarika (Daughter)',
      ),
      QuizQuestionItem(
        id: 'quiz-4',
        question: 'What is the color of the front garden gate of your Guwahati residence?',
        options: ['Forest Green', 'Bright Red', 'Sky Blue', 'Golden Yellow'],
        correctOption: 'Forest Green',
        hint: 'It matches the green color of your tea hedge garden.',
        category: 'Home Familiarity',
        createdBy: 'Priya Hazarika (Daughter)',
      ),
    ];
  }
}
