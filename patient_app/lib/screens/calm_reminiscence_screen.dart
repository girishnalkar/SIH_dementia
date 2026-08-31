import 'package:flutter/material.dart';
import '../localization/app_strings.dart';

class CalmReminiscenceScreen extends StatefulWidget {
  final String language;
  const CalmReminiscenceScreen({super.key, required this.language});

  @override
  State<CalmReminiscenceScreen> createState() => _CalmReminiscenceScreenState();
}

class _CalmReminiscenceScreenState extends State<CalmReminiscenceScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _breathingController;
  late Animation<double> _scaleAnimation;
  String _breathePrompt = 'Breathe in slowly (4s)...';

  @override
  void initState() {
    super.initState();
    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.35).animate(
      CurvedAnimation(parent: _breathingController, curve: Curves.easeInOut),
    );

    _breathingController.addListener(() {
      if (_breathingController.value < 0.4) {
        if (_breathePrompt != 'Breathe in slowly (4s)...') {
          setState(() => _breathePrompt = 'Breathe in slowly (4s)...');
        }
      } else if (_breathingController.value < 0.7) {
        if (_breathePrompt != 'Hold gently (7s)...') {
          setState(() => _breathePrompt = 'Hold gently (7s)...');
        }
      } else {
        if (_breathePrompt != 'Exhale softly (8s)...') {
          setState(() => _breathePrompt = 'Exhale softly (8s)...');
        }
      }
    });
  }

  @override
  void dispose() {
    _breathingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = (String key) => AppStrings.get(key, widget.language);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: Text(
          t('calmTitle'),
          style: const TextStyle(fontWeight: FontWeight.w800, color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Scenic Memory Photo Card
              Container(
                width: double.infinity,
                height: 180,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  image: const DecorationImage(
                    image: AssetImage('assets/images/assam_tea.jpg'),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Colors.black.withOpacity(0.85),
                        Colors.transparent,
                      ],
                    ),
                  ),
                  padding: const EdgeInsets.all(16),
                  alignment: Alignment.bottomLeft,
                  child: const Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '🌅 Assam Tea Gardens - Peaceful Memory',
                        style: TextStyle(
                          color: Color(0xFFFEF08A),
                          fontWeight: FontWeight.w800,
                          fontSize: 18,
                        ),
                      ),
                      Text(
                        'Gentle morning breeze and mountain air.',
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Animated Breathing Orb
              ScaleTransition(
                scale: _scaleAnimation,
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const RadialGradient(
                      colors: [Color(0xFF2DD4BF), Color(0xFF0F766E)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF2DD4BF).withOpacity(0.5),
                        blurRadius: 30,
                        spreadRadius: 8,
                      )
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'Breathe',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Dynamic Breath Instruction
              Text(
                _breathePrompt,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF2DD4BF),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Relax peacefully. Your whole family is right here with you.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70, fontSize: 15),
              ),
              const SizedBox(height: 32),

              // Priya Voice Comfort Note Button
              ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Priya (Voice Note): "Baba, you are safe at home in Guwahati. I love you and will call you soon!"',
                      ),
                      duration: Duration(seconds: 4),
                      backgroundColor: Color(0xFF0D9488),
                    ),
                  );
                },
                icon: const Icon(Icons.record_voice_over),
                label: Text(
                  t('listenPriyaVoice'),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E293B),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: const BorderSide(color: Color(0xFF334155), width: 1.5),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
