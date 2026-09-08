import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import { assets, doctors as staticDoctors } from './assets/assets'
import RelatedDoctors from './components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Calendar as CalendarIcon, Clock, ShieldCheck, Star, Award, Heart, MessageSquare } from 'lucide-react'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedTime, setSelectedTime] = useState('')
  const [isEmergency, setIsEmergency] = useState(false)
  const [visitReason, setVisitReason] = useState('')

  const fetchDocInfo = async () => {
    const list = (doctors && doctors.length > 0) ? doctors : staticDoctors
    let doc = list.find((d) => String(d._id) === String(docId))
    if (!doc) {
      doc = staticDoctors.find((d) => String(d._id) === String(docId)) || staticDoctors[0]
    }
    if (doc) {
      setDocInfo({ 
        ...doc, 
        available: doc.available !== false,
        availableFrom: doc.availableFrom || '09:00 AM',
        availableTo: doc.availableTo || '08:00 PM',
        breakTime: doc.breakTime || '01:00 PM - 02:00 PM',
        emergencyFee: doc.emergencyFee || 150,
        slots_booked: doc.slots_booked || {} 
      })
    }
  }

  const getAvailableSlots = () => {
    if (!docInfo) return
    setDocSlots([])

    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })

        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`
        const slotTime = formattedTime

        const isSlotAvailable =
          !docInfo?.slots_booked?.[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(slotTime)

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots((prev) => [...prev, timeSlots])
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }

    if (!selectedTime) {
      return toast.warning('Please select a time slot')
    }

    const date = docSlots[selectedDayIndex][0].datetime
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const slotDate = `${day}_${month}_${year}`

    try {
      const targetDocId = docInfo?._id || docId
      const extraFee = isEmergency ? (Number(docInfo?.emergencyFee) || 150) : 0
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`, 
        { 
          docId: String(targetDocId), 
          slotDate, 
          slotTime: selectedTime,
          isEmergency,
          emergencyFee: extraFee,
          urgency: isEmergency ? 'Critical/Emergency' : 'Standard',
          notes: visitReason ? (isEmergency ? `🚨 EMERGENCY: ${visitReason}` : visitReason) : (isEmergency ? '🚨 PRIORITY EMERGENCY' : 'General Consultation')
        }, 
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message || 'Appointment requested successfully!')
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  const basePrice = Number(docInfo?.fees) || 50
  const emergencyPrice = Number(docInfo?.emergencyFee) || 150
  const totalPrice = isEmergency ? (basePrice + emergencyPrice) : basePrice

  return (
    docInfo && (
      <div className="space-y-8 text-left max-w-5xl mx-auto">
        {/* Doctor Summary Header Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-56 h-56 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 flex-shrink-0 relative">
            <img className="w-full h-full object-cover object-top" src={docInfo.image} alt={docInfo.name} loading="eager" decoding="async" />
            
            {/* Live Availability Pin on Image */}
            <div className="absolute top-2.5 right-2.5">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md ${
                docInfo.available !== false
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-zinc-700 text-zinc-200'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                {docInfo.available !== false ? 'Available' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{docInfo.name}</h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Verified Practitioner
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  docInfo.available !== false
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {docInfo.available !== false ? '● Accepting Patients' : '○ Currently Away'}
                </span>
              </div>
              <p className="text-xs text-zinc-450 dark:text-zinc-400 mt-1 font-semibold">{docInfo.degree} — {docInfo.speciality}</p>
            </div>

            {/* Doctor Consultation Hours & Break */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl text-xs space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Daily Consultation Hours:
                </span>
                <span className="font-extrabold text-primary">
                  {docInfo.availableFrom || '09:00 AM'} — {docInfo.availableTo || '08:00 PM'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Daily Break &amp; Recess:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{docInfo.breakTime || '01:00 PM - 02:00 PM'}</span>
              </div>
            </div>

            {/* Ratings & Reviews Breakdown */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{docInfo.averageRating || '5.0'}</span>
                <span className="text-zinc-400">({docInfo.ratingCount || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-600 dark:text-zinc-350">
                <Award className="w-4 h-4 text-primary" />
                <span>{docInfo.experience} Clinical Practice</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500" /> Professional Bio</h3>
              <p className="text-xs text-zinc-505 dark:text-zinc-400 leading-relaxed max-w-2xl">{docInfo.about}</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🚨 EMERGENCY / PRIORITY CONSULTATION MODE SELECTION */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span>Select Consultation Tier</span>
              </h3>
              <p className="text-[10px] text-zinc-400">Choose between standard routine slot or priority emergency appointment with surge care.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Standard Tier */}
            <div 
              onClick={() => setIsEmergency(false)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                !isEmergency 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100/50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                  🩺 Standard Clinical Visit
                </span>
                <span className="font-black text-sm text-zinc-900 dark:text-white">{currencySymbol}{basePrice}</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Standard scheduled consultation slot. Recommended for routine follow-ups, general health checkups, and non-urgent conditions.
              </p>
            </div>

            {/* Emergency Priority Tier */}
            <div 
              onClick={() => setIsEmergency(true)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                isEmergency 
                  ? 'border-rose-500 bg-rose-500/10 shadow-md ring-2 ring-rose-500/20' 
                  : 'border-rose-200 dark:border-rose-900/40 bg-zinc-50 dark:bg-zinc-950 hover:bg-rose-500/5'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  🚨 Instant Emergency / Priority
                </span>
                <div className="text-right">
                  <span className="font-black text-sm text-rose-600 dark:text-rose-400">{currencySymbol}{basePrice + emergencyPrice}</span>
                  <span className="block text-[9px] text-zinc-400">(+{currencySymbol}{emergencyPrice} Surge Fee)</span>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
                ⚡ Direct doctor notification, instant priority queue (within 15 mins), and direct critical support desk alert.
              </p>
            </div>
          </div>

          {/* Optional reason / symptom input */}
          <div className="pt-2">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 block mb-1">
              Reason for Visit / Main Problem (लक्षण या बीमारी का विवरण):
            </label>
            <input
              type="text"
              placeholder="e.g. High fever for 3 days, Chest tightness, Acidity & stomach cramps..."
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Dynamic Booking & Slots Grid */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-850 pb-3">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Select Appointment Schedule</h3>
              <p className="text-[10px] text-zinc-400">Choose date and available time slot to request a session.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {/* Days Column Headers */}
            {docSlots.map((item, index) => {
              const dateObj = item[0]?.datetime
              if (!dateObj) return null
              const isSelected = selectedDayIndex === index
              return (
                <button
                  key={index}
                  onClick={() => { setSelectedDayIndex(index); setSelectedTime(''); }}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected 
                      ? 'bg-primary border-primary text-white shadow-sm' 
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100/50'
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-wider ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                    {daysOfWeek[dateObj.getDay()]}
                  </span>
                  <span className="text-sm font-extrabold">{dateObj.getDate()}</span>
                  <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>
                    {item.length} Slots
                  </span>
                </button>
              )
            })}
          </div>

          {/* Time Slots Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-650 dark:text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Available Hours for Selected Date
            </h4>
            
            {docSlots[selectedDayIndex]?.length > 0 ? (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {docSlots[selectedDayIndex].map((item, index) => {
                  const isTimeSelected = selectedTime === item.time
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(item.time)}
                      className={`py-2 px-2.5 rounded-xl text-center text-xs font-medium border transition-all cursor-pointer ${
                        isTimeSelected
                          ? 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50 text-white dark:text-zinc-900 shadow-sm'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      {item.time}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 text-xs">
                No slots available on this date.
              </div>
            )}
          </div>

          {/* Booking Summary & Trigger */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="text-xs text-left w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Total Payable Amount:</span>
                <span className="text-base font-black text-zinc-900 dark:text-white">{currencySymbol}{totalPrice}</span>
              </div>
              {isEmergency && (
                <span className="text-[10px] text-rose-500 font-bold">
                  Includes {currencySymbol}{basePrice} base fee + {currencySymbol}{emergencyPrice} emergency surcharge
                </span>
              )}
            </div>

            <button
              onClick={bookAppointment}
              className={`w-full sm:w-auto font-bold text-xs px-8 py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                isEmergency 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
              }`}
            >
              {isEmergency ? '🚨 Book Emergency Priority Session' : 'Book Selected Consultation'}
            </button>
          </div>
        </div>

        {/* Doctor Reviews Logs (Optional visual addition) */}
        {docInfo.ratings && docInfo.ratings.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-505" /> Patient Review Log
            </h3>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {docInfo.ratings.map((review, i) => (
                <div key={i} className="py-3.5 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">Verified Patient</span>
                    <span className="text-[10px] text-zinc-400">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {Array(5).fill(0).map((_, starIdx) => (
                      <Star key={starIdx} className={`w-3 h-3 ${starIdx < review.rating ? 'text-amber-500 fill-current' : 'text-zinc-300'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 italic">"{review.review}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Doctors */}
        <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
      </div>
    )
  )
}

export default Appointment
