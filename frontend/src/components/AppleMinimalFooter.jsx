import React from 'react'
import { Link } from 'react-router-dom'
import { HeartPulse, ShieldCheck, Globe } from 'lucide-react'

const AppleMinimalFooter = () => {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#18181b] text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed pt-12 pb-16 -mx-4 sm:-mx-[10%] px-4 sm:px-[10%] mt-12 border-t border-[#e5e5ea] dark:border-[#27272a]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Apple-style Footnote / Disclosures */}
        <div className="space-y-2 pb-6 border-b border-[#e5e5ea] dark:border-[#27272a] text-[11px] text-zinc-600 dark:text-zinc-400">
          <p>
            1. Continuous biometric telemetry is synchronized through certified healthcare protocols and is intended to complement direct clinician oversight.
          </p>
          <p>
            2. The CareSync Clinical Intelligence Assistant (powered by Whisper and Gemini) assists in clinical triage and differential symptom analysis. Always consult an attending physician for emergency diagnoses.
          </p>
          <p>
            3. All patient electronic health records (EHR) are encrypted at rest with AES-256 and transmitted in accordance with the HIPAA Security Rule and HL7 FHIR standard.
          </p>
        </div>

        {/* Minimal Directory Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-800 dark:text-slate-200 font-medium">
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white">CareSync Services</h5>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li><Link to="/doctors" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Find a Doctor</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Clinical Dashboard</Link></li>
              <li><Link to="/pharmacy-shop" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Pharmacy &amp; Medicines</Link></li>
              <li><Link to="/hospital" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Hospital Command Ops</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white">AI Intelligence</h5>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li><Link to="/ai-hub" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Symptom Checker</Link></li>
              <li><Link to="/ai-hub" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Whisper Voice Triage</Link></li>
              <li><Link to="/ai-hub" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Diet &amp; Lifestyle AI</Link></li>
              <li><Link to="/ai-hub" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Lab Report Analyzer</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white">Hospital Network</h5>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li><Link to="/hospital" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">ICU Bed Census</Link></li>
              <li><Link to="/emergency-sos" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Ambulance Dispatch</Link></li>
              <li><Link to="/blood-donation" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Blood Bank Network</Link></li>
              <li><Link to="/pharmacy-shop" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Central Pharmacy</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white">Enterprise &amp; Legal</h5>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">About CareSync</Link></li>
              <li><Link to="/contact" className="hover:text-[#0071e3] dark:hover:text-sky-400 transition-colors">Careers &amp; Contact</Link></li>
              <li><span className="cursor-pointer hover:text-[#0071e3] dark:hover:text-sky-400">HIPAA Security Vault</span></li>
              <li><span className="cursor-pointer hover:text-[#0071e3] dark:hover:text-sky-400">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom 1-Line Legal & Copyright */}
        <div className="pt-6 border-t border-[#cbd0d8] dark:border-[#1d3559] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0071e3] flex items-center justify-center text-white font-bold text-[10px]">
              C
            </div>
            <span>Copyright © {new Date().getFullYear()} CareSync Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Sales &amp; Refunds</span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Legal</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default AppleMinimalFooter
