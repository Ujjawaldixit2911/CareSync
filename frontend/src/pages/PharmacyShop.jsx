import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Pill, 
  Search, 
  ClipboardList, 
  Check, 
  Activity, 
  Plus, 
  Minus,
  Sparkles,
  ArrowRight,
  X,
  Thermometer,
  Heart,
  ShieldAlert,
  Flame,
  Wind,
  Bot,
  Send,
  AlertTriangle,
  FileText,
  HelpCircle,
  Clock,
  Info,
  Layers,
  ArrowDownUp,
  ShoppingCart,
  Trash2,
  CreditCard,
  Truck,
  CheckCircle2,
  Package,
  Volume2,
  VolumeX,
  Mic,
  MicOff
} from 'lucide-react'
import { playHumanVoice, stopHumanVoice } from '../utils/humanVoice'

const PharmacyShop = () => {
  const { backendUrl, token, userData, slotDateFormat } = useContext(AppContext)

  // Sub-sections navigation: 'finder', 'checker', 'prescriptions'
  const [activeTab, setActiveTab] = useState('finder')

  // Catalog State
  const [medicines, setMedicines] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedDisease, setSelectedDisease] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Shopping Cart State
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery'
  })

  // Clinical Guide Modal
  const [selectedMedicine, setSelectedMedicine] = useState(null)

  // Drug Interaction Checker State
  const [checkerDrugs, setCheckerDrugs] = useState(['', ''])
  const [checkerResult, setCheckerResult] = useState(null)
  const [isCheckerLoading, setIsCheckerLoading] = useState(false)

  // Consultation Prescriptions State
  const [userPrescriptions, setUserPrescriptions] = useState([])
  const [isPrescLoading, setIsPrescLoading] = useState(false)

  // AI Advisor Chat State
  const [aiQuery, setAiQuery] = useState('')
  const [aiReply, setAiReply] = useState(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      return toast.warn('Speech recognition not supported in this browser.')
    }
    if (isListening) {
      setIsListening(false)
      return
    }
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'hi-IN'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)
      recognition.onresult = (e) => {
        const spoken = e.results[0][0].transcript
        if (spoken) {
          setAiQuery(spoken)
          toast.success(`🎙️ Heard: "${spoken}"`)
        }
      }
      recognition.start()
    } catch (err) {
      setIsListening(false)
    }
  }

  // Set default checkout info from logged in user if available
  useEffect(() => {
    if (userData) {
      setCheckoutForm(prev => ({
        ...prev,
        name: userData.name || '',
        phone: userData.phone || '',
        address: typeof userData.address === 'object' ? `${userData.address.line1 || ''}, ${userData.address.line2 || ''}` : userData.address || ''
      }))
    }
  }, [userData])

  // Fetch medicines catalog
  const fetchMedicines = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/pharmacy/list?search=${search}&category=${category}&disease=${selectedDisease}`
      )
      if (data.success) {
        setMedicines(data.medicines)
      }
    } catch (err) {
      toast.error('Failed to load medicine database.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Doctor Prescriptions from Appointments
  const fetchUserPrescriptions = async () => {
    if (!token) return
    setIsPrescLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) {
        const prescriptions = data.appointments.filter(
          appt => appt.isCompleted && appt.prescription && appt.prescription.length > 0
        )
        setUserPrescriptions(prescriptions)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsPrescLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [search, category, selectedDisease])

  useEffect(() => {
    if (token) {
      fetchUserPrescriptions()
    }
  }, [token])

  // Cart Handlers
  const addToCart = (med, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === med._id)
      if (existing) {
        return prev.map(item => 
          item._id === med._id ? { ...item, quantity: item.quantity + quantity } : item
        )
      } else {
        return [...prev, { ...med, quantity }]
      }
    })
    toast.success(`🛒 Added ${med.name} to cart!`)
  }

  const updateCartQty = (medId, delta) => {
    setCart(prev => 
      prev.map(item => {
        if (item._id === medId) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : null
        }
        return item
      }).filter(Boolean)
    )
  }

  const removeFromCart = (medId) => {
    setCart(prev => prev.filter(item => item._id !== medId))
    toast.info('Item removed from cart.')
  }

  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 50) * item.quantity), 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Place Order Submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return toast.warning('Your cart is empty.')
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      return toast.warning('Please enter delivery name, contact number, and address.')
    }

    setIsOrderSubmitting(true)
    try {
      const orderPayload = {
        patientId: userData?._id || 'guest_patient',
        patientName: checkoutForm.name,
        phone: checkoutForm.phone,
        address: checkoutForm.address,
        paymentMethod: checkoutForm.paymentMethod,
        paymentStatus: checkoutForm.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price || 50
        })),
        totalAmount: cartTotal
      }

      const { data } = await axios.post(`${backendUrl}/api/pharmacy/order`, orderPayload)
      if (data.success) {
        toast.success('🎉 Pharmacy order placed successfully! Delivery initiated.')
        setCart([])
        setIsCheckoutOpen(false)
        setIsCartOpen(false)
        fetchMedicines() // Refresh stock
      } else {
        toast.error(data.message || 'Order placement failed.')
      }
    } catch (err) {
      toast.error(err.message || 'Error creating order.')
    } finally {
      setIsOrderSubmitting(false)
    }
  }

  // AI Pharmacy Advisor call
  const handleAiAdvisor = async (e, overrideQuery = null) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    const activeQuery = (overrideQuery || aiQuery || '').trim()
    if (!activeQuery) return
    if (overrideQuery) setAiQuery(overrideQuery)
    setIsAiLoading(true)
    setAiReply(null)

    const medsContext = medicines.map(m => `- ${m.name} (${m.category}): treats ${m.diseases ? m.diseases.join(', ') : ''}. Generic name: ${m.genericName || m.name}`).join('\n')

    const messageToSend = `CONTEXT: You are the CareSync Clinical Medicine Advisor. Medical database:
${medsContext}

USER ENQUIRY: ${activeQuery}

INSTRUCTIONS:
1. Provide a professional, concise, clinical analysis of symptoms or medicine questions.
2. Recommend the matching drug name(s) from our database if appropriate.
3. Explain dosage, generic formulation, and precautions.
4. Wrap any suggested drug name from our database exactly in brackets, e.g. [Paracetamol 500mg] or [Metformin 850mg].`

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai/chatbot`,
        { message: messageToSend, chat_history: [] }
      )
      if (data.success && data.data) {
        const replyText = data.data.reply
        const recommendedMeds = []

        medicines.forEach(m => {
          if (replyText.toLowerCase().includes(`[${m.name.toLowerCase()}]`) || replyText.toLowerCase().includes(m.name.toLowerCase())) {
            if (!recommendedMeds.find(x => x._id === m._id)) {
              recommendedMeds.push(m)
            }
          }
        })

        const cleanReply = replyText.replace(/\[/g, '').replace(/\]/g, '')
        setAiReply({
          text: cleanReply,
          medicines: recommendedMeds
        })

        if (isVoiceEnabled) {
          playHumanVoice(cleanReply)
        }
      } else {
        toast.error('AI advisor is currently offline.')
      }
    } catch (err) {
      toast.error('AI advisor service notice.')
    } finally {
      setIsAiLoading(false)
    }
  }

  // Trigger AI explanation for a prescription
  const handleExplainPrescription = (rxList) => {
    const rxText = rxList.map(r => `${r.name} (dosage: ${r.dosage}, frequency: ${r.frequency}, duration: ${r.duration})`).join(', ')
    setAiQuery(`Please explain these prescribed medications in detail, highlighting usage, safety warnings, and potential side effects: ${rxText}`)
    setActiveTab('finder')
    setTimeout(() => {
      const chatInput = document.getElementById('ai-advisor-input')
      if (chatInput) {
        chatInput.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  // Check drug interactions using Gemini
  const handleCheckInteractions = async (e) => {
    e.preventDefault()
    const activeDrugs = checkerDrugs.filter(d => d.trim() !== '')
    if (activeDrugs.length < 2) {
      return toast.warn('Please enter at least 2 medicine names to check interactions.')
    }
    setIsCheckerLoading(true)
    setCheckerResult(null)

    const prompt = `You are a clinical pharmacologist. Analyze safety & drug-drug interactions between: ${activeDrugs.join(', ')}.
Return raw JSON format only:
{
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "summary": "Short safety status summary.",
  "mechanism": "Pharmacological mechanism of interaction, if any.",
  "precautions": ["precaution 1", "precaution 2"]
}
Do not wrap in markdown tags or backticks. Return valid JSON only.`

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai/chatbot`,
        { message: prompt, chat_history: [] }
      )
      if (data.success && data.data) {
        try {
          const cleaned = data.data.reply.replace(/```json/i, '').replace(/```/g, '').trim()
          const parsed = JSON.parse(cleaned)
          setCheckerResult(parsed)
        } catch (parseErr) {
          toast.error('Could not parse interaction report.')
        }
      }
    } catch (err) {
      toast.error('Interaction checker is currently busy.')
    } finally {
      setIsCheckerLoading(false)
    }
  }

  const addDrugInput = () => {
    if (checkerDrugs.length >= 5) return toast.warn('You can check up to 5 drugs at a time.')
    setCheckerDrugs([...checkerDrugs, ''])
  }

  const removeDrugInput = (index) => {
    if (checkerDrugs.length <= 2) return
    setCheckerDrugs(checkerDrugs.filter((_, i) => i !== index))
  }

  const updateDrugInput = (index, val) => {
    const updated = [...checkerDrugs]
    updated[index] = val
    setCheckerDrugs(updated)
  }

  const diseaseCategories = [
    { id: 'all', label: 'All Conditions', icon: Pill, color: 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300' },
    { id: 'Fever', label: 'Fever & Pain', icon: Thermometer, color: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' },
    { id: 'Diabetes', label: 'Diabetes Care', icon: Activity, color: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400' },
    { id: 'Hypertension', label: 'Blood Pressure', icon: Heart, color: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' },
    { id: 'Bacterial Infections', label: 'Infections', icon: ShieldAlert, color: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' },
    { id: 'Acidity', label: 'Acidity & GERD', icon: Flame, color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
    { id: 'Allergies', label: 'Allergy & Itch', icon: Sparkles, color: 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400' },
    { id: 'Asthma', label: 'Asthma & COPD', icon: Wind, color: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400' }
  ]

  const categories = [
    { id: 'all', label: 'All Classes', icon: Pill },
    { id: 'Analgesics & Antipyretics', label: 'Analgesics', icon: Activity },
    { id: 'Antidiabetics', label: 'Antidiabetics', icon: ArrowDownUp },
    { id: 'Antibiotics', label: 'Antibiotics', icon: Sparkles },
    { id: 'Cardiovascular', label: 'Cardiovascular', icon: Heart },
    { id: 'Gastrointestinal', label: 'Gastrointestinal', icon: Flame },
    { id: 'Antihistamines', label: 'Antihistamines', icon: Layers }
  ]

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto py-6 px-4 sm:px-6 relative">
      
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 bg-sky-600 hover:bg-sky-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        aria-label="Open Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Header Block */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 dark:border-sky-900/40 p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
              <Pill className="w-3.5 h-3.5 text-sky-500" /> CareSync Certified E-Pharmacy &amp; Drug Guide
            </div>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
              Central Hospital Pharmacy
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm font-medium max-w-2xl">
              Order verified medicines with home delivery, explore AI clinical drug guides, check multi-drug safety compatibility, and explain doctor prescriptions.
            </p>
          </div>

          {/* Cart Header Status */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-sky-500/30 dark:border-zinc-800 rounded-2xl shadow-xs cursor-pointer hover:border-sky-500 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black">
              <ShoppingCart className="w-4.5 h-4.5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-zinc-400 block">Shopping Cart</span>
              <span className="text-xs font-black text-zinc-900 dark:text-white">{cartItemCount} Items • ₹{cartTotal}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar max-w-full p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs gap-1">
        <button 
          onClick={() => setActiveTab('finder')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'finder' 
              ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20' 
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Pill className="w-3.5 h-3.5" /> Medicine Shop &amp; Catalog
        </button>

        <button 
          onClick={() => setActiveTab('checker')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'checker' 
              ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20' 
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Drug Interaction Safety Checker
        </button>

        <button 
          onClick={() => setActiveTab('prescriptions')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'prescriptions' 
              ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20' 
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" /> Doctor Prescriptions ({userPrescriptions.length})
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE VIEW */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: MEDICINE CATALOG & SHOP */}
          {activeTab === 'finder' && (
            <div className="space-y-6">
              
              {/* Shop by Health Condition Badges */}
              <div className="space-y-3 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-500 animate-pulse" /> Shop by Health Condition
                  </h3>
                  {selectedDisease !== 'all' && (
                    <button 
                      onClick={() => setSelectedDisease('all')}
                      className="text-[10px] text-sky-600 dark:text-sky-400 hover:underline font-bold cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {diseaseCategories.map((dis) => {
                    const Icon = dis.icon
                    const isSelected = selectedDisease === dis.id
                    return (
                      <button
                        key={dis.id}
                        onClick={() => {
                          setSelectedDisease(dis.id)
                          setCategory('all')
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-500/20 scale-[1.02]'
                            : `${dis.color} hover:scale-[1.01]`
                        }`}
                      >
                        <span className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-zinc-800 shadow-xs'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-bold tracking-tight leading-tight">{dis.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Search and Category Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search medicines by brand name, generic formula, or symptom (e.g. Paracetamol, sugar, fever)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-zinc-100"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.id)
                          setSelectedDisease('all')
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Medicine Grid Cards */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl h-48 animate-pulse" />
                  ))}
                </div>
              ) : medicines.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-2">
                  <Pill className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p className="text-zinc-700 dark:text-zinc-300 text-xs font-bold">No medicines matching your search criteria.</p>
                  <p className="text-zinc-400 text-[10px]">Try searching by generic formula or clearing filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {medicines.map((med) => (
                    <div 
                      key={med._id} 
                      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {med.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {med.stock > 0 ? `In Stock (${med.stock})` : 'Out of Stock'}
                          </span>
                        </div>
                        
                        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {med.name}
                        </h3>

                        <p className="text-[10px] text-zinc-400 font-bold">
                          Generic: <span className="text-zinc-600 dark:text-zinc-300 font-normal">{med.genericName || "Standard formulation"}</span>
                        </p>

                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {med.description}
                        </p>
                      </div>

                      {/* Price, Guide & Cart Buttons */}
                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-850 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-zinc-400 block font-bold uppercase">Price</span>
                            <span className="text-base font-black text-zinc-900 dark:text-white">₹{med.price || 50}</span>
                          </div>

                          <button
                            onClick={() => setSelectedMedicine(med)}
                            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" /> Details
                          </button>
                        </div>

                        <button
                          onClick={() => addToCart(med)}
                          disabled={med.stock <= 0}
                          className="w-full py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-sky-500/20 cursor-pointer active:scale-98"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTION CHECKER */}
          {activeTab === 'checker' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-sky-500 animate-pulse" /> Multi-Drug Interaction Safety Checker
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Analyze pharmacological compatibility before taking multiple medicines together.</p>
              </div>

              <form onSubmit={handleCheckInteractions} className="space-y-4">
                <div className="space-y-2">
                  {checkerDrugs.map((drug, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 w-20">Medicine {index + 1}:</span>
                      <input
                        type="text"
                        placeholder="e.g. Paracetamol, Ibuprofen, Metformin..."
                        value={drug}
                        onChange={e => updateDrugInput(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-xl focus:outline-none dark:text-zinc-100 text-xs"
                      />
                      {checkerDrugs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeDrugInput(index)}
                          className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={addDrugInput}
                    className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    + Add Another Drug
                  </button>

                  <button
                    type="submit"
                    disabled={isCheckerLoading}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCheckerLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    Run Safety Analysis
                  </button>
                </div>
              </form>

              {/* Result output */}
              {checkerResult && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden mt-6 shadow-sm">
                  <div className={`p-4 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 ${
                    checkerResult.severity === 'Severe' ? 'bg-red-500/15 text-red-600 dark:text-red-400' :
                    checkerResult.severity === 'Moderate' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-xs uppercase tracking-wider">Severity: {checkerResult.severity}</p>
                      <p className="text-[11px] opacity-90">{checkerResult.summary}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950">
                    {checkerResult.mechanism && (
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">Pharmacological Mechanism:</p>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">{checkerResult.mechanism}</p>
                      </div>
                    )}

                    {checkerResult.precautions && checkerResult.precautions.length > 0 && (
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">Clinical Precautions:</p>
                        <ul className="list-disc pl-4 space-y-1 text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {checkerResult.precautions.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCTOR PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <ClipboardList className="w-4.5 h-4.5 text-sky-500" /> Active Consultation Prescriptions
                </h3>
                <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-0.5 rounded-full font-bold border border-sky-500/20">
                  {userPrescriptions.length} Prescriptions
                </span>
              </div>

              {isPrescLoading ? (
                <div className="py-16 text-center text-xs text-zinc-400">Loading prescription vault...</div>
              ) : userPrescriptions.length === 0 ? (
                <div className="py-16 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                  <ClipboardList className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p className="font-bold text-zinc-700 dark:text-zinc-300">No consultation prescriptions found.</p>
                  <p className="text-[10px]">Completed doctor consultations with e-prescriptions will appear here automatically.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPrescriptions.map((appt) => (
                    <div 
                      key={appt._id} 
                      className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 text-xs bg-zinc-50 dark:bg-zinc-950"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Prescription ID: #{appt._id.slice(-6)}
                          </p>
                          <p className="text-[10px] text-zinc-400">Dr. {appt.docData?.name || 'Specialist'} • {slotDateFormat ? slotDateFormat(appt.slotDate) : appt.slotDate}</p>
                        </div>
                        <button
                          onClick={() => handleExplainPrescription(appt.prescription)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Explain with AI
                        </button>
                      </div>

                      <div className="space-y-2">
                        {appt.prescription.map((rx, idx) => (
                          <div 
                            key={idx} 
                            className="flex justify-between items-center p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
                          >
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-white">{rx.name}</p>
                              <p className="text-[10px] text-zinc-400">Dosage: {rx.dosage} • Frequency: {rx.frequency}</p>
                            </div>
                            <button
                              onClick={() => {
                                const matchingMed = medicines.find(m => m.name.toLowerCase().includes(rx.name.toLowerCase()))
                                if (matchingMed) addToCart(matchingMed)
                                else toast.info(`Please check catalog search for ${rx.name}`)
                              }}
                              className="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-600 hover:text-white text-sky-600 dark:text-sky-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              + Reorder
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI CLINICAL PHARMACY ADVISOR */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
                  <Bot className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                    AI Pharmacy Advisor
                  </h3>
                  <p className="text-[10px] text-zinc-400">Ask symptoms or medicines to get matched guides.</p>
                </div>
              </div>

              {/* Voice Mute / Unmute Toggle */}
              <button
                type="button"
                onClick={() => {
                  const newVoice = !isVoiceEnabled
                  setIsVoiceEnabled(newVoice)
                  if (!newVoice) stopHumanVoice()
                  toast.info(newVoice ? '🔊 Voice narration ON' : '🔇 Voice narration OFF')
                }}
                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  isVoiceEnabled ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
                title={isVoiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <form onSubmit={handleAiAdvisor} className="flex gap-2">
              <input
                id="ai-advisor-input"
                type="text"
                placeholder="Ask about fever, diabetes, pain relief..."
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 rounded-xl focus:outline-none dark:text-zinc-100 text-xs"
              />
              {/* Mic Input Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Speak your query'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                type="submit"
                disabled={isAiLoading}
                className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                {isAiLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>

            {/* Quick Query Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Paracetamol dosage',
                'Cold & Cough remedy',
                'Gastric & Acidity relief',
                'Diabetes medicine'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAiAdvisor(null, suggestion)}
                  className="px-2.5 py-1 text-[10px] font-medium bg-zinc-100 hover:bg-sky-50 dark:bg-zinc-800 dark:hover:bg-sky-950/40 text-zinc-600 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg border border-zinc-200/60 dark:border-zinc-700 transition-colors cursor-pointer"
                >
                  ⚡ {suggestion}
                </button>
              ))}
            </div>

            {aiReply ? (
              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-850 text-xs max-h-96 overflow-y-auto no-scrollbar">
                <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-zinc-400">Clinical Advice</p>
                    <button
                      type="button"
                      onClick={() => playHumanVoice(aiReply.text)}
                      className="flex items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="whitespace-pre-line text-xs">{aiReply.text}</p>
                </div>

                {aiReply.medicines && aiReply.medicines.length > 0 && (
                  <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-sky-600 dark:text-sky-400">Recommended Medicines</p>
                    <div className="space-y-1.5">
                      {aiReply.medicines.map(med => (
                        <div key={med._id} className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl">
                          <div className="truncate max-w-[65%]">
                            <p className="font-bold text-zinc-900 dark:text-white truncate text-xs">{med.name}</p>
                            <p className="text-[10px] text-zinc-400">₹{med.price || 50}</p>
                          </div>
                          <button
                            onClick={() => addToCart(med)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-sky-600 text-white hover:bg-sky-700 rounded-lg cursor-pointer transition-all"
                          >
                            + Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center text-zinc-400 text-xs flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <Bot className="w-7 h-7 text-zinc-300 dark:text-zinc-700" />
                <p className="font-bold text-zinc-600 dark:text-zinc-300">Ask Clinical AI Assistant</p>
                <p className="text-[10px] text-zinc-400 px-4">Instant answers on drug dosages, interactions, and symptom remedies.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SHOPPING CART SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div onClick={() => setIsCartOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl p-6 flex flex-col justify-between z-10 text-left">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-black text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-sky-600" /> Your Medicine Cart ({cartItemCount})
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center text-zinc-400 text-xs space-y-2">
                  <ShoppingCart className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p className="font-bold text-zinc-700 dark:text-zinc-300">Your cart is empty.</p>
                  <p className="text-[10px]">Add medicines from the catalog to proceed to delivery.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                  {cart.map((item) => (
                    <div key={item._id} className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs">
                      <div className="space-y-1 max-w-[60%]">
                        <p className="font-bold text-zinc-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-zinc-400">₹{item.price || 50} each</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-xl">
                          <button onClick={() => updateCartQty(item._id, -1)} className="p-0.5 hover:text-red-500 cursor-pointer"><Minus className="w-3 h-3" /></button>
                          <span className="font-bold px-1.5">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item._id, 1)} className="p-0.5 hover:text-emerald-500 cursor-pointer"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="p-1.5 text-zinc-400 hover:text-red-500 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Pharmacy Delivery:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span>Total Amount:</span>
                    <span className="text-sky-600 dark:text-sky-400">₹{cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" /> Proceed to Instant Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div onClick={() => setIsCheckoutOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-black text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-600" /> Delivery &amp; Payment Checkout
              </h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Patient / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.name}
                  onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  placeholder="e.g. Ujjawal Dixit"
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.phone}
                  onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Complete Delivery Address *</label>
                <textarea
                  required
                  rows="2"
                  value={checkoutForm.address}
                  onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  placeholder="House/Flat No., Street, City, Pincode"
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Payment Option *</label>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={e => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  <option value="Online UPI / QR">Online UPI / GPay / PhonePe</option>
                  <option value="Credit / Debit Card">Credit / Debit Card (Razorpay)</option>
                </select>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs">
                <span>Total Payable:</span>
                <span className="font-black text-sm text-sky-600 dark:text-sky-400">₹{cartTotal}</span>
              </div>

              <button
                type="submit"
                disabled={isOrderSubmitting}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 active:scale-98 transition-all cursor-pointer"
              >
                {isOrderSubmitting ? 'Placing Order...' : 'Confirm & Place Medicine Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CLINICAL DETAIL MODAL */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div onClick={() => setSelectedMedicine(null)} className="fixed inset-0" />
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 text-xs text-left shadow-2xl z-10">
            <div className="flex justify-between items-start border-b border-zinc-150 dark:border-zinc-800 pb-3">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-1">
                  {selectedMedicine.category}
                </span>
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-50">
                  {selectedMedicine.name}
                </h3>
                <p className="text-[10px] text-zinc-400">Generic: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{selectedMedicine.genericName || "Standard"}</span></p>
              </div>
              <button 
                onClick={() => setSelectedMedicine(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-extrabold text-[9px] uppercase tracking-wider text-zinc-400">Clinical Uses &amp; Description</p>
                <p className="text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                  {selectedMedicine.description}
                </p>
              </div>

              {selectedMedicine.sideEffects && (
                <div>
                  <p className="font-extrabold text-[9px] uppercase tracking-wider text-red-500">Possible Side Effects</p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400 mt-1">
                    {selectedMedicine.sideEffects.map((se, i) => (
                      <li key={i}>{se}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMedicine.interactions && (
                <div>
                  <p className="font-extrabold text-[9px] uppercase tracking-wider text-amber-500">Key Drug Interactions</p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400 mt-1">
                    {selectedMedicine.interactions.map((inter, i) => (
                      <li key={i}>{inter}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  addToCart(selectedMedicine)
                  setSelectedMedicine(null)
                }}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md shadow-sky-500/20"
              >
                Add {selectedMedicine.name} to Cart (₹{selectedMedicine.price || 50})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PharmacyShop
