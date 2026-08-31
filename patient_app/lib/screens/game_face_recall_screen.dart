import 'package:flutter/material.dart';
import '../localization/app_strings.dart';
import '../services/api_service.dart';

class GameFaceRecallScreen extends StatefulWidget {
  final String language;
  const GameFaceRecallScreen({super.key, required this.language});

  @override
  State<GameFaceRecallScreen> createState() => _GameFaceRecallScreenState();
}

class _GameFaceRecallScreenState extends State<GameFaceRecallScreen> {
  late int _startTime;
  String? _selectedOption;
  bool? _isCorrect;

  final List<String> _options = [
    'Priya (Daughter)',
    'Sunita (Neighbor)',
    'Kavita (Nurse)',
    'Rina (Colleague)'
  ];

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now().millisecondsSinceEpoch;
  }

  void _onSelectOption(String option) {
    if (_selectedOption != null) return;

    final latency = (DateTime.now().millisecondsSinceEpoch - _startTime).toDouble();
    final correct = (option == 'Priya (Daughter)');

    setState(() {
      _selectedOption = option;
      _isCorrect = correct;
    });

    ApiService.logGameSession(
      patientId: 'PAT-7401',
      gameType: 'face_recall',
      score: correct ? 10.0 : 0.0,
      latencyMs: latency,
      isCorrect: correct,
      hintsUsed: 0,
    );

    Future.delayed(const Duration(milliseconds: 1800), () {
      if (mounted) {
        Navigator.pop(context, correct);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = (String key) => AppStrings.get(key, widget.language);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          t('game1Title'),
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 1,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Who is this beloved family member smiling at you?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.grey[800],
                ),
              ),
              const SizedBox(height: 20),
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF0D9488), width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    )
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Image.asset(
                    'assets/images/daughter.jpg',
                    height: 220,
                    width: 220,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 28),
              ..._options.map((opt) {
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
                    height: 60,
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
                      child: Text(
                        opt,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: textColor,
                        ),
                      ),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Voice clue: "This is your daughter Priya who loves you dearly."'),
                      duration: Duration(seconds: 3),
                    ),
                  );
                },
                icon: const Icon(Icons.volume_up, color: Color(0xFF0D9488)),
                label: const Text(
                  'Listen to Voice Clue',
                  style: TextStyle(
                    color: Color(0xFF0D9488),
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  side: const BorderSide(color: Color(0xFF0D9488), width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
