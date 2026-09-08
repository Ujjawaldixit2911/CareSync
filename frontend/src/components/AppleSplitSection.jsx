import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Activity, Shield, HeartPulse, Building2, Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const AppleSplitSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-[#fbfbfd] text-[#1d1d1f] -mx-4 sm:-mx-[10%] px-4 sm:px-[10%] space-y-28 border-b border-[#e5e5ea]/80">
      
      {/* ===================================================================== */}
      {/* Split Block 1: Clinical Telemetry & Bio-Monitoring                   */}
      {/* ===================================================================== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left: Narrative Copy */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#d2d2d7]/70 text-[#0071e3] text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Continuous Vitals Intelligence</span>
          </div>

          <h2 className="text-3.5xl sm:text-5xl font-black tracking-tight text-[#1d1d1f] leading-[1.08]">
            Diagnostics that never miss a beat.
          </h2>

          <p className="text-base sm:text-lg text-[#86868b] leading-relaxed">
            CareSync continuously synchronizes real-time metrics—from multi-lead ECG rhythm to continuous glucose and blood pressure trends—enabling predictive early-warning intervention before acute symptoms escalate.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Sub-second wearable synchronization with Apple Health & Garmin',
              'Automated arrhythmia and glycemic variability detection',
              'Encrypted clinician telemetry export in HL7 FHIR standard'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-[#1d1d1f] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/ai-hub')}
              className="inline-flex items-center gap-2 text-base font-bold text-[#0071e3] hover:text-[#0077ed] hover:underline cursor-pointer"
            >
              <span>Explore AI Clinical Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Right: Graphic Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-6 sm:p-8 bg-white border border-[#e5e5ea] shadow-xl shadow-slate-100"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Patient Bio-Stream</span>
                <h4 className="text-lg font-black text-[#1d1d1f]">Continuous Cardiac Sinus Flow</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                99.4% Synchronized
              </span>
            </div>

            {/* SVG Visual Flow */}
            <div className="h-40 w-full bg-[#fbfbfd] rounded-2xl p-4 border border-[#e5e5ea] flex flex-col justify-between">
              <div className="flex justify-between text-xs text-[#86868b] font-medium">
                <span>06:00 AM</span>
                <span>12:00 PM</span>
                <span>06:00 PM</span>
                <span>Now</span>
              </div>
              <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 80">
                <path
                  d="M 0 50 Q 50 15, 100 45 T 200 40 T 300 20 T 400 35"
                  fill="none"
                  stroke="#0071e3"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea]">
                <span className="text-[#86868b] block font-semibold">Mean Sinus Rhythm</span>
                <span className="text-lg font-black text-[#1d1d1f]">71 BPM</span>
              </div>
              <div className="p-3 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea]">
                <span className="text-[#86868b] block font-semibold">Heart Rate Variability</span>
                <span className="text-lg font-black text-emerald-600">58 ms (High)</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ===================================================================== */}
      {/* Split Block 2: Hospital Command Ops & Rapid Triage (Flipped Layout)  */}
      {/* ===================================================================== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left: Graphic Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 lg:order-1 relative rounded-3xl p-6 sm:p-8 bg-white border border-[#e5e5ea] shadow-xl shadow-slate-100"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Hospital Central Command</span>
                <h4 className="text-lg font-black text-[#1d1d1f]">ICU & Bed Census Grid</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0071e3] border border-blue-200 text-xs font-bold">
                148 Beds Ready
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Cardiology & CCU', occ: '90%', bar: 'w-[90%] bg-[#0071e3]' },
                { name: 'ICU Critical Care', occ: '96%', bar: 'w-[96%] bg-amber-500' },
                { name: 'General Medicine', occ: '82%', bar: 'w-[82%] bg-emerald-500' }
              ].map((row, idx) => (
                <div key={idx} className="p-3 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea] space-y-1.5">
                  <div className="flex justify-between font-bold text-[#1d1d1f]">
                    <span>{row.name}</span>
                    <span>{row.occ}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`${row.bar} h-full rounded-full`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100 text-slate-800 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Helipad &amp; Trauma Level-1 Active</span>
              <span className="text-emerald-600 font-bold">ETA 3 mins</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Narrative Copy */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2 space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#d2d2d7]/70 text-[#0071e3] text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Command Ops</span>
          </div>

          <h2 className="text-3.5xl sm:text-5xl font-black tracking-tight text-[#1d1d1f] leading-[1.08]">
            A hospital network that communicates instantly.
          </h2>

          <p className="text-base sm:text-lg text-[#86868b] leading-relaxed">
            Eliminate triage bottlenecks with zero-latency bed telemetry, live surgeon shift rosters, ambulance dispatch geolocation, and direct pharmacy supply chains.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Real-time bed census updates across 50+ network facilities',
              'Automated trauma alert routing and operating theater allocation',
              'Comprehensive revenue reconciliation and insurance claim clearing'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-[#1d1d1f] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/hospital')}
              className="inline-flex items-center gap-2 text-base font-bold text-[#0071e3] hover:text-[#0077ed] hover:underline cursor-pointer"
            >
              <span>Launch Hospital Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>

    </section>
  )
}

export default AppleSplitSection
