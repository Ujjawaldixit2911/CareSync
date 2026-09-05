import React, { useEffect, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import io from 'socket.io-client'
import { toast } from 'react-toastify'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './Appointment'
import AiHub from './pages/AiHub'
import PharmacyShop from './pages/PharmacyShop'
import BloodDonation from './pages/BloodDonation'
import EmergencySOS from './pages/EmergencySOS'
import ClinicalDashboard from './pages/ClinicalDashboard'
import FitnessTracker from './pages/FitnessTracker'
import HospitalAdmin from './pages/HospitalAdmin'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppleMinimalFooter from './components/AppleMinimalFooter'
import SymptomChecker from './components/SymptomChecker'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './context/AppContext'

const App = () => {
  const theme = useSelector((state) => state.ui.theme)
  const queryClient = useQueryClient()
  const { token, userData } = useContext(AppContext)

  // Synchronize Dark / Light Theme on document root with eye-care smooth transition
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Real-time WebSocket connection
  useEffect(() => {
    if (token && userData && userData._id) {
      const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const socket = io(socketUrl)

      socket.emit('join_user', userData._id)

      socket.on('appointment_approved', (data) => {
        toast.success('🎉 Your appointment slot has been approved!', {
          position: "top-right",
          autoClose: 5000,
        })
        queryClient.invalidateQueries(['appointments'])
      })

      socket.on('appointment_cancelled', (data) => {
        toast.error('⚠️ An appointment was cancelled.', {
          position: "top-right",
          autoClose: 5000,
        })
        queryClient.invalidateQueries(['appointments'])
      })

      socket.on('appointment_completed', (data) => {
        toast.success('🩺 Appointment marked as completed. Thank you!', {
          position: "top-right",
          autoClose: 5000,
        })
        queryClient.invalidateQueries(['appointments'])
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [token, userData, queryClient])

  return (
    <div className='w-full min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#18181b] dark:text-zinc-100 transition-colors duration-300 relative flex flex-col'>
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
      
      <header className='w-full sticky top-0 z-50 bg-[#f5f5f7]/90 dark:bg-[#18181b]/90 backdrop-blur-md border-b border-[#e5e5ea] dark:border-[#27272a] px-4 sm:px-[10%]'>
        <Navbar />
      </header>

      <main className='flex-grow px-4 sm:px-[10%] py-6'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<ClinicalDashboard />} />
          <Route path='/clinical-dashboard' element={<ClinicalDashboard />} />
          <Route path='/fitness' element={<FitnessTracker />} />
          <Route path='/fitness-tracker' element={<FitnessTracker />} />
          <Route path='/hospital' element={<HospitalAdmin />} />
          <Route path='/hospital-admin' element={<HospitalAdmin />} />
          <Route path='/hospital-management' element={<HospitalAdmin />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointment />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/ai-hub' element={<AiHub />} />
          <Route path='/pharmacy-shop' element={<PharmacyShop />} />
          <Route path='/blood-donation' element={<BloodDonation />} />
          <Route path='/emergency-sos' element={<EmergencySOS />} />
        </Routes>
      </main>





      {/* Floating AI Symptom Checker Widget */}
      <SymptomChecker />
      
      <AppleMinimalFooter />
    </div>
  )
}

export default App


