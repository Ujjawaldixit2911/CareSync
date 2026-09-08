// Enhanced Humanized Text-to-Speech Engine for CareSync Medical Assistant

let cachedVoices = [];

const loadVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

/**
 * Detects if the string contains Hindi/Devanagari characters or heavy Hindi transliteration
 */
export const isHindiText = (text) => {
  if (!text) return false;
  // Check for Devanagari Unicode range
  if (/[\u0900-\u097F]/.test(text)) return true;
  
  // Common Hindi/Hinglish keywords
  const hindiKeywords = [
    'namaste', 'kripya', 'dawa', 'doctor', 'bataiye', 'kya', 'hai', 'hain',
    'aapko', 'bukhar', 'dard', 'sehat', 'ilaaj', 'paani', 'aaram', 'khayal',
    'kaise', 'thik', 'hoga', 'rakhein', 'madad'
  ];
  const lower = text.toLowerCase();
  return hindiKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lower));
};

/**
 * Cleans and transforms text for natural, human-like speech output
 */
export const cleanSpeechText = (text) => {
  if (!text) return '';
  
  return text
    // Remove markdown symbols, bold, italics, code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#+\s*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bullet points and numbering for smooth reading
    .replace(/^[\s*•\-–—]+\s*/gm, '')
    .replace(/^\d+\.\s*/gm, '')
    // Replace common medical abbreviations with full natural speech words
    .replace(/\bDr\./gi, 'Doctor')
    .replace(/\bmg\b/gi, 'milligrams')
    .replace(/\bml\b/gi, 'milliliters')
    .replace(/\bBP\b/g, 'Blood Pressure')
    .replace(/\bSOS\b/g, 'Emergency S O S')
    .replace(/\bRx\b/gi, 'Prescription')
    .replace(/\bTab\b/gi, 'Tablet')
    .replace(/\bCap\b/gi, 'Capsule')
    .replace(/\bhrs?\b/gi, 'hours')
    .replace(/\bmins?\b/gi, 'minutes')
    // Strip emojis
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    // Normalize spaces and commas for natural pauses
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Finds the highest quality, most humanized/natural voice available
 */
export const getBestHumanVoice = (isHindi = false) => {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  if (isHindi) {
    // Priority order for Hindi human voices (Natural neural voices first)
    const hindiVoice = 
      voices.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('Swara') || v.name.includes('Neerja') || v.name.includes('Madhur'))) ||
      voices.find(v => v.name.includes('Google हिन्दी') || v.name.toLowerCase().includes('google hindi')) ||
      voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang.startsWith('hi')) ||
      voices.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && (v.lang.includes('en-IN') || v.name.includes('Sonia') || v.name.includes('Ravi') || v.name.includes('Prabhat'))) ||
      voices.find(v => v.lang === 'en-IN');

    if (hindiVoice) return hindiVoice;
  }

  // Priority order for English / International natural voices
  const naturalEnglishVoice = 
    // High-definition Indian English Natural voices
    voices.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && (v.lang.includes('en-IN') || v.name.includes('Sonia') || v.name.includes('Neerja') || v.name.includes('Ravi') || v.name.includes('Prabhat'))) ||
    // Natural English voices (Edge/Chrome Neural)
    voices.find(v => (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')) && (v.name.includes('Jenny') || v.name.includes('Aria') || v.name.includes('Guy') || v.name.includes('Emma') || v.name.includes('Brian'))) ||
    // Google voices
    voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Google US English')) ||
    // High quality standard human voices
    voices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira')) ||
    // Fallback to English
    voices.find(v => v.lang.startsWith('en'));

  return naturalEnglishVoice || voices[0] || null;
};

/**
 * Main humanized speech synthesis function
 */
export const playHumanVoice = (text, options = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing robotic speech

    const cleaned = cleanSpeechText(text);
    if (!cleaned) return;

    // Limit to reasonable conversational chunk length (first 350-400 characters)
    const spokenChunk = cleaned.slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(spokenChunk);
    const isHindi = isHindiText(spokenChunk);
    const selectedVoice = getBestHumanVoice(isHindi);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (isHindi ? 'hi-IN' : 'en-IN');
    } else {
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    }

    // Humanized acoustic tuning:
    // Rate: 0.93 (calm, empathetic, warm medical tone)
    // Pitch: 1.02 (natural melodic human frequency)
    utterance.rate = options.rate || 0.93;
    utterance.pitch = options.pitch || 1.02;
    utterance.volume = options.volume || 1.0;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // A tiny timeout ensures browser audio pipeline is unblocked after async axios calls
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech speak error:', e);
      }
    }, 40);
  } catch (error) {
    console.warn('Humanized speech synthesis warning:', error);
  }
};

export const stopHumanVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
