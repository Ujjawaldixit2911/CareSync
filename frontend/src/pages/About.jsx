import React from 'react'
import { assets } from '../assets/assets'
import { Sparkles, Shield, Cpu, Zap, Activity, Users, ArrowRight, HeartPulse, CheckCircle2 } from 'lucide-react'

const About = () => {
  return (
    <div className="pb-20 max-w-6xl mx-auto space-y-16">
      {/* Apple-style Hero Section */}
      <div className="text-center py-10 md:py-16 max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d2d2d7]/80 text-[#0071e3] text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
          <span>CareSync Vision • Medical Intelligence</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1d1d1f] leading-tight">
          Clinical care. <br className="hidden sm:inline" />
          Redefined for everyone.
        </h1>
        
        <p className="text-[#86868b] text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
          Bridging the gap between clinical excellence, live telemetry diagnostics, and frictionless medical operations worldwide.
        </p>
      </div>

      {/* Main Core Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Visual Image Frame (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl p-3 bg-white border border-[#e5e5ea] shadow-sm">
          <div className="relative overflow-hidden rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea]">
            <img 
              className="w-full object-cover aspect-[4/3] rounded-2xl select-none" 
              src={assets.about_image} 
              alt="CareSync Healthcare Team" 
            />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e5e5ea] shadow-xs flex items-center gap-2 text-xs font-bold text-[#1d1d1f]">
              <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Dedicated Clinical Leadership</span>
            </div>
          </div>
        </div>

        {/* Right Side: Narrative Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e5e5ea] shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0071e3] uppercase tracking-wider">
              <Cpu className="w-4 h-4" /> Who We Are
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1d1d1f] tracking-tight">
              An ecosystem built for patients and clinicians alike.
            </h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              Welcome to <span className="font-bold text-[#1d1d1f]">CareSync</span>. We engineered a unified health architecture that coordinates consultations, emergency hospital dispatching, vitals tracking, and pharmaceutical fulfilment in one remarkably intuitive platform.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e5e5ea] shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Activity className="w-4 h-4" /> Our Mission
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1d1d1f] tracking-tight">
              Instant diagnostic answers, zero waiting queues.
            </h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              By combining proactive AI analysis with board-certified doctor networks, we empower users with immediate medical triage and reliable hospital scheduling whenever care is needed.
            </p>
          </div>
        </div>
      </div>

      {/* Apple 3-Column Performance Stats */}
      <div className="bg-white border border-[#e5e5ea] rounded-3xl p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center shadow-xs">
        <div className="space-y-1">
          <h4 className="text-4xl sm:text-5xl font-black text-[#0071e3] tracking-tight">99.8%</h4>
          <p className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Consultation Satisfaction</p>
          <span className="text-[11px] text-[#86868b] block">Based on 15,000+ verified ratings</span>
        </div>

        <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-[#e5e5ea] py-6 sm:py-0">
          <h4 className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight">15+</h4>
          <p className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Specialty Departments</p>
          <span className="text-[11px] text-[#86868b] block">From Cardiology to Neurology</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-4xl sm:text-5xl font-black text-[#1d1d1f] tracking-tight">&lt; 3 min</h4>
          <p className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Average Response Time</p>
          <span className="text-[11px] text-[#86868b] block">For real-time emergency triage</span>
        </div>
      </div>

      {/* Why Choose CareSync Bento Cards */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1d1d1f]">Why Choose CareSync</h2>
          <p className="text-sm text-[#86868b]">Engineered for clinical precision, user privacy, and uninterrupted reliability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white border border-[#e5e5ea] rounded-3xl p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0071e3]">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1d1d1f]">Instant Appointments</h4>
            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              Book, reschedule, or review prescription notes with zero administrative overhead or waiting room queues.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5ea] rounded-3xl p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1d1d1f]">Verified Specialists</h4>
            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              Every practitioner is credentialed with verifiable medical council records, clinical accreditations, and hospital affiliations.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5ea] rounded-3xl p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1d1d1f]">Enterprise Security</h4>
            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              HIPAA &amp; GDPR compliant biometric and health record storage protected with end-to-end medical encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
