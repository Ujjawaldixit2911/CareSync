import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown, 
  Plus, 
  FilePlus, 
  FileCheck, 
  Activity, 
  Heart, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  ChevronRight, 
  User, 
  Stethoscope, 
  Send, 
  Download, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'

const ClinicalDashboard = () => {
  // Navigation tabs in sidebar
  const [activeNav, setActiveNav] = useState('dashboard')

  // Top header search
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Vitals Chart metric toggle
  const [vitalMetric, setVitalMetric] = useState('heartRate') // 'heartRate' | 'bp' | 'sugar'
  const [vitalTimeframe, setVitalTimeframe] = useState('7d')

  // Appointment filter
  const [appointmentFilter, setAppointmentFilter] = useState('all') // 'all' | 'confirmed' | 'pending' | 'cancelled'

  // Modals state
  const [isAddApptOpen, setIsAddApptOpen] = useState(false)
  const [isWriteRxOpen, setIsWriteRxOpen] = useState(false)
  const [isViewReportsOpen, setIsViewReportsOpen] = useState(false)

  // Forms data
  const [newAppt, setNewAppt] = useState({ patient: '', doctor: 'Dr. Sarah Jenkins', date: '', time: '10:00 AM', type: 'Video Telehealth' })
  const [newRx, setNewRx] = useState({ patient: '', medicine: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'Take after meals' })

  // Dummy Appointments State
  const [appointments, setAppointments] = useState([
    {
      id: 'APT-1092',
      patient: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80',
      doctor: 'Dr. Sarah Jenkins (Cardiology)',
      time: '10:30 AM',
      date: 'Today, Sep 5',
      type: 'Video Telehealth',
      status: 'Confirmed',
      reason: 'Hypertension Follow-up'
    },
    {
      id: 'APT-1093',
      patient: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
      doctor: 'Dr. Richard James (General)',
      time: '11:15 AM',
      date: 'Today, Sep 5',
      type: 'In-Clinic Visit',
      status: 'Pending',
      reason: 'Seasonal Fever & Cough'
    },
    {
      id: 'APT-1094',
      patient: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
      doctor: 'Dr. Emily Larson (Gynecology)',
      time: '02:00 PM',
      date: 'Today, Sep 5',
      type: 'Video Telehealth',
      status: 'Confirmed',
      reason: 'Routine Prenatal Consultation'
    },
    {
      id: 'APT-1095',
      patient: 'Michael Scott',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
      doctor: 'Dr. Christopher Lee (Neurology)',
      time: '04:30 PM',
      date: 'Today, Sep 5',
      type: 'In-Clinic Visit',
      status: 'Cancelled',
      reason: 'Migraine Assessment'
    }
  ])

  // Dummy Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 1,
      title: 'Lab Report Released',
      desc: 'Complete Blood Count (CBC) uploaded for Elena Rostova.',
      time: '12 mins ago',
      type: 'report',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
    },
    {
      id: 2,
      title: 'Prescription Issued',
      desc: 'Dr. Sarah Jenkins prescribed Amoxicillin 500mg for David Miller.',
      time: '45 mins ago',
      type: 'rx',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 3,
      title: 'SOS Emergency Cleared',
      desc: 'Metro Hospital Ambulance #04 arrived at central coordinates zone.',
      time: '2 hours ago',
      type: 'sos',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    },
    {
      id: 4,
      title: 'Vital Metric Alert',
      desc: 'Patient Sophia Chen blood glucose logged at 108 mg/dL (Normal).',
      time: '4 hours ago',
      type: 'vital',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    }
  ])

  // Dummy Reports
  const reportsList = [
    { id: 'REP-901', name: 'Comprehensive Lipid & Blood Panel', patient: 'Elena Rostova', doctor: 'Dr. Sarah Jenkins', date: 'Sep 4, 2026', status: 'Reviewed', severity: 'Normal' },
    { id: 'REP-902', name: 'Holter Monitor 24h ECG Analysis', patient: 'Marcus Vance', doctor: 'Dr. Alistair Vance', date: 'Sep 3, 2026', status: 'Urgent Review', severity: 'Attention' },
    { id: 'REP-903', name: 'Thyroid Stimulating Hormone (TSH)', patient: 'Chloe Bennett', doctor: 'Dr. Richard James', date: 'Sep 2, 2026', status: 'Completed', severity: 'Normal' },
    { id: 'REP-904', name: 'Digital Chest X-Ray DICOM', patient: 'Arthur King', doctor: 'Dr. Christopher Lee', date: 'Aug 30, 2026', status: 'Completed', severity: 'Normal' },
  ]

  // Handlers
  const handleAddAppointment = (e) => {
    e.preventDefault()
    if (!newAppt.patient.trim()) return toast.error('Please enter patient name')
    
    const newEntry = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: newAppt.patient,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80',
      doctor: newAppt.doctor,
      time: newAppt.time,
      date: newAppt.date || 'Today, Sep 5',
      type: newAppt.type,
      status: 'Confirmed',
      reason: 'General Clinical Review'
    }

    setAppointments([newEntry, ...appointments])
    setIsAddApptOpen(false)
    setNewAppt({ patient: '', doctor: 'Dr. Sarah Jenkins', date: '', time: '10:00 AM', type: 'Video Telehealth' })
    toast.success('🎉 Appointment booked successfully!')
  }

  const handleWritePrescription = (e) => {
    e.preventDefault()
    if (!newRx.patient || !newRx.medicine) return toast.error('Please fill patient and medicine details')
    
    setIsWriteRxOpen(false)
    setNewRx({ patient: '', medicine: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'Take after meals' })
    toast.success(`💊 Prescription for ${newRx.medicine} dispatched to pharmacy vault!`)
  }

  // Filtered Appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesFilter = appointmentFilter === 'all' || appt.status.toLowerCase() === appointmentFilter.toLowerCase()
    const matchesSearch = appt.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appt.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Vitals Chart Mock Data
  const vitalsData = {
    heartRate: {
      label: 'Heart Rate Trend (BPM)',
      current: '72 BPM',
      status: 'Normal Sinus Rhythm',
      color: '#0d9488', // Teal
      points: [68, 70, 74, 71, 75, 72, 73],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      min: '65',
      max: '85',
      avg: '72.4 BPM'
    },
    bp: {
      label: 'Blood Pressure Trend (mmHg)',
      current: '118/78 mmHg',
      status: 'Optimal Range',
      color: '#6366f1', // Indigo
      points: [120, 118, 122, 116, 119, 117, 118],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      min: '110/70',
      max: '125/82',
      avg: '118/78 mmHg'
    },
    sugar: {
      label: 'Blood Glucose Trend (mg/dL)',
      current: '98 mg/dL',
      status: 'Fasting Target Achieved',
      color: '#f43f5e', // Soft Red Alert color
      points: [92, 95, 104, 98, 112, 94, 98],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      min: '85',
      max: '120',
      avg: '99.0 mg/dL'
    }
  }

  const currentVital = vitalsData[vitalMetric]

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] -mx-4 sm:-mx-[10%] bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR                                                           */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-64 bg-white dark:bg-zinc-900 border-r border-slate-200/80 dark:border-zinc-800/80 flex flex-col justify-between shrink-0 p-4 lg:p-5">
        <div className="space-y-6">
          
          {/* Platform Console Header */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                CareSync Clinical
              </h2>
              <span className="text-[10px] text-primary dark:text-sky-400 font-bold uppercase tracking-wider">
                EHR & Telehealth
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'appointments', label: 'Appointments', icon: Calendar, badge: `${appointments.length}` },
              { id: 'patients', label: 'Patients & Doctors', icon: Users },
              { id: 'prescriptions', label: 'Prescriptions (Rx)', icon: FileText },
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '4' },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((navItem) => {
              const Icon = navItem.icon
              const isActive = activeNav === navItem.id
              return (
                <button
                  key={navItem.id}
                  onClick={() => {
                    setActiveNav(navItem.id)
                    if (navItem.id === 'prescriptions') setIsWriteRxOpen(true)
                    if (navItem.id === 'patients') setIsViewReportsOpen(true)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/25 font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{navItem.label}</span>
                  </div>
                  {navItem.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}>
                      {navItem.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

        </div>

        {/* Sidebar Footer Info Card */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/80 space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">FHIR v4 Synced</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-medium text-slate-700 dark:text-zinc-300">Continuous 256-Bit Crypt</p>
          </div>

          <div className="flex items-center gap-2.5 px-2">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=128&q=80" 
              alt="Dr. Sarah" 
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700" 
            />
            <div className="truncate">
              <p className="text-xs font-bold leading-tight">Dr. Sarah Jenkins</p>
              <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">Chief Cardiologist</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                                            */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-2.5xl font-black tracking-tight text-slate-900 dark:text-white">
              Clinical Command Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Real-time synchronization of appointments, vital signs telemetry, and digital prescriptions.
            </p>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, doc, Rx..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-primary transition-all relative cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <>
                  <div onClick={() => setShowNotifications(false)} className="fixed inset-0 z-20" />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Recent Notifications</span>
                      <span className="text-[10px] text-primary font-bold">Mark all read</span>
                    </div>
                    <div className="space-y-2">
                      {activityLogs.slice(0, 3).map((item) => (
                        <div key={item.id} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-left space-y-0.5">
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{item.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                          <span className="text-[9px] text-slate-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Date Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Today, Sep 5</span>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 3. TOP ROW: 4 STAT CARDS                                                  */}
        {/* 3. TOP ROW: 4 STAT CARDS (Apple KPI Cards with SVG Sparklines)          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stat 1: Upcoming Appointments */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-lg transition-all text-left">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Today's Appointments</span>
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-primary flex items-center justify-center border border-blue-500/20 shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline justify-between relative z-10">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">18 Today</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>

            <p className="text-[11px] text-slate-400 relative z-10">4 telehealth slots starting soon</p>

            {/* Mini SVG Sparkline */}
            <div className="h-6 w-full pt-1">
              <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24">
                <path d="M 0 18 L 15 15 L 30 19 L 45 10 L 60 14 L 75 6 L 90 8 L 100 2" fill="none" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Stat 2: Total Patients */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-lg transition-all text-left">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Total Active Patients</span>
              <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between relative z-10">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">1,248</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +24 new
              </span>
            </div>

            <p className="text-[11px] text-slate-400 relative z-10">98.4% clinical satisfaction</p>

            {/* Mini SVG Area Curve */}
            <div className="h-6 w-full pt-1">
              <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24">
                <path d="M 0 20 Q 25 10, 50 16 T 100 3 L 100 24 L 0 24 Z" fill="#0d948815" />
                <path d="M 0 20 Q 25 10, 50 16 T 100 3" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Stat 3: Pending Reports */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-lg transition-all text-left">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Diagnostic Reports</span>
              <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between relative z-10">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">7 Audits</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                3 Urgent
              </span>
            </div>

            <p className="text-[11px] text-slate-400 relative z-10">Lipid panel &amp; Holter ECG pending</p>

            {/* Mini SVG Warning Bars */}
            <div className="h-6 w-full pt-1">
              <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24">
                <path d="M 0 15 L 20 12 L 40 18 L 60 8 L 80 14 L 100 5" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Stat 4: Messages */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-lg transition-all text-left">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Clinical Messages</span>
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between relative z-10">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">14 Unread</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Avg &lt; 8m
              </span>
            </div>

            <p className="text-[11px] text-slate-400 relative z-10">5 clinical queries require doctor review</p>

            {/* Mini SVG Heartbeat */}
            <div className="h-6 w-full pt-1">
              <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24">
                <path d="M 0 12 L 35 12 L 45 2 L 55 22 L 65 8 L 75 12 L 100 12" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. QUICK ACTIONS BAR                                                      */}
        {/* ========================================================================= */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Quick Clinical Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddApptOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Appointment
            </button>

            <button
              onClick={() => setIsWriteRxOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" /> Write Prescription
            </button>

            <button
              onClick={() => setIsViewReportsOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-primary" /> View Reports
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. MAIN SPLIT: VITALS CHART + APPOINTMENT LIST WIDGET                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Patient Vitals Trend Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
            
            {/* Vitals Chart Header & Switcher */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Patient Vitals Telemetry Trend
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time bio-stream logged from Apple & Garmin wearables</p>
              </div>

              {/* Metric Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-zinc-950 rounded-xl text-[11px] font-semibold">
                <button
                  onClick={() => setVitalMetric('heartRate')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    vitalMetric === 'heartRate'
                      ? 'bg-teal-500 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                  }`}
                >
                  Heart Rate
                </button>
                <button
                  onClick={() => setVitalMetric('bp')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    vitalMetric === 'bp'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                  }`}
                >
                  Blood Pressure
                </button>
                <button
                  onClick={() => setVitalMetric('sugar')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    vitalMetric === 'sugar'
                      ? 'bg-rose-500 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                  }`}
                >
                  Sugar Level
                </button>
              </div>
            </div>

            {/* Metric Summary Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Reading</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{currentVital.current}</span>
              </div>
              <div className="border-x border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">7-Day Average</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{currentVital.avg}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Interpretation</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  {currentVital.status}
                </span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative pt-4 pb-2">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentVital.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={currentVital.color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-zinc-800" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-zinc-800" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-zinc-800" />

                {/* Area Fill */}
                <path
                  d={`M 0,${160 - currentVital.points[0] * 1.3} 
                      L 100,${160 - currentVital.points[1] * 1.3} 
                      L 200,${160 - currentVital.points[2] * 1.3} 
                      L 300,${160 - currentVital.points[3] * 1.3} 
                      L 400,${160 - currentVital.points[4] * 1.3} 
                      L 500,${160 - currentVital.points[5] * 1.3} 
                      L 600,${160 - currentVital.points[6] * 1.3} 
                      L 600,160 L 0,160 Z`}
                  fill="url(#vitalGradient)"
                />

                {/* Main Stroke Path */}
                <path
                  d={`M 0,${160 - currentVital.points[0] * 1.3} 
                      L 100,${160 - currentVital.points[1] * 1.3} 
                      L 200,${160 - currentVital.points[2] * 1.3} 
                      L 300,${160 - currentVital.points[3] * 1.3} 
                      L 400,${160 - currentVital.points[4] * 1.3} 
                      L 500,${160 - currentVital.points[5] * 1.3} 
                      L 600,${160 - currentVital.points[6] * 1.3}`}
                  fill="none"
                  stroke={currentVital.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {currentVital.points.map((val, pIdx) => (
                  <g key={pIdx} className="group cursor-pointer">
                    <circle
                      cx={pIdx * 100}
                      cy={160 - val * 1.3}
                      r="5"
                      fill="#ffffff"
                      stroke={currentVital.color}
                      strokeWidth="3"
                      className="transition-all hover:r-7"
                    />
                  </g>
                ))}
              </svg>

              {/* Day Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2 px-1">
                {currentVital.labels.map((day, idx) => (
                  <span key={idx}>{day}</span>
                ))}
              </div>
            </div>

            {/* Bottom Interpretation Note */}
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Vitals calibrated to patient baseline (Elena Rostova)
              </span>
              <span className="font-semibold text-primary">Export CSV Telemetry</span>
            </div>

          </div>

          {/* RIGHT: Recent Activity & Live Clinical Feed (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Recent Clinical Activity
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                Live Feed
              </span>
            </div>

            {/* Activity Stream */}
            <div className="space-y-3.5">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-zinc-950/40 border border-slate-200/50 dark:border-zinc-800/50 hover:border-primary/30 transition-all">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${log.iconBg}`}>
                    {log.type === 'report' && <FileCheck className="w-4 h-4" />}
                    {log.type === 'rx' && <FileText className="w-4 h-4" />}
                    {log.type === 'sos' && <AlertCircle className="w-4 h-4" />}
                    {log.type === 'vital' && <Heart className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5 text-left flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{log.title}</h4>
                      <span className="text-[10px] text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Assistant Quick Ping */}
            <div className="p-3 bg-gradient-to-r from-primary/5 to-teal-500/5 border border-primary/20 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">Need diagnostic assistance?</span>
              <button 
                onClick={() => toast.info('🤖 Gemini Clinical Assistant active in AiHub!')}
                className="px-2.5 py-1 bg-primary text-white font-bold rounded-lg text-[10px] hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Ask AI Assistant
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. APPOINTMENT CALENDAR / LIST WIDGET WITH STATUS TAGS                    */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Scheduled Consultations & Triage
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Filter by confirmation status or search patient profiles</p>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All (4)' },
                { id: 'confirmed', label: 'Confirmed (2)', color: 'text-emerald-600' },
                { id: 'pending', label: 'Pending (1)', color: 'text-amber-500' },
                { id: 'cancelled', label: 'Cancelled (1)', color: 'text-rose-500' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setAppointmentFilter(btn.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                    appointmentFilter === btn.id
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'bg-[#f5f5f7] dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-[#e5e5ea] dark:hover:bg-zinc-700 border border-[#e5e5ea] dark:border-zinc-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table / Card List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Patient</th>
                  <th className="pb-3 font-semibold">Doctor & Specialty</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Visit Mode</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-850/40 transition-colors">
                    
                    {/* Patient */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={appt.avatar} alt={appt.patient} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">{appt.patient}</p>
                          <p className="text-[10px] text-slate-400 leading-none mt-0.5">{appt.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 text-slate-700 dark:text-zinc-300">
                      <p className="font-semibold">{appt.doctor}</p>
                      <p className="text-[10px] text-slate-400">{appt.reason}</p>
                    </td>

                    {/* Date/Time */}
                    <td className="py-3.5">
                      <span className="font-bold text-slate-900 dark:text-white block">{appt.time}</span>
                      <span className="text-[10px] text-slate-400">{appt.date}</span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                        {appt.type.includes('Video') ? <Video className="w-3.5 h-3.5 text-primary" /> : <Building2 className="w-3.5 h-3.5 text-emerald-500" />}
                        {appt.type}
                      </span>
                    </td>

                    {/* Status Tag */}
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                          : appt.status === 'Pending'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                      }`}>
                        {appt.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                        {appt.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {appt.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                        {appt.status}
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.type.includes('Video') && appt.status === 'Confirmed' && (
                          <button
                            onClick={() => toast.success(`Launching secure video link for ${appt.patient}...`)}
                            className="px-2.5 py-1 bg-primary text-white rounded-lg text-[11px] font-bold hover:bg-primary-dark transition-colors cursor-pointer"
                          >
                            Join Video
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setNewRx(prev => ({ ...prev, patient: appt.patient }))
                            setIsWriteRxOpen(true)
                          }}
                          className="p-1.5 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="Write Prescription"
                        >
                          <FilePlus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 7. MODAL: ADD APPOINTMENT                                                 */}
      {/* ========================================================================= */}
      {isAddApptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsAddApptOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Schedule New Consultation
              </h3>
              <button onClick={() => setIsAddApptOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Bailey"
                  value={newAppt.patient}
                  onChange={e => setNewAppt({ ...newAppt, patient: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Assign Doctor</label>
                <select
                  value={newAppt.doctor}
                  onChange={e => setNewAppt({ ...newAppt, doctor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Dr. Sarah Jenkins (Cardiology)">Dr. Sarah Jenkins (Cardiology)</option>
                  <option value="Dr. Richard James (General)">Dr. Richard James (General)</option>
                  <option value="Dr. Emily Larson (Gynecology)">Dr. Emily Larson (Gynecology)</option>
                  <option value="Dr. Christopher Lee (Neurology)">Dr. Christopher Lee (Neurology)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Consultation Time</label>
                  <input
                    type="text"
                    value={newAppt.time}
                    onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Visit Type</label>
                  <select
                    value={newAppt.type}
                    onChange={e => setNewAppt({ ...newAppt, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Video Telehealth">Video Telehealth</option>
                    <option value="In-Clinic Visit">In-Clinic Visit</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Confirm Appointment Slot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: WRITE PRESCRIPTION (Rx)                                         */}
      {/* ========================================================================= */}
      {isWriteRxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsWriteRxOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-teal-500" /> Issue Digital Prescription (Rx)
              </h3>
              <button onClick={() => setIsWriteRxOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWritePrescription} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={newRx.patient}
                  onChange={e => setNewRx({ ...newRx, patient: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metformin / Lisinopril"
                    value={newRx.medicine}
                    onChange={e => setNewRx({ ...newRx, medicine: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newRx.dosage}
                    onChange={e => setNewRx({ ...newRx, dosage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Frequency</label>
                  <select
                    value={newRx.frequency}
                    onChange={e => setNewRx({ ...newRx, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Once daily">Once daily (OD)</option>
                    <option value="Twice daily">Twice daily (BD)</option>
                    <option value="Thrice daily">Thrice daily (TDS)</option>
                    <option value="As needed">As needed (PRN)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Course Duration</label>
                  <input
                    type="text"
                    value={newRx.duration}
                    onChange={e => setNewRx({ ...newRx, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Clinical Instructions & Notes</label>
                <textarea
                  rows="2"
                  value={newRx.instructions}
                  onChange={e => setNewRx({ ...newRx, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Digitally Sign & Dispatch Prescription
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: VIEW DIAGNOSTIC REPORTS                                         */}
      {/* ========================================================================= */}
      {isViewReportsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsViewReportsOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" /> Diagnostic Lab Reports & EHR Vault
              </h3>
              <button onClick={() => setIsViewReportsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {reportsList.map((rep) => (
                <div key={rep.id} className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{rep.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        rep.severity === 'Normal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}>
                        {rep.severity}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Patient: <span className="font-semibold text-slate-700 dark:text-zinc-300">{rep.patient}</span> • Signed by {rep.doctor}</p>
                    <span className="text-[10px] text-slate-400">Date: {rep.date} • ID: {rep.id}</span>
                  </div>

                  <button
                    onClick={() => toast.success(`Downloading PDF record for ${rep.id}...`)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsViewReportsOpen(false)}
                className="px-5 py-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#1d1d1f] dark:text-zinc-100 border border-[#d2d2d7] dark:border-[#3f3f46] rounded-xl font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ClinicalDashboard
