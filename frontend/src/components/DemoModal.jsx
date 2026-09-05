import React, { useState } from 'react'
import { X, Sparkles, CheckCircle2, Stethoscope, Building2, Activity, FileText, Send } from 'lucide-react'
import { toast } from 'react-toastify'

const DemoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orgType: 'Individual Patient',
    interest: 'Unified Platform',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      toast.success('🎉 Demo scheduled successfully! Our clinical advisor will connect shortly.')
    }, 900)
  }

  const handleReset = () => {
    setIsSuccess(false)
    setFormData({ name: '', email: '', orgType: 'Individual Patient', interest: 'Unified Platform', notes: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={onClose} 
        className="fixed inset-0"
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Live Interactive Walkthrough</span>
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Book a Personalized CareSync Demo
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Explore how CareSync seamlessly synchronizes patient schedules, fitness vitals, hospital EHRs, and records.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Alexander Reed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alexander@healthclinic.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Your Role / Entity
                  </label>
                  <select
                    value={formData.orgType}
                    onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="Individual Patient">Individual Patient</option>
                    <option value="Independent Physician">Independent Physician</option>
                    <option value="Hospital Administrator">Hospital Administrator</option>
                    <option value="Health-Tech Enterprise">Health-Tech Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Primary Area of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="Unified Platform">Unified Platform Suite</option>
                    <option value="Doctor Dashboard & Telehealth">Doctor Telehealth</option>
                    <option value="Wearables & Fitness Sync">Wearables & Fitness Sync</option>
                    <option value="Hospital ER Coordination">Hospital ER Coordination</option>
                    <option value="Encrypted Health Records">Encrypted Records Vault</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Scheduling Demonstration...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Confirm Demo Booking
                </>
              )}
            </button>

            <p className="text-[10px] text-zinc-400 text-center">
              🔒 We respect your medical privacy. Zero marketing spam.
            </p>

          </form>
        ) : (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Demo Request Confirmed!
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.name}</span>. A CareSync clinical solutions specialist has emailed your personalized demo credentials and meeting link to <span className="font-semibold text-primary">{formData.email}</span>.
            </p>
            <div className="pt-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default DemoModal
