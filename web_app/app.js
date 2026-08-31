/**
 * Smriti Sahayak (স্মৃতি সহায়ক) - Core Tri-Portal Application Logic
 * Role-Based Access Control (RBAC): Dedicated, Isolated Portals for Patient, Caregiver, and Doctor
 */

// ============================================================================
// 1. GLOBAL MULTI-ROLE STATE & STORE
// ============================================================================
const AppState = {
  currentUser: null,      // null (Gateway) | { role: 'patient'|'caregiver'|'doctor', name: '...', ... }
  currentLanguage: 'en',  // 'as' | 'bn' | 'hi' | 'en'
  activePatientId: 'PAT-7401',
  isOnline: true,
  isListening: false,
  ddaLevel: 2,

  users: {
    patient: {
      role: 'patient',
      name: 'Biren Babu (Biren Hazarika)',
      sub: 'Patient Companion Mode',
      icon: '👴'
    },
    caregiver: {
      role: 'caregiver',
      name: 'Priya Hazarika',
      sub: 'Primary Family Caregiver (Daughter)',
      icon: '👨‍👩‍👧'
    },
    doctor: {
      role: 'doctor',
      name: 'Dr. H. Baruah, MD, DM',
      sub: 'Senior Neurologist & Geriatrician',
      icon: '🩺'
    }
  },

  patients: {
    'PAT-7401': {
      id: 'PAT-7401',
      name: 'Biren Hazarika',
      age: 74,
      gender: 'Male',
      stage: 'Mild-Moderate Dementia (AD Stage 3)',
      location: 'Guwahati, Assam',
      primaryCaregiver: 'Priya Hazarika (Daughter)',
      caregiverContact: '+91 98640 12345',
      attendingPhysician: 'Dr. H. Baruah, MD',
      cognitiveIndex: 78.0,
      mmseScore: 22,
      reactionTimeAvg: 1420,
      latencyVariance: 120,
      complianceRate: 94,
      trend: [72, 74, 76, 78],
      radarScores: [80, 70, 85, 90, 75, 78], // Orientation, Recall, Attention, Language, Spatial, Executive
      gpsStatus: {
        status: 'safe',
        zone: 'Guwahati Home Perimeter (Sector 4)',
        battery: 88,
        sundowningRisk: 'Low (0.18)'
      }
    },
    'PAT-7402': {
      id: 'PAT-7402',
      name: 'Anjali Devi',
      age: 71,
      gender: 'Female',
      stage: 'Early Mild Cognitive Impairment',
      location: 'Jorhat, Assam',
      primaryCaregiver: 'Rahul Devi (Son)',
      caregiverContact: '+91 98640 54321',
      attendingPhysician: 'Dr. H. Baruah, MD',
      cognitiveIndex: 84.0,
      mmseScore: 25,
      reactionTimeAvg: 990,
      latencyVariance: 80,
      complianceRate: 98,
      trend: [80, 82, 83, 84],
      radarScores: [90, 85, 88, 92, 84, 86],
      gpsStatus: {
        status: 'safe',
        zone: 'Jorhat Tea Estate Residence',
        battery: 92,
        sundowningRisk: 'Minimal (0.08)'
      }
    },
    'PAT-7403': {
      id: 'PAT-7403',
      name: 'Naren Phukan',
      age: 79,
      gender: 'Male',
      stage: 'Moderate Dementia (AD Stage 4 - Wander Risk)',
      location: 'Dibrugarh, Assam',
      primaryCaregiver: 'Kabita Phukan (Spouse)',
      caregiverContact: '+91 98640 98765',
      attendingPhysician: 'Dr. H. Baruah, MD',
      cognitiveIndex: 62.0,
      mmseScore: 17,
      reactionTimeAvg: 2550,
      latencyVariance: 450,
      complianceRate: 86,
      trend: [68, 65, 63, 62],
      radarScores: [55, 48, 60, 72, 50, 58],
      gpsStatus: {
        status: 'wander_alert',
        zone: 'Near Dibrugarh Park (Outside Boundary)',
        battery: 45,
        sundowningRisk: 'Elevated (0.64)'
      }
    }
  },

  prescriptions: {
    'PAT-7401': [
      {
        id: 'rx-101',
        name: 'Donepezil Hydrochloride',
        dose: '5 mg - 1 Tablet',
        frequency: 'Once Daily (Morning)',
        time: '08:30 AM',
        color: '#3b82f6',
        shape: 'round',
        takenToday: true,
        clinicalRationale: 'Acetylcholinesterase inhibitor for synaptic clarity & memory retention.',
        instructions: {
          en: 'Take 1 blue tablet with water after morning tea.',
          as: 'ৰাতিপুৱাৰ চাহ খোৱাৰ পিছত ১টা নীলা টেবলেট পানীৰে সৈতে লওক।',
          bn: 'সকালের চা পানের পর ১টি নীল ট্যাবলেট জল দিয়ে নিন।',
          hi: 'सुबह की चाय के बाद 1 नीली गोली पानी के साथ लें।'
        }
      },
      {
        id: 'rx-102',
        name: 'Amlodipine Besylate',
        dose: '5 mg - 1 Tablet',
        frequency: 'Once Daily (Afternoon)',
        time: '01:30 PM',
        color: '#f59e0b',
        shape: 'oval',
        takenToday: false,
        clinicalRationale: 'Antihypertensive management to prevent microvascular cognitive decline.',
        instructions: {
          en: 'Take after afternoon lunch with water.',
          as: 'দুপৰীয়াৰ আহাৰৰ পিছত পানীৰে সৈতে লওক।',
          bn: 'দুপুরের খাবারের পর জল দিয়ে খান।',
          hi: 'दोपहर के भोजन के बाद पानी के साथ लें।'
        }
      },
      {
        id: 'rx-103',
        name: 'Memantine HCl',
        dose: '10 mg - 1 Tablet',
        frequency: 'Once Daily (Evening)',
        time: '08:00 PM',
        color: '#10b981',
        shape: 'round',
        takenToday: false,
        clinicalRationale: 'NMDA receptor antagonist to reduce glutamate excitotoxicity.',
        instructions: {
          en: 'Take with dinner before night rest.',
          as: 'নিশাৰ আহাৰৰ সৈতে শোৱাৰ আগতে লওক।',
          bn: 'রাতের খাবারের সাথে ঘুমানোর আগে নিন।',
          hi: 'रात के खाने के साथ सोने से पहले लें।'
        }
      }
    ]
  },

  memoryVault: {
    'PAT-7401': [
      {
        id: 'vault-1',
        title: 'Priya (Daughter)',
        relation: 'Daughter',
        image: 'assets/daughter.jpg',
        audioText: {
          en: 'This is your beloved daughter Priya. She lives in Guwahati and calls you every morning.',
          as: 'এয়া আপোনাৰ মৰমৰ জীয়াৰী প্ৰিয়া। তেওঁ গুৱাহাটীত থাকে আৰু প্ৰতিদিনে ৰাতিপুৱা আপোনাক ফোন কৰে।',
          bn: 'এটি আপনার মেয়ে প্রিয়া। সে গুয়াহাটিতে থাকে এবং প্রতিদিন ফোন করে।',
          hi: 'यह आपकी बेटी प्रिया है। वह गुवाहाटी में रहती है और रोज फोन करती है।'
        }
      },
      {
        id: 'vault-2',
        title: 'Family Tea on Veranda',
        relation: 'Family Gathering',
        image: 'assets/family.jpg',
        audioText: {
          en: 'Here is your whole family enjoying morning tea in the hills. Everyone loves and cares for you.',
          as: 'পাহাৰৰ বাৰান্দাত আপোনাৰ সমগ্ৰ পৰিয়ালে চাহ খাই আনন্দ কৰিছে। সকলোৱে আপোনাক বহুত ভাল পায়।',
          bn: 'পাহাড়ের বারান্দায় পুরো পরিবার একসাথে চা খাচ্ছে। সবাই আপনাকে ভালোবাসে।',
          hi: 'पहाड़ी बरामदे में पूरा परिवार चाय पी रहा है। सब आपसे बहुत प्यार करते हैं।'
        }
      },
      {
        id: 'vault-3',
        title: 'Assam Tea Garden',
        relation: 'Childhood Memory',
        image: 'assets/assam_tea.jpg',
        audioText: {
          en: 'The beautiful green tea gardens of Assam where you spent peaceful morning walks.',
          as: 'অসমৰ অনুপম সেউজীয়া চাহ বাগিচা, য’ত আপুনি শান্তিপূৰ্ণ ৰাতিপুৱাৰ ভ্ৰমণ কৰিছিল।',
          bn: 'আসামের সুন্দর চা বাগান যেখানে আপনি সকালে হাঁটতেন।',
          hi: 'असम के सुंदर चाय बागान जहाँ आप सुबह सैर करते थे।'
        }
      },
      {
        id: 'vault-4',
        title: 'Biren Babu (Self)',
        relation: 'Self Anchor',
        image: 'assets/elder_dadu.jpg',
        audioText: {
          en: 'This is you, Biren Hazarika. You are a respected teacher and loved by all in Guwahati.',
          as: 'এয়া আপুনি, শ্ৰীযুত বীৰেন হাজৰিকা। আপুনি এজন সন্মানীয় শিক্ষক আৰু সকলোৰে শ্ৰদ্ধাৰ।',
          bn: 'এটি আপনি, শ্রীবীরেন হাজারিকা। আপনি একজন সম্মানিত শিক্ষক এবং সবাই আপনাকে শ্রদ্ধা করে।',
          hi: 'यह आप हैं, श्री बीरेन हजारिका। आप एक सम्मानित शिक्षक हैं और सब आपका आदर करते हैं।'
        }
      }
    ]
  },

  chatMessages: {
    'PAT-7401': [
      {
        id: 'msg-1',
        senderRole: 'caregiver',
        senderName: 'Priya Hazarika (Daughter)',
        time: 'Yesterday, 04:30 PM',
        message: 'Namaskar Dr. Baruah. Baba had a mild episode of evening confusion around 6 PM yesterday. We used the "Calm Me Down" reminiscence mode and it helped soothe him.'
      },
      {
        id: 'msg-2',
        senderRole: 'doctor',
        senderName: 'Dr. H. Baruah, MD',
        time: 'Yesterday, 05:15 PM',
        message: 'Good evening Priya. Excellent proactive response. The 6 PM agitation aligns with mild sundowning. Keep the living room brightly lit from 5:30 PM and ensure he takes the Memantine dose promptly at 8:00 PM.'
      }
    ]
  },

  quizQuestions: {
    'PAT-7401': [
      {
        id: 'quiz-1',
        question: 'What is the name of your sweet granddaughter who loves tea gardens?',
        options: ['Ananya', 'Pooja', 'Sunita', 'Ritu'],
        correctOption: 'Ananya',
        hint: 'Her name starts with A and she calls you Dadu!',
        category: 'Family Members',
        createdBy: 'Priya Hazarika (Daughter)'
      },
      {
        id: 'quiz-2',
        question: 'Which historic college in Guwahati did you teach mathematics for 32 years?',
        options: ['Cotton College (University)', 'Tezpur University', 'Jorhat Engineering', 'Gauhati Medical'],
        correctOption: 'Cotton College (University)',
        hint: 'Located near Dighalipukhuri in Panbazar.',
        category: 'Career & Identity',
        createdBy: 'Priya Hazarika (Daughter)'
      },
      {
        id: 'quiz-3',
        question: "What is Priya's favorite homemade sweet you prepared on Bihu?",
        options: ['Narikol Laru (Coconut Sweet)', 'Rasgulla', 'Kaju Katli', 'Sandesh'],
        correctOption: 'Narikol Laru (Coconut Sweet)',
        hint: 'Made with freshly grated coconut and fragrant jaggery.',
        category: 'Family Memories',
        createdBy: 'Priya Hazarika (Daughter)'
      },
      {
        id: 'quiz-4',
        question: 'What is the color of the front garden gate of your Guwahati residence?',
        options: ['Forest Green', 'Bright Red', 'Sky Blue', 'Golden Yellow'],
        correctOption: 'Forest Green',
        hint: 'It matches the green color of your tea hedge garden.',
        category: 'Home Familiarity',
        createdBy: 'Priya Hazarika (Daughter)'
      }
    ]
  },

  scheduleTasks: [
    {
      id: 'task-1',
      title: 'Morning Warm Tea on Veranda',
      time: '07:30 AM',
      icon: '🌅',
      type: 'routine',
      color: '#f59e0b',
      bg: '#fef3c7',
      isCompleted: false,
      instructions: {
        en: 'Enjoy your warm morning tea with fresh mountain breeze on the veranda.',
        as: 'বাৰান্দাত পাহাৰীয়া শান্ত বতাহৰ সৈতে ৰাতিপুৱাৰ গৰম চাহ কাপ পান কৰক।',
        bn: 'বারান্দায় মনোরম বাতাসে সকালের গরম চা উপভোগ করুন।',
        hi: 'बरामदे में ताजी हवा के साथ सुबह की गरम चाय का आनंद लें।'
      }
    },
    {
      id: 'task-2',
      title: 'Donepezil 5mg (Morning Memory Pill)',
      time: '08:30 AM',
      icon: '💊',
      type: 'medication',
      color: '#3b82f6',
      bg: '#fefce8',
      isCompleted: false,
      instructions: {
        en: 'Take 1 blue Donepezil (5mg) tablet with a full glass of water after breakfast.',
        as: 'ৰাতিপুৱাৰ আহাৰৰ পিছত ১টা নীলা ডনেপেজিল (৫মিগ্ৰা) টেবলেট পানীৰে সৈতে লওক।',
        bn: 'প্রাতঃরাশের পর ১টি নীল ডনেপেজিল (৫ মিগ্রা) ট্যাবলেট জল দিয়ে খান।',
        hi: 'नाश्ते के बाद 1 नीली डोनेपेज़िल (5mg) गोली पानी के साथ लें।'
      }
    },
    {
      id: 'task-3',
      title: 'Gentle Walk in Front Garden',
      time: '10:00 AM',
      icon: '🌳',
      type: 'routine',
      color: '#10b981',
      bg: '#f0fdf4',
      isCompleted: false,
      instructions: {
        en: 'Take a gentle 15-minute stroll along the flower path inside the garden.',
        as: 'ঘৰৰ সন্মুখৰ ফুলনি বাগিচাত ১৫ মিনিট শান্তভাৱে খোজ কাঢ়ক।',
        bn: 'বাগানের ফুলের পথের পাশে ১৫ মিনিট শান্তভাবে হাঁটুন।',
        hi: 'बगीचे में फूलों की क्यारी के पास 15 मिनट टहलें।'
      }
    },
    {
      id: 'task-4',
      title: 'Daily Family Recall Memory Game',
      time: '11:30 AM',
      icon: '🎮',
      type: 'game',
      color: '#8b5cf6',
      bg: '#f3e8ff',
      isCompleted: false,
      instructions: {
        en: 'Play the Family Face Recall game to practice recognizing daughter Priya and relatives.',
        as: 'জীয়াৰী প্ৰিয়া আৰু পৰিয়ালৰ সদস্যসকলক চিনি পোৱাৰ অনুশীলন কৰক।',
        bn: 'মেয়ে প্রিয়া ও পরিবারের সদস্যদের চিনে নেওয়ার খেলা খেলুন।',
        hi: 'बेटी प्रिया और परिजनों को पहचानने का खेल खेलें।'
      }
    },
    {
      id: 'task-5',
      title: 'Nutritious Lunch & Amlodipine 5mg',
      time: '01:30 PM',
      icon: '🍲',
      type: 'medication',
      color: '#0284c7',
      bg: '#eff6ff',
      isCompleted: false,
      instructions: {
        en: 'Have healthy warm lunch followed by Amlodipine (5mg) blood pressure tablet.',
        as: 'দুপৰীয়াৰ আহাৰ খাই ৰক্তচাপৰ টেবলেট এমলোডিপিন (৫মিগ্ৰা) পানীৰে লওক।',
        bn: 'দুপুরের খাবার খেয়ে রক্তচাপের ট্যাবলেট অ্যামলোডিপিন (৫ মিগ্রা) খান।',
        hi: 'दोपहर का भोजन करें और फिर रक्तचाप की गोली एम्लोडिपिन (5mg) लें।'
      }
    },
    {
      id: 'task-6',
      title: 'Guided Reminiscence Breathing (Sunset)',
      time: '06:30 PM',
      icon: '🧘',
      type: 'therapy',
      color: '#e11d48',
      bg: '#fff1f2',
      isCompleted: false,
      instructions: {
        en: 'Sit comfortably, listen to soothing tea garden sounds, and practice 4-7-8 deep breathing.',
        as: 'আৰামত বহি চাহ বাগিচাৰ সুৰ শুনি গভীৰ প্ৰাণায়াম উশাহ-নিশাহ অনুশীলন কৰক।',
        bn: 'শান্তভাবে বসে চা বাগানের সুর শুনে ৪-৭-৮ গভীর শ্বাসচর্চা করুন।',
        hi: 'आराम से बैठें और चाय बागान की धुन के साथ 4-7-8 गहरी सांस का अभ्यास करें।'
      }
    }
  ],

  clinicalNotes: {
    'PAT-7401': [
      {
        id: 'note-1',
        date: '2026-08-25',
        doctorName: 'Dr. H. Baruah, MD',
        consultType: 'Monthly Telemetry & Follow-up',
        mmseScore: 22,
        fastStage: 'Stage 3 (Mild Cognitive Impairment / Early AD)',
        cdrScore: 1.0,
        observations: 'Patient oriented to person and city, occasional temporal disorientation. Shows marked engagement with family photo recall and cultural music stimuli. Reaction latency is within acceptable 1.4s window.',
        plan: 'Continue Donepezil 5mg AM, Memantine 10mg PM. Encourage daily 15-minute Reminiscence breathing sessions at 6:30 PM.'
      }
    ]
  },

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
  ]
};

// ============================================================================
// 2. AUDIO SYNTHESIZER & SPEECH ENGINE (Web Audio API)
// ============================================================================
const AudioEngine = {
  ctx: null,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playChime(type = 'bell') {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  },

  speakText(text, lang = 'en') {
    if (!('speechSynthesis' in window)) {
      alert(`[Spoken Voice]: "${text}"`);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select Indic Voice or default
    const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'as': 'bn-IN' };
    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    window.speechSynthesis.speak(utterance);
  }
};

// ============================================================================
// 3. MULTILINGUAL LEXICON (i18n)
// ============================================================================
const i18n = {
  en: {
    brandSubtitle: 'AI Cognitive Gaming & Digital Dementia Care Ecosystem',
    patientGreeting: 'Namaskar, Biren Babu!',
    patientDate: 'Monday, 31 August 2026',
    voiceGreet: 'Listen to Daily Greeting',
    calmModalTitle: 'Calm Me Down & Reminiscence',
    calmModalDesc: 'Relax your mind with familiar sights, tea garden sounds, and guided breathing.',
    sosTitle: 'Emergency Wander Assistance',
    sosDesc: 'One-touch emergency call to daughter Priya & Dr. Baruah beacon alert.',
    gamesHeading: 'Daily Cognitive Exercises',
    ddaTitle: 'Adaptive AI Engine Active (Level 2)',
    playFaceGame: 'Family Recall Game ("Mukhobayav")',
    playFaceDesc: 'Recognize your beloved daughter Priya and family members with voice anchors.',
    playSeqGame: 'Daily Routine Sequencing ("Dainik Kram")',
    playSeqDesc: 'Arrange morning tea, medicine, garden walk, and bath in chronological order.',
    playTileGame: 'Cultural Memory Match ("Sanskriti Mel")',
    playTileDesc: 'Pair familiar regional symbols: Japi (জাপী), Gamosa (গামোচা), Brass Bell, Flute.',
    playQuizGame: 'Family Memory Trivia ("আপোনজনৰ প্ৰশ্নোত্তৰ")',
    playQuizDesc: 'Answer personalized family questions prepared with love by daughter Priya.',
    btnTookMed: 'Confirm Taken',
    btnSpeakMed: 'Listen Instructions'
  },
  as: {
    brandSubtitle: 'কৃত্ৰিম বুদ্ধিমত্তা চালিত ডিমেনচিয়া সেৱা আৰু স্মৃতি সহায়ক',
    patientGreeting: 'নমস্কাৰ, বীৰেন বাবু!',
    patientDate: 'সোমবাৰ, ৩১ আগষ্ট ২০২৬',
    voiceGreet: 'দৈনিক শুভবাৰ্তা শুনক',
    calmModalTitle: 'মন শান্ত কৰক আৰু পুৰণি স্মৃতি',
    calmModalDesc: 'চাহ বাগিচাৰ শান্ত পৰিৱেশ আৰু প্ৰাণায়ামেৰে মন সুস্থিৰ কৰক।',
    sosTitle: 'জৰুৰীকালীন সাহাৰ্য্য আৰু সন্ধান',
    sosDesc: 'কন্যা প্ৰিয়া আৰু চিকিৎসক ড° বৰুৱালৈ ১-স্পৰ্শত বাৰ্তা পঠিয়াওক।',
    gamesHeading: 'দৈনিক মগজুৰ স্মৃতি অনুশীলন',
    ddaTitle: 'স্বয়ংক্রিয় এআই অভিযোজন সক্ৰিয় (স্তৰ ২)',
    playFaceGame: 'পৰিয়ালৰ চিনাকি খেল ("মুখাবয়ব")',
    playFaceDesc: 'মৰমৰ জীয়াৰী প্ৰিয়া আৰু আত্মীয়ৰ মাত শুনি চিনাক্ত কৰক।',
    playSeqGame: 'দৈনিক কৰ্তব্যৰ ক্ৰম ("দৈনিক ক্ৰম")',
    playSeqDesc: 'চাহ খোৱা, দৰব খোৱা আৰু ফুৰাৰ সঠিক সময় সজাওক।',
    playTileGame: 'সংস্কৃতিৰ স্মৃতি মিলন ("সংস্কৃতি মেল")',
    playTileDesc: 'জাপী, গামোচা, কাঁহৰ ঘণ্টা আৰু বাঁহীৰ সঠিক জোৰ মিলাওক।',
    playQuizGame: 'আপোনজনৰ প্ৰশ্নোত্তৰ ("আপোন স্মৃতি")',
    playQuizDesc: 'জীয়াৰী প্ৰিয়াই আপোনাৰ বাবে মৰমেৰে সজোৱা চিনাকি প্ৰশ্নৰ উত্তৰ দিয়ক।',
    btnTookMed: 'দৰব খোৱা হ’ল',
    btnSpeakMed: 'দৰবৰ নিয়ম শুনক'
  },
  bn: {
    brandSubtitle: 'এআই চালিত স্মৃতি সহায়ক ও ডিমেনশিয়া ক্লিনিক্যাল প্ল্যাটফর্ম',
    patientGreeting: 'নমস্কার, বীরেন বাবু!',
    patientDate: 'সোমবার, ৩১ আগস্ট ২০২৬',
    voiceGreet: 'প্রভাতী বার্তা শুনুন',
    calmModalTitle: 'মন শান্ত করুন ও স্মৃতি রোমন্থন',
    calmModalDesc: 'পরিচিত ছবি ও গভীর নিঃশ্বাসের মাধ্যমে মানসিক স্বস্তি পান।',
    sosTitle: 'জরুরী সহায়তা ও সতর্কবার্তা',
    sosDesc: 'মেয়ে প্রিয়া ও চিকিৎসকের কাছে এক-স্পর্শে সংকেত পাঠান।',
    gamesHeading: 'দৈনিক মানসিক ব্যায়াম',
    ddaTitle: 'অ্যাডাপ্টিভ এআই ইঞ্জিন সক্রিয় (স্তর ২)',
    playFaceGame: 'পরিবার চেনার খেলা ("মুখবয়ব")',
    playFaceDesc: 'মেয়ে প্রিয়া ও পরিবারের সদস্যদের চিনে নিন।',
    playSeqGame: 'দৈনিক কাজের ক্রমবিন্যাস ("দৈনিক ক্রম")',
    playSeqDesc: 'চা খাওয়া, ওষুধ খাওয়া ও হাঁটার সঠিক ক্রম সাজান।',
    playTileGame: 'ঐতিহ্যবাহী স্মৃতি মেল ("সংস্কৃতি মেল")',
    playTileDesc: 'জাপী, গামোচা, কাঁসার ঘণ্টা ও বাঁশির জোড় মেলান।',
    playQuizGame: 'পারিবারিক কুইজ ও স্মৃতি ("আপন স্মৃতি")',
    playQuizDesc: 'মেয়ে প্রিয়ার তৈরি করা পারিবারিক স্মৃতির প্রশ্নের উত্তর দিন।',
    btnTookMed: 'ওষুধ খেয়েছি',
    btnSpeakMed: 'নিয়ম শুনুন'
  },
  hi: {
    brandSubtitle: 'एआई डिमेंशिया केयर एवं स्मृति सहायक प्लेटफॉर्म',
    patientGreeting: 'नमस्ते, बीरेन बाबू!',
    patientDate: 'सोमवार, 31 अगस्त 2026',
    voiceGreet: 'दैनिक संदेश सुनें',
    calmModalTitle: 'मन शांत करें व पुरानी यादें',
    calmModalDesc: 'पारिवारिक यादों और गहरी सांस के अभ्यास से सुकून पाएं।',
    sosTitle: 'आपातकालीन सहायता',
    sosDesc: 'बेटी प्रिया और डॉक्टर को 1-टच में आपातकालीन सूचना भेजें।',
    gamesHeading: 'दैनिक संज्ञानात्मक खेल',
    ddaTitle: 'अनुकूली एआई सक्रिय (स्तर 2)',
    playFaceGame: 'पारिवारिक चेहरा पहचान ("मुखावयव")',
    playFaceDesc: 'अपनी बेटी प्रिया और परिजनों को आवाज से पहचानें।',
    playSeqGame: 'दैनिक दिनचर्या क्रम ("दैनिक क्रम")',
    playSeqDesc: 'चाय, दवा और टहलने की दिनचर्या को सही क्रम में लगाएं।',
    playTileGame: 'सांस्कृतिक स्मृति मिलान ("संस्कृति मेल")',
    playTileDesc: 'जापी, गमोसा, घंटी और बांसुरी के जोड़े मिलाएं।',
    playQuizGame: 'पारिवारिक यादों की पहेली ("अपनापन प्रश्न")',
    playQuizDesc: 'बेटी प्रिया द्वारा आपके लिए बनाए गए पारिवारिक प्रश्नों के उत्तर दें।',
    btnTookMed: 'दवा ले ली है',
    btnSpeakMed: 'निर्देश सुनें'
  }
};

// ============================================================================
// 4. AUTHENTICATION & STRICT PORTAL ISOLATION
// ============================================================================

function loginAs(role) {
  const user = AppState.users[role];
  if (!user) return;

  AppState.currentUser = user;
  AudioEngine.playChime('success');

  // Update Header with Authenticated Profile
  const sessionBadge = document.getElementById('sessionUserBadge');
  const userIcon = document.getElementById('headerUserIcon');
  const userName = document.getElementById('headerUserName');
  const userRole = document.getElementById('headerUserRole');
  const voiceFab = document.getElementById('voiceFab');

  if (sessionBadge) sessionBadge.style.display = 'flex';
  if (userIcon) userIcon.innerText = user.icon;
  if (userName) userName.innerText = user.name;
  if (userRole) userRole.innerText = user.sub;

  // Voice FAB only in Patient mode
  if (voiceFab) {
    voiceFab.style.display = (role === 'patient') ? 'flex' : 'none';
  }

  // Hide Gateway and all other views
  const gatewayView = document.getElementById('loginGatewayView');
  const patientView = document.getElementById('patientView');
  const caregiverView = document.getElementById('caregiverView');
  const doctorView = document.getElementById('doctorView');

  if (gatewayView) gatewayView.style.display = 'none';
  if (patientView) patientView.style.display = 'none';
  if (caregiverView) caregiverView.style.display = 'none';
  if (doctorView) doctorView.style.display = 'none';

  // Render ONLY the authorized portal view
  if (role === 'patient') {
    patientView.style.display = 'block';
    renderPatientView();
  } else if (role === 'caregiver') {
    caregiverView.style.display = 'block';
    renderCaregiverView();
  } else if (role === 'doctor') {
    doctorView.style.display = 'block';
    renderDoctorView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logout() {
  AppState.currentUser = null;
  AudioEngine.playChime('bell');

  // Hide User Badge in header
  const sessionBadge = document.getElementById('sessionUserBadge');
  const voiceFab = document.getElementById('voiceFab');
  if (sessionBadge) sessionBadge.style.display = 'none';
  if (voiceFab) voiceFab.style.display = 'none';

  // Hide all portal views
  const patientView = document.getElementById('patientView');
  const caregiverView = document.getElementById('caregiverView');
  const doctorView = document.getElementById('doctorView');
  const gatewayView = document.getElementById('loginGatewayView');

  if (patientView) patientView.style.display = 'none';
  if (caregiverView) caregiverView.style.display = 'none';
  if (doctorView) doctorView.style.display = 'none';

  // Show Gateway
  if (gatewayView) gatewayView.style.display = 'block';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------------
// PORTAL 1 RENDER: PATIENT COMPANION (ISOLATED DYNAMIC SCHEDULE SPOTLIGHT)
// ----------------------------------------------------------------------------
function renderPatientView() {
  const lang = AppState.currentLanguage;
  const t = i18n[lang] || i18n.en;

  const tasks = AppState.scheduleTasks || [];
  const activeTask = tasks.find(tsk => !tsk.isCompleted);

  const banner = document.getElementById('patientMedBanner');
  if (banner) {
    if (!activeTask) {
      banner.style.background = '#dcfce7';
      banner.style.borderColor = '#16a34a';
      banner.innerHTML = `
        <div class="med-info-group" style="width:100%; justify-content:center; text-align:center;">
          <div style="font-size:32px;">🎉</div>
          <div class="med-text-details">
            <h4 style="color:#15803d;">All Daily Schedule Tasks Completed!</h4>
            <p style="color:#166534;">Wonderful job, Biren Babu! You have completed all 6 routine activities and medicines for today.</p>
          </div>
          <button class="btn-med-taken" onclick="resetPatientSchedule()" style="background:#16a34a; margin-left:auto;">
            🔄 Replay Schedule
          </button>
        </div>
      `;
    } else {
      banner.style.background = activeTask.bg || '#fefce8';
      banner.style.borderColor = activeTask.color || '#eab308';
      const instructions = activeTask.instructions[lang] || activeTask.instructions.en;
      const isMed = activeTask.type === 'medication';
      const isGame = activeTask.type === 'game';
      const isTherapy = activeTask.type === 'therapy';

      banner.innerHTML = `
        <div class="med-info-group">
          <div class="med-pill-icon" style="font-size:32px; background:white; padding:8px 12px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
            ${activeTask.icon}
          </div>
          <div class="med-text-details">
            <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:${activeTask.color}; letter-spacing:0.5px; margin-bottom:2px;">
              ⏰ ACTIVE SCHEDULE TASK (${activeTask.time}) • ${isMed ? 'Pharmacotherapy' : (isGame ? 'Cognitive Game' : (isTherapy ? 'Calming Therapy' : 'Daily Routine'))}
            </div>
            <h4 style="color:#0f172a; margin:0 0 4px 0;">${activeTask.title}</h4>
            <p style="color:#475569; margin:0;">${instructions}</p>
          </div>
        </div>
        <div class="med-action-btns" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <button class="btn-med-taken" onclick="completeScheduleTask('${activeTask.id}')" style="background:#16a34a; color:white; font-weight:800; padding:10px 18px; border-radius:12px; border:none; cursor:pointer;">
            ✓ ${isMed ? t.btnTookMed : 'Mark Complete'}
          </button>
          ${isGame ? `<button class="btn-med-speak" onclick="startFaceRecallGame()" style="background:#0d9488; color:white; border:none; padding:10px 14px; border-radius:12px; font-weight:700; cursor:pointer;">▶ Launch Game</button>` : ''}
          ${isTherapy ? `<button class="btn-med-speak" onclick="openCalmReminiscenceModal()" style="background:#e11d48; color:white; border:none; padding:10px 14px; border-radius:12px; font-weight:700; cursor:pointer;">🧘 Open Breathing</button>` : ''}
          <button class="btn-med-speak" onclick="speakActiveTaskPrompt('${activeTask.id}')" style="background:white; border:1.5px solid ${activeTask.color}; color:#334155; padding:10px 14px; border-radius:12px; font-weight:700; cursor:pointer;">
            🔊 ${t.btnSpeakMed}
          </button>
        </div>
      `;
    }
  }

  const scheduleContainer = document.getElementById('patientScheduleList');
  if (scheduleContainer) {
    scheduleContainer.innerHTML = tasks.map(tsk => {
      const isCurrent = activeTask && activeTask.id === tsk.id;
      return `
        <div class="schedule-item ${tsk.isCompleted ? 'done' : ''}" style="cursor:pointer; ${isCurrent ? 'border: 2px solid #eab308; background:#fefce8;' : ''}" onclick="toggleScheduleTask('${tsk.id}')">
          <span>${tsk.icon} ${tsk.time} - ${tsk.title}</span>
          <strong>${tsk.isCompleted ? '✓ Completed' : (isCurrent ? '⭐ ACTIVE' : '⏰ Pending')}</strong>
        </div>
      `;
    }).join('');
  }
}

function speakActiveTaskPrompt(taskId) {
  const task = (AppState.scheduleTasks || []).find(t => t.id === taskId);
  if (!task) return;
  const lang = AppState.currentLanguage;
  const text = task.instructions[lang] || task.instructions.en;
  AudioEngine.speakText(text, lang);
}

function completeScheduleTask(taskId) {
  const task = (AppState.scheduleTasks || []).find(t => t.id === taskId);
  if (task) {
    task.isCompleted = true;
  }
  AudioEngine.playChime('success');
  AudioEngine.speakText(`Task completed! Next schedule task loaded.`, AppState.currentLanguage);

  AppState.alerts.unshift({
    id: `alt-${Date.now()}`,
    type: 'info',
    title: 'Schedule Task Completed',
    detail: `"${task ? task.title : 'Task'}" completed by patient. Telemetry synced.`,
    time: 'Just now'
  });

  renderPatientView();
}

function toggleScheduleTask(taskId) {
  const task = (AppState.scheduleTasks || []).find(t => t.id === taskId);
  if (task) {
    task.isCompleted = !task.isCompleted;
    AudioEngine.playChime('bell');
    renderPatientView();
  }
}

function resetPatientSchedule() {
  (AppState.scheduleTasks || []).forEach(t => t.isCompleted = false);
  AudioEngine.playChime('bell');
  renderPatientView();
}

function speakMedicationPrompt(rxId) {
  const task = (AppState.scheduleTasks || []).find(t => t.id === rxId);
  if (task) {
    speakActiveTaskPrompt(task.id);
  }
}

function markMedicationTaken(rxId) {
  completeScheduleTask(rxId);
}

function markMedicationTaken(rxId) {
  const patientRxs = AppState.prescriptions[AppState.activePatientId] || [];
  const med = patientRxs.find(r => r.id === rxId);
  if (med) {
    med.takenToday = true;
  }
  AudioEngine.playChime('success');
  AudioEngine.speakText('Medicine taken logged successfully. Good job Biren Babu!', AppState.currentLanguage);

  AppState.alerts.unshift({
    id: `alt-${Date.now()}`,
    type: 'info',
    title: 'Medication Confirmed Taken',
    detail: `${med ? med.name : 'Morning Pill'} confirmed by patient. Telemetry synced.`,
    time: 'Just now'
  });

  renderPatientView();
}

function simulateVoiceResponse() {
  AudioEngine.playChime('bell');
  const lang = AppState.currentLanguage;
  const greetings = {
    en: 'Good morning Biren Babu! Today is Monday, 31st August. The weather in Guwahati is pleasant and bright. Priya sends her love!',
    as: 'নমস্কাৰ বীৰেন বাবু! আজি সোমবাৰ, ৩১ আগষ্ট। গুৱাহাটীৰ বতৰ আজি শান্তিপূৰ্ণ। প্ৰিয়াই আপোনাক মৰম যাচিছে!',
    bn: 'শুভ সকাল বীরেন বাবু! আজ সোমবার, ৩১ আগস্ট। গুয়াহাটির পরিবেশ খুব সুন্দর। প্রিয়া আপনার জন্য ভালোবাসা পাঠিয়েছে!',
    hi: 'शुभ प्रभात बीरेन बाबू! आज सोमवार, 31 अगस्त है। गुवाहाटी में मौसम बहुत सुहावना है। प्रिया ने आपको प्रणाम कहा है!'
  };
  AudioEngine.speakText(greetings[lang] || greetings.en, lang);
}

function triggerSOS() {
  AudioEngine.playChime('bell');
  alert(`🚨 EMERGENCY SOS BEACON DISPATCHED:\n\n• Primary Contact: Priya Hazarika (Daughter) - Call & SMS Dialed\n• Attending Neurologist: Dr. H. Baruah (Guwahati Clinic)\n• Live GPS: Safe within Guwahati Home Sector 4\n• Battery: 88% • Network: Offline SQLite Queue active`);
}

// ----------------------------------------------------------------------------
// PORTAL 2 RENDER: CAREGIVER / FAMILY PORTAL (ISOLATED)
// ----------------------------------------------------------------------------
function renderCaregiverView() {
  const patient = AppState.patients[AppState.activePatientId];

  const cogElem = document.getElementById('caregiverCogIndex');
  if (cogElem) cogElem.innerText = `${patient.cognitiveIndex}/100`;

  const latElem = document.getElementById('caregiverLatency');
  if (latElem) latElem.innerText = `${(patient.reactionTimeAvg / 1000).toFixed(2)}s`;

  const medElem = document.getElementById('caregiverMedCompliance');
  if (medElem) medElem.innerText = `${patient.complianceRate}%`;

  const vaultGrid = document.getElementById('caregiverVaultGrid');
  const vaultItems = AppState.memoryVault[AppState.activePatientId] || [];
  if (vaultGrid) {
    vaultGrid.innerHTML = vaultItems.map(item => `
      <div class="vault-card-thumb">
        <img src="${item.image}" alt="${item.title}">
        <div class="vault-tag">${item.title}</div>
        <button class="vault-audio-btn" onclick="playVaultAudio('${item.id}')" title="Test Voice Note">🔊</button>
      </div>
    `).join('');
  }

  renderCaregiverQuizQuestions();
  renderCaregiverChat();
  renderAlertsList();
}

function renderCaregiverQuizQuestions() {
  const container = document.getElementById('caregiverQuizList');
  if (!container) return;

  const questions = AppState.quizQuestions[AppState.activePatientId] || [];
  if (questions.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#64748b;">No family quiz questions added yet. Click "+ Add Quiz Question" to create one!</div>`;
    return;
  }

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      ${questions.map((q, idx) => `
        <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:14px 18px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px;">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="background:#fef3c7; color:#b45309; font-weight:800; font-size:11px; padding:3px 8px; border-radius:6px;">Q${idx + 1} • ${q.category}</span>
              <span style="font-size:12px; color:#64748b;">Created by ${q.createdBy}</span>
            </div>
            <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:15px;">${q.question}</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              ${q.options.map(opt => `
                <span style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:8px; ${opt === q.correctOption ? 'background:#dcfce7; color:#15803d; border:1px solid #16a34a;' : 'background:#f1f5f9; color:#475569;'}">
                  ${opt === q.correctOption ? '✓ ' : ''}${opt}
                </span>
              `).join('')}
            </div>
            <div style="font-size:12px; color:#b45309;">💡 <em>Hint: "${q.hint}"</em></div>
          </div>
          <button onclick="deleteCaregiverQuizQuestion('${q.id}')" style="background:#fee2e2; border:none; color:#ef4444; padding:8px 10px; border-radius:10px; cursor:pointer; font-size:14px;" title="Delete Question">
            🗑️
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function openAddQuizModal() {
  document.getElementById('quizQuestionModal').style.display = 'flex';
}

function closeAddQuizModal() {
  document.getElementById('quizQuestionModal').style.display = 'none';
}

function handleSaveQuizQuestion(e) {
  e.preventDefault();
  const qText = document.getElementById('quizQuestionText').value;
  const category = document.getElementById('quizCategory').value;
  const correctChoice = document.getElementById('quizCorrectOpt').value;
  const optA = document.getElementById('quizOptA').value;
  const optB = document.getElementById('quizOptB').value;
  const optC = document.getElementById('quizOptC').value;
  const optD = document.getElementById('quizOptD').value;
  const hint = document.getElementById('quizHint').value;

  const options = [optA, optB, optC, optD];
  const choiceMap = { 'A': optA, 'B': optB, 'C': optC, 'D': optD };
  const correctOption = choiceMap[correctChoice] || optA;

  const newQ = {
    id: `quiz-${Date.now()}`,
    question: qText,
    options: options,
    correctOption: correctOption,
    hint: hint || 'Think about your family members.',
    category: category,
    createdBy: 'Priya Hazarika (Daughter)'
  };

  if (!AppState.quizQuestions[AppState.activePatientId]) {
    AppState.quizQuestions[AppState.activePatientId] = [];
  }
  AppState.quizQuestions[AppState.activePatientId].push(newQ);

  closeAddQuizModal();
  document.getElementById('newQuizForm').reset();
  AudioEngine.playChime('success');
  alert(`Question added to Biren Babu's Game 4 ("Family Memory Trivia")!`);

  renderCaregiverQuizQuestions();
}

function deleteCaregiverQuizQuestion(qId) {
  if (!confirm('Are you sure you want to delete this quiz question?')) return;
  if (AppState.quizQuestions[AppState.activePatientId]) {
    AppState.quizQuestions[AppState.activePatientId] = AppState.quizQuestions[AppState.activePatientId].filter(q => q.id !== qId);
  }
  renderCaregiverQuizQuestions();
}

function renderCaregiverChat() {
  const chatContainer = document.getElementById('caregiverChatMessages');
  if (!chatContainer) return;

  const msgs = AppState.chatMessages[AppState.activePatientId] || [];
  chatContainer.innerHTML = msgs.map(m => `
    <div class="chat-bubble ${m.senderRole}">
      <strong>${m.senderName}</strong>: ${m.message}
      <div class="chat-meta">${m.time}</div>
    </div>
  `).join('');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function prefillChat(text) {
  const input = document.getElementById('caregiverChatInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function sendCaregiverMessage() {
  const input = document.getElementById('caregiverChatInput');
  if (!input || !input.value.trim()) return;

  const msgText = input.value.trim();
  input.value = '';

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderRole: 'caregiver',
    senderName: 'Priya Hazarika (Daughter)',
    time: 'Just now',
    message: msgText
  };

  if (!AppState.chatMessages[AppState.activePatientId]) {
    AppState.chatMessages[AppState.activePatientId] = [];
  }
  AppState.chatMessages[AppState.activePatientId].push(newMsg);
  renderCaregiverChat();
  AudioEngine.playChime('bell');

  setTimeout(() => {
    const doctorReply = {
      id: `msg-doc-${Date.now()}`,
      senderRole: 'doctor',
      senderName: 'Dr. H. Baruah, MD',
      time: 'Just now',
      message: `Received, Priya. I have reviewed Baba's latest 30-day cognitive telemetry (MMSE 22/30, Latency 1.42s). Continue the morning Donepezil regimen and let me know if his evening agitation recurs.`
    };
    AppState.chatMessages[AppState.activePatientId].push(doctorReply);
    renderCaregiverChat();
    AudioEngine.playChime('success');
  }, 1500);
}

function playVaultAudio(itemId) {
  const items = AppState.memoryVault[AppState.activePatientId] || [];
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  const lang = AppState.currentLanguage;
  const text = item.audioText[lang] || item.audioText.en;
  AudioEngine.speakText(text, lang);
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

// ----------------------------------------------------------------------------
// PORTAL 3 RENDER: DOCTOR / CLINICIAN CONSOLE (ISOLATED)
// ----------------------------------------------------------------------------
let doctorTrendChart = null;
let doctorMmseRadarChart = null;

function renderDoctorView() {
  const patient = AppState.patients[AppState.activePatientId];

  const docCog = document.getElementById('docCogIndex');
  if (docCog) docCog.innerHTML = `${patient.cognitiveIndex}<span class="vital-unit">/100</span>`;

  const docMmse = document.getElementById('docMmseScore');
  if (docMmse) docMmse.innerHTML = `${patient.mmseScore}.0<span class="vital-unit">/30</span>`;

  const docLat = document.getElementById('docLatency');
  if (docLat) docLat.innerHTML = `${(patient.reactionTimeAvg / 1000).toFixed(2)}s<span class="vital-unit">±${patient.latencyVariance}ms</span>`;

  const docFast = document.getElementById('docFastStage');
  if (docFast) docFast.innerText = patient.stage.split('(')[0].trim();

  const docMed = document.getElementById('docMedAdherence');
  if (docMed) docMed.innerText = `${patient.complianceRate}%`;

  renderDoctorPrescriptionsTable();
  renderDoctorClinicalNotes();
  initDoctorCharts();
}

function onDoctorSelectPatient(patientId) {
  AppState.activePatientId = patientId;
  renderDoctorView();
}

function renderDoctorPrescriptionsTable() {
  const tbody = document.getElementById('doctorPrescriptionsTableBody');
  if (!tbody) return;

  const rxs = AppState.prescriptions[AppState.activePatientId] || [];
  if (rxs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">No active prescriptions recorded for this patient.</td></tr>`;
    return;
  }

  tbody.innerHTML = rxs.map(rx => `
    <tr>
      <td>
        <div class="rx-drug-badge">
          <span class="rx-pill-dot" style="background:${rx.color};"></span>
          <div>
            <strong>${rx.name}</strong>
            <div style="font-size:11px; color:var(--text-muted);">${rx.dose}</div>
          </div>
        </div>
      </td>
      <td>
        <strong>${rx.time}</strong>
        <div style="font-size:11px; color:var(--text-muted);">${rx.frequency}</div>
      </td>
      <td style="max-width:200px;">
        <span style="font-size:12px; color:var(--text-muted);">${rx.clinicalRationale}</span>
      </td>
      <td>
        <button class="chip-btn" onclick="speakMedicationPrompt('${rx.id}')">🔊 Test Voice</button>
      </td>
      <td>
        <button class="btn-rx-del" onclick="deleteDoctorPrescription('${rx.id}')" title="Discontinue Medication">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function deleteDoctorPrescription(rxId) {
  if (!confirm('Are you sure you want to discontinue this prescription?')) return;
  if (AppState.prescriptions[AppState.activePatientId]) {
    AppState.prescriptions[AppState.activePatientId] = AppState.prescriptions[AppState.activePatientId].filter(r => r.id !== rxId);
  }
  renderDoctorPrescriptionsTable();
  renderPatientView();
}

function renderDoctorClinicalNotes() {
  const container = document.getElementById('doctorClinicalNotesList');
  if (!container) return;

  const notes = AppState.clinicalNotes[AppState.activePatientId] || [];
  container.innerHTML = notes.map(n => `
    <div class="clinical-note-card">
      <div class="note-head">
        <strong>${n.doctorName} • ${n.date}</strong>
        <span class="note-badge">MMSE: ${n.mmseScore}/30</span>
      </div>
      <div class="note-body">
        <p><strong>Assessment:</strong> ${n.observations}</p>
        <div class="note-plan"><strong>Therapeutic Plan:</strong> ${n.plan}</div>
      </div>
    </div>
  `).join('');
}

function initDoctorCharts() {
  const trendCtx = document.getElementById('doctorTrendChart');
  const radarCtx = document.getElementById('doctorMmseRadarChart');
  const patient = AppState.patients[AppState.activePatientId];

  if (trendCtx && typeof Chart !== 'undefined') {
    if (doctorTrendChart) doctorTrendChart.destroy();
    doctorTrendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4 (Current)'],
        datasets: [
          {
            label: 'Cognitive Baseline Index (0-100)',
            data: patient.trend,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.15)',
            tension: 0.35,
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: '#0d9488'
          },
          {
            label: 'Reaction Speed Index (Norm)',
            data: [65, 68, 70, 75],
            borderColor: '#2563eb',
            borderDash: [5, 5],
            tension: 0.35,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { min: 40, max: 100 } }
      }
    });
  }

  if (radarCtx && typeof Chart !== 'undefined') {
    if (doctorMmseRadarChart) doctorMmseRadarChart.destroy();
    doctorMmseRadarChart = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Orientation', 'Recall', 'Attention', 'Language', 'Spatial', 'Executive'],
        datasets: [
          {
            label: `${patient.name} (MMSE Profile)`,
            data: patient.radarScores,
            backgroundColor: 'rgba(37, 99, 235, 0.25)',
            borderColor: '#2563eb',
            pointBackgroundColor: '#2563eb'
          },
          {
            label: 'Age-Matched Clinical Norm',
            data: [90, 85, 90, 95, 90, 88],
            borderColor: '#94a3b8',
            borderDash: [4, 4],
            backgroundColor: 'transparent',
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { min: 0, max: 100 } }
      }
    });
  }
}

// ============================================================================
// 5. MODALS & FORMS
// ============================================================================

// Prescription Modal
function openNewPrescriptionModal() {
  document.getElementById('prescriptionModal').style.display = 'flex';
}
function closePrescriptionModal() {
  document.getElementById('prescriptionModal').style.display = 'none';
}

function autoFillDrugRationale(drugName) {
  const rationales = {
    'Donepezil Hydrochloride': 'Inhibits acetylcholinesterase to maintain cognitive baseline and synaptic clarity.',
    'Memantine HCl': 'NMDA receptor antagonist protecting against glutamate excitotoxicity.',
    'Rivastigmine Tartrate': 'Dual AChE & BuChE inhibitor for symptomatic Alzheimer improvement.',
    'Galantamine Hydrobromide': 'Allosteric nicotinic modulator enhancing cholinergic neurotransmission.',
    'Amlodipine Besylate': 'Blood pressure stabilization to prevent cerebral vascular micro-lesions.',
    'Ginkgo Biloba Extract': 'Antioxidant and microcirculatory cerebral perfusion support.'
  };
  const ratInput = document.getElementById('rxRationale');
  if (ratInput && rationales[drugName]) {
    ratInput.value = rationales[drugName];
  }
}

function handleSavePrescription(e) {
  e.preventDefault();
  const drugName = document.getElementById('rxDrugName').value;
  const dose = document.getElementById('rxDose').value;
  const freq = document.getElementById('rxFrequency').value;
  const time = document.getElementById('rxTime').value;
  const rationale = document.getElementById('rxRationale').value;
  const instEn = document.getElementById('rxInstructionsEn').value;
  const instAs = document.getElementById('rxInstructionsAs').value;

  const newRx = {
    id: `rx-${Date.now()}`,
    name: drugName,
    dose: dose,
    frequency: freq,
    time: time,
    color: '#3b82f6',
    shape: 'round',
    takenToday: false,
    clinicalRationale: rationale,
    instructions: {
      en: instEn,
      as: instAs || instEn,
      bn: instEn,
      hi: instEn
    }
  };

  if (!AppState.prescriptions[AppState.activePatientId]) {
    AppState.prescriptions[AppState.activePatientId] = [];
  }
  AppState.prescriptions[AppState.activePatientId].push(newRx);

  closePrescriptionModal();
  AudioEngine.playChime('success');
  alert(`Prescription for ${drugName} saved and synchronized!`);

  renderDoctorPrescriptionsTable();
  renderPatientView();
}

// Memory Vault Modal
function openAddVaultModal() {
  document.getElementById('vaultModal').style.display = 'flex';
}
function closeAddVaultModal() {
  document.getElementById('vaultModal').style.display = 'none';
}

function handleSaveVaultItem(e) {
  e.preventDefault();
  const title = document.getElementById('vaultTitle').value;
  const relation = document.getElementById('vaultRelation').value;
  const voiceText = document.getElementById('vaultVoiceText').value;
  const checkedImg = document.querySelector('input[name="vaultImgPreset"]:checked');
  const imgUrl = checkedImg ? checkedImg.value : 'assets/family.jpg';

  const newItem = {
    id: `vault-${Date.now()}`,
    title: title,
    relation: relation,
    image: imgUrl,
    audioText: {
      en: voiceText,
      as: voiceText,
      bn: voiceText,
      hi: voiceText
    }
  };

  if (!AppState.memoryVault[AppState.activePatientId]) {
    AppState.memoryVault[AppState.activePatientId] = [];
  }
  AppState.memoryVault[AppState.activePatientId].push(newItem);

  closeAddVaultModal();
  AudioEngine.playChime('success');
  alert(`Memory "${title}" added to Reminiscence Vault!`);
  renderCaregiverView();
}

// Clinical Consultation Notes Modal
function openAddNoteModal() {
  document.getElementById('clinicalNoteModal').style.display = 'flex';
}
function closeAddNoteModal() {
  document.getElementById('clinicalNoteModal').style.display = 'none';
}

function handleSaveClinicalNote(e) {
  e.preventDefault();
  const consultType = document.getElementById('noteConsultType').value;
  const mmse = parseInt(document.getElementById('noteMmseScore').value) || 22;
  const fast = document.getElementById('noteFastStage').value;
  const cdr = parseFloat(document.getElementById('noteCdrScore').value) || 1.0;
  const obs = document.getElementById('noteObservations').value;
  const plan = document.getElementById('notePlan').value;

  const newNote = {
    id: `note-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    doctorName: 'Dr. H. Baruah, MD',
    consultType: consultType,
    mmseScore: mmse,
    fastStage: fast,
    cdrScore: cdr,
    observations: obs,
    plan: plan
  };

  if (!AppState.clinicalNotes[AppState.activePatientId]) {
    AppState.clinicalNotes[AppState.activePatientId] = [];
  }
  AppState.clinicalNotes[AppState.activePatientId].unshift(newNote);

  const p = AppState.patients[AppState.activePatientId];
  if (p) {
    p.mmseScore = mmse;
    p.stage = fast;
  }

  closeAddNoteModal();
  AudioEngine.playChime('success');
  renderDoctorView();
}

// Clinical Report Generator Modal
function openClinicalReportModal() {
  const patient = AppState.patients[AppState.activePatientId];
  const rxs = AppState.prescriptions[AppState.activePatientId] || [];
  const notes = AppState.clinicalNotes[AppState.activePatientId] || [];
  const latestNote = notes[0] || {};

  const reportContainer = document.getElementById('clinicalReportContent');
  if (reportContainer) {
    reportContainer.innerHTML = `
      <div class="report-hospital-header">
        <div class="hospital-title">
          <h2>GUWAHATI NEUROLOGICAL & GERIATRIC HEALTH CENTER</h2>
          <p>Department of Cognitive Neurology, Neuropsychology & Dementia Telemetry</p>
          <p>Medical Center Road, Guwahati, Assam - 781001 • Telemetry Reg: AS-MED-7401</p>
        </div>
        <div class="report-meta-box">
          <strong>REPORT ID: REP-SMRI-${Math.floor(100000 + Math.random() * 900000)}</strong>
          <div>Date: 31 August 2026</div>
          <div>Physician: Dr. H. Baruah, MD, DM</div>
        </div>
      </div>

      <div class="report-patient-summary">
        <div><strong>Patient Name:</strong> ${patient.name}</div>
        <div><strong>Patient ID:</strong> ${patient.id}</div>
        <div><strong>Age / Gender:</strong> ${patient.age} Yrs / ${patient.gender}</div>
        <div><strong>Primary Caregiver:</strong> ${patient.primaryCaregiver}</div>
        <div><strong>Clinical Staging:</strong> ${patient.stage}</div>
        <div><strong>Attending Doctor:</strong> ${patient.attendingPhysician}</div>
      </div>

      <div class="report-section-title">1. COMPOSITE COGNITIVE TELEMETRY (30-DAY AI EVALUATION)</div>
      <div class="report-telemetry-grid">
        <div class="report-tel-card">
          <div class="r-val">${patient.cognitiveIndex}/100</div>
          <div class="r-lbl">Cognitive Baseline Index</div>
        </div>
        <div class="report-tel-card">
          <div class="r-val">${patient.mmseScore}/30</div>
          <div class="r-lbl">Estimated MMSE Score</div>
        </div>
        <div class="report-tel-card">
          <div class="r-val">${(patient.reactionTimeAvg / 1000).toFixed(2)}s</div>
          <div class="r-lbl">Mean Reaction Latency</div>
        </div>
        <div class="report-tel-card">
          <div class="r-val" style="color:#16a34a;">${patient.complianceRate}%</div>
          <div class="r-lbl">Medication Adherence</div>
        </div>
      </div>

      <div class="report-section-title">2. ACTIVE PHARMACOTHERAPY PRESCRIPTIONS</div>
      <ul class="report-list">
        ${rxs.map(r => `<li><strong>${r.name} (${r.dose})</strong>: ${r.frequency} at ${r.time} — <em>${r.clinicalRationale}</em></li>`).join('')}
      </ul>

      <div class="report-section-title">3. LATEST CLINICAL CONSULTATION OBSERVATIONS</div>
      <p style="font-size:13px; line-height:1.5; margin-bottom:8px;">
        ${latestNote.observations || 'Patient demonstrates stable cognitive telemetry with high adherence to daily reminiscence audio therapy and family recall gaming.'}
      </p>

      <div class="report-section-title">4. CLINICAL RECOMMENDATIONS & CARE PLAN</div>
      <ol class="report-list">
        <li>Continue morning Donepezil 5mg dosage and maintain strict compliance timing.</li>
        <li>Perform daily 15-minute Reminiscence breathing sessions at 6:30 PM to suppress sundowning restlessness.</li>
        <li>Engage in twice-daily Smriti Sahayak cognitive games (Family Face Recall & Routine Sequencing).</li>
        <li>Routine 60-day in-clinic follow-up scheduled with Dr. H. Baruah.</li>
      </ol>

      <div class="report-signature-block">
        <div>
          <span style="font-size:12px; color:var(--text-muted);">Verified via Smriti Sahayak Digital Telemetry Cryptographic Hash: <strong>#8F90-A1E2</strong></span>
        </div>
        <div class="signature-line">
          Dr. H. Baruah, MD, DM (Neurology)<br>
          <span style="font-size:11px; font-weight:normal;">Consultant Neurologist & Geriatrician</span>
        </div>
      </div>
    `;
  }
  document.getElementById('clinicalReportModal').style.display = 'flex';
}

function closeClinicalReportModal() {
  document.getElementById('clinicalReportModal').style.display = 'none';
}

// ============================================================================
// 6. COGNITIVE GAMES ENGINES
// ============================================================================
function openGameModal(htmlContent) {
  const container = document.getElementById('gameContainer');
  container.innerHTML = htmlContent;
  document.getElementById('gameModal').style.display = 'flex';
}

function closeGameModal() {
  document.getElementById('gameModal').style.display = 'none';
}

// Game 1: Family Face Recall
function startFaceRecallGame() {
  AudioEngine.playChime('bell');
  const startTime = Date.now();

  const gameHTML = `
    <div class="game-arena">
      <h3>👨‍👩‍👧 Family Recall Game ("Mukhobayav")</h3>
      <p class="game-prompt">Who is this beloved family member smiling at you?</p>
      
      <img src="assets/daughter.jpg" alt="Daughter" class="game-target-photo">

      <div class="game-options-grid">
        <button class="btn-game-opt" onclick="checkFaceAnswer(true, ${startTime}, this)">Priya (Daughter)</button>
        <button class="btn-game-opt" onclick="checkFaceAnswer(false, ${startTime}, this)">Sunita (Neighbor)</button>
        <button class="btn-game-opt" onclick="checkFaceAnswer(false, ${startTime}, this)">Kavita (Nurse)</button>
        <button class="btn-game-opt" onclick="checkFaceAnswer(false, ${startTime}, this)">Rina (Colleague)</button>
      </div>

      <button class="btn-med-speak" onclick="AudioEngine.speakText('This is your daughter Priya who loves you dearly.', AppState.currentLanguage)" style="margin: 0 auto;">
        🔊 Listen to Voice Clue
      </button>
    </div>
  `;
  openGameModal(gameHTML);
}

function checkFaceAnswer(isCorrect, startTime, buttonElem) {
  const latency = Date.now() - startTime;
  if (isCorrect) {
    buttonElem.classList.add('correct');
    AudioEngine.playChime('success');
    AudioEngine.speakText('Excellent! Yes, this is your beloved daughter Priya!', AppState.currentLanguage);
    
    AppState.alerts.unshift({
      id: `alt-${Date.now()}`,
      type: 'info',
      title: 'Family Recall Game Completed',
      detail: `Patient correctly identified Priya (Daughter) with latency of ${(latency / 1000).toFixed(2)}s.`,
      time: 'Just now'
    });

    setTimeout(() => {
      closeGameModal();
    }, 1800);
  } else {
    buttonElem.classList.add('wrong');
    AudioEngine.playChime('error');
    AudioEngine.speakText('Look closely at the gentle smile. That is your daughter Priya.', AppState.currentLanguage);
  }
}

// Game 2: Daily Sequencing
function startSequencingGame() {
  AudioEngine.playChime('bell');
  const gameHTML = `
    <div class="game-arena">
      <h3>⏰ Daily Routine Sequencing ("Dainik Kram")</h3>
      <p class="game-prompt">Click the activities in the correct order from Morning to Night:</p>
      
      <div class="game-seq-slots" id="seqOptions">
        <button class="seq-item-card" onclick="pickSeqStep(this, 1, '🌅 Morning Tea')">🌅 Morning Tea</button>
        <button class="seq-item-card" onclick="pickSeqStep(this, 2, '💊 Donepezil 5mg')">💊 Donepezil 5mg</button>
        <button class="seq-item-card" onclick="pickSeqStep(this, 3, '🌳 Garden Walk')">🌳 Garden Walk</button>
        <button class="seq-item-card" onclick="pickSeqStep(this, 4, '🍲 Lunch & Rest')">🍲 Lunch & Rest</button>
      </div>

      <div id="seqResultBox" style="font-size:16px; font-weight:700; color:#0d9488; min-height:30px; margin-top:16px;"></div>
    </div>
  `;
  openGameModal(gameHTML);
  window.seqStepCurrent = 1;
}

function pickSeqStep(btn, stepNum, title) {
  if (stepNum === window.seqStepCurrent) {
    btn.style.background = '#dcfce7';
    btn.style.borderColor = '#16a34a';
    btn.disabled = true;
    AudioEngine.playChime('bell');
    window.seqStepCurrent++;

    if (window.seqStepCurrent > 4) {
      AudioEngine.playChime('success');
      document.getElementById('seqResultBox').innerText = '🎉 Wonderful! Daily routine sequence arranged perfectly!';
      setTimeout(() => closeGameModal(), 1800);
    }
  } else {
    AudioEngine.playChime('error');
  }
}

// Game 3: Cultural Match
function startCulturalMatchGame() {
  AudioEngine.playChime('bell');
  const symbols = ['👒', '🧣', '🔔', '🪈', '👒', '🧣', '🔔', '🪈'];
  symbols.sort(() => Math.random() - 0.5);

  const gameHTML = `
    <div class="game-arena">
      <h3>👒 Cultural Memory Match ("Sanskriti Mel")</h3>
      <p class="game-prompt">Find matching pairs of regional symbols (Japi, Gamosa, Brass Bell, Flute):</p>
      
      <div class="cultural-match-grid">
        ${symbols.map((sym, i) => `
          <div class="cultural-card" data-symbol="${sym}" onclick="flipCulturalCard(this)">
            <span class="card-sym" style="visibility:hidden;">${sym}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  openGameModal(gameHTML);
  window.flippedCards = [];
}

function flipCulturalCard(card) {
  if (card.classList.contains('matched') || window.flippedCards.length >= 2) return;
  
  card.querySelector('.card-sym').style.visibility = 'visible';
  card.classList.add('flipped');
  window.flippedCards.push(card);
  AudioEngine.playChime('bell');

  if (window.flippedCards.length === 2) {
    const [c1, c2] = window.flippedCards;
    if (c1.dataset.symbol === c2.dataset.symbol) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      AudioEngine.playChime('success');
      window.flippedCards = [];
    } else {
      setTimeout(() => {
        c1.querySelector('.card-sym').style.visibility = 'hidden';
        c2.querySelector('.card-sym').style.visibility = 'hidden';
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        window.flippedCards = [];
      }, 900);
    }
  }
}

// Game 4: Family Memory Trivia (Customized by Caregiver)
function startFamilyQuizGame() {
  AudioEngine.playChime('bell');
  const questions = AppState.quizQuestions[AppState.activePatientId] || [];
  if (questions.length === 0) {
    alert('No family quiz questions available. Please ask daughter Priya to add questions in the Caregiver portal!');
    return;
  }

  window.familyQuizState = {
    questions: questions,
    currentIndex: 0,
    score: 0,
    startTime: Date.now()
  };

  renderFamilyQuizStep();
}

function renderFamilyQuizStep() {
  const { questions, currentIndex, score } = window.familyQuizState;
  const q = questions[currentIndex];
  const startTime = Date.now();

  const gameHTML = `
    <div class="game-arena" style="max-width:560px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="background:#fef3c7; color:#b45309; font-weight:800; font-size:12px; padding:4px 10px; border-radius:8px;">
          QUESTION ${currentIndex + 1} OF ${questions.length} • ${q.category}
        </span>
        <span style="color:#0d9488; font-weight:800; font-size:14px;">⭐ Score: ${score}</span>
      </div>

      <div style="font-size:12px; color:#64748b; margin-bottom:8px; font-weight:700;">
        👨‍👩‍👧 Customized with love by: <strong>${q.createdBy}</strong>
      </div>

      <h3 style="font-size:20px; color:#0f172a; line-height:1.4; margin-bottom:20px; background:#f8fafc; padding:16px; border-radius:14px; border:2px solid #cbd5e1;">
        ${q.question}
      </h3>

      <div class="game-options-grid" style="margin-bottom:16px;">
        ${q.options.map((opt, i) => `
          <button class="btn-game-opt" onclick="checkFamilyQuizAnswer('${opt.replace(/'/g, "\\'")}', '${q.correctOption.replace(/'/g, "\\'")}', '${q.hint.replace(/'/g, "\\'")}', ${startTime}, this)">
            <strong>${String.fromCharCode(65 + i)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>

      <div id="quizHintContainer" style="display:none; background:#fefce8; border:1.5px solid #facc15; padding:12px; border-radius:12px; margin-bottom:16px; font-size:13px; color:#854d0e; font-weight:700;">
      </div>

      <button class="btn-med-speak" onclick="AudioEngine.speakText('${q.question.replace(/'/g, "\\'")}', AppState.currentLanguage)" style="margin: 0 auto;">
        🔊 Read Question Aloud
      </button>
    </div>
  `;
  openGameModal(gameHTML);
}

function checkFamilyQuizAnswer(selectedOpt, correctOpt, hint, startTime, btn) {
  const latency = Date.now() - startTime;
  const isCorrect = (selectedOpt === correctOpt);

  if (isCorrect) {
    btn.classList.add('correct');
    window.familyQuizState.score++;
    AudioEngine.playChime('success');
    AudioEngine.speakText('Wonderful! That is correct!', AppState.currentLanguage);

    AppState.alerts.unshift({
      id: `alt-${Date.now()}`,
      type: 'info',
      title: 'Family Trivia Question Answered',
      detail: `Patient correctly answered "${window.familyQuizState.questions[window.familyQuizState.currentIndex].question}" (${(latency / 1000).toFixed(2)}s).`,
      time: 'Just now'
    });

    setTimeout(() => {
      advanceFamilyQuiz();
    }, 1500);
  } else {
    btn.classList.add('wrong');
    AudioEngine.playChime('error');
    const hintBox = document.getElementById('quizHintContainer');
    if (hintBox) {
      hintBox.style.display = 'block';
      hintBox.innerHTML = `💡 Priya's Hint: "${hint}"`;
    }
    AudioEngine.speakText(`Look at the hint: ${hint}`, AppState.currentLanguage);
  }
}

function advanceFamilyQuiz() {
  const { questions, currentIndex, score } = window.familyQuizState;
  if (currentIndex < questions.length - 1) {
    window.familyQuizState.currentIndex++;
    renderFamilyQuizStep();
  } else {
    AudioEngine.playChime('success');
    const finishHTML = `
      <div class="game-arena" style="text-align:center; padding:30px 20px;">
        <div style="font-size:48px; margin-bottom:10px;">🎉</div>
        <h3 style="color:#0f172a; font-size:24px; margin-bottom:8px;">Family Trivia Quiz Completed!</h3>
        <p style="font-size:16px; color:#15803d; font-weight:700; margin-bottom:12px;">
          You answered ${score} of ${questions.length} questions correctly!
        </p>
        <p style="color:#475569; font-size:14px; max-width:400px; margin:0 auto 24px;">
          Wonderful job, Biren Babu! Your daughter Priya is very proud of your memory recall today.
        </p>
        <button class="btn-primary-action" onclick="closeGameModal()" style="margin:0 auto; padding:12px 24px; font-size:16px;">
          ✓ Done & Return to Companion
        </button>
      </div>
    `;
    openGameModal(finishHTML);
  }
}

// Calm Me Down Modal
function openCalmReminiscenceModal() {
  AudioEngine.playChime('bell');
  const gameHTML = `
    <div class="calm-arena">
      <div class="reminiscence-scenery-bg">
        <div class="reminiscence-scenery-text">
          <h3>🌅 Assam Tea Gardens - Peaceful Memory Walk</h3>
          <p>Gentle morning breeze, birdsong, and familiar mountain air.</p>
        </div>
      </div>

      <div class="breathing-coach-section">
        <div class="breathing-orb">
          Breathe
        </div>
        <p style="font-size:16px; color:#cbd5e1; margin-bottom:16px;">
          Breathe in slowly (4s) ... Hold gently (7s) ... Exhale softly (8s)
        </p>

        <div class="calm-audio-controls">
          <button class="btn-calm-action" onclick="AudioEngine.speakText('You are safe at home in Guwahati. Your whole family loves you.', AppState.currentLanguage)">
            🎙️ Play Priya's Comfort Note
          </button>
          <button class="btn-calm-action" onclick="AudioEngine.playChime('bell')">
            🔔 Gentle Meditation Chime
          </button>
        </div>
      </div>
    </div>
  `;
  openGameModal(gameHTML);
}

// ============================================================================
// 7. LANGUAGE SWITCHING & EVENT LISTENERS
// ============================================================================
function changeLanguage(lang) {
  AppState.currentLanguage = lang;
  const t = i18n[lang] || i18n.en;

  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (t[key]) elem.innerText = t[key];
  });

  if (AppState.currentUser && AppState.currentUser.role === 'patient') {
    renderPatientView();
  }
}

function toggleVoiceAssistant() {
  const fab = document.getElementById('voiceFab');
  AppState.isListening = !AppState.isListening;
  fab.classList.toggle('listening', AppState.isListening);

  if (AppState.isListening) {
    AudioEngine.playChime('bell');
    AudioEngine.speakText('Namaskar Biren Babu! Smriti is listening. How can I help you today?', AppState.currentLanguage);
    setTimeout(() => {
      AppState.isListening = false;
      fab.classList.remove('listening');
    }, 4000);
  }
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Language selector
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = AppState.currentLanguage;
    langSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
  }

  // Voice Assistant Floating button
  const voiceFab = document.getElementById('voiceFab');
  if (voiceFab) {
    voiceFab.addEventListener('click', toggleVoiceAssistant);
  }

  // Set default language translations
  changeLanguage(AppState.currentLanguage);

  // Start at Secure Gateway by default
  logout();
});
