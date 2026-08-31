import 'package:flutter/material.dart';
import '../localization/app_strings.dart';

class GameCulturalMatchScreen extends StatefulWidget {
  final String language;
  const GameCulturalMatchScreen({super.key, required this.language});

  @override
  State<GameCulturalMatchScreen> createState() => _GameCulturalMatchScreenState();
}

class _GameCulturalMatchScreenState extends State<GameCulturalMatchScreen> {
  final List<String> _symbols = ['👒', '🧣', '🔔', '🪈', '👒', '🧣', '🔔', '🪈'];
  final List<bool> _revealed = List.filled(8, false);
  final List<bool> _matched = List.filled(8, false);
  int? _firstIndex;
  bool _lock = false;

  @override
  void initState() {
    super.initState();
    _symbols.shuffle();
  }

  void _onCardTap(int index) {
    if (_lock || _matched[index] || _revealed[index]) return;

    setState(() {
      _revealed[index] = true;
    });

    if (_firstIndex == null) {
      _firstIndex = index;
    } else {
      _lock = true;
      final match = _symbols[_firstIndex!] == _symbols[index];

      if (match) {
        setState(() {
          _matched[_firstIndex!] = true;
          _matched[index] = true;
          _firstIndex = null;
          _lock = false;
        });

        if (_matched.every((m) => m)) {
          Future.delayed(const Duration(milliseconds: 1500), () {
            if (mounted) Navigator.pop(context, true);
          });
        }
      } else {
        Future.delayed(const Duration(milliseconds: 800), () {
          if (mounted) {
            setState(() {
              _revealed[_firstIndex!] = false;
              _revealed[index] = false;
              _firstIndex = null;
              _lock = false;
            });
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = (String key) => AppStrings.get(key, widget.language);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          t('game3Title'),
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
              'Pair familiar regional symbols: Japi (👒), Gamosa (🧣), Brass Bell (🔔), Flute (🪈)',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 28),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.3,
                ),
                itemCount: 8,
                itemBuilder: (context, index) {
                  final isShown = _revealed[index] || _matched[index];
                  final isMatched = _matched[index];

                  return InkWell(
                    onTap: () => _onCardTap(index),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: isMatched
                            ? const Color(0xFFDCFCE7)
                            : (isShown ? const Color(0xFFEDE9FE) : Colors.white),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isMatched
                              ? const Color(0xFF16A34A)
                              : (isShown ? const Color(0xFF7C3AED) : const Color(0xFFCBD5E1)),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: Center(
                        child: Text(
                          isShown ? _symbols[index] : '❓',
                          style: const TextStyle(fontSize: 42),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
