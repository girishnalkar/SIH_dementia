"""
Multilingual Speech & Indic Voice Assistant Service for Smriti Sahayak.
Provides conversational grounding, sentiment/agitation scoring, and regional speech generation.
"""
from typing import Dict, Any

class MultilingualSpeechService:
    def __init__(self):
        self.supported_languages = ["as", "bn", "hi", "mni", "en"]
        self.lexicon = {
            "greeting": {
                "as": "নমস্কাৰ বীৰেন বাবু! আজিৰ দিনটো আপোনাৰ বাবে শুভ হওক।",
                "bn": "নমস্কার বীরেন বাবু! আজকের দিনটি আপনার জন্য শুভ হোক।",
                "hi": "नमस्ते बीरेन बाबू! आपका आज का दिन शुभ और मंगलमय हो।",
                "en": "Good day Biren Babu! Wishing you a peaceful and bright morning."
            },
            "calm_prompt": {
                "as": "শান্ত হওক। আপোনাৰ সমগ্ৰ পৰিয়াল আপোনাৰ কাষতেই আছে। দীঘলকৈ উশাহ লওক।",
                "bn": "শান্ত হোন। আপনার পুরো পরিবার আপনার সাথে আছে। গভীর শ্বাস নিন।",
                "hi": "शांत हो जाइए। आपका पूरा परिवार आपके साथ है। गहरी सांस लीजिए।",
                "en": "Relax peacefully. Your family is right here by your side. Take a slow deep breath."
            }
        }

    def process_voice_query(self, transcript: str, lang: str = "as") -> Dict[str, Any]:
        """
        Parses intent from patient voice query and computes confusion/agitation score.
        """
        transcript_lower = transcript.lower()
        
        # Simple intent matching
        intent = "general_checkin"
        sentiment_score = 0.85 # 0.0 (distressed) to 1.0 (calm)

        if any(w in transcript_lower for w in ["medicine", "দৰব", "ওষুধ", "दवा", "pill"]):
            intent = "query_medication"
        elif any(w in transcript_lower for w in ["priya", "family", "প্ৰিয়া", "পৰিয়াল", "बेटी"]):
            intent = "query_family"
        elif any(w in transcript_lower for w in ["where", "lost", "ক’ত", "কোথায়", "कहाँ", "confused"]):
            intent = "confusion_grounding"
            sentiment_score = 0.35 # Triggers calming guidance
        elif any(w in transcript_lower for w in ["calm", "শান্ত", "घबराहट", "anxious"]):
            intent = "trigger_calm_mode"
            sentiment_score = 0.40

        return {
            "intent": intent,
            "sentiment_score": sentiment_score,
            "detected_language": lang,
            "requires_grounding": sentiment_score < 0.5
        }

speech_service = MultilingualSpeechService()
