import React from 'react'
import { UserPlus, Cpu, LineChart, ArrowRight, CheckCircle, Sparkles, Shield, Activity, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    step: '01',
    title: 'Sign Up in 60 Seconds',
    subtitle: 'Step 1: Onboard Securely',
    description: 'Create your patient or provider profile with military-grade two-factor authentication and role-specific permissions.',
    icon: UserPlus,
    badge: 'Fast & Encrypted',
    color: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    details: ['Biometric / 2FA Login', 'Custom Health Baseline', 'Zero Spam Policy']
  },
  {
    step: '02',
    title: 'Connect Your Health Data',
    subtitle: 'Step 2: Universal Sync',
    description: 'Effortlessly sync Apple Health, Garmin, past lab PDF records, and link with partner hospital EHR databases via FHIR API.',
    icon: Cpu,
    badge: 'Automated Sync',
    color: 'border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400',
    details: ['Wearables Integration', 'Historical EHR Ingestion', 'Decentralized Vault']
  },
  {
    step: '03',
    title: 'Get Insights & Clinical Care',
    subtitle: 'Step 3: Proactive Health',
    description: 'Receive real-time AI vitals analysis, consult board-certified specialists via HD video, and get instant emergency ambulance dispatch.',
    icon: LineChart,
    badge: 'Proactive Intelligence',
    color: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    details: ['Gemini AI Diagnostics', '1-Click Doctor Booking', 'Continuous Monitoring']
  }
]

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Frictionless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            How CareSync Works
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Transition from fragmented medical visits to an intelligent, interconnected health journey in three simple steps.
          </p>
        </div>

        {/* 3-Step Horizontal Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Subtle horizontal connecting line in desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-emerald-500/20 -translate-y-12 -z-10" />

          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="relative bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 group"
              >
                {/* Step Number Top Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 duration-200 ${item.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-primary/40 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mt-1">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-6">
                  <span className="text-xs font-bold text-primary dark:text-sky-400 uppercase tracking-wider block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bullet Highlights */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                  {item.details.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-350">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

              </div>
            )
          })}
        </div>

        {/* Bottom Quick Action */}
        <div className="mt-12 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
          >
            <span>Ready to experience CareSync? Create your account today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
