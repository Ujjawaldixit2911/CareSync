import React, { useEffect, useState, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { getDoctorInstantImage } from '../../assets/assets'
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  User, 
  Stethoscope, 
  DollarSign, 
  AlertCircle,
  Check,
  X
} from 'lucide-react'

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, approveAppointment, getAllAppointments } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  const filteredAppointments = appointments.filter(item => {
    const patientName = item.userData?.name || ''
    const doctorName = item.docData?.name || ''
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctorName.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === 'All') return matchesSearch
    if (filterStatus === 'Pending') return matchesSearch && !item.cancelled && !item.isCompleted && item.status !== 'Approved'
    if (filterStatus === 'Approved') return matchesSearch && item.status === 'Approved' && !item.isCompleted && !item.cancelled
    if (filterStatus === 'Completed') return matchesSearch && item.isCompleted
    if (filterStatus === 'Cancelled') return matchesSearch && (item.cancelled || item.status === 'Declined')
    return matchesSearch
  })

  const pendingCount = appointments.filter(a => !a.cancelled && !a.isCompleted && a.status !== 'Approved').length
  const approvedCount = appointments.filter(a => a.status === 'Approved' && !a.isCompleted && !a.cancelled).length
  const completedCount = appointments.filter(a => a.isCompleted).length

  return (
    <div className='flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 text-left max-w-7xl mx-auto w-full'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm'>
        <div>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
              <Calendar className='w-5 h-5' />
            </div>
            <h1 className='text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white'>
              Patient Appointments
            </h1>
          </div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1'>
            Real-time consultation queue, status tracking, approvals, and doctor schedules.
          </p>
        </div>

        {/* Quick Stats */}
        <div className='flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0'>
          <div className='px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center min-w-[75px]'>
            <p className='text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400'>Pending</p>
            <p className='text-base font-black text-amber-600 dark:text-amber-400'>{pendingCount}</p>
          </div>
          <div className='px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center min-w-[75px]'>
            <p className='text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400'>Approved</p>
            <p className='text-base font-black text-blue-600 dark:text-blue-400'>{approvedCount}</p>
          </div>
          <div className='px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[75px]'>
            <p className='text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400'>Done</p>
            <p className='text-base font-black text-emerald-600 dark:text-emerald-400'>{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400' />
          <input
            type='text'
            placeholder='Search by patient or doctor name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-zinc-900 dark:text-white placeholder-zinc-400 shadow-sm'
          />
        </div>

        {/* Status Pills */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0'>
          {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments View: Responsive Table & Mobile Cards */}
      {filteredAppointments.length === 0 ? (
        <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm'>
          <div className='w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400 mb-3'>
            <Calendar className='w-8 h-8' />
          </div>
          <h3 className='text-base font-bold text-zinc-900 dark:text-white'>No Appointments Found</h3>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto'>
            No appointment records match the current filter or search criteria.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Desktop Table (Hidden on small screens) */}
          <div className='hidden lg:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm'>
            <div className='grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1.8fr] py-3.5 px-6 border-b border-zinc-200 dark:border-zinc-800 font-bold text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 uppercase tracking-wider'>
              <p>#</p>
              <p>Patient</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Doctor</p>
              <p>Fee</p>
              <p className='text-right'>Status / Action</p>
            </div>

            <div className='divide-y divide-zinc-150 dark:divide-zinc-800/80 text-xs'>
              {filteredAppointments.map((item, index) => (
                <div 
                  key={item._id || index}
                  className='grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1.8fr] items-center py-4 px-6 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors'
                >
                  <p className='font-bold text-zinc-400 dark:text-zinc-500'>{index + 1}</p>
                  
                  {/* Patient Info */}
                  <div className='flex items-center gap-3 pr-2'>
                    <img 
                      src={item.userData?.image} 
                      className='w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100 shrink-0' 
                      alt="" 
                    />
                    <div className='truncate'>
                      <p className='font-bold text-zinc-900 dark:text-white truncate flex items-center gap-1.5'>
                        {item.userData?.name}
                        {item.isEmergency && (
                          <span className='px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse'>
                            🚨 EMERGENCY
                          </span>
                        )}
                      </p>
                      <p className='text-[10px] text-zinc-400 truncate'>{item.userData?.email}</p>
                    </div>
                  </div>

                  {/* Age */}
                  <p className='font-semibold text-zinc-700 dark:text-zinc-300'>
                    {calculateAge(item.userData?.dob)} yrs
                  </p>

                  {/* Slot */}
                  <div>
                    <p className='font-bold text-zinc-900 dark:text-white'>{slotDateFormat(item.slotDate)}</p>
                    <p className='text-[11px] text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1 mt-0.5'>
                      <Clock className='w-3 h-3 text-primary' /> {item.slotTime}
                    </p>
                  </div>

                  {/* Doctor Info */}
                  <div className='flex items-center gap-3 pr-2'>
                    <img 
                      src={getDoctorInstantImage(item.docData)} 
                      loading='eager'
                      decoding='async'
                      className='w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100 shrink-0' 
                      alt="" 
                    />
                    <div className='truncate'>
                      <p className='font-bold text-zinc-900 dark:text-white truncate'>{item.docData?.name}</p>
                      <p className='text-[10px] text-primary font-semibold truncate'>{item.docData?.speciality}</p>
                    </div>
                  </div>

                  {/* Fee */}
                  <p className='font-black text-zinc-900 dark:text-zinc-100 text-sm'>
                    {currency}{item.amount}
                  </p>

                  {/* Actions / Status */}
                  <div className='flex items-center justify-end gap-2'>
                    {item.cancelled || item.status === 'Declined' ? (
                      <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20'>
                        <XCircle className='w-3 h-3' /> Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'>
                        <CheckCircle2 className='w-3 h-3' /> Completed
                      </span>
                    ) : item.status === 'Approved' ? (
                      <div className='flex items-center gap-2'>
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20'>
                          <Check className='w-3 h-3' /> Approved
                        </span>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className='p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer'
                          title='Decline consultation'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => approveAppointment(item._id)}
                          className='inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95'
                        >
                          <Check className='w-3.5 h-3.5' /> Approve
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className='inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-lg font-bold text-xs transition-all cursor-pointer active:scale-95'
                        >
                          <X className='w-3.5 h-3.5' /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Card View (Visible on small & medium screens) */}
          <div className='lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
            {filteredAppointments.map((item, index) => (
              <div
                key={item._id || index}
                className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4'
              >
                {/* Header: Patient & Status */}
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={item.userData?.image}
                      className='w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100'
                      alt=''
                    />
                    <div>
                      <h4 className='font-bold text-zinc-900 dark:text-white text-sm'>{item.userData?.name}</h4>
                      <p className='text-xs text-zinc-400'>
                        {calculateAge(item.userData?.dob)} yrs • {item.userData?.gender || 'Patient'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {item.cancelled || item.status === 'Declined' ? (
                      <span className='px-2.5 py-1 rounded-full text-[10px] font-bold text-red-600 bg-red-500/10 border border-red-500/20'>
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className='px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20'>
                        Completed
                      </span>
                    ) : item.status === 'Approved' ? (
                      <span className='px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-600 bg-blue-500/10 border border-blue-500/20'>
                        Approved
                      </span>
                    ) : (
                      <span className='px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20'>
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Doctor & Schedule Info */}
                <div className='bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800/60 space-y-2 text-xs'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={getDoctorInstantImage(item.docData)}
                        loading='eager'
                        decoding='async'
                        className='w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700'
                        alt=''
                      />
                      <span className='font-bold text-zinc-800 dark:text-zinc-200'>{item.docData?.name}</span>
                    </div>
                    <span className='text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md'>
                      {item.docData?.speciality}
                    </span>
                  </div>

                  <div className='flex items-center justify-between text-zinc-600 dark:text-zinc-400 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[11px]'>
                    <span className='flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200'>
                      <Calendar className='w-3 h-3 text-primary' /> {slotDateFormat(item.slotDate)}
                    </span>
                    <span className='flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200'>
                      <Clock className='w-3 h-3 text-primary' /> {item.slotTime}
                    </span>
                  </div>
                </div>

                {/* Footer: Fee & Action Buttons */}
                <div className='flex items-center justify-between gap-3 pt-1'>
                  <div>
                    <p className='text-[10px] text-zinc-400 font-bold uppercase'>Consultation Fee</p>
                    <p className='text-sm font-black text-zinc-900 dark:text-white'>{currency}{item.amount}</p>
                  </div>

                  {!item.cancelled && !item.isCompleted && item.status !== 'Approved' && (
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => approveAppointment(item._id)}
                        className='px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer active:scale-95 flex items-center gap-1'
                      >
                        <Check className='w-3.5 h-3.5' /> Approve
                      </button>
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className='px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-bold text-xs cursor-pointer active:scale-95 flex items-center gap-1'
                      >
                        <X className='w-3.5 h-3.5' /> Decline
                      </button>
                    </div>
                  )}

                  {item.status === 'Approved' && !item.isCompleted && !item.cancelled && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-bold text-xs cursor-pointer active:scale-95 flex items-center gap-1'
                    >
                      <X className='w-3.5 h-3.5' /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AllAppointments