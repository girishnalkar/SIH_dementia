/// Models for Smriti Sahayak Patient Mobile Companion
class PatientProfile {
  final String id;
  final String name;
  final int age;
  final String stage;
  final String location;
  final String primaryCaregiver;
  final String caregiverContact;
  final double cognitiveIndex;
  final int mmseScore;
  final double complianceRate;

  PatientProfile({
    required this.id,
    required this.name,
    required this.age,
    required this.stage,
    required this.location,
    required this.primaryCaregiver,
    required this.caregiverContact,
    required this.cognitiveIndex,
    required this.mmseScore,
    required this.complianceRate,
  });

  factory PatientProfile.defaultBiren() {
    return PatientProfile(
      id: 'PAT-7401',
      name: 'Biren Hazarika',
      age: 74,
      stage: 'Mild-Moderate Dementia (AD Stage 3)',
      location: 'Guwahati, Assam',
      primaryCaregiver: 'Priya Hazarika (Daughter)',
      caregiverContact: '+91 98640 12345',
      cognitiveIndex: 78.0,
      mmseScore: 22,
      complianceRate: 0.94,
    );
  }
}

class MedicationItem {
  final String id;
  final String name;
  final String dose;
  final String time;
  final String mealTiming;
  final int colorHex;
  final Map<String, String> instructions;
  bool isTakenToday;

  MedicationItem({
    required this.id,
    required this.name,
    required this.dose,
    required this.time,
    this.mealTiming = 'After Morning Meal / Tea',
    required this.colorHex,
    required this.instructions,
    this.isTakenToday = false,
  });

  factory MedicationItem.donepezil() {
    return MedicationItem(
      id: 'rx-101',
      name: 'Donepezil',
      dose: '5 mg - 1 Tablet',
      time: '08:30 AM',
      mealTiming: 'After Morning Meal / Tea',
      colorHex: 0xFF3B82F6,
      instructions: {
        'en': 'Take 1 blue tablet with water after morning tea.',
        'as': 'ৰাতিপুৱাৰ চাহ খোৱাৰ পিছত ১টা নীলা টেবলেট পানীৰে সৈতে লওক।',
        'bn': 'সকালের চা পানের পর ১টি নীল ট্যাবলেট জল দিয়ে নিন।',
        'hi': 'सुबह की चाय के बाद 1 नीली गोली पानी के साथ लें।'
      },
      isTakenToday: false,
    );
  }
}

enum TaskType {
  routine,
  medication,
  game,
  therapy,
}

class ScheduleTask {
  final String id;
  final String title;
  final String time;
  final String icon;
  final TaskType type;
  final int bgHex;
  final int borderHex;
  final int textHex;
  final Map<String, String> instructions;
  final String? gameTarget;
  bool isCompleted;

  ScheduleTask({
    required this.id,
    required this.title,
    required this.time,
    required this.icon,
    this.type = TaskType.routine,
    this.bgHex = 0xFFFEFCE8,
    this.borderHex = 0xFFFACC15,
    this.textHex = 0xFF713F12,
    required this.instructions,
    this.gameTarget,
    this.isCompleted = false,
  });
}

class MemoryVaultItem {
  final String id;
  final String title;
  final String relation;
  final String imagePath;
  final Map<String, String> audioText;

  MemoryVaultItem({
    required this.id,
    required this.title,
    required this.relation,
    required this.imagePath,
    required this.audioText,
  });
}

class QuizQuestionItem {
  final String id;
  final String question;
  final List<String> options;
  final String correctOption;
  final String hint;
  final String category;
  final String createdBy;

  QuizQuestionItem({
    required this.id,
    required this.question,
    required this.options,
    required this.correctOption,
    required this.hint,
    this.category = 'Family Trivia',
    this.createdBy = 'Priya Hazarika (Daughter)',
  });

  factory QuizQuestionItem.fromJson(Map<String, dynamic> json) {
    return QuizQuestionItem(
      id: json['id'] ?? 'quiz-default',
      question: json['question'] ?? 'What is your daughter\'s name?',
      options: List<String>.from(json['options'] ?? ['Priya', 'Sunita', 'Anjali', 'Kavita']),
      correctOption: json['correct_option'] ?? 'Priya',
      hint: json['hint'] ?? 'She loves and cares for you every day.',
      category: json['category'] ?? 'Family Trivia',
      createdBy: json['created_by'] ?? 'Priya Hazarika',
    );
  }
}

