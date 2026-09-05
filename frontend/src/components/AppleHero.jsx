import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Play, Video, Star, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const AppleHero = ({ onOpenDemo }) => {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-[#f5f5f7] dark:bg-[#18181b] text-[#1d1d1f] dark:text-zinc-100 -mx-4 sm:-mx-[10%] px-4 sm:px-[10%] border-b border-[#e5e5ea] dark:border-[#27272a]">
      
      {/* Calm Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#0071e3]/10 dark:from-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top Header & Apple Typography */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Apple-style Category Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#27272a] border border-[#d2d2d7]/80 dark:border-[#3f3f46] text-[#0071e3] dark:text-sky-400 text-xs font-semibold shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
            <span>CareSync 2.0 • The Unified Health Architecture</span>
          </motion.div>

          {/* Huge Apple Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1d1d1f] dark:text-white leading-[1.05]">
              Health, unified.
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#86868b] dark:text-zinc-400 font-normal leading-relaxed tracking-tight">
              Patient consultations. Real-time vitals. Hospital operations. <br className="hidden sm:inline" />
              Engineered into one remarkably intuitive ecosystem.
            </p>
          </motion.div>

          {/* Apple CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1"
          >
            <button
              onClick={() => navigate('/doctors')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Consult a Specialist</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white dark:bg-[#27272a] hover:bg-[#f5f5f7] dark:hover:bg-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 border border-[#d2d2d7] dark:border-[#3f3f46] font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Watch Keynote Demo</span>
              <Play className="w-3.5 h-3.5 fill-current text-[#0071e3]" />
            </button>
          </motion.div>

          {/* Social Proof Avatars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 pt-1 text-xs text-[#86868b] dark:text-zinc-400"
          >
            <img 
              src={assets.group_profiles} 
              alt="Patient Network" 
              className="w-20 h-auto border-2 border-white dark:border-[#27272a] rounded-full shadow-xs" 
            />
            <div className="text-left leading-tight">
              <span className="font-bold text-[#1d1d1f] dark:text-zinc-200 block">10,000+ Verified Appointments</span>
              <span className="text-[11px]">Board-certified clinical hospital network</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual Mockup: The 3 Doctors Cover Photo with Floating Telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl p-3 sm:p-5 bg-white dark:bg-[#242428] border border-[#e5e5ea] dark:border-[#3f3f46] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden">
            
            <div className="relative rounded-2xl bg-gradient-to-b from-[#f0f4f9] to-[#e4edf8] dark:from-[#1c1c20] dark:to-[#18181b] border border-[#dce6f2] dark:border-[#333338] p-4 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Details within Showcase */}
              <div className="space-y-5 lg:max-w-md text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Medical Council Specialists</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                  World-class clinical team ready at your fingertips.
                </h3>

                <p className="text-xs sm:text-sm text-[#86868b] dark:text-zinc-300 leading-relaxed">
                  Connect instantly via HD encrypted video consultation, review diagnostic reports with AI insights, or book in-person hospital visits.
                </p>

                {/* Live Floating Feature Highlights */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-[#27272a]/90 border border-[#e5e5ea] dark:border-[#3f3f46] backdrop-blur-sm space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0071e3]">
                      <Video className="w-3.5 h-3.5" />
                      <span>Instant Video</span>
                    </div>
                    <p className="text-[11px] text-[#86868b] dark:text-zinc-400">&lt; 3 mins wait time</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 dark:bg-[#27272a]/90 border border-[#e5e5ea] dark:border-[#3f3f46] backdrop-blur-sm space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>99.8% Approval</span>
                    </div>
                    <p className="text-[11px] text-[#86868b] dark:text-zinc-400">Over 5,000+ reviews</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('/doctors')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0071e3] hover:text-[#0077ed] group cursor-pointer"
                  >
                    <span>Browse all 15 specialty departments</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Side: 3 Doctors Cover Photo (header_img) */}
              <div className="relative w-full lg:w-1/2 flex items-end justify-center pt-4">
                {/* Ambient photo halo */}
                <div className="absolute inset-0 bg-radial from-blue-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="relative max-w-[420px] w-full">
                  <img
                    src={assets.header_img}
                    alt="Senior Clinical Team - 3 Doctors"
                    className="w-full h-auto object-contain object-bottom drop-shadow-xl select-none"
                  />

                  {/* Floating On-Duty Badge */}
                  <div className="absolute top-4 right-2 sm:right-4 bg-white/95 dark:bg-[#27272a]/95 backdrop-blur-md border border-[#e5e5ea] dark:border-[#3f3f46] rounded-2xl p-2.5 shadow-lg flex items-center gap-2 text-xs font-bold text-[#1d1d1f] dark:text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>3 Specialists On Duty</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>

    </section>
  )
}

export default AppleHero
