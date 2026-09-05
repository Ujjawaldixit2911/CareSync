import React from 'react'
import { assets } from '../assets/assets'
import { Phone, Mail, MapPin, Briefcase, Sparkles, ArrowRight, MessageSquare, Clock, Globe } from 'lucide-react'

const Contact = () => {
  return (
    <div className="pb-20 max-w-6xl mx-auto space-y-12">
      {/* Apple-style Hero Section */}
      <div className="text-center py-10 md:py-16 max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d2d2d7]/80 text-[#0071e3] text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
          <span>CareSync Global Support Desk</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1d1d1f] leading-tight">
          Get in touch.
        </h1>
        
        <p className="text-[#86868b] text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
          Have questions regarding patient scheduling, clinical integrations, or career opportunities? Our global team is here to assist.
        </p>
      </div>

      {/* Main Apple Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Visual Image Card (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl p-3 bg-white border border-[#e5e5ea] shadow-sm space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea]">
            <img 
              className="w-full object-cover aspect-[4/3] rounded-2xl select-none" 
              src={assets.contact_image} 
              alt="CareSync Support Team" 
            />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e5e5ea] shadow-xs flex items-center gap-2 text-xs font-bold text-[#1d1d1f]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Support Lines Active (24/7)</span>
            </div>
          </div>

          <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1d1d1f]">
              <Clock className="w-4 h-4 text-[#0071e3]" />
              <span>Rapid Response Commitment</span>
            </div>
            <p className="text-[11px] text-[#86868b] leading-relaxed">
              Clinical emergencies are routed immediately. Non-urgent inquiries receive responses within under 2 business hours.
            </p>
          </div>
        </div>

        {/* Right Side: Contact Information & Careers (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Headquarters Card */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e5e5ea] shadow-sm space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0071e3]" />
                  Corporate Headquarters
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">Primary Administrative &amp; Technology Center</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#f5f5f7] text-zinc-700 border border-[#e5e5ea] text-xs font-semibold">
                USA
              </span>
            </div>
            
            <div className="space-y-1 text-sm text-[#4b5563] leading-relaxed">
              <p className="font-bold text-[#1d1d1f]">CareSync Technologies Inc.</p>
              <p>54709 Willms Station, Suite 350</p>
              <p>Seattle, Washington 98101, United States</p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a 
                href="tel:+14155550132" 
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-[#eceef1] border border-[#e5e5ea] transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-[#e5e5ea] shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#86868b] block font-bold uppercase tracking-wider">Direct Hotline</span>
                  <span className="text-xs font-bold text-[#1d1d1f]">(415) 555-0132</span>
                </div>
              </a>

              <a 
                href="mailto:support@caresync.ai" 
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-[#eceef1] border border-[#e5e5ea] transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-[#e5e5ea] shadow-xs group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#86868b] block font-bold uppercase tracking-wider">Clinical Inquiries</span>
                  <span className="text-xs font-bold text-[#1d1d1f]">support@caresync.ai</span>
                </div>
              </a>
            </div>
          </div>

          {/* Careers & Engineering Card */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e5e5ea] shadow-sm space-y-5 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Careers at CareSync
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold">
                12 Roles Open
              </span>
            </div>
            
            <p className="text-[#86868b] text-xs sm:text-sm leading-relaxed">
              We are constantly seeking passionate healthcare engineers, UI/UX designers, and clinical researchers to build the next generation of healthcare tools.
            </p>

            <button className="px-7 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer">
              <span>Explore Open Positions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Contact
