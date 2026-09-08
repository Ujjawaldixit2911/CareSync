import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, ShieldCheck, Calendar, Clock, Stethoscope, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { doctors as staticDoctors, specialityData, getDoctorInstantImage } from '../assets/assets'

const DoctorLeadershipGrid = () => {
  const navigate = useNavigate()
  const { doctors: contextDoctors } = useContext(AppContext)
  const [selectedSpeciality, setSelectedSpeciality] = useState('All')
  const [visibleCount, setVisibleCount] = useState(15)

  // Use live backend doctors if present, otherwise complete 15 static doctors
  const fullDoctorList = (contextDoctors && contextDoctors.length > 0) ? contextDoctors : staticDoctors

  // Filter doctors by specialty
  const filteredDoctors = selectedSpeciality === 'All' 
    ? fullDoctorList 
    : fullDoctorList.filter(d => d.speciality.toLowerCase() === selectedSpeciality.toLowerCase())

  const displayedDoctors = filteredDoctors.slice(0, visibleCount)

  return (
    <section className="py-20 bg-white dark:bg-[#18181b] text-[#1d1d1f] dark:text-zinc-100 -mx-4 sm:-mx-[10%] px-4 sm:px-[10%] border-b border-[#e5e5ea] dark:border-[#27272a]">
      
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header: Apple Typography */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-[#27272a] text-[#0071e3] border border-blue-200 dark:border-[#3f3f46] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>World-Class Clinical Specialists ({fullDoctorList.length}+ Available)</span>
          </div>

          <h2 className="text-3.5xl sm:text-5xl font-black tracking-tight text-[#1d1d1f] dark:text-white leading-tight">
            Consult the world’s leading doctors.
          </h2>

          <p className="text-base sm:text-lg text-[#86868b] dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Board-certified clinicians from premier hospital institutions, ready for instant appointments, video consultations, and second opinions.
          </p>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedSpeciality('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
              selectedSpeciality === 'All'
                ? 'bg-[#0071e3] text-white shadow-md shadow-blue-500/25'
                : 'bg-[#f5f5f7] dark:bg-[#27272a] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#3f3f46] border border-[#e5e5ea] dark:border-[#3f3f46]'
            }`}
          >
            All Specialists ({fullDoctorList.length})
          </button>
          {specialityData.map((spec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSpeciality(spec.speciality)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                selectedSpeciality.toLowerCase() === spec.speciality.toLowerCase()
                  ? 'bg-[#0071e3] text-white shadow-md shadow-blue-500/25'
                  : 'bg-[#f5f5f7] dark:bg-[#27272a] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#3f3f46] border border-[#e5e5ea] dark:border-[#3f3f46]'
              }`}
            >
              <span>{spec.speciality}</span>
            </button>
          ))}
        </div>

        {/* Doctor Photo Cards Grid (All 15 Doctors with Original Photos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedDoctors.map((doc, idx) => {
            const docId = doc._id || `doc${idx + 1}`
            const docRating = (4.9 + (idx % 10) * 0.01).toFixed(2)
            const reviewsCount = 120 + ((idx * 37) % 350)

            return (
              <motion.div
                key={docId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: (idx % 5) * 0.05 }}
                onClick={() => {
                  navigate(`/appointment/${docId}`)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="group flex flex-col justify-between p-4 rounded-3xl bg-[#f5f5f7] dark:bg-[#242428] hover:bg-white dark:hover:bg-[#2c2c30] border border-[#e5e5ea] dark:border-[#3f3f46] hover:border-blue-400/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/40 transition-all duration-300 cursor-pointer text-left overflow-hidden hover:-translate-y-1"
              >
                {/* Doctor Photo Container */}
                <div className="relative mb-4 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-500/10 via-zinc-100 dark:via-[#1f1f23] to-teal-500/10 aspect-square flex items-center justify-center p-2 border border-zinc-200/60 dark:border-[#3f3f46]">
                  <img
                    src={getDoctorInstantImage(doc, idx)}
                    alt={doc.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Active Status Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-sm backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Available</span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#0071e3] uppercase tracking-wider block">
                      {doc.speciality}
                    </span>
                    <h3 className="text-base font-extrabold text-[#1d1d1f] dark:text-white tracking-tight group-hover:text-[#0071e3] transition-colors line-clamp-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-[#86868b] dark:text-slate-300 font-medium">
                      {doc.degree || 'MBBS'} • {doc.experience || '4 Years Exp'}
                    </p>
                  </div>

                  {/* Rating & Action Button */}
                  <div className="pt-3 border-t border-[#e5e5ea] dark:border-[#1e3a66] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-bold text-[#1d1d1f] dark:text-white">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{docRating}</span>
                      <span className="text-[10px] text-[#86868b] dark:text-slate-400 font-normal">({reviewsCount})</span>
                    </div>

                    <span className="font-bold text-[#0071e3] text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Book <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

        {/* Bottom Explorer Action */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              navigate('/doctors')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore All 500+ Verified Doctors &amp; Slots</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </section>
  )
}

export default DoctorLeadershipGrid
