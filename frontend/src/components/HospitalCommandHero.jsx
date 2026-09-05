import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Phone, 
  Calendar, 
  Clock, 
  Stethoscope, 
  HelpCircle, 
  MapPin, 
  AlertOctagon, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  ExternalLink,
  ChevronRight,
  Activity,
  Bed,
  Users
} from 'lucide-react'
import { toast } from 'react-toastify'

const HospitalCommandHero = ({ onOpenAppointment }) => {
  const navigate = useNavigate()

  // Modals for Quick Action Pills
  const [activeModal, setActiveModal] = useState(null) // 'visiting', 'emergency', 'map', 'faq'

  return (
    <div className="space-y-6">
      
      {/* Top Announcement Pill */}
      <div className="w-full bg-[#f5f5f7] dark:bg-[#27272a] text-[#1d1d1f] dark:text-zinc-200 text-center py-2 px-4 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 rounded-full border border-[#d2d2d7] dark:border-[#3f3f46] shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
        <span>CareSync Memorial Hospital System — 24/7 Acute Care &amp; Multispecialty Center</span>
      </div>

      {/* Main Hero Banner: Apple Light Theme with #f5f5f7 and #bcbdbf */}
      <div className="relative overflow-hidden rounded-3xl bg-[#f5f5f7] dark:bg-[#1f1f23] text-[#1d1d1f] dark:text-zinc-100 p-6 sm:p-10 lg:p-12 border border-[#d2d2d7] dark:border-[#3f3f46] shadow-xl">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Hospital Title, Subtitle, CTAs & Trust Badges (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#27272a] text-[#0071e3] border border-blue-200 dark:border-[#3f3f46] text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
              <span>CareSync Health System</span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-3.5xl sm:text-5xl lg:text-5.5xl font-black tracking-tight text-[#1d1d1f] dark:text-white leading-[1.08]">
              CareSync Memorial Hospital
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#86868b] dark:text-zinc-300 font-normal leading-relaxed max-w-xl">
              Advanced surgical facilities, 24/7 level-1 acute trauma response, continuous bio-telemetry, and over 500+ board-certified clinical specialists.
            </p>

            {/* 3 Distinct Action Buttons in Pill Style */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* Button 1: Find Doctor & Book Slot */}
              <button
                onClick={() => navigate('/doctors')}
                className="px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Find Doctors &amp; Book Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Button 2: Hospital Bed & Ward Management */}
              <button
                onClick={() => navigate('/hospital')}
                className="px-5 py-3 rounded-full bg-white dark:bg-[#27272a] hover:bg-[#f0f0f2] dark:hover:bg-[#333338] text-[#1d1d1f] dark:text-zinc-100 border border-[#d2d2d7] dark:border-[#3f3f46] font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Hospital Bed &amp; Ward Ops</span>
              </button>

              {/* Button 3: Clinical Vitals Dashboard */}
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 rounded-full bg-white dark:bg-[#27272a] hover:bg-[#f0f0f2] dark:hover:bg-[#333338] text-[#0071e3] dark:text-sky-400 border border-[#d2d2d7] dark:border-[#3f3f46] font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Activity className="w-4 h-4 text-[#0071e3]" />
                <span>Clinical Vitals Dashboard</span>
              </button>

            </div>

            {/* 3 Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#86868b] dark:text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                <span className="text-[#1d1d1f] dark:text-zinc-200">500+ Board-certified specialists</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0071e3]" />
                <span className="text-[#1d1d1f] dark:text-zinc-200">24/7 Level-1 trauma response</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                <span className="text-[#1d1d1f] dark:text-zinc-200">Patient-first care protocols</span>
              </span>
            </div>

          </div>

          {/* RIGHT: Glassmorphic Integrated Care Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            
            {/* Top Floating Badge */}
            <div className="absolute -top-3.5 right-4 z-10 px-3.5 py-1 rounded-xl bg-white dark:bg-[#27272a] border border-[#d2d2d7] dark:border-[#3f3f46] text-right shadow-md">
              <span className="text-[9px] uppercase tracking-wider text-[#86868b] dark:text-zinc-400 block font-bold">At a Glance</span>
              <span className="text-sm font-black text-[#0071e3] dark:text-sky-400">450+ Beds • 96% Recovery Rate</span>
            </div>

            {/* Main Integrated Care Card */}
            <div className="rounded-3xl bg-white dark:bg-[#242428] border border-[#d2d2d7] dark:border-[#3f3f46] p-6 sm:p-7 space-y-6 shadow-xl text-left">
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0071e3] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">
                  • Integrated Care
                </span>
                <h3 className="text-xl font-black text-[#1d1d1f] dark:text-white">CareSync Central Medical Center</h3>
                <p className="text-xs text-[#86868b] dark:text-zinc-400 font-medium">
                  50+ Specialty Wards • Level 1 Trauma Center • Helicopter Helipad Active
                </p>
              </div>

              {/* Department Status Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#f5f5f7] dark:bg-[#27272a] rounded-xl border border-[#e5e5ea] dark:border-[#3f3f46]">
                  <span className="text-[10px] text-[#86868b] dark:text-zinc-400 block font-medium">Cardiology CCU</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">90% Occupancy</span>
                </div>
                <div className="p-2.5 bg-[#f5f5f7] dark:bg-[#27272a] rounded-xl border border-[#e5e5ea] dark:border-[#3f3f46]">
                  <span className="text-[10px] text-[#86868b] dark:text-zinc-400 block font-medium">Critical ICU</span>
                  <span className="font-extrabold text-[#0071e3] dark:text-sky-400">12 Ventilators Free</span>
                </div>
              </div>

              {/* 24/7 Red Emergency Call Pill */}
              <a
                href="tel:+14155550132"
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold transition-all shadow-md shadow-red-500/20 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 fill-red-600 text-red-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-red-100 block font-extrabold">Emergency Dispatch 24/7</span>
                  <span className="text-sm font-black">+1 (415) 555-0132</span>
                </div>
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* "I NEED TO..." QUICK ACTION PILLS BAR                                     */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#1f1f23] border border-[#d2d2d7] dark:border-[#3f3f46] rounded-3xl shadow-sm text-left space-y-3">
        
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#0071e3] dark:text-sky-400">
            I Need To...
          </span>
          <span className="text-[11px] text-[#86868b] dark:text-zinc-400">Direct Patient &amp; Visitor Portals</span>
        </div>

        {/* Action Pills Row */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          
          {/* 1. Book a Doctor Visit */}
          <button
            onClick={() => navigate('/doctors')}
            className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] hover:bg-[#0071e3] hover:text-white border border-[#e5e5ea] dark:border-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Book a Doctor Visit</span>
          </button>

          {/* 2. Call Emergency Hotline */}
          <a
            href="tel:+14155550132"
            className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] hover:bg-[#0071e3] hover:text-white border border-[#e5e5ea] dark:border-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Call the Hospital</span>
          </a>

          {/* 3. Check Visiting Hours */}
          <button
            onClick={() => setActiveModal('visiting')}
            className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] hover:bg-[#0071e3] hover:text-white border border-[#e5e5ea] dark:border-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Visiting Hours</span>
          </button>

          {/* 4. Pharmacy & Medicine Orders */}
          <button
            onClick={() => navigate('/pharmacy-shop')}
            className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] hover:bg-[#0071e3] hover:text-white border border-[#e5e5ea] dark:border-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Browse Pharmacy</span>
          </button>

          {/* 5. AI Symptom Checker */}
          <button
            onClick={() => navigate('/ai-hub')}
            className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] hover:bg-[#0071e3] hover:text-white border border-[#e5e5ea] dark:border-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AI Symptom Checker</span>
          </button>

          {/* 6. Hospital Campus Map & Parking */}
          <button
            onClick={() => setActiveModal('map')}
            className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#27272a] hover:bg-[#0071e3] hover:text-white border border-[#e5e5ea] dark:border-[#3f3f46] text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Campus Map &amp; Parking</span>
          </button>

          {/* 7. Emergency Ambulance Dispatch (High-Priority Red Pill) */}
          <button
            onClick={() => navigate('/emergency-sos')}
            className="px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            <span>Emergency Ambulance SOS</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VISITING HOURS                                                   */}
      {/* ========================================================================= */}
      {activeModal === 'visiting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setActiveModal(null)} className="fixed inset-0" />
          <div className="relative w-full max-w-md bg-white dark:bg-[#242428] border border-[#e5e5ea] dark:border-[#3f3f46] rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-left text-[#1d1d1f] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea] dark:border-[#3f3f46]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0071e3]" /> Hospital Visiting Hours
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46]">
                <p className="font-bold">General Inpatient Wards</p>
                <p className="text-[#86868b] dark:text-zinc-400 mt-0.5">Monday – Sunday: 09:00 AM – 08:00 PM</p>
              </div>

              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46]">
                <p className="font-bold">ICU &amp; Critical Care</p>
                <p className="text-[#86868b] dark:text-zinc-400 mt-0.5">Strict Hours: 10:00 AM – 12:00 PM &amp; 05:00 PM – 07:00 PM</p>
              </div>

              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46]">
                <p className="font-bold">Pediatrics &amp; Neonatal</p>
                <p className="text-[#86868b] dark:text-zinc-400 mt-0.5">Parents: 24/7 Access • General Visitors: 01:00 PM – 06:00 PM</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Close Guidelines
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MAP & DIRECTIONS                                                 */}
      {/* ========================================================================= */}
      {activeModal === 'map' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setActiveModal(null)} className="fixed inset-0" />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#242428] border border-[#e5e5ea] dark:border-[#3f3f46] rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-left text-[#1d1d1f] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea] dark:border-[#3f3f46]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0071e3]" /> CareSync Hospital Location &amp; Parking
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold">CareSync Central Medical Campus</p>
              <p className="text-[#86868b] dark:text-zinc-400">54709 Willms Station, Suite 350, Seattle, WA 98101, USA</p>
              
              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46] text-[#0071e3] dark:text-sky-400 text-xs">
                🅿️ Free Valet &amp; Underground Parking Available at Emergency Gate 2.
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null)
                window.open('https://maps.google.com/?q=Seattle+General+Hospital', '_blank')
              }}
              className="w-full py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CLINICAL FAQ                                                     */}
      {/* ========================================================================= */}
      {activeModal === 'faq' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setActiveModal(null)} className="fixed inset-0" />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#242428] border border-[#e5e5ea] dark:border-[#3f3f46] rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-left text-[#1d1d1f] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea] dark:border-[#3f3f46]">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0071e3]" /> Clinical &amp; Admission FAQ
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46] space-y-1">
                <p className="font-bold">What documents are needed for admission?</p>
                <p className="text-[#86868b] dark:text-zinc-400">Government ID, active insurance policy card, and any recent lab reports or medical history summaries.</p>
              </div>

              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46] space-y-1">
                <p className="font-bold">Is 24/7 emergency walk-in available?</p>
                <p className="text-[#86868b] dark:text-zinc-400">Yes, the acute trauma center and trauma ICU operate continuously without prior booking.</p>
              </div>

              <div className="p-3 bg-[#f5f5f7] dark:bg-[#27272a] rounded-2xl border border-[#e5e5ea] dark:border-[#3f3f46] space-y-1">
                <p className="font-bold">Can I book virtual follow-ups post-discharge?</p>
                <p className="text-[#86868b] dark:text-zinc-400">Yes, your attending doctor will provide telemedicine check-in links directly in your patient dashboard.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Close FAQ
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default HospitalCommandHero
