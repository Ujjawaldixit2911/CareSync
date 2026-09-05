import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Calendar, 
  Building2, 
  FileText, 
  Lock, 
  CheckCircle2, 
  TrendingUp,
  UserCheck,
  Stethoscope
} from 'lucide-react'

const HeroSection = ({ onOpenDemo }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('vitals')

  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 overflow-hidden">
      {/* Ambient background glow gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: Value Proposition & CTAs ================= */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            
            {/* Trust Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-primary dark:text-sky-400 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Unified Health Ecosystem</span>
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">HIPAA & FHIR Ready</span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12]">
              Unifying Patient Care,{' '}
              <span className="bg-gradient-to-r from-primary via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Fitness, Hospitals
              </span>{' '}
              & Health Records.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-350 leading-relaxed max-w-xl mx-auto lg:mx-0">
              CareSync brings your entire medical journey into one secure, intelligent hub. 
              Book certified specialists, sync wearable fitness vitals, coordinate hospital operations, 
              and access encrypted health records in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-primary" /> Book a Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-850 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>256-Bit Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>500+ Verified Doctors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-500" />
                <span>Real-Time Biometrics</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Abstract Medical SaaS Visual & Live Preview ================= */}
          <div className="lg:col-span-6 relative">
            
            {/* Background Graphic Rings */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/20 via-teal-500/10 to-emerald-500/20 rounded-3xl blur-2xl -z-10 opacity-70" />

            {/* Main Interactive SaaS Container */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-2">CareSync Unified Console</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Synchronized
                </div>
              </div>

              {/* Module Filter Switcher Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100/80 dark:bg-zinc-950/60 rounded-xl text-[11px] font-semibold">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'vitals'
                      ? 'bg-white dark:bg-zinc-850 text-primary shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Activity className="w-3 h-3" /> Vitals
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-white dark:bg-zinc-850 text-primary shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Calendar className="w-3 h-3" /> Doctors
                </button>
                <button
                  onClick={() => setActiveTab('hospital')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'hospital'
                      ? 'bg-white dark:bg-zinc-850 text-primary shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Building2 className="w-3 h-3" /> Hospitals
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'records'
                      ? 'bg-white dark:bg-zinc-850 text-primary shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3 h-3" /> Records
                </button>
              </div>

              {/* Dynamic Interactive Card Content */}
              {activeTab === 'vitals' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-zinc-950/40 border border-sky-100 dark:border-zinc-800/80">
                      <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
                        <span>Heart Rate</span>
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-zinc-900 dark:text-white">72</span>
                        <span className="text-[10px] text-zinc-400">BPM</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Optimal Rhythm</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-zinc-950/40 border border-emerald-100 dark:border-zinc-800/80">
                      <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
                        <span>Blood Oxygen</span>
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-zinc-900 dark:text-white">99%</span>
                        <span className="text-[10px] text-zinc-400">SpO2</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Excellent</span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-zinc-950/40 border border-indigo-100 dark:border-zinc-800/80">
                      <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
                        <span>Daily Steps</span>
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-zinc-900 dark:text-white">8,420</span>
                        <span className="text-[10px] text-zinc-400">/ 10k</span>
                      </div>
                      <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">84% Goal Met</span>
                    </div>
                  </div>

                  {/* Vitals Graph Representation */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/70 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">Continuous ECG & Bio-Rhythm</span>
                      <span className="text-[10px] text-primary font-bold">Sync: Live Apple & Garmin API</span>
                    </div>
                    <div className="h-10 w-full flex items-center justify-between gap-1">
                      {[40, 65, 30, 85, 45, 95, 25, 70, 50, 80, 40, 90, 60, 45, 80, 55].map((val, idx) => (
                        <div
                          key={idx}
                          style={{ height: `${val}%` }}
                          className="flex-1 bg-gradient-to-t from-primary/40 to-teal-400 rounded-full transition-all duration-300 hover:bg-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Dr. Sarah Jenkins</h4>
                        <p className="text-[10px] text-zinc-500">Chief of Cardiology • Metro Health</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-lg border border-emerald-500/20">
                      Confirmed Today 10:30 AM
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 text-zinc-500">
                    <span>Includes HD Telehealth Video link</span>
                    <button onClick={() => navigate('/doctors')} className="text-primary font-bold hover:underline cursor-pointer">
                      View 500+ Doctors →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'hospital' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">City Hospital ER Network</h4>
                        <p className="text-[10px] text-zinc-500">4 ICU Beds Available • GPS Ambulance Active</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold">3 min Triage ETA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 text-zinc-500">
                    <span>Emergency SOS & blood donor dispatch</span>
                    <button onClick={() => navigate('/emergency-sos')} className="text-rose-500 font-bold hover:underline cursor-pointer">
                      ER Command Desk →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'records' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Unified Health Vault</h4>
                        <p className="text-[10px] text-zinc-500">32 Lab Records • 8 Prescriptions Synced</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-md">
                      FHIR v4
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 text-zinc-500">
                    <span>Decentralized end-to-end encrypted storage</span>
                    <button onClick={() => navigate('/my-appointments')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                      Open Vault →
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Mini Banner */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dr. Verification: 100% Certified</span>
                </div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">CareSync Engine v3.4</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
