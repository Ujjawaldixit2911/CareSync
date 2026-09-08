import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Activity, 
  Building2, 
  FolderLock, 
  ArrowRight, 
  Sparkles, 
  HeartPulse, 
  Flame, 
  ShieldAlert, 
  FileCheck2,
  CalendarCheck,
  Stethoscope,
  Pill
} from 'lucide-react'

const features = [
  {
    id: 'dashboard',
    title: 'Patient / Doctor Dashboard',
    shortTitle: 'Patient & Doctor Portal',
    badge: 'Real-time Coordination',
    description: 'Effortlessly schedule clinical visits, conduct HD tele-consultations, and manage verified patient appointments with zero friction.',
    icon: Users,
    link: '/dashboard',
    linkText: 'Explore Dashboard',
    colorTheme: 'blue',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    accentBorder: 'hover:border-blue-500/40 dark:hover:border-blue-500/40',
    glowColor: 'from-blue-500/10 to-transparent',
    statsHighlight: '500+ Verified Specialists'
  },
  {
    id: 'pharmacy',
    title: 'Digital Pharmacy & Medicines',
    shortTitle: 'Pharmacy & Drug Store',
    badge: 'Express Delivery',
    description: 'Order genuine prescription medications, browse 30+ clinical categories with dosage guides, interactions, and instant checkout.',
    icon: Pill,
    link: '/pharmacy-shop',
    linkText: 'Explore Pharmacy',
    colorTheme: 'emerald',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    accentBorder: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/40',
    glowColor: 'from-emerald-500/10 to-transparent',
    statsHighlight: '30+ Essential Medicines'
  },
  {
    id: 'hospital',
    title: 'Hospital & ER Management',
    shortTitle: 'Hospital Management',
    badge: 'Emergency SOS',
    description: 'Live ICU bed occupancy monitoring, instant GPS ambulance dispatch, and rapid emergency triage coordination across 50+ network facilities.',
    icon: Building2,
    link: '/hospital',
    linkText: 'Explore Hospital Ops',
    colorTheme: 'rose',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    accentBorder: 'hover:border-rose-500/40 dark:hover:border-rose-500/40',
    glowColor: 'from-rose-500/10 to-transparent',
    statsHighlight: 'Instant 3-Min ER Response'
  },
  {
    id: 'records',
    title: 'Health Records Viewer',
    shortTitle: 'Health Records Vault',
    badge: 'FHIR & 256-Bit Crypt',
    description: 'Unified, HIPAA-compliant storage for lab diagnostics, digital prescriptions, vaccination logs, and historical medical timelines.',
    icon: FolderLock,
    link: '/my-appointments',
    linkText: 'Explore Records Viewer',
    colorTheme: 'indigo',
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    accentBorder: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/40',
    glowColor: 'from-indigo-500/10 to-transparent',
    statsHighlight: '100% Encrypted & Portable'
  }
]

const FeatureCards = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/5 dark:bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Four Pillars of CareSync</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            A Complete Medical Ecosystem in One Place
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Eliminate fragmented health data. CareSync bridges doctors, wearables, hospitals, 
            and personal medical records into a singular, unified platform.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.id}
                className={`group relative bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl dark:hover:shadow-zinc-950/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${card.accentBorder} overflow-hidden`}
              >
                {/* Subtle card top gradient glow on hover */}
                <div className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b ${card.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  {/* Top: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 duration-300 ${card.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>

                  {/* 1-Line Description */}
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Bottom: Highlight & Explore Link */}
                <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3 relative z-10">
                  <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {card.statsHighlight}
                  </div>

                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-dark transition-all group-hover:translate-x-1 duration-200"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FeatureCards
