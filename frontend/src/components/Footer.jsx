import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  HeartPulse, 
  Heart, 
  Send, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { toast } from 'react-toastify'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      return toast.error('Please enter a valid email address.')
    }
    setSubscribed(true)
    toast.success('🎉 Subscribed to CareSync Clinical Insights!')
    setEmail('')
  }

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-16 mt-16 md:mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand Info & Mission (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary to-teal-500 flex items-center justify-center text-white shadow-md shadow-primary/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                  CareSync
                </span>
                <p className="text-[9px] text-primary dark:text-sky-400 font-bold uppercase tracking-wider">
                  Unified Health Platform
                </p>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              CareSync is the modern healthtech infrastructure unifiying doctor consultations, wearable bio-metrics, hospital ER triage, and encrypted patient records.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant • 256-Bit Encrypted Data</span>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2.5">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="X / Twitter"
                className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-colors hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-colors hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
                </svg>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-colors hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:border-rose-500 transition-colors hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to="/doctors" className="hover:text-primary transition-colors">
                  Doctor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ai-hub" className="hover:text-primary transition-colors">
                  Fitness & AI Hub
                </Link>
              </li>
              <li>
                <Link to="/emergency-sos" className="hover:text-primary transition-colors">
                  Hospital ER Network
                </Link>
              </li>
              <li>
                <Link to="/my-appointments" className="hover:text-primary transition-colors">
                  Health Records Vault
                </Link>
              </li>
              <li>
                <Link to="/pharmacy-shop" className="hover:text-primary transition-colors">
                  Clinical Pharmacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Governance */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Security & Compliance
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Clinical Newsletter
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Get monthly wellness insights, AI diagnostic research, and platform feature releases.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Subscribed successfully!
                </p>
              )}
            </form>

            <div className="pt-2 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" /> support@caresync.ai
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> +1 (800) 555-CARE
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="border-t border-zinc-200/60 dark:border-zinc-800/80 py-6 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CareSync Technologies Inc. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-zinc-400">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for modern patient care.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
