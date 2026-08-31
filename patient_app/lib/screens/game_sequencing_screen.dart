import 'package:flutter/material.dart';
import '../localization/app_strings.dart';

class GameSequencingScreen extends StatefulWidget {
  final String language;
  const GameSequencingScreen({super.key, required this.language});

  @override
  State<GameSequencingScreen> createState() => _GameSequencingScreenState();
}

class _GameSequencingScreenState extends State<GameSequencingScreen> {
  int _currentStep = 1;
  final List<Map<String, dynamic>> _steps = [
    {'step': 1, 'title': '🌅 Morning Tea on Veranda', 'picked': false},
    {'step': 2, 'title': '💊 Donepezil 5mg Medication', 'picked': false},
    {'step': 3, 'title': '🌳 Gentle Garden Walk', 'picked': false},
    {'step': 4, 'title': '🍲 Nutritious Lunch & Rest', 'picked': false},
  ];

  @override
  void initState() {
    super.initState();
    _steps.shuffle();
  }

  void _onPickStep(Map<String, dynamic> item) {
    if (item['picked'] == true) return;

    if (item['step'] == _currentStep) {
      setState(() {
        item['picked'] = true;
        _currentStep++;
      });

      if (_currentStep > 4) {
        Future.delayed(const Duration(milliseconds: 1500), () {
          if (mounted) Navigator.pop(context, true);
        });
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Try thinking what happens earlier in the morning!'),
          duration: Duration(seconds: 1),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = (String key) => AppStrings.get(key, widget.language);
    final isDone = _currentStep > 4;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          t('game2Title'),
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 1,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Text(
              'Tap the daily routine activities in proper chronological order from Morning to Afternoon:',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w600,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: _steps.length,
                itemBuilder: (context, index) {
                  final item = _steps[index];
                  final isPicked = item['picked'] == true;

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 14.0),
                    child: SizedBox(
                      height: 64,
                      child: ElevatedButton(
                        onPressed: isPicked ? null : () => _onPickStep(item),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isPicked ? const Color(0xFFDCFCE7) : Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: BorderSide(
                              color: isPicked ? const Color(0xFF16A34A) : const Color(0xFFCBD5E1),
                              width: 2,
                            ),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              item['title'],
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w700,
                                color: isPicked ? const Color(0xFF15803D) : const Color(0xFF0F172A),
                              ),
                            ),
                            if (isPicked)
                              const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 28),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            if (isDone)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Text(
                  '🎉 Outstanding! Routine arranged in perfect chronological order!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF15803D),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
