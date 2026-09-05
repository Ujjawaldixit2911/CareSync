import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Play, HeartPulse, Activity } from 'lucide-react'

const CtaBanner = ({ onOpenDemo }) => {
  const navigate = useNavigate()

  return (
    <section className="py-12 my-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#edf5fd] via-[#f8fafc] to-[#e8f1fb] text-slate-900 rounded-3xl border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-lg">
          
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-0 w-[35vw] h-[35vw] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[25vw] h-[25vw] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#0071e3] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Over 10,000+ Active Patients &amp; Doctors</span>
              </div>

              <h2 className="text-3xl sm:text-4.5xl font-black tracking-tight leading-tight text-slate-900">
                Start managing your health smarter{' '}
                <span className="bg-gradient-to-r from-[#0071e3] via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  with CareSync today.
                </span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience seamless appointment booking, wearable vitals tracking, instant ER coordination, and encrypted health records in one intuitive interface.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => {
                    navigate('/login')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-600/25 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#0071e3]" /> Book a Product Demo
                </button>
              </div>

              {/* Perks / Guarantees */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 pt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free 30-day patient onboarding
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> HIPAA &amp; GDPR compliant
                </span>
              </div>

            </div>

            {/* Right Column Graphic Pill / Quick Metric */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 bg-white/95 border border-slate-200/90 rounded-3xl backdrop-blur-xl shadow-xl w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">CareSync Fast-Track</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Instant Access
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Account Setup</span>
                    <span className="text-slate-900 font-bold">~ 45 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Import (FHIR/Wearables)</span>
                    <span className="text-slate-900 font-bold">Automatic</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Doctor Availability</span>
                    <span className="text-emerald-600 font-bold">Live 24/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Encryption Level</span>
                    <span className="text-[#0071e3] font-bold">AES-256 GCM</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0071e3] to-emerald-500 h-full w-[100%] animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center mt-1.5">Zero downtime guarantee</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default CtaBanner
