import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Bot, 
  Sparkles, 
  Pill, 
  Apple, 
  FileText, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  Upload,
  X,
  Search,
  Calendar,
  UserCheck,
  Stethoscope,
  Info
} from 'lucide-react'

const AiHub = () => {
  const { backendUrl, token, userData } = useContext(AppContext)

  // Sub-tools active tab inside the right-hand side box: 'medicine', 'diet', 'reports'
  const [activeToolTab, setActiveToolTab] = useState('medicine')

  // Voice States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  // Chatbot State
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { 
      sender: 'ai', 
      text: 'Namaste! 🙏 I am your CareSync AI Clinical Assistant.\n\nYou can ask me in **Hindi or English** about:\n• 💊 **Medicine Differences & Dosages** (e.g. Dolo vs Paracetamol, Pan-40 vs Omez)\n• 📅 **Your Scheduled Appointments & Visit Reason**\n• 👨‍⚕️ **Doctor Specialist Guidance** for any symptoms\n• 📄 **Medical Reports & Diagnostics**' 
    }
  ])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatFile, setChatFile] = useState(null)
  const chatFileInputRef = useRef(null)
  const chatBottomRef = useRef(null)

  // Medicine State (Right Side Box)
  const [medQuery, setMedQuery] = useState('')
  const [medResult, setMedResult] = useState(null)
  const [isMedLoading, setIsMedLoading] = useState(false)

  // Diet State (Right Side Box)
  const [dietConditions, setDietConditions] = useState([])
  const [dietGoal, setDietGoal] = useState('')
  const [dietResult, setDietResult] = useState(null)
  const [isDietLoading, setIsDietLoading] = useState(false)

  // Reports State (Right Side Box)
  const [reportText, setReportText] = useState('')
  const [reportResult, setReportResult] = useState(null)
  const [isReportLoading, setIsReportLoading] = useState(false)
  const [reportFile, setReportFile] = useState(null)
  const reportFileInputRef = useRef(null)

  const predefinedConditions = [
    'Diabetes Type-2',
    'Hypertension',
    'High Cholesterol',
    'Acid Reflux (GERD)',
    'General Weight Management'
  ]

  const [detectedLang, setDetectedLang] = useState('en')
  const [liveVoiceStatus, setLiveVoiceStatus] = useState('')

  // EXACTLY 3 COMPACT ENGLISH SUGGESTIONS
  const compactSuggestions = [
    { 
      label: '💊 Compare Dolo vs Paracetamol', 
      query: 'What is the difference between Dolo 650 and Paracetamol 500mg?' 
    },
    { 
      label: '📅 My Appointments & Visit Reason', 
      query: 'When is my appointment and what is the reason for my visit?' 
    },
    { 
      label: '🩺 Doctor Specialist Recommendation', 
      query: 'Which doctor specialist should I consult for my symptoms?' 
    }
  ]

  // Helper to detect Hindi / Hinglish vs English
  const isHindiInput = (text) => {
    return /[\u0900-\u097F]|\b(kya|kyu|kaise|kaha|kab|dawai|dawa|upchar|ilaj|kripya|namaste|namaskar|bukhar|sar\s*dard|sir\s*dard|pet\s*dard|badan\s*dard|khansi|jukham|btao|batao|bataiye|chahiye|mein|me|lein|lena|hain|hai|rahe|karein|kare|gharelu|nuskhe|jalan|dast|ulti|pet|goli|tablet|mariz|sujhao|samjhao|kariye|karo|hota|hoti|hote|peena|khana|khao|khaye|khayein|kisliye|aaye)\b/i.test(text || '')
  }

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isChatLoading])

  // Initialize Text-to-Speech (Hindi & English Bilingual Auto-Switching)
  const speakText = (text) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const cleanText = text.replace(/[*_#`[\]]/g, '').slice(0, 350)
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.lang = isHindiInput(cleanText) ? 'hi-IN' : 'en-IN'
      window.speechSynthesis.speak(utterance)
    } catch (err) {
      console.warn(err)
    }
  }

  const silenceTimerRef = useRef(null)
  const currentTranscriptRef = useRef('')

  // Initialize Speech Recognition (Bilingual hi-IN / en-IN with Auto-Analyze on Silence)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'hi-IN' // Understands Hindi, Hinglish, and English seamlessly

      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        const spokenText = finalTranscript || interimTranscript
        if (spokenText) {
          currentTranscriptRef.current = spokenText
          setDetectedLang(isHindiInput(spokenText) ? 'hi' : 'en')
          setLiveVoiceStatus('🎙️ Listening (सुन रहे हैं)...')
          setChatMessage(spokenText)

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

          // Auto-trigger analysis when user stops speaking for 850ms
          silenceTimerRef.current = setTimeout(() => {
            const queryToRun = currentTranscriptRef.current.trim()
            if (queryToRun) {
              setLiveVoiceStatus('⚡ Auto-analyzing clinical query...')
              toast.success(`⚡ Analyzing: "${queryToRun}"`)
              try { recognition.stop() } catch (e) {}
              setIsListening(false)
              triggerChatMessage(queryToRun, chatFile)
            }
          }, 850)
        }
      }

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          setIsListening(false)
          setLiveVoiceStatus('')
        }
      }
      recognition.onend = () => {
        setIsListening(false)
        const queryToRun = currentTranscriptRef.current.trim()
        if (queryToRun) {
          setLiveVoiceStatus('⚡ Auto-analyzing...')
          triggerChatMessage(queryToRun, chatFile)
        } else {
          setLiveVoiceStatus('')
        }
      }
      recognitionRef.current = recognition
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [chatFile])

  const toggleListening = () => {
    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch (e) {}
      }
      setIsListening(false)
      setLiveVoiceStatus('')
      const queryToRun = currentTranscriptRef.current.trim()
      if (queryToRun) {
        triggerChatMessage(queryToRun, chatFile)
      }
    } else {
      if (recognitionRef.current) {
        try {
          currentTranscriptRef.current = ''
          setChatMessage('')
          setLiveVoiceStatus('🎙️ Speak now (बोलना शुरू करें)...')
          recognitionRef.current.start()
          setIsListening(true)
          toast.info('🎙️ Listening... Auto-analyzes as soon as you stop speaking!')
        } catch (e) {
          setIsListening(false)
        }
      } else {
        toast.info('Speech recognition is not supported in this browser.')
      }
    }
  }

  // Trigger Chat Query with specific text & Token
  const triggerChatMessage = async (userText, attachment = null) => {
    if (!userText && !attachment) return
    setChatHistory(prev => [...prev, { sender: 'user', text: userText || `Attached file: ${attachment?.name}`, attachment }])
    setChatMessage('')
    setChatFile(null)
    currentTranscriptRef.current = ''
    setIsChatLoading(true)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai/chatbot`,
        { 
          message: userText, 
          chat_history: chatHistory.slice(-6),
          image: attachment?.base64 || null,
          mimeType: attachment?.mimeType || null,
          userId: userData?._id || null
        },
        {
          headers: token ? { token } : {}
        }
      )
      if (data.success && data.data) {
        setChatHistory(prev => [...prev, { sender: 'ai', text: data.data.reply }])
        speakText(data.data.reply)
      }
    } catch (err) {
      toast.error('AI chat module is currently offline.')
    } finally {
      setIsChatLoading(false)
      setLiveVoiceStatus('')
    }
  }

  // Trigger Medicine Query (Right Side Tool)
  const triggerMedicineQuery = async (medicineName) => {
    if (!medicineName) return
    setIsMedLoading(true)
    setMedResult(null)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai/medicine-info`,
        { medicine_name: medicineName },
        { headers: token ? { token } : {} }
      )
      if (data.success && data.data) {
        setMedResult(data.data)
        speakText(`${medicineName}: ${data.data.description || 'Information loaded'}`)
      }
    } catch (err) {
      toast.error('Medicine info service offline.')
    } finally {
      setIsMedLoading(false)
    }
  }

  const handleToggleCondition = (cond) => {
    if (dietConditions.includes(cond)) {
      setDietConditions(dietConditions.filter(c => c !== cond))
    } else {
      setDietConditions([...dietConditions, cond])
    }
  }

  // Handle Chatbot Image/File Attachment
  const handleChatFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setChatFile({
        name: file.name,
        base64: reader.result,
        mimeType: file.type || 'image/jpeg'
      })
      toast.success(`📎 Attached: ${file.name}`)
    }
    reader.readAsDataURL(file)
  }

  // Handle Report Upload in Report Tool
  const handleReportFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setReportFile({
        name: file.name,
        base64: reader.result,
        mimeType: file.type || 'image/jpeg'
      })
      toast.success(`📄 Report file loaded: ${file.name}`)
    }
    reader.readAsDataURL(file)
  }

  // API 1: Chatbot submit
  const handleSendChat = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim() && !chatFile) return
    triggerChatMessage(chatMessage.trim(), chatFile)
  }

  // API 2: Medicine Info submit
  const handleMedSearch = async (e) => {
    e.preventDefault()
    if (!medQuery.trim()) return
    triggerMedicineQuery(medQuery.trim())
  }

  // API 3: Diet & Nutrition submit
  const handleDietSubmit = async (e) => {
    e.preventDefault()
    setIsDietLoading(true)
    setDietResult(null)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai/diet-nutrition`,
        { health_conditions: dietConditions, goals: dietGoal || 'Balanced health' },
        { headers: token ? { token } : {} }
      )
      if (data.success && data.data) {
        setDietResult(data.data)
      }
    } catch (err) {
      toast.error('Diet Planner offline.')
    } finally {
      setIsDietLoading(false)
    }
  }

  // API 4: Report summary submit
  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (!reportText.trim() && !reportFile) {
      return toast.warning('Please paste report text or upload a report document.')
    }
    setIsReportLoading(true)
    setReportResult(null)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai/report-summary`,
        { 
          report_text: reportText,
          image: reportFile?.base64 || null,
          mimeType: reportFile?.mimeType || null
        },
        { headers: token ? { token } : {} }
      )
      if (data.success && data.data) {
        setReportResult(data.data)
        speakText(`Lab Report Summary: ${data.data.summary}`)
      }
    } catch (err) {
      toast.error('Report summary offline.')
    } finally {
      setIsReportLoading(false)
    }
  }

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      
      {/* ========================================================================= */}
      {/* 🌟 HEADER & VOICE TOGGLE */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-primary" /> CareSync AI Clinical Intelligence
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Bilingual Voice Consultation (Hindi &amp; English) • Real-time Patient Appointment Context • Clinical Medicine Comparisons
          </p>
        </div>

        {/* Voice Speech Output Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const newVoice = !isVoiceEnabled
              setIsVoiceEnabled(newVoice)
              if (!newVoice && 'speechSynthesis' in window) window.speechSynthesis.cancel()
              toast.info(newVoice ? '🔊 Voice narration enabled' : '🔇 Voice narration muted')
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isVoiceEnabled ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{isVoiceEnabled ? 'Voice Output ON' : 'Voice Output OFF'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎙️ CENTRAL VOICE AI STATION (Pulsating Mic + 3 Compact English Suggestions) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-purple-900/10 dark:from-blue-950/40 dark:via-zinc-900 dark:to-purple-950/30 border border-blue-200/60 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 text-center shadow-lg">
        
        {/* Ambient Top Indicator */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-blue-200/40 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isListening ? 'bg-red-400' : 'bg-green-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isListening ? 'bg-red-500' : 'bg-green-500'}`}></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">
              CareSync Voice AI Studio
            </span>
          </div>

          {/* Dynamic Language Mirroring Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs">
            <span className="text-xs">{detectedLang === 'hi' ? '🇮🇳' : '🌐'}</span>
            <span className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200">
              {detectedLang === 'hi' ? 'Hindi Mode (हिंदी)' : 'English Mode'}
            </span>
          </div>
        </div>

        {/* Center Big Animated Microphone Button */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-40 h-40 rounded-full bg-red-500/20 animate-ping"></div>
                <div className="absolute w-32 h-32 rounded-full bg-red-500/30 animate-pulse"></div>
              </>
            )}

            {!isListening && (
              <div className="absolute w-28 h-28 rounded-full bg-blue-500/15 animate-pulse"></div>
            )}

            {/* BIG CENTRAL MICROPHONE BUTTON */}
            <button
              type="button"
              onClick={toggleListening}
              className={`relative z-10 w-22 h-22 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 cursor-pointer active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white ring-6 ring-red-400/40 shadow-red-500/50 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-[#0071e3] via-blue-600 to-indigo-600 text-white ring-4 ring-blue-500/20 shadow-blue-500/40 hover:scale-105'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-9 h-9 animate-bounce" />
                  <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 drop-shadow-md" />
                  <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Tap To Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="mt-3">
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
              {isListening ? (
                <span className="text-red-600 dark:text-red-400">
                  🔴 Listening to your voice... (Auto-analyzes on silence)
                </span>
              ) : (
                <span>
                  Speak or Type in Hindi or English — <span className="text-primary font-bold">Auto-Detected</span>
                </span>
              )}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {liveVoiceStatus || (isListening ? '⚡ Stop speaking to trigger instant analysis' : 'Ask about medicine differences, appointments, visit reasons, or doctor advice')}
            </p>
          </div>
        </div>

        {/* 🌟 EXACTLY 3 CLEAN, COMPACT ENGLISH SUGGESTIONS */}
        <div className="mt-3 pt-3 border-t border-blue-200/40 dark:border-zinc-800">
          <div className="flex flex-wrap justify-center gap-2">
            {compactSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => triggerChatMessage(s.query)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-primary hover:border-primary hover:scale-[1.02] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>{s.label}</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 2-COLUMN COHESIVE WORKSPACE */}
      {/* Left (Col 7/8): Full Clinical AI Chat Box */}
      {/* Right (Col 5/4): Clinical Tools & Details Box (Medicine, Diet, Reports) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 💬 LEFT COLUMN: MAIN AI CHAT CONVERSATION BOX */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex flex-col h-[620px]">
          
          {/* Chat Window Header */}
          <div className="flex items-center justify-between border-b pb-3 border-zinc-100 dark:border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">CareSync Clinical Chat</h3>
                <p className="text-[10px] text-zinc-400">Doctor info, medicine comparisons &amp; appointment tracking</p>
              </div>
            </div>

            {userData && (
              <span className="text-[10px] bg-blue-500/10 text-primary font-bold px-2.5 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> {userData.name}
              </span>
            )}
          </div>

          {/* Scrollable Chat Message History */}
          <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-zinc-50/80 dark:bg-zinc-950/80 rounded-2xl mb-3 border border-zinc-200/60 dark:border-zinc-800 text-xs no-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3.5 rounded-2xl max-w-[88%] sm:max-w-md leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white font-medium shadow-sm' 
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 whitespace-pre-line shadow-xs'
                }`}>
                  {msg.text}
                  {msg.sender === 'ai' && (
                    <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                      <button onClick={() => speakText(msg.text)} className="text-[10px] text-primary font-bold flex items-center gap-1 cursor-pointer">
                        <Volume2 className="w-3 h-3" /> Replay Voice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-400 flex items-center gap-2 shadow-xs">
                  <Clock className="w-3.5 h-3.5 animate-spin text-primary" /> Analyzing clinical context...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Attached file chip if selected */}
          {chatFile && (
            <div className="px-3 py-1.5 mb-2 bg-primary/10 border border-primary/20 rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-primary truncate max-w-xs">📎 Attached: {chatFile.name}</span>
              <button onClick={() => setChatFile(null)} className="p-0.5 text-zinc-400 hover:text-red-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Chat Form with Voice & Attachment Trigger */}
          <form onSubmit={handleSendChat} className="flex gap-2 items-center pt-1">
            <input
              ref={chatFileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleChatFileUpload}
            />
            <button
              type="button"
              onClick={() => chatFileInputRef.current?.click()}
              title="Attach Medical Document or Prescription Photo"
              className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer flex-shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={isListening ? "🎙️ Listening to voice..." : "Ask medicine differences, appointment details, doctor advice..."}
              className={`flex-1 p-2.5 bg-white dark:bg-zinc-950 border rounded-xl text-xs focus:outline-none dark:text-white ${
                isListening ? 'border-red-500 animate-pulse text-red-500' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            />

            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                isListening ? 'bg-red-600 text-white animate-bounce' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-primary" />}
            </button>

            <button 
              type="submit" 
              className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-sm hover:scale-[1.02] transition-all cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* 📋 RIGHT COLUMN: CLINICAL TOOLS & DETAILS BOX (Medicine, Diet, Reports) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex flex-col h-[620px] overflow-hidden">
          
          {/* Header & Tab Selector Strip */}
          <div className="border-b pb-3 border-zinc-100 dark:border-zinc-800 mb-3">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Clinical Tools &amp; Details
              </h3>
              <span className="text-[10px] text-zinc-400 font-medium">Add details &amp; analyze</span>
            </div>

            {/* 3 Modern Tab Buttons */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold">
              <button 
                onClick={() => setActiveToolTab('medicine')}
                className={`py-1.5 px-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  activeToolTab === 'medicine' ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary' : 'text-zinc-500'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                <span className="truncate">Medicine</span>
              </button>
              <button 
                onClick={() => setActiveToolTab('diet')}
                className={`py-1.5 px-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  activeToolTab === 'diet' ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary' : 'text-zinc-500'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span className="truncate">Diet Plan</span>
              </button>
              <button 
                onClick={() => setActiveToolTab('reports')}
                className={`py-1.5 px-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  activeToolTab === 'reports' ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary' : 'text-zinc-500'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate">Lab OCR</span>
              </button>
            </div>
          </div>

          {/* Tab Content Area (Scrollable within the box) */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar text-xs">
            
            {/* TOOL 1: MEDICINE DETAILS & LOOKUP */}
            {activeToolTab === 'medicine' && (
              <div className="space-y-4">
                <form onSubmit={handleMedSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Medicine name (e.g. Pan 40, Dolo 650, Metformin)..."
                      value={medQuery}
                      onChange={(e) => setMedQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 dark:text-white rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isMedLoading}
                    className="px-3 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl cursor-pointer flex-shrink-0"
                  >
                    {isMedLoading ? '...' : 'Check'}
                  </button>
                </form>

                {medResult ? (
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3 bg-zinc-50/70 dark:bg-zinc-950/70">
                    <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-primary" /> {medQuery} Details
                      </h4>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">Clinical Data</span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <span className="font-bold text-zinc-400 uppercase text-[9px]">Description &amp; Action</span>
                        <p className="text-zinc-700 dark:text-zinc-300 mt-0.5 leading-relaxed">{medResult.description}</p>
                      </div>
                      <div>
                        <span className="font-bold text-red-500 uppercase text-[9px]">Side Effects</span>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400 mt-0.5 pl-1">
                          {medResult.side_effects?.map((se, idx) => <li key={idx}>{se}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-amber-500 uppercase text-[9px]">Precautions &amp; Warnings</span>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400 mt-0.5 pl-1">
                          {medResult.interactions?.map((it, idx) => <li key={idx}>{it}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-primary uppercase text-[9px]">Dosage Guide</span>
                        <p className="text-zinc-800 dark:text-zinc-200 mt-0.5 font-bold">"{medResult.typical_dosage}"</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerChatMessage(`Tell me more about ${medQuery} and compare it with alternatives.`)}
                        className="w-full mt-2 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-center cursor-pointer transition-colors text-[11px]"
                      >
                        Ask AI Chat to compare {medQuery} ➔
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center space-y-2">
                    <Pill className="w-7 h-7 text-zinc-300 dark:text-zinc-700" />
                    <p className="font-medium text-xs">Search any medicine to view dosage, mechanism &amp; interactions</p>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 2: CLINICAL DIET PLANNER */}
            {activeToolTab === 'diet' && (
              <div className="space-y-3.5">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">Select Conditions:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {predefinedConditions.map(cond => {
                      const isChecked = dietConditions.includes(cond)
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => handleToggleCondition(cond)}
                          className={`text-left px-2.5 py-1.5 border rounded-xl font-medium cursor-pointer transition-colors text-[11px] ${
                            isChecked 
                              ? 'bg-primary/10 border-primary text-primary font-bold' 
                              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {cond}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Health Goal:</label>
                  <input
                    type="text"
                    placeholder="e.g. Lower fasting glucose, weight control"
                    value={dietGoal}
                    onChange={(e) => setDietGoal(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleDietSubmit}
                  disabled={isDietLoading}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl cursor-pointer shadow-sm text-xs"
                >
                  {isDietLoading ? 'Creating Plan...' : 'Generate Diet Guidelines'}
                </button>

                {dietResult && (
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/70 space-y-3">
                    <h4 className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Apple className="w-4 h-4 text-emerald-500" /> Custom Nutrition Protocol
                    </h4>
                    
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[9px]">Recommended Foods</span>
                      <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300 mt-0.5 pl-1">
                        {dietResult.recommended_foods?.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-red-500 uppercase text-[9px]">Foods to Avoid</span>
                      <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300 mt-0.5 pl-1">
                        {dietResult.avoid_foods?.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <span className="font-bold text-zinc-400 uppercase text-[9px]">Sample Meal Schedule</span>
                      <p className="text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        "{dietResult.meal_plan_suggestion}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 3: LAB REPORT OCR & EXPLAINER */}
            {activeToolTab === 'reports' && (
              <div className="space-y-3.5">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Upload Lab Report Photo / PDF:</label>
                  <input
                    ref={reportFileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleReportFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => reportFileInputRef.current?.click()}
                    className="w-full p-2.5 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary rounded-xl text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2 cursor-pointer bg-zinc-50 dark:bg-zinc-950 transition-colors text-xs"
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>{reportFile ? reportFile.name : 'Choose Report Image'}</span>
                  </button>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Or Paste Test Metrics:</label>
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="e.g. Fasting Glucose: 135 mg/dL, HbA1c: 7.2%, Hemoglobin: 13.0 g/dL..."
                    className="w-full h-24 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none dark:text-white text-[11px]"
                  />
                </div>

                <button
                  onClick={handleReportSubmit}
                  disabled={isReportLoading}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl cursor-pointer shadow-sm text-xs"
                >
                  {isReportLoading ? 'Analyzing Report...' : 'Analyze & Explain Report'}
                </button>

                {reportResult && (
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/70 space-y-3">
                    <h4 className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary" /> Diagnostic Summary
                    </h4>

                    <div>
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        "{reportResult.summary}"
                      </p>
                    </div>

                    {reportResult.abnormal_values?.length > 0 && (
                      <div>
                        <span className="font-bold text-red-500 uppercase text-[9px]">Abnormal / Flagged Markers</span>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300 mt-0.5 pl-1">
                          {reportResult.abnormal_values.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => triggerChatMessage(`Explain my lab report findings in detail: ${reportResult.summary}`)}
                      className="w-full mt-2 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-center cursor-pointer transition-colors text-[11px]"
                    >
                      Discuss with AI Doctor in Chat ➔
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}

export default AiHub
