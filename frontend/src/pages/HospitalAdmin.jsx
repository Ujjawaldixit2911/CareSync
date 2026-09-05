import React, { useState } from 'react'
import { 
  Building2, 
  Bed, 
  Users, 
  Stethoscope, 
  DollarSign, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Package, 
  Layers, 
  TrendingUp, 
  Activity, 
  Download, 
  Plus, 
  UserPlus, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Ambulance, 
  Syringe, 
  HeartPulse, 
  Briefcase,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'

const HospitalAdmin = () => {
  // Sidebar active navigation
  const [activeTab, setActiveTab] = useState('dashboard')

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [rosterStatusFilter, setRosterStatusFilter] = useState('All')

  // Sorting
  const [sortField, setSortField] = useState('occupancyRate')
  const [sortDirection, setSortDirection] = useState('desc')

  // Modals state
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false)
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false)

  // Quick Admission Form State
  const [newAdmission, setNewAdmission] = useState({
    patientName: '',
    mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
    age: '',
    gender: 'Male',
    department: 'Cardiology',
    assignedDoctor: 'Dr. Sarah Jenkins',
    roomNumber: 'Ward 4B - Bed 12',
    admissionType: 'Emergency Triage'
  })

  // 1. Department Occupancy Data
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Cardiology & CCU', totalBeds: 50, occupied: 45, head: 'Dr. Sarah Jenkins', nurseStation: 'Station 4A', status: 'High Occupancy' },
    { id: 2, name: 'Neurology & Stroke Unit', totalBeds: 35, occupied: 28, head: 'Dr. Christopher Lee', nurseStation: 'Station 3B', status: 'Normal' },
    { id: 3, name: 'ICU & Critical Care', totalBeds: 50, occupied: 48, head: 'Dr. Alistair Vance', nurseStation: 'Main ICU', status: 'Critical Threshold' },
    { id: 4, name: 'General Medicine & Surgery', totalBeds: 120, occupied: 104, head: 'Dr. Richard James', nurseStation: 'Station 2A', status: 'Normal' },
    { id: 5, name: 'Pediatrics & Neonatal ICU', totalBeds: 45, occupied: 32, head: 'Dr. Emily Larson', nurseStation: 'Station 1C', status: 'Normal' },
    { id: 6, name: 'Oncology & Hematology', totalBeds: 50, occupied: 41, head: 'Dr. Jessica Taylor', nurseStation: 'Station 5B', status: 'Normal' },
    { id: 7, name: 'Orthopedics & Trauma', totalBeds: 60, occupied: 48, head: 'Dr. David Kim', nurseStation: 'Station 2C', status: 'High Occupancy' },
    { id: 8, name: 'Obstetrics & Gynecology', totalBeds: 40, occupied: 26, head: 'Dr. Maria Santos', nurseStation: 'Station 1A', status: 'Normal' }
  ])

  // 2. Doctor On-Duty Roster Data
  const [doctorRoster, setDoctorRoster] = useState([
    {
      id: 'DOC-101',
      name: 'Dr. Sarah Jenkins',
      specialty: 'Cardiology',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=128&q=80',
      department: 'Cardiology & CCU',
      shift: 'Morning (07:00 - 15:00)',
      room: 'Cath Lab 2',
      status: 'In Surgery',
      patientsAssigned: 8
    },
    {
      id: 'DOC-102',
      name: 'Dr. Christopher Lee',
      specialty: 'Neurology',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=128&q=80',
      department: 'Neurology & Stroke Unit',
      shift: 'Morning (07:00 - 15:00)',
      room: 'Neuro ICU #04',
      status: 'Available',
      patientsAssigned: 5
    },
    {
      id: 'DOC-103',
      name: 'Dr. Alistair Vance',
      specialty: 'Critical Care / ICU',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=128&q=80',
      department: 'ICU & Critical Care',
      shift: 'Morning (07:00 - 15:00)',
      room: 'Main ICU Bay 1',
      status: 'Available',
      patientsAssigned: 12
    },
    {
      id: 'DOC-104',
      name: 'Dr. Richard James',
      specialty: 'General Physician',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
      department: 'General Medicine & Surgery',
      shift: 'Evening (15:00 - 23:00)',
      room: 'OPD Ward 302',
      status: 'Available',
      patientsAssigned: 14
    },
    {
      id: 'DOC-105',
      name: 'Dr. Emily Larson',
      specialty: 'Pediatrics',
      avatar: 'https://images.unsplash.com/photo-1594824813589-39938b8163f9?auto=format&fit=crop&w=128&q=80',
      department: 'Pediatrics & Neonatal ICU',
      shift: 'Night (23:00 - 07:00)',
      room: 'NICU Unit B',
      status: 'Off Duty',
      patientsAssigned: 0
    },
    {
      id: 'DOC-106',
      name: 'Dr. David Kim',
      specialty: 'Orthopedics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
      department: 'Orthopedics & Trauma',
      shift: 'Morning (07:00 - 15:00)',
      room: 'OR Suite 4',
      status: 'In Surgery',
      patientsAssigned: 6
    }
  ])

  // 3. Real-Time Emergency & Supply Alerts
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-1',
      type: 'emergency',
      title: 'Inbound Trauma Level-1 Ambulance',
      message: 'Ambulance #04 incoming with severe acute cardiac distress. ETA 4 mins. Trauma Bay 1 assigned.',
      timestamp: 'Just now',
      severity: 'critical'
    },
    {
      id: 'ALT-2',
      type: 'inventory',
      title: 'Low Inventory: O-Negative Blood Bank',
      message: 'Central blood bank reserve dropped to 4 units. Urgent donor requisition dispatched.',
      timestamp: '15 mins ago',
      severity: 'warning'
    },
    {
      id: 'ALT-3',
      type: 'capacity',
      title: 'ICU Threshold Alert: 96% Capacity',
      message: 'Main ICU currently has only 2 available ventilators remaining. Triage protocol active.',
      timestamp: '42 mins ago',
      severity: 'critical'
    },
    {
      id: 'ALT-4',
      type: 'inventory',
      title: 'Supply Notice: Sterile Surgical Kits',
      message: '18 packs remaining in OR Sterile Stockroom #3. Scheduled restock arrival at 16:00.',
      timestamp: '1 hour ago',
      severity: 'info'
    }
  ])

  // Aggregate Metrics Calculations
  const totalBeds = departments.reduce((acc, d) => acc + d.totalBeds, 0)
  const totalOccupied = departments.reduce((acc, d) => acc + d.occupied, 0)
  const totalAvailable = totalBeds - totalOccupied
  const totalOccupancyRate = Math.round((totalOccupied / totalBeds) * 100)

  const doctorsOnDutyCount = doctorRoster.filter(d => d.status !== 'Off Duty').length
  const doctorsInSurgeryCount = doctorRoster.filter(d => d.status === 'In Surgery').length
  const doctorsAvailableCount = doctorRoster.filter(d => d.status === 'Available').length

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Filtered & Sorted Departments
  const filteredDepartments = departments
    .filter(d => departmentFilter === 'All' || d.name.includes(departmentFilter))
    .sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'occupancyRate') {
        aVal = (a.occupied / a.totalBeds) * 100
        bVal = (b.occupied / b.totalBeds) * 100
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  // Filtered Doctors
  const filteredDoctors = doctorRoster.filter(doc => {
    const matchesStatus = rosterStatusFilter === 'All' || doc.status === rosterStatusFilter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Admission Submit Handler
  const handleAdmissionSubmit = (e) => {
    e.preventDefault()
    if (!newAdmission.patientName.trim()) return toast.error('Please enter patient name')

    toast.success(`🏥 Patient ${newAdmission.patientName} (${newAdmission.mrn}) admitted to ${newAdmission.department}!`)
    setIsAdmitModalOpen(false)
    setNewAdmission({
      patientName: '',
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      age: '',
      gender: 'Male',
      department: 'Cardiology',
      assignedDoctor: 'Dr. Sarah Jenkins',
      roomNumber: 'Ward 4B - Bed 12',
      admissionType: 'Emergency Triage'
    })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] -mx-4 sm:-mx-[10%] bg-[#f5f5f7] dark:bg-[#18181b] text-[#1d1d1f] dark:text-zinc-100 font-sans transition-colors">
      
      {/* ========================================================================= */}
      {/* 1. ENTERPRISE SIDEBAR                                                     */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-64 bg-white dark:bg-[#1f1f23] text-zinc-700 dark:text-zinc-300 flex flex-col justify-between shrink-0 p-4 lg:p-5 border-r border-[#e5e5ea] dark:border-[#27272a] shadow-xs">
        <div className="space-y-6">
          
          {/* Hospital Brand & Authority */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-black shadow-md shadow-teal-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-[#1d1d1f] dark:text-white leading-tight">
                CareSync Memorial
              </h2>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider block">
                Hospital Command Ops
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: Layers },
              { id: 'doctors', label: 'Doctor Roster', icon: Stethoscope, badge: `${doctorsOnDutyCount} on-duty` },
              { id: 'patients', label: 'Admitted Inpatients', icon: Users, badge: `${totalOccupied}` },
              { id: 'departments', label: 'Departments & Beds', icon: Bed },
              { id: 'billing', label: 'Billing & Financials', icon: DollarSign },
              { id: 'inventory', label: 'Pharmacy & Supplies', icon: Package, badge: '2 alerts' },
              { id: 'reports', label: 'Clinical Analytics', icon: FileText }
            ].map((navItem) => {
              const Icon = navItem.icon
              const isActive = activeTab === navItem.id
              return (
                <button
                  key={navItem.id}
                  onClick={() => {
                    setActiveTab(navItem.id)
                    if (navItem.id === 'patients') setIsAdmitModalOpen(true)
                    if (navItem.id === 'inventory') setIsRestockModalOpen(true)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0071e3] text-white font-bold shadow-md shadow-blue-500/25'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-[#f5f5f7] dark:hover:bg-[#27272a] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{navItem.label}</span>
                  </div>
                  {navItem.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#eceef1] dark:bg-[#27272a] text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {navItem.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

        </div>

        {/* Sidebar Footer: Authority & Current Admin */}
        <div className="pt-6 border-t border-[#e5e5ea] dark:border-[#27272a] space-y-3">
          <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Trauma Level 1</span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200">Central Helipad Active</p>
          </div>

          <div className="flex items-center gap-2.5 px-2">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80" 
              alt="Marcus" 
              className="w-8 h-8 rounded-full object-cover border border-[#e5e5ea] dark:border-zinc-700" 
            />
            <div className="truncate text-left">
              <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">Marcus Sterling</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate leading-none mt-0.5">Director of Operations</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN HOSPITAL CONTENT                                                  */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-2.5xl font-black tracking-tight text-slate-900 dark:text-white">
                Hospital Enterprise Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 text-[10px] font-bold uppercase">
                Facility ID: NY-9402
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Live census, department occupancy, medical staff rosters, emergency admissions, and revenue ledger.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAdmitModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Fast Admission (MRN)
            </button>

            <button
              onClick={() => setIsRestockModalOpen(true)}
              className="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#1d1d1f] dark:text-zinc-100 border border-[#d2d2d7] dark:border-[#3f3f46] rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Supply Requisition
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 3. OVERVIEW STAT CARDS (4 CARDS)                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stat 1: Total Beds Available */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Total Beds Available</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white">
                {totalAvailable} <span className="text-sm font-bold text-slate-400">/ {totalBeds}</span>
              </span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md">
                {100 - totalOccupancyRate}% Free
              </span>
            </div>
            <p className="text-[11px] text-slate-400">12 ICU & 8 Step-down beds ready for triage</p>
          </div>

          {/* Stat 2: Admitted Patients */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Admitted Inpatients</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white">
                {totalOccupied}
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +18 Today
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{totalOccupancyRate}% facility capacity utilization</p>
          </div>

          {/* Stat 3: Doctors On Duty */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Doctors On Duty</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white">
                {doctorsOnDutyCount} Staff
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                {doctorsInSurgeryCount} In Surgery
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{doctorsAvailableCount} clinical consultants available for rounds</p>
          </div>

          {/* Stat 4: Today's Revenue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Today's Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2.5xl font-black text-slate-900 dark:text-white">
                $148,650
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +8.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">96.2% insurance claim clearance rate</p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. SPLIT ROW: DEPARTMENT OCCUPANCY + CRITICAL ALERTS                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Department Occupancy Table & Capacity Progress (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Bed className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Department Bed Occupancy Matrix
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Live tracking of ward capacities and head supervisors</p>
              </div>

              {/* Department Quick Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="ICU">ICU Critical Care</option>
                  <option value="General">General Medicine</option>
                </select>
              </div>
            </div>

            {/* Occupancy Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th onClick={() => handleSort('name')} className="pb-3 font-semibold cursor-pointer hover:text-slate-600">
                      Department <ArrowUpDown className="w-3 h-3 inline ml-0.5" />
                    </th>
                    <th onClick={() => handleSort('occupied')} className="pb-3 font-semibold cursor-pointer hover:text-slate-600">
                      Occupied / Total
                    </th>
                    <th onClick={() => handleSort('occupancyRate')} className="pb-3 font-semibold cursor-pointer hover:text-slate-600">
                      Occupancy Rate %
                    </th>
                    <th className="pb-3 font-semibold">Head of Ward</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                  {filteredDepartments.map((dept) => {
                    const occRate = Math.round((dept.occupied / dept.totalBeds) * 100)
                    const isHigh = occRate >= 90
                    return (
                      <tr key={dept.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-850/40 transition-colors">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {dept.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{dept.nurseStation}</span>
                        </td>
                        <td className="py-3 text-slate-700 dark:text-zinc-300">
                          <span className="font-extrabold">{dept.occupied}</span> / {dept.totalBeds} Beds
                          <span className="text-[10px] text-slate-400 block">{dept.totalBeds - dept.occupied} Available</span>
                        </td>
                        <td className="py-3">
                          <div className="space-y-1 w-28">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className={isHigh ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-600 dark:text-zinc-300'}>
                                {occRate}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${occRate}%` }}
                                className={`h-full rounded-full ${
                                  occRate >= 95 ? 'bg-rose-500' : occRate >= 85 ? 'bg-amber-500' : 'bg-teal-500'
                                }`}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-zinc-400 text-[11px]">
                          {dept.head}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                            dept.status === 'Critical Threshold'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                              : dept.status === 'High Occupancy'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                          }`}>
                            {dept.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* RIGHT: Critical Real-Time Alerts Panel & Triage Feed (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Real-Time Clinical & Supply Alerts
                </h3>
              </div>
              <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                Active Priority
              </span>
            </div>

            {/* Alerts List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all ${
                    alert.severity === 'critical'
                      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      : alert.severity === 'warning'
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : 'bg-slate-50 dark:bg-zinc-950 border-slate-200/70 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {alert.type === 'emergency' && <Ambulance className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                      {alert.type === 'inventory' && <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                      {alert.type === 'capacity' && <Bed className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                      <span className="text-slate-900 dark:text-white">{alert.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{alert.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-zinc-350 leading-relaxed font-normal">
                    {alert.message}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">ID: {alert.id}</span>
                    <button 
                      onClick={() => toast.success(`Action dispatched for ${alert.id}`)}
                      className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Acknowledge & Dispatch →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Restock Action Banner */}
            <div className="p-3.5 bg-[#f5f5f7] dark:bg-[#27272a] text-[#1d1d1f] dark:text-zinc-100 border border-[#d2d2d7] dark:border-[#3f3f46] rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold">Pharmacy & Supply Central</p>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">2 automatic supplier purchase orders queued</span>
              </div>
              <button
                onClick={() => setIsRestockModalOpen(true)}
                className="px-3 py-1.5 bg-[#0071e3] text-white font-extrabold rounded-xl text-[10px] hover:bg-[#0077ed] transition-colors cursor-pointer shadow-xs"
              >
                Review POs
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 5. SPLIT ROW: DOCTOR ROSTER TABLE + BILLING MINI-CHART                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Doctor Roster Table (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Active Doctor Shift Roster
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Specialist assignments, current operating room / ward, and active status</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {['All', 'Available', 'In Surgery', 'Off Duty'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRosterStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rosterStatusFilter === st
                        ? 'bg-[#0071e3] text-white shadow-xs'
                        : 'bg-[#f5f5f7] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-[#e5e5ea] border border-[#e5e5ea] dark:border-zinc-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Doctor Profile</th>
                    <th className="pb-3 font-semibold">Department & Ward</th>
                    <th className="pb-3 font-semibold">Shift Schedule</th>
                    <th className="pb-3 font-semibold">Active Location</th>
                    <th className="pb-3 font-semibold text-right">Shift Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-850/40 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{doc.name}</p>
                            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{doc.specialty}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-slate-700 dark:text-zinc-300">
                        <span className="font-semibold block">{doc.department}</span>
                        <span className="text-[10px] text-slate-400">{doc.patientsAssigned} Inpatients Assigned</span>
                      </td>

                      <td className="py-3 text-slate-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {doc.shift}
                        </span>
                      </td>

                      <td className="py-3 text-slate-700 dark:text-zinc-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-[11px] font-bold">
                          {doc.room}
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          doc.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                            : doc.status === 'In Surgery'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                            : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            doc.status === 'Available' ? 'bg-emerald-500 animate-pulse' : doc.status === 'In Surgery' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* RIGHT: Billing Overview Mini-Chart (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Financial & Billing Ledger
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Today vs Target</span>
            </div>

            {/* Financial Ledger Mini-Metrics */}
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/60 dark:border-zinc-800 space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Gross Hospital Invoiced</span>
                  <span className="text-slate-900 dark:text-white font-black">$148,650</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[84%]" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Target: $175,000</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">84.9% Met</span>
                </div>
              </div>

              {/* Breakdown Stack */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-zinc-950/40">
                  <span className="text-slate-500">Insurance Claims Settled</span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">$118,200 (79.5%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-zinc-950/40">
                  <span className="text-slate-500">Out-of-Pocket & Co-Pay</span>
                  <span className="font-extrabold text-slate-800 dark:text-zinc-200">$24,550 (16.5%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-zinc-950/40">
                  <span className="text-slate-500">Pending TPA Approvals</span>
                  <span className="font-extrabold text-amber-500">$5,900 (4.0%)</span>
                </div>
              </div>
            </div>

            {/* Quick Export Button */}
            <button
              onClick={() => toast.success('📊 Generating Hospital Billing PDF & CSV statement...')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Export Revenue Statement
            </button>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 6. MODAL: FAST INPATIENT ADMISSION (MRN)                                  */}
      {/* ========================================================================= */}
      {isAdmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsAdmitModalOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Fast Inpatient Admission Desk
              </h3>
              <button onClick={() => setIsAdmitModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-3 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Henderson"
                    value={newAdmission.patientName}
                    onChange={e => setNewAdmission({ ...newAdmission, patientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Generated MRN</label>
                  <input
                    type="text"
                    disabled
                    value={newAdmission.mrn}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="42"
                    value={newAdmission.age}
                    onChange={e => setNewAdmission({ ...newAdmission, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Gender</label>
                  <select
                    value={newAdmission.gender}
                    onChange={e => setNewAdmission({ ...newAdmission, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Admission Type</label>
                  <select
                    value={newAdmission.admissionType}
                    onChange={e => setNewAdmission({ ...newAdmission, admissionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Emergency Triage">Emergency Triage</option>
                    <option value="Planned Surgery">Planned Surgery</option>
                    <option value="Direct Transfer">Direct Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Target Department</label>
                  <select
                    value={newAdmission.department}
                    onChange={e => setNewAdmission({ ...newAdmission, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Cardiology">Cardiology & CCU</option>
                    <option value="Neurology">Neurology & Stroke</option>
                    <option value="ICU">ICU Critical Care</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Attending Clinician</label>
                  <select
                    value={newAdmission.assignedDoctor}
                    onChange={e => setNewAdmission({ ...newAdmission, assignedDoctor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                    <option value="Dr. Christopher Lee">Dr. Christopher Lee</option>
                    <option value="Dr. Alistair Vance">Dr. Alistair Vance</option>
                    <option value="Dr. Richard James">Dr. Richard James</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Bed / Ward Assignment</label>
                <input
                  type="text"
                  value={newAdmission.roomNumber}
                  onChange={e => setNewAdmission({ ...newAdmission, roomNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Confirm Admission & Assign Bed
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: SUPPLY REQUISITION & PHARMACY INVENTORY                         */}
      {/* ========================================================================= */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsRestockModalOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Hospital Supplies & Pharmacy Requisition
              </h3>
              <button onClick={() => setIsRestockModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'O-Negative Whole Blood Units', category: 'Blood Bank', current: '4 units', threshold: '15 units', status: 'Critical Low', po: 'PO-8821' },
                { name: 'Propofol 10mg/mL Injectable', category: 'Anesthesia', current: '18 vials', threshold: '50 vials', status: 'Low Stock', po: 'PO-8822' },
                { name: 'Sterile Surgical Glove Sets (Size 7.5)', category: 'OR Consumables', current: '45 boxes', threshold: '100 boxes', status: 'Restock Queued', po: 'PO-8823' },
                { name: 'IV Infusion Catheter Sets (18G)', category: 'Emergency Room', current: '62 sets', threshold: '120 sets', status: 'Normal', po: 'PO-8824' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-slate-400 text-[11px]">{item.category} • In-Stock: <span className="font-semibold text-slate-700 dark:text-zinc-300">{item.current}</span> (Min: {item.threshold})</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.status === 'Critical Low'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400'
                    }`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => toast.success(`Instant Re-order submitted for ${item.name} (${item.po})`)}
                      className="block text-[10px] text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                    >
                      Approve {item.po}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="px-5 py-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#1d1d1f] dark:text-zinc-100 border border-[#d2d2d7] dark:border-[#3f3f46] rounded-xl font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Requisition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default HospitalAdmin
