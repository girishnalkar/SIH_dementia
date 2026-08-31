import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const SmritiPatientApp());
}

class SmritiPatientApp extends StatefulWidget {
  const SmritiPatientApp({super.key});

  @override
  State<SmritiPatientApp> createState() => _SmritiPatientAppState();
}

class _SmritiPatientAppState extends State<SmritiPatientApp> {
  String _currentLanguage = 'en';

  void _changeLanguage(String newLang) {
    setState(() {
      _currentLanguage = newLang;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smriti Sahayak - Patient Companion',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Segoe UI',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D9488),
          primary: const Color(0xFF0D9488),
          secondary: const Color(0xFF2563EB),
          surface: const Color(0xFFF8FAFC),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      home: HomeScreen(
        currentLanguage: _currentLanguage,
        onLanguageChanged: _changeLanguage,
      ),
    );
  }
}
