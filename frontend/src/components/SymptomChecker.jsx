import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Paperclip, 
  FileText, 
  Image as ImageIcon,
  RotateCcw,
  AudioWaveform,
  CheckCircle2,
  Stethoscope,
  Pill,
  Thermometer
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { playHumanVoice, stopHumanVoice } from '../utils/humanVoice';

// Helper to check if text is Hindi / Hinglish vs English
const isHindiInput = (text) => {
  return /[\u0900-\u097F]|\b(kya|kaise|dawai|dawa|upchar|kripya|namaste|namaskar|bukhar|sar\s*dard|sir\s*dard|pet\s*dard|khansi|jukham|btao|batao|chahiye|mein|lein|hain|rahe|karein|gharelu|nuskhe|jalan|dast|ulti|pet|goli|mariz|sujhao|bataiye|samjhao|kariye|karo|hota|hoti|hote)\b/i.test(text || '');
};

// Smart local clinical knowledge base for instant bilingual guidance (Hindi & English)
const generateSmartMedicalAnswer = (userQuery) => {
  const query = (userQuery || '').toLowerCase().trim();
  const isHindi = isHindiInput(query);

  // Check for out-of-domain / non-medical queries
  const isNonMedical = /\b(cricket|football|ipl|match|movie|film|actor|actress|bollywood|hollywood|modi|politics|election|vote|coding|programming|python|javascript|java|crypto|bitcoin|stock\s*market|nifty|weather|barish|gaana|song|joke|chutkula|dance)\b/i.test(query);

  if (isNonMedical) {
    if (isHindi) {
      return `⚠️ **CareSync Medical AI Assistant:**

माफ़ कीजिये, मैं केवल **चिकित्सा और स्वास्थ्य (Medical & Healthcare)** से जुड़े विषयों पर प्रशिक्षित हूँ। मुझे केवल निम्नलिखित क्षेत्रों के बारे में जानकारी है:

• 🩺 **बीमारियाँ व लक्षण (Diseases & Symptoms):** बुखार, सिर दर्द, खांसी, जुकाम, पेट दर्द, बीपी, शुगर, डेंगू, टाइफाइड आदि।
• 💊 **दवाइयां व खुराक (Medicines & Dosages):** Paracetamol, Pan-40, Cetirizine, Azithromycin, Dolo 650 आदि के सही उपयोग व सावधानियां।
• 🔬 **मेडिकल रिपोर्ट व जांच (Lab Reports & Diagnostics):** Blood Test, CBC, Sugar, Lipid Profile आदि।
• 🥗 **डाइट व पोषण (Clinical Nutrition):** बीमारी के अनुसार सही खान-पान और घरेलू नुस्खे।
• 👨‍⚕️ **डॉक्टर परामर्श (Doctor Consultations):** किस समस्या के लिए किस स्पेशलिस्ट से मिलें।

👉 कृपया मुझसे केवल स्वास्थ्य, बीमारी या दवाई से संबंधित सवाल पूछें! 🙏`;
    } else {
      return `⚠️ **CareSync Medical AI Assistant:**

I apologize, but I am specialized exclusively in **Medical & Healthcare** topics. I only have domain expertise in the following fields:

• 🩺 **Diseases & Symptoms:** Fever, Headache, Cough, Cold, Abdominal Pain, Diabetes, Hypertension, Dengue, Typhoid, etc.
• 💊 **Medicines & Dosages:** Paracetamol, Pan-40, Cetirizine, Azithromycin, Antacids, Antibiotics, uses & precautions.
• 🔬 **Diagnostic Reports & Lab Tests:** CBC, Blood Sugar, Lipid Profile, Liver/Kidney Function tests.
• 🥗 **Clinical Diet & Nutrition:** Medical diet routines, hydration, and safe home remedies.
• 👨‍⚕️ **Doctor Consultations & Triage:** Specialist guidance and emergency warnings.

👉 Please ask questions strictly related to health, illnesses, or medications! 🙏`;
    }
  }

  // 1. FEVER / BUKHAR / DENGUE / MALARIA / TYPHOID / DOLO / PARACETAMOL
  if (query.includes('bukhar') || query.includes('fever') || query.includes('taap') || query.includes('dolo') || query.includes('paracetamol') || query.includes('crocin') || query.includes('calpol') || query.includes('dengue') || query.includes('malaria') || query.includes('typhoid')) {
    if (isHindi) {
      return `🌡️ **बुखार (Fever / Typhoid / Dengue) की दवाई और घरेलू उपचार:**

1. **मुख्य दवा (Paracetamol - Dolo 650mg / Crocin 500mg / Calpol):**
   - **खुराक (Dosage):** बड़ों के लिए 1 टैबलेट भोजन के बाद लें (दिन में 6–8 घंटे के अंतराल पर, 24 घंटे में अधिकतम 4 टैबलेट)।
   - **सावधानी:** खाली पेट न लें और 24 घंटे में 4000mg से अधिक न लें।

2. **सहायक व घरेलू देखभाल:**
   - खूब पानी, नारियल पानी, ORS या नींबू पानी पिएं (Dehydration से बचें)।
   - माथे पर ताजे पानी की पट्टी (Cold compress) रखें।
   - हल्का व सुपाच्य भोजन (खिचड़ी, सूप, दलिया) लें।

⚠️ **डॉक्टर को कब दिखाएं:** यदि बुखार 102°F से अधिक हो या 3 दिन से अधिक रहे, तो तुरंत CBC/Widal टेस्ट कराएं और CareSync के General Physician से परामर्श लें।`;
    } else {
      return `🌡️ **Fever Treatment & Medicine Guidelines:**

1. **Recommended Medication:**
   - **Paracetamol (Dolo 650mg / Crocin 500mg / Calpol):**
   - **Dosage:** 1 tablet after meals every 6–8 hours as needed (Maximum 3–4 tablets / 4000mg in 24 hours).
   - **Precaution:** Avoid taking on an empty stomach and avoid concurrent alcohol consumption.

2. **Home Care & Supportive Measures:**
   - High fluid intake (electrolyte water, coconut water, oral rehydration).
   - Apply a lukewarm / cool water damp cloth on forehead to lower body temperature.
   - Get plenty of bed rest and eat light meals (broth, soups, oats).

⚠️ **When to consult a Doctor:** If temperature exceeds 102°F (38.9°C) or persists for more than 3 days, book an immediate consultation with a CareSync physician.`;
    }
  }

  // 2. HEADACHE / SAR DARD / MIGRAINE
  if (query.includes('sar dard') || query.includes('sardard') || query.includes('headache') || query.includes('sir dard') || query.includes('head pain') || query.includes('migraine')) {
    if (isHindi) {
      return `💆 **सिर दर्द (Headache / Migraine) की दवाई और उपचार:**

1. **दवाई (Medication):**
   - **Paracetamol 650mg (Dolo 650)** या **Ibuprofen 400mg (Brufen)** भोजन के बाद लें।
   - यदि गैस/एसिडिटी के कारण सिर दर्द है तो **Pantoprazole 40mg (Pan-40)** सुबह खाली पेट या **Digene syrup** लें।

2. **तुरंत राहत के उपाय:**
   - शांत और अंधेरे कमरे में 20–30 मिनट विश्राम करें।
   - 2 बड़े गिलास पानी पिएं (Dehydration सिर दर्द का मुख्य कारण होता है)।
   - स्क्रीन (Mobile/Laptop) का उपयोग कम करें और बाम लगाएं।

⚠️ अचानक तेज असहनीय दर्द या उल्टी आने पर तुरंत डॉक्टर से जांच कराएं।`;
    } else {
      return `💆 **Headache Relief & Clinical Recommendations:**

1. **First-Line Medications:**
   - **Paracetamol (650mg)** or **Ibuprofen 400mg** after food.
   - If headache is triggered by acidity/gastritis, consider an antacid like **Pantoprazole 40mg (Pan-40)**.

2. **Immediate Supportive Relief:**
   - Rest in a quiet, dark room for 20–30 minutes.
   - Drink 2 large glasses of water immediately to rule out dehydration.
   - Reduce digital screen brightness and apply a soothing cooling balm on temples.

⚠️ Seek emergency medical care if the headache is sudden and thunderclap-like, or accompanied by blurred vision or stiff neck.`;
    }
  }

  // 3. COUGH & COLD / KHANSI & JUKHAM / AZITHROMYCIN / CETIRIZINE
  if (query.includes('khansi') || query.includes('cough') || query.includes('jukham') || query.includes('cold') || query.includes('nazla') || query.includes('gale') || query.includes('sore throat') || query.includes('cetirizine') || query.includes('azithromycin') || query.includes('montair')) {
    if (isHindi) {
      return `🤧 **खांसी और जुकाम (Cough & Cold) का उपचार:**

1. **दवाइयां (Medicines):**
   - **एलर्जी व छींक:** **Cetirizine 10mg** या **Montair-LC** (रात को सोते समय 1 टैबलेट)।
   - **सूखी खांसी (Dry Cough):** **Dextromethorphan सिरप** (Ascoril-D / Benadryl-DR) 10ml दिन में 2 बार।
   - **बलगम वाली खांसी (Wet Cough):** **Ambroxol + Guaiphenesin सिरप** (Grilinctus-BM / Ascoril-LS)।
   - **गले में इन्फेक्शन:** डॉक्टर की सलाह पर **Azithromycin 500mg** (दिन में 1 बार 3 दिन)।

2. **घरेलू नुस्खे:**
   - गुनगुने पानी में नमक डालकर दिन में 3 बार गरारे (Gargle) करें।
   - दिन में 2 बार भाप (Steam) लें।
   - अदरक, तुलसी, काली मिर्च और शहद का काढ़ा पिएं।`;
    } else {
      return `🤧 **Cough & Cold Clinical Recommendations:**

1. **Medications by Symptom:**
   - **Allergic Rhinitis / Sneezing:** Cetirizine 10mg or Montair-LC (1 tablet at bedtime).
   - **Dry Cough:** Dextromethorphan Cough Syrup (e.g. Benadryl DR / Ascoril-D) 10ml twice daily.
   - **Productive / Chest Congestion (Wet Cough):** Ambroxol + Guaiphenesin Expectorant (Ascoril-LS / Grilinctus).
   - **Bacterial Throat Infection:** Azithromycin 500mg once daily for 3 days as prescribed.

2. **Home Remedies:**
   - Warm saltwater gargles 3 times daily to soothe throat inflammation.
   - Inhale warm steam to clear nasal passages.
   - Drink herbal tea with ginger, honey, and lemon.`;
    }
  }

  // 4. STOMACH PAIN / ACIDITY / GAS / PET DARD / PAN-40 / MEFTAL / VOMIKIND
  if (query.includes('pet') || query.includes('stomach') || query.includes('acidity') || query.includes('gas') || query.includes('loose motion') || query.includes('dast') || query.includes('vomiting') || query.includes('diarrhea') || query.includes('pan 40') || query.includes('pan-40') || query.includes('digene') || query.includes('meftal') || query.includes('vomikind')) {
    if (isHindi) {
      return `🩺 **पेट दर्द, एसिडिटी, गैस और दस्त की दवाई:**

1. **एसिडिटी और सीने में जलन:**
   - **Pantoprazole 40mg (Pan-40 / Pan-D):** सुबह खाली पेट 1 टैबलेट।
   - **Digene / Gelusil Syrup:** 2 चम्मच भोजन के बाद।

2. **पेट दर्द (Cramps/Spasms):**
   - **Meftal-Spas** या **Drotaverine (Drotin-M):** भोजन के बाद 1 टैबलेट।

3. **दस्त (Loose Motion) व उल्टी:**
   - हर दस्त के बाद 1 गिलास **ORS घोल** पिएं।
   - **Sporlac Probiotic** दिन में 2 बार लें।
   - उल्टी के लिए **Ondansetron 4mg (Vomikind)** लें।`;
    } else {
      return `🩺 **Stomach Discomfort, Acidity & GI Care:**

1. **Acidity & Heartburn:**
   - **Pantoprazole 40mg (Pan-40):** 1 tablet taken 30 minutes before breakfast on an empty stomach.
   - **Antacid Gel (Digene / Gelusil):** 2 teaspoons post-meals.

2. **Abdominal Cramps / Spasms:**
   - **Drotaverine / Meftal-Spas:** 1 tablet after meals as prescribed.

3. **Diarrhea & Nausea:**
   - Drink 1 glass of WHO-formula Oral Rehydration Salts (ORS) after each loose motion to prevent dehydration.
   - Take a probiotic (Sporlac / Bifilac) and **Ondansetron 4mg (Vomikind)** for vomiting.`;
    }
  }

  // 5. DIABETES / SUGAR / METFORMIN
  if (query.includes('diabetes') || query.includes('sugar') || query.includes('metformin') || query.includes('glucose') || query.includes('madhumeh')) {
    if (isHindi) {
      return `🩸 **डायबिटीज (Sugar) नियंत्रण मार्गदर्शन:**

1. **सामान्य लक्ष्य (Target Levels):**
   - Fasting (खाली पेट): 80–130 mg/dL
   - Post-meal (भोजन के 2 घंटे बाद): < 180 mg/dL
   - HbA1c: < 7.0%

2. **महत्वपूर्ण दिशानिर्देश:**
   - डॉक्टर द्वारा निर्धारित दवाएं (**Metformin 500mg/1000mg**) समय पर लें।
   - रोजाना 30–45 मिनट तेज चाल में वॉक करें।
   - चीनी, मैदा, और मीठे पेय पदार्थों से पूरी तरह परहेज करें।`;
    } else {
      return `🩸 **Diabetes & Blood Sugar Guidelines:**

1. **Target Glycemic Ranges:**
   - Fasting Blood Sugar: 80–130 mg/dL
   - Postprandial (2 hrs post-meal): Under 180 mg/dL
   - Target HbA1c: Under 7.0%

2. **Clinical Management:**
   - Adhere strictly to prescribed oral hypoglycemics (Metformin / Glimepiride).
   - Engage in 30–45 minutes of aerobic exercise (brisk walking) daily.
   - Prioritize high-fiber complex carbohydrates and eliminate refined sugars.`;
    }
  }

  // 6. BLOOD PRESSURE / BP / HYPERTENSION
  if (query.includes('blood pressure') || query.includes('bp') || query.includes('hypertension') || query.includes('telmisartan') || query.includes('amlodipine')) {
    if (isHindi) {
      return `❤️ **ब्लड प्रेशर (High BP) मार्गदर्शन:**

1. **सामान्य स्तर (Normal Range):** 120/80 mmHg (140/90 mmHg से ऊपर High BP माना जाता है)।
2. **प्रमुख सावधानियां:**
   - नमक (Sodium) का सेवन प्रतिदिन 1 चम्मच से कम रखें।
   - डॉक्टर की बीपी की दवाई (**Telmisartan 40mg / Amlodipine 5mg**) नियमित समय पर लें।
   - तनाव कम करें और नियमित 30 मिनट वॉक करें।`;
    } else {
      return `❤️ **Blood Pressure (Hypertension) Guidelines:**

1. **Clinical Ranges:**
   - Ideal: 120/80 mmHg
   - Stage 1 Hypertension: 130-139 / 80-89 mmHg
   - Stage 2 Hypertension: 140/90 mmHg or above

2. **Lifestyle & Preventive Care:**
   - Restrict daily dietary sodium intake to under 2,000 mg (under 1 teaspoon).
   - Take antihypertensives (e.g. Telmisartan / Amlodipine) consistently without skipping doses.
   - Practice stress-reduction techniques and monitor BP regularly.`;
    }
  }

  // 7. BODY PAIN / COMBIFLAM / JOINTS / ARTHRITIS
  if (query.includes('body pain') || query.includes('badan dard') || query.includes('joint pain') || query.includes('gathiya') || query.includes('combiflam') || query.includes('back pain')) {
    if (isHindi) {
      return `💪 **बदन दर्द और जोड़ों के दर्द (Body & Joint Pain) का उपचार:**

1. **दवाइयां (Medicines):**
   - **Combiflam** (Ibuprofen + Paracetamol) या **Dolo 650mg** भोजन के बाद 1 टैबलेट लें।
   - जोड़ों के दर्द के लिए **Calcium + Vitamin D3 (Shelcal 500)** रोज 1 टैबलेट लें।
   - दर्द वाले हिस्से पर **Volini / Moov Gel** लगाएं।

2. **घरेलू देखभाल:**
   - गर्म पानी की थैली से 15 मिनट सिकाई करें।
   - हल्दी वाला गुनगुना दूध पिएं और पर्याप्त आराम करें।`;
    } else {
      return `💪 **Body & Joint Pain Clinical Guidance:**

1. **Medications:**
   - **Combiflam (Ibuprofen + Paracetamol)** or **Paracetamol 650mg** after meals.
   - **Calcium + Vitamin D3 (Shelcal 500)** daily for joint health.
   - Apply topical analgesic gel (Diclofenac / Volini).

2. **Supportive Care:**
   - Warm compress application for 15 minutes.
   - Rest adequately and avoid strenuous physical lifting.`;
    }
  }

  // Default fallback
  if (isHindi) {
    return `नमस्ते! 🙏 मैं आपका **CareSync AI Health & Medicine Assistant** हूँ।
आप मुझसे किसी भी लक्षण, बीमारी (बुखार, सिर दर्द, खांसी, पेट दर्द), दवाइयों की खुराक (Paracetamol, Pan-40 आदि) या अपनी लैब रिपोर्ट के बारे में हिंदी या English में पूछ सकते हैं। नीचे सेंटर माइक बटन दबाकर बोलें!`;
  } else {
    return `Hello! 🙏 I am your **CareSync AI Health & Clinical Assistant**.
You can ask me about symptoms, medications (dosages, side effects, precautions), or attach diagnostic lab reports in English or Hindi. Press the Center Microphone button below to speak!`;
  }
};

const SymptomChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: 'Namaste! I am your CareSync Voice & Vision AI Assistant. You can speak with me in Hindi or English, ask about any medicines or symptoms, or attach your medical lab reports.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [attachedFile, setAttachedFile] = useState(null); // { name, base64, mimeType, preview }
  const [voiceStatusText, setVoiceStatusText] = useState('');

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);

  // Humanized Speech Synthesis with natural acoustic tuning
  const speakText = (text) => {
    if (!isVoiceEnabled) return;
    playHumanVoice(text);
  };

  // Helper to send query and auto-reply
  const handleProcessQuery = async (queryText, currentAttachment = null) => {
    const textToProcess = (queryText || '').trim() || (currentAttachment ? `Attached report: ${currentAttachment.name}` : '');
    if (!textToProcess) return;

    setInput('');
    setVoiceStatusText('');
    setAttachedFile(null);
    currentTranscriptRef.current = '';

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        text: textToProcess,
        attachment: currentAttachment
      }
    ]);
    setIsLoading(true);

    try {
      const payload = {
        message: textToProcess,
        chat_history: messages.slice(-4).map(m => ({ role: m.type === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
        image: currentAttachment?.base64 || null,
        mimeType: currentAttachment?.mimeType || null
      };

      const socketOrHttpUrl = backendUrl || 'http://localhost:8080';
      const response = await axios.post(`${socketOrHttpUrl}/api/user/ai/chatbot`, payload, { timeout: 8000 });

      if (response.data?.success && response.data.data?.reply) {
        const replyText = response.data.data.reply;
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            text: replyText
          },
        ]);
        speakText(replyText);
      } else {
        const fallback = generateSmartMedicalAnswer(textToProcess);
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), type: 'bot', text: fallback }
        ]);
        speakText(fallback);
      }
    } catch (error) {
      console.error('Error assessing query, using smart clinical responder:', error);
      const smartReply = generateSmartMedicalAnswer(textToProcess);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), type: 'bot', text: smartReply }
      ]);
      speakText(smartReply);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Speech Recognition with Auto-Analyze on Voice Silence
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Recognizes Hindi, Hinglish, and English seamlessly

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const spokenText = finalTranscript || interimTranscript;
        if (spokenText) {
          currentTranscriptRef.current = spokenText;
          setInput(spokenText);
          setVoiceStatusText('🎙️ Sun rahe hain...');

          // Reset silence timer on every detected syllable
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // When user pauses speaking for 850ms, auto-trigger instant analysis!
          silenceTimerRef.current = setTimeout(() => {
            const queryToExecute = currentTranscriptRef.current.trim();
            if (queryToExecute) {
              setVoiceStatusText('⚡ Turant analysis shuru ho raha hai...');
              toast.success(`⚡ Auto-analyzing: "${queryToExecute}"`);
              if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
              }
              setIsListening(false);
              handleProcessQuery(queryToExecute, attachedFile);
            }
          }, 850);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          setVoiceStatusText('');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If transcript exists and silence timer didn't fire yet, execute immediately
        const queryToExecute = currentTranscriptRef.current.trim();
        if (queryToExecute) {
          setVoiceStatusText('⚡ Turant analysis shuru ho raha hai...');
          handleProcessQuery(queryToExecute, attachedFile);
        } else {
          setVoiceStatusText('');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [messages, attachedFile]);

  // Toggle Voice Input Mic
  const toggleListening = () => {
    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      setVoiceStatusText('');
      const queryToExecute = currentTranscriptRef.current.trim();
      if (queryToExecute) {
        handleProcessQuery(queryToExecute, attachedFile);
      }
    } else {
      if (recognitionRef.current) {
        try {
          currentTranscriptRef.current = '';
          setInput('');
          setVoiceStatusText('🎙️ Bolna shuru karein...');
          recognitionRef.current.start();
          setIsListening(true);
          toast.info('🎙️ Sun rahe hain... Bolna band karte hi turant analyze hoga!');
        } catch (err) {
          console.warn('Recognition start error:', err);
          setIsListening(false);
        }
      } else {
        toast.info('Speech recognition is not supported in this browser. Please type your message.');
      }
    }
  };

  // Handle Report File Upload (Images & PDFs)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.warning('Please select a file under 5MB.');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setAttachedFile({
        name: file.name,
        base64: base64,
        mimeType: file.type || 'image/jpeg',
        preview: file.type.startsWith('image/') ? base64 : null
      });
      toast.success(`📎 Report attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;
    handleProcessQuery(input, attachedFile);
  };

  const quickPrompts = [
    { label: '🌡️ Bukhar ki Dawai', query: 'bukhar ki dawai btao' },
    { label: '💆 Sar Dard Relief', query: 'sar dard ki dawai btao' },
    { label: '🤧 Khansi & Jukham', query: 'khansi aur jukham ki dawai btao' },
    { label: '🩺 Pet Dard & Gas', query: 'pet dard aur acidity ki dawai' },
    { label: '🩸 Sugar & BP Guidelines', query: 'sugar aur blood pressure ke nuskhe btao' }
  ];

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-24px)] sm:w-[430px] max-w-[430px] h-[82vh] sm:h-[600px] max-h-[620px] mb-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600/15 via-indigo-500/10 to-transparent border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0071e3] to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    CareSync Voice AI <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </h3>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Voice Hindi &amp; English • Medicines • Symptoms • Report OCR
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Voice Output Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const newVoice = !isVoiceEnabled;
                    setIsVoiceEnabled(newVoice);
                    if (!newVoice) stopHumanVoice();
                    toast.info(newVoice ? '🔊 Voice output enabled' : '🔇 Voice output muted');
                  }}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isVoiceEnabled ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title={isVoiceEnabled ? 'Mute Voice' : 'Enable Voice'}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    stopHumanVoice();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="space-y-1.5 max-w-[84%]">
                    {/* Attached Image Preview */}
                    {msg.attachment?.preview && (
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <img src={msg.attachment.preview} alt="uploaded report" className="w-full max-h-36 object-contain rounded-lg" />
                        <span className="text-[9px] text-zinc-400 block mt-1 font-semibold truncate">{msg.attachment.name}</span>
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-[#0071e3] to-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/15'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150 rounded-tl-none border border-zinc-200/60 dark:border-zinc-700/60 whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.type === 'bot' && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          onClick={() => speakText(msg.text)}
                          className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" /> Speak Out (Sunne ke liye click karein)
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.type === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                    <span className="ml-1 text-[11px] font-semibold text-primary">Diagnosing in Hindi &amp; English...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-1.5 bg-zinc-50/80 dark:bg-zinc-950/80 border-t border-zinc-100 dark:border-zinc-850 flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleProcessQuery(p.query)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-primary hover:border-primary whitespace-nowrap transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* STYLED CENTER VOICE STATION BAR */}
            <div className="p-3 bg-gradient-to-b from-blue-50/70 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 border-t border-blue-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-1.5 flex-shrink-0 shadow-inner">
              
              <button
                type="button"
                onClick={toggleListening}
                className={`relative px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-red-500/30 animate-pulse ring-4 ring-red-400/40'
                    : 'bg-gradient-to-r from-[#0071e3] via-blue-600 to-indigo-600 text-white shadow-blue-500/25 hover:scale-[1.02] ring-2 ring-blue-500/20'
                }`}
              >
                {/* Voice Equalizer waves */}
                {isListening ? (
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3.5 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-5 bg-white rounded-full animate-bounce delay-75"></span>
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 h-2.5 bg-white rounded-full animate-bounce delay-100"></span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Mic className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <span className="tracking-wide font-extrabold text-[11px] sm:text-xs">
                  {isListening ? '🔴 Sun rahe hain... Abhi bolein' : '🎙️ Tap to Speak (Hindi / English)'}
                </span>

                {isListening && (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                )}
              </button>

              <p className="text-[9px] text-zinc-400 font-medium">
                {isListening ? 'Bolne ke baad text auto-convert hokar turant answer milega' : 'Bolo: "Bukhar ki dawai btao", "Sardard", ya "Medicine info"'}
              </p>
            </div>

            {/* Attached file preview bar before sending */}
            {attachedFile && (
              <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex justify-between items-center text-xs flex-shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-bold text-primary truncate max-w-[170px] sm:max-w-[240px]">{attachedFile.name}</span>
                </div>
                <button onClick={() => setAttachedFile(null)} className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Text Input & Controls */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 flex-shrink-0"
            >
              {/* File / Report Upload Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Lab Report / Medicine Image"
                className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer flex-shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Type question or use center Mic..."}
                className={`flex-1 bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-zinc-100 ${
                  isListening ? 'border-red-500 animate-pulse text-red-600 dark:text-red-400' : 'border-zinc-200 dark:border-zinc-700'
                }`}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !attachedFile)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#0071e3] to-blue-600 text-white flex items-center justify-center hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0071e3] to-blue-700 text-white shadow-2xl flex items-center justify-center cursor-pointer relative group"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:animate-none"></div>
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <Bot className="w-6 h-6 relative z-10" />}
      </motion.button>
    </div>
  );
};

export default SymptomChecker;
