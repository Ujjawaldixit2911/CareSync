import React, { useState } from 'react'
import HospitalCommandHero from '../components/HospitalCommandHero'
import AppleHero from '../components/AppleHero'
import FeatureCards from '../components/FeatureCards'
import AppleSplitSection from '../components/AppleSplitSection'
import DoctorLeadershipGrid from '../components/DoctorLeadershipGrid'
import SingleCenteredTestimonial from '../components/SingleCenteredTestimonial'
import StatsBar from '../components/StatsBar'
import HowItWorks from '../components/HowItWorks'
import CtaBanner from '../components/CtaBanner'
import DemoModal from '../components/DemoModal'

const Home = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  const handleOpenDemo = () => {
    setIsDemoOpen(true)
  }

  const handleCloseDemo = () => {
    setIsDemoOpen(false)
  }

  return (
    <div className="space-y-12 text-[#1d1d1f]">
      {/* 1. Iconic Flagship Apple Hero ("Health, unified." with Live Telemetry Card) */}
      <AppleHero onOpenDemo={handleOpenDemo} />

      {/* 2. Hospital Command Quick Action Shortcuts ("I Need To..." Direct Portal) */}
      <HospitalCommandHero onOpenAppointment={handleOpenDemo} />

      {/* 3. 4 Pillar Feature Cards (Apple Grid) */}
      <div className="pt-2">
        <FeatureCards />
      </div>

      {/* 4. Apple Split Image-Text Narrative Sections (Diagnostics & Hospital Network) */}
      <AppleSplitSection />

      {/* 5. Circular Doctor Photo Grid (Apple Leadership Style with Dynamic Cloudinary Face-Crop) */}
      <DoctorLeadershipGrid />

      {/* 6. Single Centered Iconic Apple Testimonial */}
      <SingleCenteredTestimonial />

      {/* 7. Stats Bar & Regulatory Standards */}
      <div className="py-6">
        <StatsBar />
      </div>

      {/* 8. How It Works (3-Step Continuum) */}
      <HowItWorks />

      {/* 9. Apple Clean CTA Banner */}
      <CtaBanner onOpenDemo={handleOpenDemo} />

      {/* Interactive Keynote Demo Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={handleCloseDemo} />
    </div>
  )
}

export default Home