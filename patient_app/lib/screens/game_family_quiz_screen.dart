import 'package:flutter/material.dart';
import '../localization/app_strings.dart';
import '../models/patient_models.dart';
import '../services/api_service.dart';

class GameFamilyQuizScreen extends StatefulWidget {
  final String language;
  const GameFamilyQuizScreen({super.key, required this.language});

  @override
  State<GameFamilyQuizScreen> createState() => _GameFamilyQuizScreenState();
}

class _GameFamilyQuizScreenState extends State<GameFamilyQuizScreen> {
  int _currentIndex = 0;
  int _score = 0;
  String? _selectedOption;
  bool? _isCorrect;
  bool _showHint = false;
  bool _isLoading = true;
  late int _startTime;
  List<QuizQuestionItem> _questions = [];

  @override
  void initState() {
    super.initState();
    _loadCaregiverQuestions();
  }

  Future<void> _loadCaregiverQuestions() async {
    setState(() => _isLoading = true);
    final fetched = await ApiService.fetchQuizQuestions('PAT-7401');
    if (mounted) {
      setState(() {
        _questions = fetched;
        _isLoading = false;
        _startTime = DateTime.now().millisecondsSinceEpoch;
      });
    }
  }

  void _onSelectOption(String option) {
    if (_selectedOption != null || _questions.isEmpty) return;

    final currentQ = _questions[_currentIndex];
    final correct = (option == currentQ.correctOption);
    final latency = (DateTime.now().millisecondsSinceEpoch - _startTime).toDouble();

    setState(() {
      _selectedOption = option;
      _isCorrect = correct;
      if (!correct) _showHint = true;
    });

    if (correct) {
      _score++;
    }

    ApiService.logGameSession(
      patientId: 'PAT-7401',
      gameType: 'family_trivia_quiz',
      score: correct ? 10.0 : 0.0,
      latencyMs: latency,
      isCorrect: correct,
      hintsUsed: _showHint ? 1 : 0,
    );

    Future.delayed(const Duration(milliseconds: 1800), () {
      if (!mounted) return;

      if (_currentIndex < _questions.length - 1) {
        setState(() {
          _currentIndex++;
          _selectedOption = null;
          _isCorrect = null;
          _showHint = false;
          _startTime = DateTime.now().millisecondsSinceEpoch;
        });
      } else {
        _showCompletionDialog();
      }
    });
  }

  void _showCompletionDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Text('🎉', style: TextStyle(fontSize: 32)),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'Quiz Completed!',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'You answered $_score of ${_questions.length} questions correctly!',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF15803D)),
            ),
            const SizedBox(height: 8),
            const Text(
              'Wonderful job, Biren Babu! Your daughter Priya is very proud of your memory recall today.',
              style: TextStyle(fontSize: 14, color: Color(0xFF334155)),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context, true);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Back to Companion', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = (String key) => AppStrings.get(key, widget.language);

    if (_isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: Text(
            t('game4Title'),
            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20),
          ),
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF0F172A),
          elevation: 1,
        ),
        body: const Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(color: Color(0xFF0D9488)),
              SizedBox(height: 16),
              Text(
                'Loading customized family questions from daughter Priya...',
                style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF475569)),
              ),
            ],
          ),
        ),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: Text(t('game4Title'), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF0F172A),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('👨‍👩‍👧', style: TextStyle(fontSize: 48)),
                const SizedBox(height: 12),
                const Text(
                  'No personalized family questions added yet.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Ask daughter Priya to add memory quiz questions from the Caregiver Portal!',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _loadCaregiverQuestions,
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                  child: const Text('🔄 Retry Loading Questions', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final currentQ = _questions[_currentIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          t('game4Title'),
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 1,
        actions: [
          IconButton(
            onPressed: _loadCaregiverQuestions,
            icon: const Icon(Icons.refresh),
            tooltip: 'Sync Latest Questions from Priya',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Bar & Meta
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFF59E0B)),
                    ),
                    child: Text(
                      'QUESTION ${_currentIndex + 1} OF ${_questions.length}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFFB45309)),
                    ),
                  ),
                  Text(
                    '⭐ Score: $_score',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0D9488)),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Caregiver Tag
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('👨‍👩‍👧', style: TextStyle(fontSize: 16)),
                    const SizedBox(width: 6),
                    Text(
                      '${currentQ.category} • Created by ${currentQ.createdBy}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF475569)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Question Box Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFCBD5E1), width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlpha(10),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Text(
                  currentQ.question,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    height: 1.35,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Options
              ...currentQ.options.map((opt) {
                final isPicked = _selectedOption == opt;
                Color bgColor = Colors.white;
                Color borderColor = const Color(0xFFCBD5E1);
                Color textColor = const Color(0xFF0F172A);

                if (isPicked) {
                  if (_isCorrect == true) {
                    bgColor = const Color(0xFFDCFCE7);
                    borderColor = const Color(0xFF16A34A);
                    textColor = const Color(0xFF15803D);
                  } else {
                    bgColor = const Color(0xFFFEE2E2);
                    borderColor = const Color(0xFFEF4444);
                    textColor = const Color(0xFF991B1B);
                  }
                }

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: SizedBox(
                    width: double.infinity,
                    height: 62,
                    child: ElevatedButton(
                      onPressed: () => _onSelectOption(opt),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: bgColor,
                        foregroundColor: textColor,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: borderColor, width: 2),
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: isPicked
                                  ? (_isCorrect == true ? const Color(0xFF16A34A) : const Color(0xFFEF4444))
                                  : const Color(0xFFF1F5F9),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                String.fromCharCode(65 + currentQ.options.indexOf(opt)),
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: isPicked ? Colors.white : const Color(0xFF475569),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(
                              opt,
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w700,
                                color: textColor,
                              ),
                            ),
                          ),
                          if (isPicked && _isCorrect == true)
                            const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 26)
                          else if (isPicked && _isCorrect == false)
                            const Icon(Icons.cancel, color: Color(0xFFEF4444), size: 26),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 12),

              // Hint Alert (revealed or clickable)
              if (_showHint)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFF59E0B)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('💡', style: TextStyle(fontSize: 20)),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Priya\'s Hint: "${currentQ.hint}"',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF78350F),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 14),

              OutlinedButton.icon(
                onPressed: () {
                  setState(() => _showHint = true);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Priya\'s Hint: "${currentQ.hint}"'),
                      duration: const Duration(seconds: 4),
                      backgroundColor: const Color(0xFF0D9488),
                    ),
                  );
                },
                icon: const Icon(Icons.lightbulb_outline, color: Color(0xFF0D9488)),
                label: const Text(
                  'Need a Family Hint?',
                  style: TextStyle(
                    color: Color(0xFF0D9488),
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                  side: const BorderSide(color: Color(0xFF0D9488), width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
