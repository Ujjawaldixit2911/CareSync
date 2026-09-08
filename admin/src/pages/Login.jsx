import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => { 
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[90vh] flex items-center justify-center bg-zinc-50/50 px-4'>
      <div className='flex flex-col gap-5 m-auto items-start p-8 sm:p-10 w-full max-w-md bg-white border border-zinc-200/80 rounded-2xl text-zinc-600 text-sm shadow-xl transition-all duration-300'>
        {/* Brand Header */}
        <div className="flex items-center gap-2 select-none m-auto mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
            <span className="font-black text-base">C</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">CareSync</span>
        </div>

        <div className="w-full text-center">
          <h2 className='text-xl font-bold text-zinc-900'>{state} Console</h2>
          <p className="text-zinc-500 text-xs mt-1">Please enter your credentials to gain dashboard access.</p>
        </div>

        <div className='w-full space-y-1.5'>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email Address</label>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border border-zinc-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl w-full p-3 outline-none transition-all text-zinc-800' 
            type="email" 
            placeholder="admin@caresync.ai"
            required 
          />
        </div>

        <div className='w-full space-y-1.5'>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Secure Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='border border-zinc-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl w-full p-3 outline-none transition-all text-zinc-800' 
            type="password" 
            placeholder="••••••••"
            required 
          />
        </div>

        <button className='bg-primary hover:bg-primary-dark text-white font-medium w-full py-3 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] mt-2 cursor-pointer'>
          Sign In as {state}
        </button>

        {/* 1-Click Demo Fill Badges */}
        <div className="w-full p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-700 text-[11px]">⚡ Quick Demo Auto-Fill:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setState('Admin');
                setEmail('admin@caresync.com');
                setPassword('admin123');
                toast.info('🛡️ Admin credentials filled!');
              }}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg font-bold text-[10px] text-zinc-800 transition-all cursor-pointer text-center"
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setState('Doctor');
                setEmail('doc1@gmail.com');
                setPassword('password123');
                toast.info('🩺 Doctor credentials filled!');
              }}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg font-bold text-[10px] text-primary transition-all cursor-pointer text-center"
            >
              Fill Doctor Demo
            </button>
          </div>
        </div>

        <div className="w-full text-center mt-2 border-t border-zinc-100 pt-4">
          {state === 'Admin' ? (
            <p className="text-zinc-500 text-xs">
              Are you a doctor?{' '}
              <span onClick={() => setState('Doctor')} className='text-primary font-medium hover:underline cursor-pointer transition-all'>
                Doctor Portal Login
              </span>
            </p>
          ) : (
            <p className="text-zinc-500 text-xs">
              Are you an administrator?{' '}
              <span onClick={() => setState('Admin')} className='text-primary font-medium hover:underline cursor-pointer transition-all'>
                Admin Console Login
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  )
}

export default Login