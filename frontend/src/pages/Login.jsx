import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { GoogleLogin } from '@react-oauth/google'
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  HeartPulse, 
  Shield, 
  Stethoscope, 
  UserCheck, 
  CheckCircle2, 
  Zap,
  ExternalLink
} from 'lucide-react'

// Zod schemas for client-side validation
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const Login = () => {
  const { backendUrl, token, setToken, loadUserProfileData } = useContext(AppContext)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Role: 'patient' | 'admin' | 'doctor'
  const [role, setRole] = useState(searchParams.get('role') || 'patient')
  const [state, setState] = useState('Login') // 'Login' or 'Sign Up' (only for patient)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const adminPanelUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5180'

  // Sync role from URL param if present
  useEffect(() => {
    const urlRole = searchParams.get('role')
    if (urlRole && ['patient', 'admin', 'doctor'].includes(urlRole)) {
      setRole(urlRole)
    }
  }, [searchParams])

  // Demo autofill helpers
  const autofillDemo = (selectedRole) => {
    setErrors({})
    if (selectedRole === 'admin') {
      setEmail('admin@caresync.com')
      setPassword('admin123')
      toast.info('⚡ Admin demo credentials loaded!')
    } else if (selectedRole === 'doctor') {
      setEmail('doc1@gmail.com')
      setPassword('password123')
      toast.info('⚡ Doctor demo credentials loaded!')
    } else {
      setEmail('demo.patient@caresync.com')
      setPassword('password123')
      setName('Demo Patient')
      toast.info('⚡ Patient demo credentials loaded!')
    }
  }

  // Google OAuth Success Handler (Patient only)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true)
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
        credential: credentialResponse.credential
      })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        if (loadUserProfileData) {
          loadUserProfileData()
        }
        toast.success(`Welcome to CareSync, ${data.userData?.name || 'User'}! 🎉`)
        navigate('/')
      } else {
        toast.error(data.message || 'Google Login failed')
      }
    } catch (err) {
      console.error('Google login error:', err)
      toast.error(err.response?.data?.message || err.message || 'Google login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google Sign-In was cancelled or failed.')
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrors({})
    setIsLoading(true)

    // 1. ADMIN LOGIN
    if (role === 'admin') {
      try {
        loginSchema.parse({ email, password })
      } catch (err) {
        setIsLoading(false)
        if (err instanceof z.ZodError) {
          toast.error(err.errors[0].message)
          return
        }
      }

      try {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
        if (data.success) {
          toast.success('🛡️ Admin Authenticated! Opening Console...')
          // Redirect seamlessly with token
          setTimeout(() => {
            window.location.href = `${adminPanelUrl}?aToken=${data.token}`
          }, 400)
        } else {
          toast.error(data.message || 'Invalid Admin Credentials')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Admin login failed')
      } finally {
        setIsLoading(false)
      }
      return
    }

    // 2. DOCTOR LOGIN
    if (role === 'doctor') {
      try {
        loginSchema.parse({ email, password })
      } catch (err) {
        setIsLoading(false)
        if (err instanceof z.ZodError) {
          toast.error(err.errors[0].message)
          return
        }
      }

      try {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
        if (data.success) {
          toast.success('🩺 Doctor Authenticated! Opening Dashboard...')
          // Redirect seamlessly with token
          setTimeout(() => {
            window.location.href = `${adminPanelUrl}?dToken=${data.token}`
          }, 400)
        } else {
          toast.error(data.message || 'Invalid Doctor Credentials')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Doctor login failed')
      } finally {
        setIsLoading(false)
      }
      return
    }

    // 3. PATIENT LOGIN / SIGN UP
    try {
      if (state === 'Sign Up') {
        signupSchema.parse({ name, email, password })
      } else {
        loginSchema.parse({ email, password })
      }
    } catch (err) {
      setIsLoading(false)
      if (err instanceof z.ZodError) {
        const formattedErrors = {}
        err.errors.forEach((e) => {
          formattedErrors[e.path[0]] = e.message
        })
        setErrors(formattedErrors)
        toast.error(err.errors[0].message)
        return
      }
    }

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Registration successful! Welcome to CareSync 🎉')
          navigate('/')
        } else {
          toast.error(data.message || 'Registration failed')
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Welcome back to CareSync!')
          navigate('/')
        } else {
          toast.error(data.message || 'Login failed')
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Server error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token && role === 'patient') {
      navigate('/')
    }
  }, [token, role])

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-10 px-4'>
      <div className='w-full max-w-lg bg-white dark:bg-zinc-900 border border-[#e5e5ea] dark:border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 text-left'>
        
        {/* Branding header */}
        <div className="text-center space-y-2 pb-1">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto shadow-sm">
            <HeartPulse className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <h2 className='text-2xl sm:text-3xl font-black tracking-tight text-[#1d1d1f] dark:text-zinc-50'>
            {role === 'admin' ? 'Administrator Login' : role === 'doctor' ? 'Doctor Clinical Sign In' : (state === 'Sign Up' ? 'Create Account' : 'Welcome to CareSync')}
          </h2>
          <p className="text-xs text-[#86868b] dark:text-zinc-400">
            {role === 'admin' 
              ? 'Enter master credentials to manage doctors, hospital beds, and system operations'
              : role === 'doctor'
              ? 'Access clinical queue, tele-consultation slots, and prescriptions'
              : (state === 'Sign Up' ? 'Start your connected medical journey' : 'Access your patient portal and medical appointments')}
          </p>
        </div>

        {/* 1-CLICK ROLE SWITCHER TABS */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => { setRole('patient'); setErrors({}); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'patient'
                ? 'bg-white dark:bg-zinc-900 text-primary shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('doctor'); setErrors({}); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'doctor'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('admin'); setErrors({}); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'admin'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick Demo Autofill Pill */}
        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {role === 'admin' ? 'Demo Admin: admin@caresync.com' : role === 'doctor' ? 'Demo Doctor: doc1@gmail.com' : 'Demo Patient Sign In'}
          </span>
          <button
            type="button"
            onClick={() => autofillDemo(role)}
            className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black rounded-lg transition-all cursor-pointer active:scale-95"
          >
            1-Click Fill
          </button>
        </div>

        {/* Google OAuth (Only for Patient) */}
        {role === 'patient' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                size="large"
                width="360"
                text={state === 'Sign Up' ? 'signup_with' : 'signin_with'}
                theme="outline"
              />
            </div>

            <div className="w-full flex items-center gap-3 my-3">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">or sign in with email</span>
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
            </div>
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {role === 'patient' && state === 'Sign Up' && (
            <div className='space-y-1.5 w-full text-xs'>
              <label className='font-bold text-[#1d1d1f] dark:text-zinc-200'>Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  placeholder="John Doe" 
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800/80 text-[#1d1d1f] dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-medium ${
                    errors.name ? 'border-red-500' : 'border-[#e5e5ea] dark:border-zinc-700'
                  }`} 
                  type="text" 
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.name}</p>}
            </div>
          )}

          <div className='space-y-1.5 w-full text-xs'>
            <label className='font-bold text-[#1d1d1f] dark:text-zinc-200'>
              {role === 'admin' ? 'Administrator Email' : role === 'doctor' ? 'Doctor Registered Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                placeholder={role === 'admin' ? 'admin@caresync.com' : role === 'doctor' ? 'doc1@gmail.com' : 'patient@example.com'} 
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800/80 text-[#1d1d1f] dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-medium ${
                  errors.email ? 'border-red-500' : 'border-[#e5e5ea] dark:border-zinc-700'
                }`} 
                type="email" 
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.email}</p>}
          </div>

          <div className='space-y-1.5 w-full text-xs'>
            <label className='font-bold text-[#1d1d1f] dark:text-zinc-200'>Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                placeholder="••••••••" 
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800/80 text-[#1d1d1f] dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-medium ${
                  errors.password ? 'border-red-500' : 'border-[#e5e5ea] dark:border-zinc-700'
                }`} 
                type="password" 
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type='submit' 
            disabled={isLoading}
            className={`w-full py-3.5 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2 ${
              role === 'admin' 
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' 
                : role === 'doctor'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-primary hover:bg-primary-dark shadow-primary/20'
            }`}
          >
            <span>
              {isLoading 
                ? 'Authenticating...' 
                : role === 'admin' 
                ? 'Sign In as Administrator' 
                : role === 'doctor' 
                ? 'Sign In as Doctor' 
                : (state === 'Sign Up' ? 'Create Account' : 'Sign In as Patient')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Patient Sign In / Sign Up toggle */}
        {role === 'patient' && (
          <div className="text-center pt-1">
            {state === 'Sign Up' ? (
              <p className="text-xs text-[#86868b] dark:text-zinc-400">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setState('Login'); setErrors({}); }} 
                  className='text-primary font-bold hover:underline cursor-pointer'
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#86868b] dark:text-zinc-400">
                New to CareSync?{' '}
                <button 
                  type="button"
                  onClick={() => { setState('Sign Up'); setErrors({}); }} 
                  className='text-primary font-bold hover:underline cursor-pointer'
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        )}

        {/* Direct Link to dedicated Admin Console if needed */}
        <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-400">
            Dedicated Console URL:{' '}
            <a 
              href={adminPanelUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
            >
              {adminPanelUrl} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login