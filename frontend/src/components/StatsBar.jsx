import React from 'react'
import { Users, Stethoscope, Building2, ShieldCheck, Zap, ArrowUpRight, Activity } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,480+',
    label: 'Active Patients',
    description: 'Continuous bio-monitoring & telehealth',
    growth: '+14.8% MoM',
    color: '#0071e3',
    badgeBg: 'bg-blue-50 text-[#0071e3] border-blue-200/80',
    svgPath: 'M 0 35 Q 35 10, 70 28 T 140 20 T 210 5 T 280 12',
    gradientId: 'grad-patients'
  },
  {
    icon: Stethoscope,
    value: '520+',
    label: 'Board-Certified Specialists',
    description: 'Across 28+ clinical hospital departments',
    growth: '99.2% Verified',
    color: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    svgPath: 'M 0 30 Q 40 32, 80 15 T 160 22 T 240 8 T 280 4',
    gradientId: 'grad-doctors'
  },
  {
    icon: Building2,
    value: '50+ Network',
    label: 'Partner Hospitals',
    description: 'Direct ICU, helipad & ambulance integration',
    growth: '24/7 Level-1',
    color: '#0d9488',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/80',
    svgPath: 'M 0 38 Q 45 25, 90 30 T 180 12 T 240 18 T 280 6',
    gradientId: 'grad-hospitals'
  },
  {
    icon: Zap,
    value: '99.99%',
    label: 'Platform Uptime SLA',
    description: 'Sub-second real-time telemetry streaming',
    growth: 'Zero Latency',
    color: '#6366f1',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    svgPath: 'M 0 25 L 50 25 L 65 5 L 80 40 L 95 15 L 110 25 L 280 25',
    gradientId: 'grad-uptime'
  }
]

const StatsBar = () => {
  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e5e5ea]">
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0071e3]">
              Platform Telemetry &amp; Scale
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1d1d1f]">
              Measurable Clinical Impact
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-md text-left sm:text-right">
            Synchronizing high-concurrency patient biometric streams across global medical institutions.
          </p>
        </div>

        {/* 4 Rich Apple KPI Cards with SVGs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative bg-white dark:bg-zinc-900 border border-[#e5e5ea] dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden text-left"
              >
                {/* Ambient Top Corner Light */}
                <div
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-30"
                  style={{ backgroundColor: item.color }}
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Row: Icon Pill + Growth Badge */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105"
                      style={{ 
                        backgroundColor: `${item.color}10`, 
                        borderColor: `${item.color}25`,
                        color: item.color 
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-xs ${item.badgeBg}`}>
                      {item.growth}
                    </span>
                  </div>

                  {/* KPI Metric & Label */}
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-3.5xl font-black tracking-tight text-[#1d1d1f] dark:text-white">
                      {item.value}
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-[#86868b] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Embedded Dynamic SVG Sparkline Wave */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                  <div className="h-10 w-full overflow-hidden flex items-end">
                    <svg className="w-full h-10 overflow-visible" viewBox="0 0 280 45">
                      <defs>
                        <linearGradient id={item.gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={item.color} stopOpacity="0.28" />
                          <stop offset="100%" stopColor={item.color} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Sparkline Area */}
                      <path
                        d={`${item.svgPath} L 280 45 L 0 45 Z`}
                        fill={`url(#${item.gradientId})`}
                      />

                      {/* Sparkline Stroke */}
                      <path
                        d={item.svgPath}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Compliance & Trust Accreditation Strip */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-[#e5e5ea] dark:border-zinc-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-[#86868b] shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-[#1d1d1f] dark:text-zinc-200">Certified Healthcare Infrastructure Standard</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-bold">
            <span className="px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-[#e5e5ea] dark:border-zinc-700">
              HIPAA SECURITY RULE
            </span>
            <span className="px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-[#e5e5ea] dark:border-zinc-700">
              HL7 / FHIR v4
            </span>
            <span className="px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-[#e5e5ea] dark:border-zinc-700">
              ISO 27001
            </span>
            <span className="px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-[#e5e5ea] dark:border-zinc-700">
              SOC 2 TYPE II
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default StatsBar
