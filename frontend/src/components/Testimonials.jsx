import React from 'react'
import { Star, Quote, CheckCircle, Sparkles } from 'lucide-react'

const testimonials = [
  {
    quote:
      "CareSync transformed how our cardiology department manages patient intake and post-op recovery. Having synced wearable telemetry alongside electronic health records saved our clinical team over 4 hours every single day.",
    name: "Dr. Alistair Vance, MD",
    role: "Chief of Cardiology, Metro Health Medical Center",
    type: "Doctor / Healthcare Provider",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80",
    rating: 5,
    tag: "Verified Cardiologist",
    metric: "4 hrs/day saved in triage"
  },
  {
    quote:
      "Managing both my chronic diabetic care and daily marathon fitness metrics used to be a mess across five apps. CareSync brought my glucose trends, fitness vitals, and doctor consultations into one crystal-clear dashboard.",
    name: "Elena Rostova",
    role: "Patient & Wellness Advocate",
    type: "Patient",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    rating: 5,
    tag: "Verified Patient",
    metric: "100% records consolidated"
  },
  {
    quote:
      "The integrated emergency SOS and live ICU bed coordination system dropped our emergency intake lag time by 42%. CareSync is by far the most modern, dependable health-tech infrastructure we've deployed.",
    name: "Marcus Sterling",
    role: "Director of Hospital Operations, St. Jude Health",
    type: "Hospital Administrator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    rating: 5,
    tag: "Hospital Network Lead",
    metric: "42% faster ER response"
  }
]

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-primary border border-sky-200 dark:border-sky-900/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Clinical Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Trusted by Patients, Doctors & Hospitals
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Discover how CareSync creates trusted, frictionless connections between healthcare providers and the individuals they care for.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1.5"
            >
              {/* Quote Icon Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, rIdx) => (
                    <Star key={rIdx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                  <Quote className="w-4 h-4" />
                </div>
              </div>

              {/* Quote Content */}
              <p className="text-zinc-600 dark:text-zinc-350 text-xs sm:text-sm leading-relaxed mb-6 italic">
                "{item.quote}"
              </p>

              {/* Footer Profile & Metric */}
              <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {item.name}
                      </h4>
                      <CheckCircle className="w-3.5 h-3.5 text-primary fill-primary/10" />
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Impact Highlight Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200/50 dark:border-emerald-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Impact: {item.metric}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials
