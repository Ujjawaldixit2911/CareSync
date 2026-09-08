import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  Edit3, 
  Save, 
  X, 
  Stethoscope, 
  Award, 
  Clock, 
  Loader2 
} from 'lucide-react'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPass, setIsChangingPass] = useState(false)

  const authHeader = {
    headers: {
      dtoken: dToken,
      Authorization: `Bearer ${dToken}`
    }
  }

  const updateProfile = async () => {
    setIsSaving(true)
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available,
        availableFrom: profileData.availableFrom || '09:00 AM',
        availableTo: profileData.availableTo || '08:00 PM',
        breakTime: profileData.breakTime || '01:00 PM - 02:00 PM',
        emergencyFee: profileData.emergencyFee || 150
      }

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`, 
        updateData, 
        authHeader
      )

      if (data.success) {
        toast.success(data.message || 'Profile updated successfully!')
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      return toast.warning('New password must be at least 8 characters long')
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match')
    }

    setIsChangingPass(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/change-password`,
        { currentPassword, newPassword },
        authHeader
      )

      if (data.success) {
        toast.success(data.message || 'Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to change password')
    } finally {
      setIsChangingPass(false)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  if (!profileData) {
    return (
      <div className='flex-1 flex items-center justify-center min-h-[60vh]'>
        <div className='flex items-center gap-2 text-zinc-500 font-bold text-sm'>
          <Loader2 className='w-5 h-5 animate-spin text-primary' />
          <span>Loading Doctor Profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 text-left max-w-6xl mx-auto w-full'>
      
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm'>
        <div>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
              <Stethoscope className='w-5 h-5' />
            </div>
            <h1 className='text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white'>
              Doctor Account & Credentials
            </h1>
          </div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1'>
            Manage your clinical bio, consultation fee, availability status, and account security.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {isEdit ? (
            <>
              <button
                onClick={updateProfile}
                disabled={isSaving}
                className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50'
              >
                {isSaving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => { setIsEdit(false); getProfileData(); }}
                className='px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer'
              >
                <X className='w-3.5 h-3.5' /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer'
            >
              <Edit3 className='w-3.5 h-3.5' /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Card: Doctor Overview */}
        <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between'>
          <div className='space-y-4 text-center'>
            <div className='relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm'>
              <img
                src={profileData.image}
                alt={profileData.name}
                className='w-full h-full object-cover object-top'
              />
              <div className='absolute bottom-1 right-1'>
                <span className={`w-3.5 h-3.5 rounded-full block border-2 border-white dark:border-zinc-900 ${profileData.available ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
              </div>
            </div>

            <div>
              <h2 className='text-lg font-black text-zinc-900 dark:text-white flex items-center justify-center gap-1.5'>
                {profileData.name}
                <ShieldCheck className='w-4 h-4 text-primary' />
              </h2>
              <p className='text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mt-1'>
                {profileData.speciality}
              </p>
              <p className='text-xs text-zinc-400 mt-1 font-medium'>
                {profileData.degree} • {profileData.experience}
              </p>
            </div>
          </div>

          <div className='pt-4 border-t border-zinc-150 dark:border-zinc-800 space-y-3 text-xs'>
            <div className='flex items-center justify-between'>
              <span className='text-zinc-500'>Email Address</span>
              <span className='font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[160px]'>{profileData.email}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-zinc-500'>Consultation Fee</span>
              <span className='font-black text-zinc-900 dark:text-white text-sm'>{currency}{profileData.fees}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-zinc-500'>Slot Status</span>
              <label className='flex items-center gap-2 cursor-pointer select-none'>
                <input
                  type="checkbox"
                  disabled={!isEdit}
                  checked={profileData.available}
                  onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                  className='w-4 h-4 text-primary rounded border-zinc-300 dark:border-zinc-700 cursor-pointer disabled:opacity-60'
                />
                <span className='font-bold text-zinc-700 dark:text-zinc-300'>
                  {profileData.available ? 'Online (Accepting)' : 'Offline'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Details & Security / Password Change */}
        <div className='lg:col-span-2 space-y-6'>
          
          {/* Clinical Profile Details */}
          <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5'>
            <h3 className='text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2'>
              <Award className='w-4 h-4 text-primary' /> Professional Bio & Location
            </h3>

            {/* About */}
            <div className='space-y-1.5 text-xs'>
              <label className='font-bold text-zinc-700 dark:text-zinc-300'>About Doctor & Clinical Focus</label>
              {isEdit ? (
                <textarea
                  rows={4}
                  value={profileData.about}
                  onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  className='w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-primary/20 outline-none resize-none'
                />
              ) : (
                <p className='p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl text-zinc-600 dark:text-zinc-300 leading-relaxed border border-zinc-150 dark:border-zinc-800/60'>
                  {profileData.about || 'No description provided.'}
                </p>
              )}
            </div>

            {/* Fee & Address */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
              <div className='space-y-1.5'>
                <label className='font-bold text-zinc-700 dark:text-zinc-300'>Consultation Fee (₹ INR)</label>
                {isEdit ? (
                  <input
                    type="number"
                    value={profileData.fees}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                    className='w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-primary/20 outline-none'
                  />
                ) : (
                  <p className='px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-150 dark:border-zinc-800/60'>
                    {currency}{profileData.fees}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label className='font-bold text-zinc-700 dark:text-zinc-300'>Clinic Address Line 1</label>
                {isEdit ? (
                  <input
                    type="text"
                    value={profileData.address?.line1 || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                    className='w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-primary/20 outline-none'
                  />
                ) : (
                  <p className='px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-150 dark:border-zinc-800/60'>
                    {profileData.address?.line1 || 'No address set'}
                  </p>
                )}
              </div>
            </div>

            {/* Custom Daily Consultation Timings & Break Hours */}
            <div className='p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4 text-xs'>
              <div className='flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200'>
                <Clock className='w-4 h-4 text-primary' />
                <span>Daily Consultation Timings &amp; Break Hours</span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <div className='space-y-1'>
                  <label className='font-semibold text-zinc-600 dark:text-zinc-400 text-[11px]'>Available From (शुरुआती समय)</label>
                  {isEdit ? (
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM"
                      value={profileData.availableFrom || '09:00 AM'}
                      onChange={(e) => setProfileData(prev => ({ ...prev, availableFrom: e.target.value }))}
                      className='w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary/20'
                    />
                  ) : (
                    <p className='px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'>
                      {profileData.availableFrom || '09:00 AM'}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label className='font-semibold text-zinc-600 dark:text-zinc-400 text-[11px]'>Available Till (समाप्ति समय)</label>
                  {isEdit ? (
                    <input
                      type="text"
                      placeholder="e.g. 08:00 PM"
                      value={profileData.availableTo || '08:00 PM'}
                      onChange={(e) => setProfileData(prev => ({ ...prev, availableTo: e.target.value }))}
                      className='w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary/20'
                    />
                  ) : (
                    <p className='px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'>
                      {profileData.availableTo || '08:00 PM'}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label className='font-semibold text-zinc-600 dark:text-zinc-400 text-[11px]'>Daily Break / Unavailable Recess</label>
                  {isEdit ? (
                    <input
                      type="text"
                      placeholder="e.g. 01:00 PM - 02:00 PM"
                      value={profileData.breakTime || '01:00 PM - 02:00 PM'}
                      onChange={(e) => setProfileData(prev => ({ ...prev, breakTime: e.target.value }))}
                      className='w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary/20'
                    />
                  ) : (
                    <p className='px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl font-bold text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-zinc-800'>
                      {profileData.breakTime || '01:00 PM - 02:00 PM'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY & CHANGE PASSWORD SECTION */}
          <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5'>
            <div>
              <h3 className='text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2'>
                <KeyRound className='w-4 h-4 text-amber-500' /> Security &amp; Change Password
              </h3>
              <p className='text-xs text-zinc-400 mt-0.5'>
                Admin gives you initial login credentials. You can change your password anytime here.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className='space-y-4 text-xs'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='space-y-1.5'>
                  <label className='font-bold text-zinc-700 dark:text-zinc-300'>Current Password</label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400' />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className='w-full pl-9 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-primary/20 outline-none'
                    />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='font-bold text-zinc-700 dark:text-zinc-300'>New Password (Min 8 chars)</label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400' />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className='w-full pl-9 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-primary/20 outline-none'
                    />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='font-bold text-zinc-700 dark:text-zinc-300'>Confirm New Password</label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400' />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='w-full pl-9 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-primary/20 outline-none'
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end pt-1'>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className='px-5 py-2.5 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5'
                >
                  {isChangingPass ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <KeyRound className='w-3.5 h-3.5 text-amber-400 dark:text-amber-600' />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile