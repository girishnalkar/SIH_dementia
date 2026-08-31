import 'package:flutter/material.dart';
import '../localization/app_strings.dart';
import '../models/patient_models.dart';
import 'game_face_recall_screen.dart';
import 'game_sequencing_screen.dart';
import 'game_cultural_match_screen.dart';
import 'game_sound_memory_screen.dart';
import 'calm_reminiscence_screen.dart';

import '../services/api_service.dart';

class HomeScreen extends StatefulWidget {
  final Function(String) onLanguageChanged;
  final String currentLanguage;

  const HomeScreen({
    super.key,
    required this.onLanguageChanged,
    required this.currentLanguage,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    _fetchDoctorPrescriptionsAndSyncGoals();
  }

  Future<void> _fetchDoctorPrescriptionsAndSyncGoals() async {
    final meds = await ApiService.fetchPrescriptions('PAT-7401');
    if (meds.isNotEmpty) {
      setState(() {
        for (final m in meds) {
          final taskId = 'task-rx-${m.id}';
          final exists = _schedule.any((t) => t.id == taskId || t.title.contains(m.name));
          if (!exists) {
            _schedule.add(
              ScheduleTask(
                id: taskId,
                title: '💊 ${m.name} ${m.dose} (${m.mealTiming})',
                time: m.time,
                icon: '💊',
                type: TaskType.medication,
                bgHex: 0xFFFEFCE8,
                borderHex: 0xFFEAB308,
                textHex: 0xFF713F12,
                instructions: m.instructions.isNotEmpty ? m.instructions : {
                  'en': 'GOAL (${m.mealTiming.toUpperCase()}): Take 1 tablet of ${m.name} (${m.dose}) with water.',
                  'as': 'ৰাতিপুৱাৰ চাহ খোৱাৰ পিছত ১টা টেবলেট পানীৰে সৈতে লওক।',
                  'bn': 'সকালের খাবারের পর ১টি ট্যাবলেট জল দিয়ে খান।',
                  'hi': 'भोजन के बाद 1 गोली पानी के साथ लें।',
                },
                isCompleted: false,
              ),
            );
          }
        }
      });
    }
  }

  final List<ScheduleTask> _schedule = [
    ScheduleTask(
      id: 'task-1',
      title: 'Morning Warm Tea on Veranda',
      time: '07:30 AM',
      icon: '🌅',
      type: TaskType.routine,
      bgHex: 0xFFFEF3C7,
      borderHex: 0xFFF59E0B,
      textHex: 0xFF78350F,
      instructions: {
        'en': 'Enjoy your warm morning tea with fresh mountain breeze on the veranda.',
        'as': 'বাৰান্দাত পাহাৰীয়া শান্ত বতাহৰ সৈতে ৰাতিপুৱাৰ গৰম চাহ কাপ পান কৰক।',
        'bn': 'বারান্দায় মনোরম বাতাসে সকালের গরম চা উপভোগ করুন।',
        'hi': 'बरामदे में ताजी हवा के साथ सुबह की गरम चाय का आनंद लें।'
      },
      isCompleted: false,
    ),
    ScheduleTask(
      id: 'task-2',
      title: 'Donepezil 5mg (Morning Memory Pill)',
      time: '08:30 AM',
      icon: '💊',
      type: TaskType.medication,
      bgHex: 0xFFFEFCE8,
      borderHex: 0xFFEAB308,
      textHex: 0xFF713F12,
      instructions: {
        'en': 'Take 1 blue Donepezil (5mg) tablet with a full glass of water after breakfast.',
        'as': 'ৰাতিপুৱাৰ আহাৰৰ পিছত ১টা নীলা ডনেপেজিল (৫মিগ্ৰা) টেবলেট পানীৰে সৈতে লওক।',
        'bn': 'প্রাতঃরাশের পর ১টি নীল ডনেপেজিল (৫ মিগ্রা) ট্যাবলেট জল দিয়ে খান।',
        'hi': 'नाश्ते के बाद 1 नीली डोनेपेज़िल (5mg) गोली पानी के साथ लें।'
      },
      isCompleted: false,
    ),
    ScheduleTask(
      id: 'task-3',
      title: 'Gentle Walk in Front Garden',
      time: '10:00 AM',
      icon: '🌳',
      type: TaskType.routine,
      bgHex: 0xFFF0FDF4,
      borderHex: 0xFF22C55E,
      textHex: 0xFF14532D,
      instructions: {
        'en': 'Take a gentle 15-minute stroll along the flower path inside the garden.',
        'as': 'ঘৰৰ সন্মুখৰ ফুলনি বাগিচাত ১৫ মিনিট শান্তভাৱে খোজ কাঢ়ক।',
        'bn': 'বাগানের ফুলের পথের পাশে ১৫ মিনিট শান্তভাবে হাঁটুন।',
        'hi': 'बगीचे में फूलों की क्यारी के पास 15 मिनट टहलें।'
      },
      isCompleted: false,
    ),
    ScheduleTask(
      id: 'task-4',
      title: 'Daily Family Recall Memory Game',
      time: '11:30 AM',
      icon: '🎮',
      type: TaskType.game,
      gameTarget: 'face_recall',
      bgHex: 0xFFF3E8FF,
      borderHex: 0xFFA855F7,
      textHex: 0xFF581C87,
      instructions: {
        'en': 'Play the Family Face Recall game to practice recognizing daughter Priya and relatives.',
        'as': 'জীয়াৰী প্ৰিয়া আৰু পৰিয়ালৰ সদস্যসকলক চিনি পোৱাৰ অনুশীলন কৰক।',
        'bn': 'মেয়ে প্রিয়া ও পরিবারের সদস্যদের চিনে নেওয়ার খেলা খেলুন।',
        'hi': 'बेटी प्रिया और परिजनों को पहचानने का खेल खेलें।'
      },
      isCompleted: false,
    ),
    ScheduleTask(
      id: 'task-5',
      title: 'Nutritious Lunch & Amlodipine 5mg',
      time: '01:30 PM',
      icon: '🍲',
      type: TaskType.medication,
      bgHex: 0xFFEFF6FF,
      borderHex: 0xFF3B82F6,
      textHex: 0xFF1E3A8A,
      instructions: {
        'en': 'Have healthy warm lunch followed by Amlodipine (5mg) blood pressure tablet.',
        'as': 'দুপৰীয়াৰ আহাৰ খাই ৰক্তচাপৰ টেবলেট এমলোডিপিন (৫মিগ্ৰা) পানীৰে লওক।',
        'bn': 'দুপুরের খাবার খেয়ে রক্তচাপের ট্যাবলেট অ্যামলোডিপিন (৫ মিগ্রা) খান।',
        'hi': 'दोपहर का भोजन करें और फिर रक्तचाप की गोली एम्लोडिपिन (5mg) लें।'
      },
      isCompleted: false,
    ),
    ScheduleTask(
      id: 'task-6',
      title: 'Guided Reminiscence Breathing (Sunset)',
      time: '06:30 PM',
      icon: '🧘',
      type: TaskType.therapy,
      bgHex: 0xFFFFF1F2,
      borderHex: 0xFFF43F5E,
      textHex: 0xFF881337,
      instructions: {
        'en': 'Sit comfortably, listen to soothing tea garden sounds, and practice 4-7-8 deep breathing.',
        'as': 'আৰামত বহি চাহ বাগিচাৰ সুৰ শুনি গভীৰ প্ৰাণায়াম উশাহ-নিশাহ অনুশীলন কৰক।',
        'bn': 'শান্তভাবে বসে চা বাগানের সুর শুনে ৪-৭-৮ গভীর শ্বাসচর্চা করুন।',
        'hi': 'आराम से बैठें और चाय बागान की धुन के साथ 4-7-8 गहरी सांस का अभ्यास करें।'
      },
      isCompleted: false,
    ),
  ];

  ScheduleTask? get _currentActiveTask {
    for (final t in _schedule) {
      if (!t.isCompleted) return t;
    }
    return null;
  }

  void _completeTask(ScheduleTask task) {
    setState(() {
      task.isCompleted = true;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('✓ "${task.title}" completed! Next task loaded into spotlight panel.'),
        backgroundColor: const Color(0xFF16A34A),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _resetAllTasks() {
    setState(() {
      for (final t in _schedule) {
        t.isCompleted = false;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🔄 Daily schedule reset for today.'),
        backgroundColor: Color(0xFF0D9488),
      ),
    );
  }

  void _triggerSOS() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Color(0xFFEF4444), size: 32),
            SizedBox(width: 10),
            Text('EMERGENCY SOS', style: TextStyle(fontWeight: FontWeight.w800)),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('🚨 Emergency Alert Beacon Triggered:'),
            SizedBox(height: 8),
            Text('• Calling Daughter: Priya Hazarika (+91 98640 12345)'),
            Text('• Attending Clinician: Dr. H. Baruah (Guwahati Clinic)'),
            Text('• GPS Geofence: Safe within Guwahati Home Sector 4'),
            Text('• Device Battery: 88%'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A)),
            child: const Text('Close Alert', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _speakGreeting() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Spoken Voice: "Namaskar Biren Babu! Today is Monday, 31st August. Wishing you a peaceful and bright day!"',
        ),
        duration: Duration(seconds: 4),
        backgroundColor: Color(0xFF0D9488),
      ),
    );
  }

  String _t(String key) => AppStrings.get(key, widget.currentLanguage);

  @override
  Widget build(BuildContext context) {
    final activeTask = _currentActiveTask;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF0D9488), Color(0xFF2563EB)]),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text('🧠', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _t('appTitle'),
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Color(0xFF0F172A)),
                ),
                Text(
                  _t('brandSubtitle'),
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
        actions: [
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: widget.currentLanguage,
              icon: const Icon(Icons.language, color: Color(0xFF0D9488)),
              items: const [
                DropdownMenuItem(value: 'en', child: Text('English', style: TextStyle(fontWeight: FontWeight.w600))),
                DropdownMenuItem(value: 'as', child: Text('অসমীয়া', style: TextStyle(fontWeight: FontWeight.w600))),
                DropdownMenuItem(value: 'bn', child: Text('বাংলা', style: TextStyle(fontWeight: FontWeight.w600))),
                DropdownMenuItem(value: 'hi', child: Text('हिन्दी', style: TextStyle(fontWeight: FontWeight.w600))),
              ],
              onChanged: (val) {
                if (val != null) widget.onLanguageChanged(val);
              },
            ),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Welcome Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFF0FDF4), Color(0xFFE0F2FE)]),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFBBF7D0), width: 2),
                boxShadow: [
                  BoxShadow(color: Colors.black.withAlpha(15), blurRadius: 16, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(40),
                        child: Image.asset('assets/images/elder_dadu.jpg', width: 72, height: 72, fit: BoxFit.cover),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _t('greeting'),
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF064E3B)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _t('date'),
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF047857)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: _speakGreeting,
                      icon: const Icon(Icons.volume_up),
                      label: Text(_t('listenGreeting'), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0D9488),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 2. DYNAMIC ACTIVE TASK SPOTLIGHT PANEL (Reflects Active Schedule Item)
            _buildActiveTaskSpotlight(activeTask),
            const SizedBox(height: 20),

            // 3. Sensory Hub (Calm Me Down & SOS)
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => CalmReminiscenceScreen(language: widget.currentLanguage)),
                      );
                    },
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [Color(0xFFFFFBEB), Color(0xFFFEF3C7)]),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFFDE68A), width: 2),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('🌅', style: TextStyle(fontSize: 28)),
                          const SizedBox(height: 8),
                          Text(_t('calmTitle'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF713F12))),
                          const SizedBox(height: 4),
                          Text(_t('calmDesc'), style: const TextStyle(fontSize: 12, color: Color(0xFF854D0E), height: 1.3)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: InkWell(
                    onTap: _triggerSOS,
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [Color(0xFFFFF1F2), Color(0xFFFFE4E6)]),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFFECDD3), width: 2),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('🚨', style: TextStyle(fontSize: 28)),
                          const SizedBox(height: 8),
                          Text(_t('sosTitle'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF9F1239))),
                          const SizedBox(height: 4),
                          Text(_t('sosDesc'), style: const TextStyle(fontSize: 12, color: Color(0xFFBE123C), height: 1.3)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            // 4. Cognitive Exercises Heading
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(_t('exercises'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFFCCFBF1), borderRadius: BorderRadius.circular(12)),
                  child: const Text('🧠 DDA Level 2', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF0D9488))),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // 4 Games Cards
            _buildGameCard(
              icon: '👨‍👩‍👧',
              iconBg: const Color(0xFFE0F2FE),
              title: _t('game1Title'),
              desc: _t('game1Sub'),
              btnText: _t('playGame'),
              onPlay: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => GameFaceRecallScreen(language: widget.currentLanguage)),
                );
              },
            ),
            const SizedBox(height: 12),
            _buildGameCard(
              icon: '⏰',
              iconBg: const Color(0xFFFEF3C7),
              title: _t('game2Title'),
              desc: _t('game2Sub'),
              btnText: _t('playGame'),
              onPlay: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => GameSequencingScreen(language: widget.currentLanguage)),
                );
              },
            ),
            const SizedBox(height: 12),
            _buildGameCard(
              icon: '👒',
              iconBg: const Color(0xFFF3E8FF),
              title: _t('game3Title'),
              desc: _t('game3Sub'),
              btnText: _t('playGame'),
              onPlay: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => GameCulturalMatchScreen(language: widget.currentLanguage)),
                );
              },
            ),
            const SizedBox(height: 12),
            _buildGameCard(
              icon: '🔔',
              iconBg: const Color(0xFFCCFBF1),
              title: _t('game4Title'),
              desc: _t('game4Sub'),
              btnText: _t('playGame'),
              onPlay: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => GameSoundMemoryScreen(language: widget.currentLanguage)),
                );
              },
            ),
            const SizedBox(height: 28),

            // 5. Daily Schedule Checklist Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(_t('schedule'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                      TextButton.icon(
                        onPressed: _resetAllTasks,
                        icon: const Icon(Icons.refresh, size: 16),
                        label: const Text('Reset', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  ..._schedule.map((task) {
                    final isCurrentFocus = activeTask?.id == task.id;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10.0),
                      child: InkWell(
                        onTap: () {
                          setState(() {
                            task.isCompleted = !task.isCompleted;
                          });
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: task.isCompleted
                                ? const Color(0xFFF0FDF4)
                                : (isCurrentFocus ? const Color(0xFFFEFCE8) : const Color(0xFFF1F5F9)),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isCurrentFocus
                                  ? const Color(0xFFEAB308)
                                  : (task.isCompleted ? const Color(0xFFBBF7D0) : Colors.transparent),
                              width: isCurrentFocus ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Text(task.icon, style: const TextStyle(fontSize: 20)),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  '${task.time} - ${task.title}',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: isCurrentFocus ? FontWeight.w800 : FontWeight.w600,
                                    color: task.isCompleted ? const Color(0xFF166534) : const Color(0xFF0F172A),
                                  ),
                                ),
                              ),
                              if (isCurrentFocus)
                                Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFACC15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text('ACTIVE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF713F12))),
                                ),
                              Text(
                                task.isCompleted ? '✓ ${_t('completed')}' : _t('pending'),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: task.isCompleted ? const Color(0xFF16A34A) : Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActiveTaskSpotlight(ScheduleTask? activeTask) {
    if (activeTask == null) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFDCFCE7),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF16A34A), width: 2),
        ),
        child: Column(
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('🎉', style: TextStyle(fontSize: 32)),
                SizedBox(width: 12),
                Text(
                  'All Daily Tasks Completed!',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF15803D)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Wonderful job, Biren Babu! You have completed all 6 routine activities and medicines for today. Rest well!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Color(0xFF166534), fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 14),
            ElevatedButton.icon(
              onPressed: _resetAllTasks,
              icon: const Icon(Icons.refresh),
              label: const Text('🔄 Replay / Reset Schedule Tasks'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF16A34A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      );
    }

    final instructions = activeTask.instructions[widget.currentLanguage] ?? activeTask.instructions['en']!;
    final isMed = activeTask.type == TaskType.medication;
    final isGame = activeTask.type == TaskType.game;
    final isTherapy = activeTask.type == TaskType.therapy;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Color(activeTask.bgHex),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Color(activeTask.borderHex), width: 2.5),
        boxShadow: [
          BoxShadow(
            color: Color(activeTask.borderHex).withAlpha(40),
            blurRadius: 14,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Color(activeTask.borderHex),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '⏰ ACTIVE SCHEDULE TASK (${activeTask.time})',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
              Text(
                isMed ? '💊 Pharmacotherapy' : (isGame ? '🎮 Cognitive Exercise' : (isTherapy ? '🧘 Calming Therapy' : '🌅 Daily Routine')),
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: Color(activeTask.textHex),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                child: Text(activeTask.icon, style: const TextStyle(fontSize: 28)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      activeTask.title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: Color(activeTask.textHex),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      instructions,
                      style: TextStyle(
                        fontSize: 13,
                        color: Color(activeTask.textHex).withAlpha(200),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _completeTask(activeTask),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF16A34A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Text(
                    isMed ? '✓ ${_t('confirmTaken')}' : '✓ Mark Complete',
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              if (isGame) ...[
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => GameFaceRecallScreen(language: widget.currentLanguage)),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D9488),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  child: const Text('▶ Launch Game', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                ),
                const SizedBox(width: 8),
              ],
              if (isTherapy) ...[
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => CalmReminiscenceScreen(language: widget.currentLanguage)),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  child: const Text('🧘 Open Breathing', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                ),
                const SizedBox(width: 8),
              ],
              OutlinedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(instructions),
                      backgroundColor: Color(activeTask.textHex),
                    ),
                  );
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Color(activeTask.borderHex), width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                ),
                child: const Text('🔊 Listen', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGameCard({
    required String icon,
    required Color iconBg,
    required String title,
    required String desc,
    required String btnText,
    required VoidCallback onPlay,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(14)),
            child: Center(child: Text(icon, style: const TextStyle(fontSize: 26))),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                const SizedBox(height: 2),
                Text(desc, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.3)),
              ],
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton(
            onPressed: onPlay,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            ),
            child: const Text('▶ Play', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
