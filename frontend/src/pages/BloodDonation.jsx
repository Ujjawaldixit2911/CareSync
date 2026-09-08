import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Heart, 
  MapPin, 
  AlertOctagon, 
  Clock, 
  Plus, 
  Phone, 
  Shield, 
  Activity, 
  CheckCircle2,
  ChevronRight,
  Filter,
  Thermometer,
  ShieldCheck,
  Droplet,
  Users,
  Info,
  Calendar
} from 'lucide-react'

const BloodDonation = () => {
  const { backendUrl, token, slotDateFormat } = useContext(AppContext)

  // Navigation tabs: 'requests', 'inventory', 'donors-map', 'register', 'request-blood'
  const [activeTab, setActiveTab] = useState('requests')

  // Stock State
  const [bloodStock, setBloodStock] = useState(null)
  const [stockStats, setStockStats] = useState({ totalUnits: 118, storageTemperature: '3.5°C' })
  const [isStockLoading, setIsStockLoading] = useState(false)

  // Donors State
  const [donors, setDonors] = useState([])
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all')
  const [isDonorsLoading, setIsDonorsLoading] = useState(false)

  // Active Requests State
  const [bloodRequests, setBloodRequests] = useState([])
  const [isRequestsLoading, setIsRequestsLoading] = useState(false)

  // Register Donor Form
  const [donorForm, setDonorForm] = useState({
    name: '', bloodGroup: 'O+', phone: '', email: '', address: '', lastDonationDate: ''
  })
  const [isRegLoading, setIsRegLoading] = useState(false)

  // Request Blood Form
  const [requestForm, setRequestForm] = useState({
    patientName: '', bloodGroup: 'O+', units: '', hospital: '', phone: '', urgency: 'Urgent', address: ''
  })
  const [isReqLoading, setIsReqLoading] = useState(false)

  // Selected map pin donor details
  const [hoveredDonor, setHoveredDonor] = useState(null)

  // Fetch Blood Stock
  const fetchStock = async () => {
    setIsStockLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/blood/stock`)
      if (data.success) {
        setBloodStock(data.stock)
        setStockStats({
          totalUnits: data.totalUnits || 118,
          storageTemperature: data.storageTemperature || '3.5°C'
        })
      }
    } catch (err) {
      console.error('Fetch stock error:', err)
      // Fallback default stock
      setBloodStock({
        "O+": { units: 28, status: "Adequate", canGiveTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"] },
        "O-": { units: 8, status: "Low", canGiveTo: ["All Types (Universal Donor)"], canReceiveFrom: ["O-"] },
        "A+": { units: 22, status: "Adequate", canGiveTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
        "A-": { units: 6, status: "Low", canGiveTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
        "B+": { units: 31, status: "Adequate", canGiveTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
        "B-": { units: 5, status: "Critical", canGiveTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
        "AB+": { units: 14, status: "Adequate", canGiveTo: ["AB+"], canReceiveFrom: ["Universal Recipient"] },
        "AB-": { units: 4, status: "Critical", canGiveTo: ["AB+", "AB-"], canReceiveFrom: ["AB-", "A-", "B-", "O-"] }
      })
    } finally {
      setIsStockLoading(false)
    }
  }

  // Load registered donors
  const fetchDonors = async () => {
    setIsDonorsLoading(true)
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/blood/list-donors?bloodGroup=${selectedBloodGroup}`
      )
      if (data.success) {
        setDonors(data.donors)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsDonorsLoading(false)
    }
  }

  // Load blood requests
  const fetchRequests = async () => {
    setIsRequestsLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/blood/list-requests`)
      if (data.success) {
        setBloodRequests(data.requests)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsRequestsLoading(false)
    }
  }

  useEffect(() => {
    fetchStock()
    fetchRequests()
  }, [])

  useEffect(() => {
    fetchDonors()
  }, [selectedBloodGroup])

  // Donor Onboarding Submit
  const handleRegisterDonorSubmit = async (e) => {
    e.preventDefault()
    if (!donorForm.name || !donorForm.phone || !donorForm.email || !donorForm.address) {
      return toast.warning('Please enter required details')
    }

    setIsRegLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blood/register`,
        {
          name: donorForm.name,
          bloodGroup: donorForm.bloodGroup,
          phone: donorForm.phone,
          email: donorForm.email,
          address: donorForm.address,
          lastDonationDate: donorForm.lastDonationDate || ''
        },
        token ? { headers: { token } } : {}
      )

      if (data.success) {
        toast.success(data.message || 'Donor registered successfully!')
        setDonorForm({ name: '', bloodGroup: 'O+', phone: '', email: '', address: '', lastDonationDate: '' })
        fetchDonors()
        setActiveTab('donors-map')
      } else {
        toast.error(data.message || 'Failed to register donor.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setIsRegLoading(false)
    }
  }

  // Request Blood Submit
  const handleRequestBloodSubmit = async (e) => {
    e.preventDefault()
    if (!requestForm.patientName || !requestForm.units || !requestForm.hospital || !requestForm.phone || !requestForm.address) {
      return toast.warning('Please fill in all required fields')
    }

    setIsReqLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blood/request`,
        requestForm,
        token ? { headers: { token } } : {}
      )

      if (data.success) {
        toast.success('🩸 Blood request logged successfully in active emergency queue!')
        setRequestForm({
          patientName: '', bloodGroup: 'O+', units: '', hospital: '', phone: '', urgency: 'Urgent', address: ''
        })
        fetchRequests()
        setActiveTab('requests')
      } else {
        toast.error(data.message || 'Request failed.')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsReqLoading(false)
    }
  }

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto py-6 px-4 sm:px-6 relative">
      
      {/* Top Header & Nav Pills Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-zinc-200/60 dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Blood Donation &amp; Registry
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">
            Fulfill emergency triage blood requests and connect with active donors.
          </p>
        </div>

        {/* Top-Right Pill Nav Buttons */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs overflow-x-auto no-scrollbar max-w-full">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'requests' 
                ? 'bg-white text-blue-600 dark:bg-white dark:text-[#0071e3] shadow-md' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Emergency Requests
          </button>
          
          <button 
            onClick={() => setActiveTab('donors-map')}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'donors-map' 
                ? 'bg-white text-blue-600 dark:bg-white dark:text-[#0071e3] shadow-md' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Nearby Donors Map
          </button>

          <button 
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'register' 
                ? 'bg-white text-blue-600 dark:bg-white dark:text-[#0071e3] shadow-md' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Register as Donor
          </button>

          <button 
            onClick={() => setActiveTab('request-blood')}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'request-blood' 
                ? 'bg-white text-blue-600 dark:bg-white dark:text-[#0071e3] shadow-md' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Request Blood
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DYNAMIC TABS WORKSPACE (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: EMERGENCY REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500" /> ACTIVE EMERGENCY REQUESTS
              </h3>

              {isRequestsLoading ? (
                <div className="py-16 text-center text-xs text-zinc-400">Loading emergency requests...</div>
              ) : bloodRequests.length === 0 ? (
                <div className="py-20 text-center text-xs text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl space-y-2">
                  <p className="font-medium text-zinc-400 dark:text-zinc-500">No active blood requests logged.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bloodRequests.map((req) => (
                    <div 
                      key={req._id}
                      className="bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            req.urgency === 'Critical' 
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30' 
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" /> {req.urgency}
                          </span>
                          
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {req.status || 'Active'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-black border border-red-500/20">
                              {req.bloodGroup}
                            </span>
                            <span>{req.units} Units Required</span>
                          </h4>
                          <p className="text-zinc-600 dark:text-zinc-300 mt-1 font-bold text-xs">{req.patientName}</p>
                        </div>

                        <div className="space-y-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-850">
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" /> <span className="font-semibold text-zinc-700 dark:text-zinc-300">{req.hospital}</span></p>
                          <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" /> {req.address}</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" /> {req.phone}</p>
                        </div>
                      </div>

                      <a 
                        href={`tel:${req.phone}`}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/20 active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" /> Direct Call Hospital
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NEARBY DONORS RADAR MAP */}
          {activeTab === 'donors-map' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400 flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-red-500" /> Nearby Donors Radar Map
                </h3>
                
                {/* Filter blood group */}
                <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-xl text-xs">
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  <select 
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="bg-transparent font-semibold focus:outline-none text-xs dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="all">All Blood Groups</option>
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* MOCK GOOGLE MAP COMPONENT */}
              <div className="relative w-full h-80 rounded-3xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col justify-between p-4 shadow-sm select-none">
                {/* Grid Visual Canvas */}
                <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
                
                {/* Central Target Landmark */}
                <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-600"></div>
                  </div>
                  <span className="text-[9px] font-bold text-red-600 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-red-500/30 shadow-sm mt-1">CareSync Central Bank</span>
                </div>

                {/* Render mock donor coordinates mapping */}
                {donors.map((donor, idx) => {
                  const topOffset = 50 + ((donor.latitude - 12.9716) * 1200)
                  const leftOffset = 50 + ((donor.longitude - 77.5946) * 1200)
                  return (
                    <div 
                      key={donor._id || idx}
                      className="absolute z-10 cursor-pointer"
                      style={{ top: `${Math.max(12, Math.min(88, topOffset))}%`, left: `${Math.max(12, Math.min(88, leftOffset))}%` }}
                      onMouseEnter={() => setHoveredDonor(donor)}
                      onMouseLeave={() => setHoveredDonor(null)}
                    >
                      <div className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white text-[9px] font-black shadow-lg border-2 border-white dark:border-zinc-900 animate-bounce">
                        {donor.bloodGroup}
                      </div>
                    </div>
                  )
                })}

                {/* Hover overlay panel */}
                {hoveredDonor && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-20 flex justify-between items-center animate-in fade-in duration-150">
                    <div className="text-xs">
                      <p className="font-extrabold text-zinc-900 dark:text-white">{hoveredDonor.name}</p>
                      <p className="text-[10px] text-zinc-400">{hoveredDonor.address} • {hoveredDonor.phone}</p>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-black border border-red-500/20">
                      {hoveredDonor.bloodGroup}
                    </span>
                  </div>
                )}

                <div className="z-10 text-[10px] text-zinc-600 dark:text-zinc-300 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-xs font-medium">
                  💡 Hover pins to view donor profile &amp; distance.
                </div>
              </div>

              {/* Donors List Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {donors.map((donor) => (
                  <div key={donor._id} className="p-4 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-[#141416] flex justify-between items-center shadow-sm hover:border-red-500/30 transition-all">
                    <div className="space-y-1">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{donor.name}</p>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> {donor.address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-black border border-red-500/20">
                        {donor.bloodGroup}
                      </span>
                      <a href={`tel:${donor.phone}`} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DONOR REGISTRATION FORM */}
          {activeTab === 'register' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm space-y-5 max-w-xl">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" /> Join as a Volunteer Blood Donor
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Your registration helps save lives in acute emergency trauma situations.</p>
              </div>

              <form onSubmit={handleRegisterDonorSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={donorForm.name}
                      onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Blood Group *</label>
                    <select
                      value={donorForm.bloodGroup}
                      onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={donorForm.phone}
                      onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Email ID *</label>
                    <input
                      type="email"
                      required
                      value={donorForm.email}
                      onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                      placeholder="vikram@example.com"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Residential City / Address *</label>
                    <input
                      type="text"
                      required
                      value={donorForm.address}
                      onChange={(e) => setDonorForm({ ...donorForm, address: e.target.value })}
                      placeholder="e.g. Indiranagar, Bangalore"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Last Blood Donation Date (Leave empty if first-time donor)</label>
                    <input
                      type="date"
                      value={donorForm.lastDonationDate}
                      onChange={(e) => setDonorForm({ ...donorForm, lastDonationDate: e.target.value })}
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-2xl space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <p className="font-bold text-zinc-700 dark:text-zinc-200">📋 Eligibility Checklist:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Minimum weight of 50 kilograms.</li>
                    <li>Age between 18 and 65 years.</li>
                    <li>Must be at least 90 days since previous donation.</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isRegLoading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  {isRegLoading ? 'Submitting Registration...' : 'Complete Donor Registration'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: REQUEST BLOOD FORM */}
          {activeTab === 'request-blood' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm space-y-5 max-w-xl">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-600" /> Request Blood Bank Reserve
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Emergency requests are dispatched to regional hospital blood banks immediately.</p>
              </div>

              <form onSubmit={handleRequestBloodSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.patientName}
                      onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
                      placeholder="e.g. Jordan Wilkes"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Required Blood Group *</label>
                    <select
                      value={requestForm.bloodGroup}
                      onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Units Required *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={requestForm.units}
                      onChange={(e) => setRequestForm({ ...requestForm, units: e.target.value })}
                      placeholder="e.g. 2"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Urgency Level *</label>
                    <select
                      value={requestForm.urgency}
                      onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="Critical">Critical (Immediate Emergency)</option>
                      <option value="Urgent">Urgent (Within 6–12 Hours)</option>
                      <option value="Standard">Standard (Scheduled Surgery)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Hospital Name &amp; Ward Number *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.hospital}
                      onChange={(e) => setRequestForm({ ...requestForm, hospital: e.target.value })}
                      placeholder="e.g. CareSync Memorial Hospital (Trauma Ward 4B)"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">City / Location *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.address}
                      onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                      placeholder="e.g. Bangalore Central"
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReqLoading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  {isReqLoading ? 'Submitting Emergency Request...' : 'Dispatch Blood Request'}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DONATION CRITERIA & COMPATIBILITY CARD (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Donation Criteria Card */}
          <div className="bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5 text-zinc-900 dark:text-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> DONATION CRITERIA
            </h3>

            <div className="p-4 bg-white dark:bg-white text-zinc-900 rounded-2xl shadow-sm border border-zinc-200/50 space-y-1 text-xs">
              <p className="font-bold text-zinc-900 text-xs">Who can donate blood?</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">Age Check</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Must be between 18 and 65 years old.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">Weight Range</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Must weigh at least 50 kg.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">Interval Period</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">At least 90 days interval between donation schedules.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Compatibility Guide */}
          <div className="bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-red-500 fill-red-500" /> Universal Compatibility
            </h4>
            
            <div className="space-y-2 text-[11px]">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200/50 dark:border-red-900/40">
                <span className="font-black text-red-600 dark:text-red-400 block text-xs">O Negative (O-)</span>
                <span className="text-zinc-600 dark:text-zinc-300">Universal Red Cell Donor — Can give blood to all 8 blood types.</span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-900/40">
                <span className="font-black text-blue-600 dark:text-blue-400 block text-xs">AB Positive (AB+)</span>
                <span className="text-zinc-600 dark:text-zinc-300">Universal Recipient — Can safely receive blood from any blood type.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BloodDonation
