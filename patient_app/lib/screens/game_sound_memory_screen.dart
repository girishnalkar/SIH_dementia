import 'package:flutter/material.dart';
import '../localization/app_strings.dart';

class GameSoundMemoryScreen extends StatefulWidget {
  final String language;
  const GameSoundMemoryScreen({super.key, required this.language});

  @override
  State<GameSoundMemoryScreen> createState() => _GameSoundMemoryScreenState();
}

class _GameSoundMemoryScreenState extends State<GameSoundMemoryScreen> {
  String? _selectedOption;
  bool? _isCorrect;

  final List<String> _soundOptions = [
    '🔔 Temple Brass Bell (মন্দিৰৰ ঘণ্টা)',
    '🌊 Brahmaputra Stream (নদীৰ জুৰি)',
    '🐦 Hill Cuckoo (কুলিৰ মাত)',
    '🪈 Bihu Bamboo Flute (বাঁহী)',
  ];

  void _onSelectOption(String option) {
    if (_selectedOption != null) return;
    final correct = option.contains('Temple Brass Bell');

    setState(() {
      _selectedOption = option;
      _isCorrect = correct;
    });

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (mounted) Navigator.pop(context, correct);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = (String key) => AppStrings.get(key, widget.language);

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
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Text(
              'Listen to the soothing regional sound resonance and identify it:',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w600,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 24),
            Container(
              width: 110,
              height: 110,
              decoration: BoxDecoration(
                color: const Color(0xFFCCFBF1),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF0D9488), width: 3),
              ),
              child: const Icon(Icons.music_note, size: 54, color: Color(0xFF0F766E)),
            ),
            const SizedBox(height: 28),
            ..._soundOptions.map((opt) {
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
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                        side: BorderSide(color: borderColor, width: 2),
                      ),
                    ),
                    child: Text(
                      opt,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                    ),
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
