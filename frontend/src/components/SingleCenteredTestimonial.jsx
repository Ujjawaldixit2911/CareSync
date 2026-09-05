import React from 'react'
import { Star, ShieldCheck, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCloudinaryUrl } from '../utils/cloudinary'

const SingleCenteredTestimonial = () => {
  const avatarUrl = getCloudinaryUrl("https://images.unsplash.com/photo-1594824813589-39938b8163f9", {
    width: 200,
    height: 200,
    crop: 'thumb',
    gravity: 'face',
    fallbackIndex: 3
  })

  return (
    <section className="py-24 sm:py-32 bg-white text-[#1d1d1f] -mx-4 sm:-mx-[10%] px-4 sm:px-[10%] border-b border-[#e5e5ea]/80 overflow-hidden relative">
      
      <div className="max-w-4xl mx-auto text-center space-y-10">
        
        {/* Apple Testimonial Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] text-[#0071e3] text-xs font-bold shadow-xs"
        >
          <Star className="w-3.5 h-3.5 fill-[#0071e3] text-[#0071e3]" />
          <span>Clinical Validation & Medical Excellence</span>
        </motion.div>

        {/* Big Editorial Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-2.5xl sm:text-4xl lg:text-4.5xl font-extrabold tracking-tight text-[#1d1d1f] leading-[1.22] font-serif sm:font-sans"
        >
          “CareSync has fundamentally transformed our multi-hospital clinical workflows. Real-time patient telemetry and instant AI-assisted triage reduced our diagnostic turnaround from days to mere minutes.”
        </motion.blockquote>

        {/* Circular Avatar & Doctor Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center space-y-4 pt-2"
        >
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#0071e3] to-emerald-500 shadow-lg">
            <img
              src={avatarUrl}
              alt="Dr. Elena Rostova"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h4 className="font-extrabold text-lg text-[#1d1d1f]">Dr. Elena Rostova, MD, FACC</h4>
              <ShieldCheck className="w-4 h-4 text-[#0071e3]" title="Verified Chief Medical Officer" />
            </div>
            <p className="text-sm text-[#86868b] font-medium">
              Chief Medical Officer • Mount Sinai Health System
            </p>
          </div>
        </motion.div>

        {/* Institutional Accreditation Badges */}
        <div className="pt-8 border-t border-[#e5e5ea] max-w-xl mx-auto flex items-center justify-around text-xs text-[#86868b] font-semibold">
          <span>HIPAA Security Certified</span>
          <span>•</span>
          <span>HL7 FHIR v4 Compliant</span>
          <span>•</span>
          <span>99.9% Uptime SLA</span>
        </div>

      </div>

    </section>
  )
}

export default SingleCenteredTestimonial
