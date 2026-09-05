import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { GoogleLogin } from '@react-oauth/google'
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldAlert, HeartPulse } from 'lucide-react'

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
  const [state, setState] = useState('Login') // 'Login' or 'Sign Up'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  // Google OAuth Success Handler
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

    // Run client-side Zod validation
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

    // Submit request
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Registration successful!')
        } else {
          toast.error(data.message || 'Registration failed')
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Welcome back!')
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
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className='min-h-[75vh] flex items-center justify-center py-10 px-4'>
      <div 
        className='w-full max-w-md bg-white dark:bg-zinc-900 border border-[#e5e5ea] dark:border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 text-left'
      >
        {/* Branding header */}
        <div className="text-center space-y-2 pb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800 border border-[#e5e5ea] dark:border-zinc-700 flex items-center justify-center mx-auto shadow-xs">
            <HeartPulse className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <h2 className='text-2xl sm:text-3xl font-black tracking-tight text-[#1d1d1f] dark:text-zinc-50'>
            {state === 'Sign Up' ? 'Create Account' : 'Welcome to CareSync'}
          </h2>
          <p className="text-xs text-[#86868b] dark:text-zinc-400">
            {state === 'Sign Up' ? 'Start your connected medical journey' : 'Access your patient portal and health records'}
          </p>
        </div>

        {/* Google OAuth Login Button */}
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

          <div className="w-full flex items-center gap-3 my-4">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">or continue with email</span>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
          </div>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === 'Sign Up' && (
            <div className='space-y-1.5 w-full text-xs'>
              <label className='font-bold text-[#1d1d1f] dark:text-zinc-200'>Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  placeholder="John Doe" 
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800/80 text-[#1d1d1f] dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all text-xs font-medium ${
                    errors.name ? 'border-red-500' : 'border-[#e5e5ea] dark:border-zinc-700'
                  }`} 
                  type="text" 
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.name}</p>}
            </div>
          )}

          <div className='space-y-1.5 w-full text-xs'>
            <label className='font-bold text-[#1d1d1f] dark:text-zinc-200'>Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                placeholder="example@email.com" 
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800/80 text-[#1d1d1f] dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all text-xs font-medium ${
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
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl bg-[#f5f5f7] dark:bg-zinc-800/80 text-[#1d1d1f] dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all text-xs font-medium ${
                  errors.password ? 'border-red-500' : 'border-[#e5e5ea] dark:border-zinc-700'
                }`} 
                type="password" 
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.password}</p>}
          </div>

          {/* Submit */}
          <button 
            type='submit' 
            disabled={isLoading}
            className='w-full py-3.5 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2'
          >
            <span>{isLoading ? 'Processing...' : state === 'Sign Up' ? 'Create Account' : 'Sign In with Email'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center pt-2">
          {state === 'Sign Up' ? (
            <p className="text-xs text-[#86868b] dark:text-zinc-400">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setState('Login'); setErrors({}); }} 
                className='text-[#0071e3] font-bold hover:underline cursor-pointer'
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
                className='text-[#0071e3] font-bold hover:underline cursor-pointer'
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login