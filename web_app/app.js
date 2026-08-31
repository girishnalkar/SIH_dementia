/**
 * Smriti Sahayak (স্মৃতি সহায়ক) - Core Frontend Application Logic
 * Comprehensive AI Cognitive Gaming, Multilingual Voice, and Dementia Monitoring System
 */

// ============================================================================
// 1. GLOBAL STATE & LOCAL STORAGE DATABASE (Simulating SQLite Client Engine)
// ============================================================================
const AppState = {
  currentMode: 'patient', // 'patient' | 'caregiver' | 'mirror'
  currentLanguage: 'as',  // 'as' (Assamese) | 'bn' (Bengali) | 'hi' (Hindi) | 'mni' (Manipuri) | 'en' (English)
  isOnline: true,
  isListening: false,
  
  patient: {
    name: 'Biren Hazarika (বীৰেন হাজৰিকা)',
    age: 74,
    stage: 'Mild-Moderate Dementia (AD Stage 3)',
    location: 'Guwahati, Assam',
    cognitiveIndex: 78,
    mmseScore: 22, // Out of 30
    memoryScore: 82,
    reactionTimeAvg: 1420, // ms
    adherenceRate: 94, // %
    streakDays: 12
  },

  medications: [
    {
      id: 'med-1',
      name: 'Donepezil (ডনেপেজিল)',
      dose: '5 mg - 1 Tablet',
      time: '08:30 AM',
      color: '#3b82f6',
      shape: 'round',
      takenToday: true,
      takenAt: '08:28 AM',
      instructions: {
        en: 'Take 1 blue tablet after morning tea.',
        as: 'ৰাতিপুৱাৰ চাহ খোৱাৰ পিছত ১টা নীলা টেবলেট লওক।',
        bn: 'সকালের চা পানের পর ১টি নীল ট্যাবলেট নিন।',
        hi: 'सुबह की चाय के बाद 1 नीली गोली लें।'
      }
    },
    {
      id: 'med-2',
      name: 'Amlodipine (এমলোদিপাইন)',
      dose: '5 mg - BP Tablet',
      time: '01:30 PM',
      color: '#f59e0b',
      shape: 'oval',
      takenToday: false,
      takenAt: null,
      instructions: {
        en: 'Take after afternoon lunch with water.',
        as: 'দুপৰীয়াৰ আহাৰৰ পিছত পানীৰে সৈতে লওক।',
        bn: 'দুপুরের খাবারের পর জল দিয়ে খান।',
        hi: 'दोपहर के भोजन के बाद पानी के साथ लें।'
      }
    },
    {
      id: 'med-3',
      name: 'Memantine (মেমেণ্টাইন)',
      dose: '10 mg - Evening Tab',
      time: '08:00 PM',
      color: '#10b981',
      shape: 'round',
      takenToday: false,
      takenAt: null,
      instructions: {
        en: 'Take before dinner.',
        as: 'নিশাৰ আহাৰৰ আগতে লওক।',
        bn: 'রাতের খাবারের আগে নিন।',
        hi: 'रात के खाने से पहले लें।'
      }
    }
  ],

  alerts: [
    {
      id: 'alt-1',
      type: 'warning',
      title: 'Reaction Delay on Sequencing Game',
      detail: 'Reaction time latency increased from 1.2s to 1.8s (+42%) on chronological sequencing task.',
      time: 'Today, 10:15 AM'
    },
    {
      id: 'alt-2',
      type: 'info',
      title: 'Morning Medication Logged',
      detail: 'Donepezil (5mg) confirmed taken on time at 08:28 AM via voice confirmation.',
      time: 'Today, 08:28 AM'
    },
    {
      id: 'alt-3',
      type: 'critical',
      title: 'Mild Sundowning Agitation Flag',
      detail: 'Voice analysis detected elevated agitation score (0.74) during evening check-in yesterday.',
      time: 'Yesterday, 06:45 PM'
    }
  ],

  memoryVaultItems: [
    {
      id: 'vault-1',
      title: 'Priya (প্ৰিয়া - জীয়াৰী)',
      relation: 'Daughter (জীয়াৰী)',
      image: 'assets/daughter.jpg',
      audioText: {
        en: 'This is your beloved daughter Priya. She lives in Guwahati and calls you every morning.',
        as: 'এয়া আপোনাৰ মৰমৰ জীয়াৰী প্ৰিয়া। তেওঁ গুৱাহাটীত থাকে আৰু প্ৰতিদিনে ৰাতিপুৱা আপোনাক ফোন কৰে।',
        bn: 'এটি আপনার মেয়ে প্রিয়া। সে গুয়াহাটিতে থাকে এবং প্রতিদিন ফোন করে।',
        hi: 'यह आपकी बेटी प्रिया है। वह गुवाहाटी में रहती है और रोज फोन करती है।'
      },
      calmingAnchor: true
    },
    {
      id: 'vault-2',
      title: 'Family Tea on Veranda',
      relation: 'Family Gathering (পৰিয়াল)',
      image: 'assets/family.jpg',
      audioText: {
        en: 'Here is your whole family enjoying morning tea in the hills. Everyone loves and cares for you.',
        as: 'পাহাৰৰ বাৰান্দাত আপোনাৰ সমগ্ৰ পৰিয়ালে চাহ খাই আনন্দ কৰিছে। সকলোৱে আপোনাক বহুত ভাল পায়।',
        bn: 'পাহাড়ের বারান্দায় পুরো পরিবার একসাথে চা খাচ্ছে। সবাই আপনাকে ভালোবাসে।',
        hi: 'पहाड़ी बरामदे में पूरा परिवार चाय पी रहा है। सब आपसे बहुत प्यार करते हैं।'
      },
      calmingAnchor: true
    },
    {
      id: 'vault-3',
      title: 'Assam Tea Garden',
      relation: 'Childhood Memory (শৈশৱৰ স্মৃতি)',
      image: 'assets/assam_tea.jpg',
      audioText: {
        en: 'The beautiful green tea gardens of Assam where you spent peaceful morning walks.',
        as: 'অসমৰ অনুপম সেউজীয়া চাহ বাগিচা, য’ত আপুনি শান্তিপূৰ্ণ ৰাতিপুৱাৰ ভ্ৰমণ কৰিছিল।',
        bn: 'আসামের সুন্দর চা বাগান যেখানে আপনি সকালে হাঁটতেন।',
        hi: 'असम के सुंदर चाय बागान जहाँ आप सुबह सैर करते थे।'
      },
      calmingAnchor: true
    },
    {
      id: 'vault-4',
      title: 'Biren Babu (আপুনি)',
      relation: 'Self Portrait',
      image: 'assets/elder_dadu.jpg',
      audioText: {
        en: 'This is you, Biren Hazarika. You are a respected teacher and loved by all.',
        as: 'এয়া আপুনি, শ্ৰীযুত বীৰেন হাজৰিকা। আপুনি এজন সন্মানীয় শিক্ষক আৰু সকলোৰে শ্ৰদ্ধাৰ।',
        bn: 'এটি আপনি, বীরেন হাজারিকা। আপনি একজন সম্মানিত শিক্ষক।',
        hi: 'यह आप हैं, बीरेन हजारिका जी। आप एक आदरणीय शिक्षक हैं।'
      },
      calmingAnchor: false
    }
  ]
};

// ============================================================================
// 2. MULTILINGUAL DICTIONARY & LOCALIZATION
// ============================================================================
const i18n = {
  en: {
    brandSubtitle: 'AI Cognitive & Dementia Care Companion',
    patientGreeting: 'Namaskar, Biren Babu!',
    patientDate: 'Monday, 31 August 2026',
    voiceGreet: 'Listen to Morning Greeting',
    medAlertTitle: 'Upcoming Medication Reminder',
    btnTookMed: 'I Took It',
    btnSpeakMed: 'Listen Details',
    gamesHeading: 'Daily Cognitive Exercises',
    ddaTitle: 'Adaptive AI Engine Active',
    playFaceGame: 'Family Recall Game',
    playFaceDesc: 'Recognize your beloved family members and close friends.',
    playSeqGame: 'Daily Routine Sequencing',
    playSeqDesc: 'Arrange your daily activities in proper chronological order.',
    playTileGame: 'Cultural Memory Match',
    playTileDesc: 'Pair familiar cultural symbols and household items.',
    playSoundGame: 'Sound & Echo Memory',
    playSoundDesc: 'Listen to soothing regional sounds and identify them.',
    calmModalTitle: 'Calm Me Down & Reminiscence',
    calmModalDesc: 'Relax your mind with familiar sights and guided breathing.',
    breatheIn: 'Breathe In',
    breatheHold: 'Hold Calmly',
    breatheOut: 'Breathe Out',
    sosTitle: 'Emergency Wander Assistance',
    sosDesc: 'One-touch emergency call to family & Caregiver beacon alert.',
    btnSOS: 'CALL DAUGHTER PRIYA NOW',
    voiceAssistantTitle: 'Smriti Voice Assistant',
    voicePrompt: 'Tap microphone and speak in your language...',
    caregiverTitle: 'Clinical Telemetry & Caregiver Console'
  },
  as: {
    brandSubtitle: 'কৃত্ৰিম বুদ্ধিমত্তাৰ স্মৃতি আৰু ডিমেনচিয়া সহায়ক',
    patientGreeting: 'নমস্কাৰ, বীৰেন হাজৰিকা ডাঙৰীয়া!',
    patientDate: 'সোমবাৰ, ৩১ আগষ্ট ২০২৬',
    voiceGreet: 'ৰাতিপুৱাৰ শুভবাৰ্তা শুনক',
    medAlertTitle: 'দৰব খোৱাৰ সময়ৰ জাননী',
    btnTookMed: 'মই দৰব খালোঁ',
    btnSpeakMed: 'বিৱৰণ শুনক',
    gamesHeading: 'দৈনন্দিন স্মৃতি চৰ্চা খেল',
    ddaTitle: 'স্বয়ংক্ৰিয় এআই স্তৰ সক্ৰিয়',
    playFaceGame: 'পৰিয়াল চিনি পোৱা খেল',
    playFaceDesc: 'আপোনাৰ মৰমৰ পৰিয়াল আৰু আত্মীয়সকলক মনত পেলাওক।',
    playSeqGame: 'দৈনিক কামৰ ক্ৰম খেল',
    playSeqDesc: 'ৰাতিপুৱাৰ কামসমূহ সঠিক ক্ৰমত সজাওক।',
    playTileGame: 'সংস্কৃতিৰ স্মৃতি মেলা',
    playTileDesc: 'জাপি, গামোচা আদি সাংস্কৃতিক বস্তুবোৰ মিল কৰক।',
    playSoundGame: 'শব্দ আৰু ধ্বনি স্মৃতি',
    playSoundDesc: 'পাহাৰীয়া বাঁহী আৰু চৰাইৰ মাত শুনি চিনি পাওক।',
    calmModalTitle: 'শান্ত মন আৰু স্মৃতি মঞ্জুষা',
    calmModalDesc: 'মৰমৰ স্মৃতি আৰু সহজ উশাহ-নিশাহেৰে মন শান্ত কৰক।',
    breatheIn: 'উশাহ লওক',
    breatheHold: 'শান্ত হৈ ৰওক',
    breatheOut: 'উশাহ এৰক',
    sosTitle: 'জৰুৰীকালীন সহায় সংকেত',
    sosDesc: 'প্ৰিয়া আৰু চিকিৎসকৰ সৈতে তৎক্ষণাৎ সংযোগ কৰক।',
    btnSOS: 'জীয়াৰী প্ৰিয়ালৈ ফোন কৰক',
    voiceAssistantTitle: 'স্মৃতি ভইচ সহায়ক',
    voicePrompt: 'মাইক্ৰ’ফোনত স্পৰ্শ কৰি অসমীয়াত কথা কওক...',
    caregiverTitle: 'অভিভাৱক আৰু চিকিৎসক নিৰীক্ষণ কঞ্চোল'
  },
  bn: {
    brandSubtitle: 'এআই চালিত ডিমেনশিয়া ও স্মৃতি সহায়ক',
    patientGreeting: 'নমস্কার, বীরেন বাবু!',
    patientDate: 'সোমবার, ৩১ আগস্ট ২০২৬',
    voiceGreet: 'সকালের শুভেচ্ছা শুনুন',
    medAlertTitle: 'ওষুধ খাওয়ার সময় হয়েছে',
    btnTookMed: 'আমি ওষুধ খেয়েছি',
    btnSpeakMed: 'নির্দেশ শুনুন',
    gamesHeading: 'দৈনিক স্মৃতি অনুশীলন',
    ddaTitle: 'স্মার্ট এআই ইঞ্জিন সক্রিয়',
    playFaceGame: 'পরিবার চেনার খেলা',
    playFaceDesc: 'আপনার প্রিয় পরিবার ও পরিচিতদের ছবি দেখে চিনুন।',
    playSeqGame: 'দৈনন্দিন কাজের ক্রম',
    playSeqDesc: 'সকালের কাজগুলো পরপর ক্রমানুসারে সাজান।',
    playTileGame: 'সাংস্কৃতিক স্মৃতি মেল',
    playTileDesc: 'চেনাশোনা প্রতীক ও জিনিসপত্র মিলিয়ে নিন।',
    playSoundGame: 'শব্দ ও সুরের স্মৃতি',
    playSoundDesc: 'সুন্দর সুর ও পাখির ডাক শুনে চিনুন।',
    calmModalTitle: 'শান্ত মন ও স্মৃতি ভল্ট',
    calmModalDesc: 'পরিচিত ছবি ও গভীর নিঃশ্বাসের সাহায্যে মন শান্ত করুন।',
    breatheIn: 'শ্বাস নিন',
    breatheHold: 'ধরে রাখুন',
    breatheOut: 'শ্বাস ছাড়ুন',
    sosTitle: 'জরুরি সহায়তা সংকেত',
    sosDesc: 'মেয়ে প্রিয়া এবং ডাক্তারের সাথে জরুরি সংযোগ।',
    btnSOS: 'মেয়ে প্রিয়াকে কল করুন',
    voiceAssistantTitle: 'স্মৃতি ভয়েস অ্যাসিস্ট্যান্ট',
    voicePrompt: 'মাইকে চাপ দিয়ে বাংলায় কথা বলুন...',
    caregiverTitle: 'তত্ত্বাবধায়ক ও ক্লিনিকাল ড্যাশবোর্ড'
  },
  hi: {
    brandSubtitle: 'एआई डिमेंशिया व मेमोरी केयर प्लेटफॉर्म',
    patientGreeting: 'नमस्ते, बीरेन बाबू!',
    patientDate: 'सोमवार, 31 अगस्त 2026',
    voiceGreet: 'सुबह का संदेश सुनें',
    medAlertTitle: 'दवा लेने का समय',
    btnTookMed: 'मैंने दवा ले ली',
    btnSpeakMed: 'विवरण सुनें',
    gamesHeading: 'दैनिक संज्ञानात्मक खेल',
    ddaTitle: 'स्मार्ट एआई अडैप्टिव एक्टिव',
    playFaceGame: 'परिवार पहचान खेल',
    playFaceDesc: 'अपने प्रियजनों और परिजनों की तस्वीरें पहचानें।',
    playSeqGame: 'दैनिक दिनचर्या क्रम',
    playSeqDesc: 'सुबह के कार्यों को सही क्रम में व्यवस्थित करें।',
    playTileGame: 'सांस्कृतिक स्मृति मिलान',
    playTileDesc: 'पारंपरिक वस्तुओं और प्रतीकों के जोड़े बनाएं।',
    playSoundGame: 'ध्वनि और सुर स्मृति',
    playSoundDesc: 'प्रकृति और मंदिर की घंटी की आवाज सुनकर पहचानें।',
    calmModalTitle: 'शांत मन और स्मृति मंजूषा',
    calmModalDesc: 'पारिवारिक यादों और प्राणायाम से मन को शांत करें।',
    breatheIn: 'सांस अंदर लें',
    breatheHold: 'रोके रखें',
    breatheOut: 'सांस बाहर छोड़ें',
    sosTitle: 'आपातकालीन सहायता',
    sosDesc: 'बेटी प्रिया और डॉक्टर से तत्काल संपर्क।',
    btnSOS: 'बेटी प्रिया को अभी कॉल करें',
    voiceAssistantTitle: 'स्मृति वॉइस सहायक',
    voicePrompt: 'माइक दबाकर हिंदी में बोलें...',
    caregiverTitle: 'केयरगिवर व क्लिनिकल कंसोल'
  }
};

// ============================================================================
// 3. SYNTHETIC AUDIO & WEB SPEECH ENGINE
// ============================================================================
class AudioSynthesizer {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playChime(type = 'success') {
    this.init();
    if (!this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === 'success') {
      // Warm uplifting arpeggio: C5 -> E5 -> G5
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'hint') {
      // Gentle soft tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'bell') {
      // Temple Bell Harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.start(now);
      osc.stop(now + 1.8);
    }
  }

  speakText(text, lang = 'en') {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser.');
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Slightly slower, calm cadence for dementia patients
    utterance.pitch = 1.05; // Gentle warm pitch

    const langCodes = {
      en: 'en-IN',
      as: 'as-IN',
      bn: 'bn-IN',
      hi: 'hi-IN'
    };
    utterance.lang = langCodes[lang] || 'en-IN';

    // Find regional voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }
}

const AudioEngine = new AudioSynthesizer();

// ============================================================================
// 4. DYNAMIC DIFFICULTY ADJUSTMENT (DDA) ALGORITHM
// ============================================================================
class AdaptiveDDAEngine {
  constructor() {
    this.sessionHistory = [];
  }

  /**
   * Calculates next game parameters based on recent patient latency & error recovery
   */
  evaluatePerformance(gameType, latencyMs, isCorrect, hintsUsed) {
    const record = { gameType, latencyMs, isCorrect, hintsUsed, timestamp: Date.now() };
    this.sessionHistory.push(record);

    let ddaLevel = 'Moderate (Balanced)';
    let timeoutSec = 25;
    let hintThreshold = 8; // show hint after 8s of hesitation

    if (latencyMs < 2000 && isCorrect && hintsUsed === 0) {
      ddaLevel = 'High Engagement (Level 3)';
      timeoutSec = 18;
      hintThreshold = 12;
    } else if (latencyMs > 5000 || !isCorrect || hintsUsed > 1) {
      ddaLevel = 'Gentle Support (Level 1 - Assisted)';
      timeoutSec = 40;
      hintThreshold = 4; // offer early gentle audio clue
    }

    // Trigger state sync with caregiver telemetry
    AppState.patient.reactionTimeAvg = Math.round(
      (AppState.patient.reactionTimeAvg * 0.8) + (latencyMs * 0.2)
    );
    if (isCorrect) {
      AppState.patient.cognitiveIndex = Math.min(95, AppState.patient.cognitiveIndex + 1);
    }

    renderCaregiverStats();
    return { ddaLevel, timeoutSec, hintThreshold };
  }
}

const DDA = new AdaptiveDDAEngine();

// ============================================================================
// 5. INTERACTIVE COGNITIVE GAMES LOGIC
// ============================================================================

// --- Game 1: Face & Family Recall ---
let faceGameStartTime = 0;
let faceGameHintsUsed = 0;

function startFaceRecallGame() {
  const modal = document.getElementById('gameModal');
  const container = document.getElementById('gameContainer');
  faceGameStartTime = Date.now();
  faceGameHintsUsed = 0;

  const currentItem = AppState.memoryVaultItems[0]; // Priya (Daughter)
  const currentLang = AppState.currentLanguage;

  container.innerHTML = `
    <div class="face-game-arena">
      <div class="dda-badge" style="display:inline-flex; margin-bottom: 16px;">
        🤖 AI Adaptive: Level 2 (Assisted Visual Anchors)
      </div>
      <h3 class="game-instruction-title">
        ${currentLang === 'as' ? 'এই ফটোখন কাৰ চিনি পাইছেনে?' : 
          currentLang === 'bn' ? 'এই ছবিটি কার চিনতে পারছেন?' : 
          currentLang === 'hi' ? 'यह तस्वीर किसकी है, पहचानिए?' : 
          'Who is this in the photograph?'}
      </h3>
      
      <div class="face-image-frame">
        <img src="${currentItem.image}" alt="Family member" />
      </div>

      <div>
        <button class="game-voice-clue-btn" id="btnVoiceClue">
          🔊 ${currentLang === 'as' ? 'কণ্ঠস্বৰৰ সংকেত শুনক (Voice Hint)' : 'Listen to Voice Clue'}
        </button>
      </div>

      <div class="face-options-grid">
        <button class="option-btn" onclick="checkFaceAnswer(true, this, 'Priya')">
          <span>Priya (প্ৰিয়া)</span>
          <span class="relation-tag">${currentLang === 'as' ? 'মৰমৰ জীয়াৰী (Daughter)' : 'Daughter'}</span>
        </button>
        <button class="option-btn" onclick="checkFaceAnswer(false, this, 'Kamala')">
          <span>Kamala (কমলা)</span>
          <span class="relation-tag">${currentLang === 'as' ? 'ভগ্নী (Sister)' : 'Sister'}</span>
        </button>
        <button class="option-btn" onclick="checkFaceAnswer(false, this, 'Sunita')">
          <span>Sunita (সুনীতা)</span>
          <span class="relation-tag">${currentLang === 'as' ? 'উপস্থিত সেৱিকা (Nurse)' : 'Caregiver'}</span>
        </button>
        <button class="option-btn" onclick="checkFaceAnswer(false, this, 'Ananya')">
          <span>Ananya (অনন্যা)</span>
          <span class="relation-tag">${currentLang === 'as' ? 'নাতিনী (Granddaughter)' : 'Granddaughter'}</span>
        </button>
      </div>

      <div id="gameResultFeedback" style="font-size: 18px; font-weight: 800; min-height: 32px; margin-top: 14px;"></div>
    </div>
  `;

  document.getElementById('btnVoiceClue').addEventListener('click', () => {
    faceGameHintsUsed++;
    AudioEngine.playChime('hint');
    const clue = currentItem.audioText[currentLang] || currentItem.audioText.en;
    AudioEngine.speakText(clue, currentLang);
  });

  modal.classList.add('open');
}

function checkFaceAnswer(isCorrect, buttonElem, choiceName) {
  const latency = Date.now() - faceGameStartTime;
  const feedback = document.getElementById('gameResultFeedback');
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    buttonElem.classList.add('correct');
    AudioEngine.playChime('success');
    feedback.style.color = '#15803d';
    feedback.innerHTML = `🌟 বহুত ধুনীয়া! (Excellent!) Correct: Priya is your daughter.`;
    
    AudioEngine.speakText('বহুত ভাল! এইয়া আপোনাৰ জীয়াৰী প্ৰিয়া।', AppState.currentLanguage);
    DDA.evaluatePerformance('face_recall', latency, true, faceGameHintsUsed);

    setTimeout(() => {
      closeGameModal();
    }, 2800);
  } else {
    buttonElem.classList.add('wrong');
    feedback.style.color = '#b91c1c';
    feedback.innerHTML = `মনত পেলাওক: তেওঁ সদায় ৰাতিপুৱা আপোনাক ফোন কৰে (জীয়াৰী প্ৰিয়া)।`;
    
    // Highlight correct button
    allBtns[0].classList.add('correct');
    AudioEngine.speakText('এইয়া আপোনাৰ জীয়াৰী প্ৰিয়া। মনত পেলাওক।', AppState.currentLanguage);
    DDA.evaluatePerformance('face_recall', latency, false, faceGameHintsUsed);
  }
}

// --- Game 2: Daily Routine Sequencing ---
function startSequencingGame() {
  const modal = document.getElementById('gameModal');
  const container = document.getElementById('gameContainer');
  const currentLang = AppState.currentLanguage;

  const sequenceSteps = [
    { id: 1, text: currentLang === 'as' ? '১. ৰাতিপুৱা শুই উঠা আৰু মুখ ধোৱা' : '1. Wake up & Freshen Up' },
    { id: 2, text: currentLang === 'as' ? '২. গৰম চাহ আৰু ব্ৰেকফাষ্ট খোৱা' : '2. Morning Tea & Breakfast' },
    { id: 3, text: currentLang === 'as' ? '৩. ৰাতিপুৱাৰ প্ৰেচাৰৰ দৰব খোৱা' : '3. Morning BP Medicine' },
    { id: 4, text: currentLang === 'as' ? '৪. সেউজীয়া ফুলনিত খোজ কঢ়া' : '4. Gentle Garden Walk' }
  ];

  container.innerHTML = `
    <div style="text-align: center;">
      <div class="dda-badge" style="display:inline-flex; margin-bottom: 16px;">
        ⏳ DDA Memory Sequence: 4 Steps
      </div>
      <h3 class="game-instruction-title">
        ${currentLang === 'as' ? 'ৰাতিপুৱাৰ কামবোৰ সঠিক ক্ৰমত সজাওক:' : 'Arrange your morning routine in order:'}
      </h3>
      <p style="color: var(--text-muted); margin-bottom: 20px;">
        ${currentLang === 'as' ? 'কাৰ্ডখন স্পৰ্শ কৰি সঠিক ক্ৰমত নিৰ্বাচন কৰক' : 'Tap the items in the natural morning order'}
      </p>

      <div class="sequence-container" id="seqList">
        ${sequenceSteps.map(s => `
          <div class="seq-item-card" onclick="tapSequenceItem(this, ${s.id})">
            <span>${s.text}</span>
            <div class="seq-order-badge">✓</div>
          </div>
        `).join('')}
      </div>

      <button class="btn-play-game" style="width: 100%; margin-top: 20px;" onclick="completeSequenceGame()">
        ${currentLang === 'as' ? 'ক্ৰম সম্পূৰ্ণ কৰক (Check Routine)' : 'Confirm Daily Sequence'}
      </button>
    </div>
  `;

  modal.classList.add('open');
}

function tapSequenceItem(elem, id) {
  AudioEngine.playChime('hint');
  elem.style.background = '#dbeafe';
  elem.style.borderColor = '#2563eb';
}

function completeSequenceGame() {
  AudioEngine.playChime('success');
  AudioEngine.speakText('বৰ সুন্দৰ! আপুনি সকলো কাম সঠিক ক্ৰমত মনত ৰাখিছে।', AppState.currentLanguage);
  DDA.evaluatePerformance('sequencing', 2400, true, 0);

  const container = document.getElementById('gameContainer');
  container.innerHTML = `
    <div style="text-align: center; padding: 30px;">
      <div style="font-size: 64px;">🏆</div>
      <h3 style="font-size: 24px; font-weight:800; color:#15803d; margin: 16px 0;">
        অসাধাৰণ! (Routine Mastered!)
      </h3>
      <p style="font-size: 16px; color: var(--text-muted);">
        Daily cognitive sequence score recorded: +10 pts
      </p>
    </div>
  `;

  setTimeout(() => {
    closeGameModal();
  }, 2200);
}

// --- Game 3: Cultural Memory Match (Assam / NE Motifs) ---
function startCulturalMatchGame() {
  const modal = document.getElementById('gameModal');
  const container = document.getElementById('gameContainer');
  const currentLang = AppState.currentLanguage;

  const motifs = ['👒', '🧣', '🫖', '🔔', '🪈', '🪔'];
  const cards = [...motifs.slice(0, 4), ...motifs.slice(0, 4)].sort(() => Math.random() - 0.5);

  let flippedCards = [];
  let matchedCount = 0;

  window.handleCardClick = function(cardElem, symbol) {
    if (cardElem.classList.contains('flipped') || cardElem.classList.contains('matched') || flippedCards.length === 2) {
      return;
    }

    AudioEngine.playChime('hint');
    cardElem.innerText = symbol;
    cardElem.classList.add('flipped');
    flippedCards.push({ elem: cardElem, symbol });

    if (flippedCards.length === 2) {
      if (flippedCards[0].symbol === flippedCards[1].symbol) {
        AudioEngine.playChime('success');
        flippedCards[0].elem.classList.add('matched');
        flippedCards[1].elem.classList.add('matched');
        flippedCards = [];
        matchedCount += 2;

        if (matchedCount === 8) {
          AudioEngine.speakText('সকলো সাংস্কৃতিক প্ৰতীক সফলভাৱে মিল হ’ল!', AppState.currentLanguage);
          DDA.evaluatePerformance('cultural_match', 3100, true, 0);
          setTimeout(() => {
            closeGameModal();
          }, 2000);
        }
      } else {
        setTimeout(() => {
          flippedCards[0].elem.innerText = '❓';
          flippedCards[1].elem.innerText = '❓';
          flippedCards[0].elem.classList.remove('flipped');
          flippedCards[1].elem.classList.remove('flipped');
          flippedCards = [];
        }, 900);
      }
    }
  };

  container.innerHTML = `
    <div style="text-align: center;">
      <div class="dda-badge" style="display:inline-flex; margin-bottom: 16px;">
        🏛️ Spatial Memory: Cultural Motifs
      </div>
      <h3 class="game-instruction-title">
        ${currentLang === 'as' ? 'সাংস্কৃতিক বস্তুবোৰৰ যোৰা মিলাওক:' : 'Match the Cultural Artifact Pairs:'}
      </h3>
      
      <div class="tiles-grid">
        ${cards.map((c, idx) => `
          <div class="memory-tile" onclick="window.handleCardClick(this, '${c}')">
            ❓
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');
}

// --- Game 4: Sound & Echo Memory ---
function startSoundMemoryGame() {
  const modal = document.getElementById('gameModal');
  const container = document.getElementById('gameContainer');
  const currentLang = AppState.currentLanguage;

  container.innerHTML = `
    <div style="text-align: center;">
      <div class="dda-badge" style="display:inline-flex; margin-bottom: 16px;">
        🎵 Auditory Cognition & Association
      </div>
      <h3 class="game-instruction-title">
        ${currentLang === 'as' ? 'শব্দটো শুনক আৰু চিনাক্ত কৰক:' : 'Listen to the Sound and Identify:'}
      </h3>
      
      <button class="voice-greet-btn" style="margin: 20px auto;" onclick="AudioEngine.playChime('bell')">
        🔔 ${currentLang === 'as' ? 'শব্দ পুনৰ শুনক (Play Sound)' : 'Play Regional Bell Sound'}
      </button>

      <div class="face-options-grid" style="margin-top: 24px;">
        <button class="option-btn" onclick="checkSoundAnswer(true, this)">
          <span>🔔 Temple Bell (মন্দিৰৰ ঘণ্টা)</span>
          <span class="relation-tag">Morning Prayer Sound</span>
        </button>
        <button class="option-btn" onclick="checkSoundAnswer(false, this)">
          <span>🌧️ Monsoon Rain (বৰষুণৰ টোপাল)</span>
          <span class="relation-tag">Tin Roof Rain</span>
        </button>
        <button class="option-btn" onclick="checkSoundAnswer(false, this)">
          <span>🐦 Cuckoo Bird (কুলি চৰাই)</span>
          <span class="relation-tag">Spring Bird</span>
        </button>
        <button class="option-btn" onclick="checkSoundAnswer(false, this)">
          <span>🪈 Bamboo Flute (বাঁহীৰ সুৰ)</span>
          <span class="relation-tag">Bihu Melody</span>
        </button>
      </div>

      <div id="soundFeedback" style="font-size: 18px; font-weight:800; min-height:30px; margin-top:14px;"></div>
    </div>
  `;

  AudioEngine.playChime('bell');
  modal.classList.add('open');
}

function checkSoundAnswer(isCorrect, btn) {
  const feedback = document.getElementById('soundFeedback');
  if (isCorrect) {
    btn.classList.add('correct');
    AudioEngine.playChime('success');
    feedback.style.color = '#15803d';
    feedback.innerText = 'সঠিক উত্তৰ! এইয়া মন্দিৰৰ ঘন্টাৰ পবিত্ৰ ধ্বনি।';
    AudioEngine.speakText('সঠিক উত্তৰ! মন্দিৰৰ ঘন্টাৰ ধ্বনি।', AppState.currentLanguage);
    DDA.evaluatePerformance('sound_memory', 1800, true, 0);

    setTimeout(() => closeGameModal(), 2500);
  } else {
    btn.classList.add('wrong');
    feedback.style.color = '#b91c1c';
    feedback.innerText = 'মন দি শুনক: এইয়া মন্দিৰৰ ঘণ্টা।';
  }
}

function closeGameModal() {
  const modal = document.getElementById('gameModal');
  modal.classList.remove('open');
}

// ============================================================================
// 6. REMINISCENCE MEMORY VAULT & "CALM ME DOWN" SUNDOWNING THERAPY
// ============================================================================
function openCalmReminiscenceModal() {
  const modal = document.getElementById('gameModal');
  const container = document.getElementById('gameContainer');
  const currentLang = AppState.currentLanguage;
  const currentVault = AppState.memoryVaultItems[1]; // Family on veranda

  container.innerHTML = `
    <div class="reminiscence-player">
      <div class="reminiscence-scenery-bg" style="background-image: url('assets/assam_tea.jpg')">
        <div class="reminiscence-scenery-text">
          <h3>অসমৰ শান্তিপূৰ্ণ স্মৃতি (Peaceful Assam Memories)</h3>
          <p>You are safe, surrounded by people who love you deeply.</p>
        </div>
      </div>

      <div class="breathing-coach-section">
        <div class="breathing-orb" id="breathingOrb">
          ${currentLang === 'as' ? 'উশাহ লওক' : 'Breathe'}
        </div>
        <p style="color: #cbd5e1; font-size: 16px; margin-bottom: 20px;">
          ${currentLang === 'as' ? 'ধীৰে ধীৰে উশাহ লওক আৰু মন শান্ত কৰক (4-7-8 Breathing)' : 'Gentle calming breath with soothing soundscape'}
        </p>

        <div class="calm-audio-controls">
          <button class="btn-calm-action" onclick="playFamilyVoiceNote()">
            ❤️ ${currentLang === 'as' ? 'জীয়াৰী প্ৰিয়াৰ বাৰ্তা শুনক' : 'Play Daughter Priya Voice Note'}
          </button>
          <button class="btn-calm-action" onclick="AudioEngine.playChime('bell')">
            🔔 ${currentLang === 'as' ? 'শান্তিৰ ঘণ্টা (Zen Chime)' : 'Peaceful Bell'}
          </button>
        </div>
      </div>
    </div>
  `;

  // Start breathing text cycle
  const orb = document.getElementById('breathingOrb');
  let cycle = 0;
  window.breatheInterval = setInterval(() => {
    if (!document.getElementById('breathingOrb')) {
      clearInterval(window.breatheInterval);
      return;
    }
    cycle = (cycle + 1) % 3;
    if (cycle === 0) orb.innerText = currentLang === 'as' ? 'উশাহ লওক' : 'Breathe In';
    else if (cycle === 1) orb.innerText = currentLang === 'as' ? 'শান্ত হৈ ৰওক' : 'Hold Calmly';
    else orb.innerText = currentLang === 'as' ? 'উশাহ এৰক' : 'Breathe Out';
  }, 3000);

  modal.classList.add('open');
}

function playFamilyVoiceNote() {
  const currentLang = AppState.currentLanguage;
  const message = {
    as: 'দেউতা, মই প্ৰিয়া। চিন্তা নকৰিব, আমি সকলো আপোনাৰ কাষতেই আছোঁ। আপুনি শান্ত হৈ চাহ কাপ উপভোগ কৰক। আমি আপোনাক বহুত ভাল পাওঁ।',
    en: 'Father, it is Priya. Do not worry at all, we are all right here with you. Relax peacefully, we love you.',
    bn: 'বাবা, আমি প্রিয়া। কোন চিন্তা করবেন না, আমরা সবাই আপনার সাথে আছি। শান্ত হয়ে থাকুন।',
    hi: 'पिताजी, मैं प्रिया हूँ। चिंता मत कीजिए, हम सब आपके साथ हैं। शांत होकर विश्राम करें।'
  };
  AudioEngine.speakText(message[currentLang] || message.en, currentLang);
}

// ============================================================================
// 7. MULTILINGUAL VOICE ASSISTANT ("SMRITI")
// ============================================================================
function toggleVoiceAssistant() {
  const fab = document.getElementById('voiceFab');
  const currentLang = AppState.currentLanguage;

  if (AppState.isListening) {
    AppState.isListening = false;
    fab.classList.remove('listening');
    return;
  }

  AppState.isListening = true;
  fab.classList.add('listening');

  // Check Web Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'as' ? 'as-IN' : currentLang === 'bn' ? 'bn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      processVoiceCommand(speechText);
      AppState.isListening = false;
      fab.classList.remove('listening');
    };

    recognition.onerror = () => {
      // Fallback to simulated regional voice assistant if mic permission denied or offline
      simulateVoiceResponse();
      AppState.isListening = false;
      fab.classList.remove('listening');
    };
  } else {
    simulateVoiceResponse();
    AppState.isListening = false;
    fab.classList.remove('listening');
  }
}

function simulateVoiceResponse() {
  const currentLang = AppState.currentLanguage;
  const responses = {
    as: 'নমস্কাৰ বীৰেন বাবু! আজি সোমবাৰ, ৩১ আগষ্ট। আপোনাৰ দুপৰীয়াৰ দৰব খোৱাৰ সময় ১:৩০ বজাত। আপুনি সম্পূৰ্ণ সুৰক্ষিত।',
    bn: 'নমস্কার বীরেন বাবু! আজ সোমবার, ৩১ আগস্ট। আপনার দুপুরের ওষুধ দুপুর ১:৩০ টায়। আপনি সুস্থ আছেন।',
    hi: 'नमस्ते बीरेन बाबू! आज सोमवार, 31 अगस्त है। आपकी दोपहर की दवा 1:30 बजे है। सब कुशल मंगल है।',
    en: 'Good day Biren Babu! Today is Monday, 31st August. Your next medication is at 1:30 PM. You are doing wonderfully.'
  };

  AudioEngine.speakText(responses[currentLang] || responses.en, currentLang);
}

function processVoiceCommand(text) {
  console.log('Voice heard:', text);
  simulateVoiceResponse();
}

// ============================================================================
// 8. MEDICATION LOGGING & TELEMETRY SYNC
// ============================================================================
function markMedicationTaken(medId) {
  const med = AppState.medications.find(m => m.id === medId);
  if (med) {
    med.takenToday = true;
    med.takenAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    AudioEngine.playChime('success');
    AudioEngine.speakText('দৰব খোৱা নিশ্চিত হ’ল। তথ্য সংৰক্ষণ কৰা হ’ল।', AppState.currentLanguage);

    // Add alert log
    AppState.alerts.unshift({
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `${med.name} Confirmed Taken`,
      detail: `Patient recorded dosage confirmation at ${med.takenAt}.`,
      time: 'Just now'
    });

    renderMedicationBanner();
    renderCaregiverStats();
  }
}

function speakMedicationInstructions() {
  const med = AppState.medications[0];
  const lang = AppState.currentLanguage;
  const inst = med.instructions[lang] || med.instructions.en;
  AudioEngine.speakText(inst, lang);
}

// ============================================================================
// 9. CAREGIVER & CLINICIAN DASHBOARD & CHARTS
// ============================================================================
let cognitiveTrendChart = null;
let mmseRadarChart = null;

function initCaregiverCharts() {
  const trendCtx = document.getElementById('cognitiveTrendChart');
  const radarCtx = document.getElementById('mmseRadarChart');

  if (trendCtx && typeof Chart !== 'undefined') {
    if (cognitiveTrendChart) cognitiveTrendChart.destroy();
    cognitiveTrendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4 (Current)'],
        datasets: [
          {
            label: 'Cognitive Baseline Index (0-100)',
            data: [72, 74, 76, AppState.patient.cognitiveIndex],
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.12)',
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: '#0d9488'
          },
          {
            label: 'Reaction Latency Index (Normalized)',
            data: [65, 68, 70, 75],
            borderColor: '#2563eb',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { min: 40, max: 100 }
        }
      }
    });
  }

  if (radarCtx && typeof Chart !== 'undefined') {
    if (mmseRadarChart) mmseRadarChart.destroy();
    mmseRadarChart = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Temporal Orientation', 'Immediate Recall', 'Attention/Calc', 'Language Naming', 'Visual Spatial', 'Executive Function'],
        datasets: [{
          label: 'Patient MMSE Domain Profile',
          data: [80, 70, 85, 90, 75, 78],
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: { min: 0, max: 100 }
        }
      }
    });
  }
}

function renderCaregiverStats() {
  const indexElem = document.getElementById('caregiverCogIndex');
  if (indexElem) indexElem.innerText = `${AppState.patient.cognitiveIndex}/100`;

  const latencyElem = document.getElementById('caregiverLatency');
  if (latencyElem) latencyElem.innerText = `${(AppState.patient.reactionTimeAvg / 1000).toFixed(2)}s`;

  renderAlertsList();
}

function renderAlertsList() {
  const container = document.getElementById('caregiverAlertsList');
  if (!container) return;

  container.innerHTML = AppState.alerts.map(a => `
    <div class="alert-item ${a.type}">
      <div class="alert-icon">
        ${a.type === 'critical' ? '🚨' : a.type === 'warning' ? '⚠️' : '✅'}
      </div>
      <div class="alert-content">
        <h5>${a.title}</h5>
        <p>${a.detail}</p>
        <div class="alert-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// 10. UI RENDERING & EVENT ATTACHMENTS
// ============================================================================
function renderMedicationBanner() {
  const banner = document.getElementById('patientMedBanner');
  if (!banner) return;
  const currentLang = AppState.currentLanguage;
  const nextMed = AppState.medications[0];

  banner.innerHTML = `
    <div class="med-info-group">
      <div class="med-pill-icon" style="color: ${nextMed.color}">💊</div>
      <div class="med-text-details">
        <h4>${nextMed.name} (${nextMed.dose})</h4>
        <p>⏰ ${nextMed.time} • ${nextMed.instructions[currentLang] || nextMed.instructions.en}</p>
      </div>
    </div>
    <div class="med-action-btns">
      <button class="btn-med-taken" onclick="markMedicationTaken('${nextMed.id}')">
        ✓ ${i18n[currentLang].btnTookMed}
      </button>
      <button class="btn-med-speak" onclick="speakMedicationInstructions()">
        🔊 ${i18n[currentLang].btnSpeakMed}
      </button>
    </div>
  `;
}

function switchMode(mode) {
  AppState.currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  const patientView = document.getElementById('patientView');
  const caregiverView = document.getElementById('caregiverView');
  const mirrorView = document.getElementById('mirrorView');

  if (mode === 'patient') {
    patientView.style.display = 'block';
    caregiverView.style.display = 'none';
    mirrorView.style.display = 'none';
  } else if (mode === 'caregiver') {
    patientView.style.display = 'none';
    caregiverView.style.display = 'block';
    mirrorView.style.display = 'none';
    initCaregiverCharts();
  } else if (mode === 'mirror') {
    patientView.style.display = 'none';
    caregiverView.style.display = 'none';
    mirrorView.style.display = 'block';
    initCaregiverCharts();
  }
}

function changeLanguage(lang) {
  AppState.currentLanguage = lang;
  
  // Update UI texts
  const t = i18n[lang] || i18n.en;
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (t[key]) elem.innerText = t[key];
  });

  renderMedicationBanner();
}

function triggerSOS() {
  AudioEngine.playChime('bell');
  alert(`🚨 EMERGENCY SOS DISPATCHED:\n\n• Primary Contact: Priya (Daughter) - SMS & Call Dialed\n• Clinician: Dr. H. Baruah (Guwahati Neurological Clinic)\n• GPS Geofence: Safe within Guwahati Home Sector 4\n• Battery: 88% • Network: Offline Sync Queue active`);
}

// Initialization on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Mode switchers
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // Language selector
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
  }

  // Voice FAB
  const voiceFab = document.getElementById('voiceFab');
  if (voiceFab) {
    voiceFab.addEventListener('click', toggleVoiceAssistant);
  }

  // Close modal button
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeGameModal);
  }

  renderMedicationBanner();
  renderCaregiverStats();
});
