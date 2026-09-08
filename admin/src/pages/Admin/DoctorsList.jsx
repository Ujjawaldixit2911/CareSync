import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { getDoctorInstantImage } from '../../assets/assets'
import { Search, Filter, Stethoscope, CheckCircle2, XCircle, Trash2, UserCheck, ShieldCheck, DollarSign } from 'lucide-react'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, removeDoctor } = useContext(AdminContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('All')

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const specialities = ['All', ...new Set(doctors.map(d => d.speciality).filter(Boolean))]

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc.degree && doc.degree.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSpeciality = selectedSpeciality === 'All' || doc.speciality === selectedSpeciality
    return matchesSearch && matchesSpeciality
  })

  const availableCount = doctors.filter(d => d.available).length

  return (
    <div className='flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 text-left max-w-7xl mx-auto w-full'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm'>
        <div>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 bg-primary/10 text-primary rounded-xl'>
              <Stethoscope className='w-5 h-5' />
            </div>
            <h1 className='text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white'>
              Doctor Directory & Roster
            </h1>
          </div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1'>
            Manage clinical staff credentials, real-time consultation availability, and roster records.
          </p>
        </div>

        {/* Stats summary */}
        <div className='flex items-center gap-3'>
          <div className='px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-center min-w-[80px]'>
            <p className='text-[10px] uppercase font-bold text-zinc-400'>Total</p>
            <p className='text-base font-black text-zinc-900 dark:text-white'>{doctors.length}</p>
          </div>
          <div className='px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[80px]'>
            <p className='text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400'>Active</p>
            <p className='text-base font-black text-emerald-600 dark:text-emerald-400'>{availableCount}</p>
          </div>
          <div className='px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center min-w-[80px]'>
            <p className='text-[10px] uppercase font-bold text-zinc-500'>Inactive</p>
            <p className='text-base font-black text-zinc-600 dark:text-zinc-300'>{doctors.length - availableCount}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400' />
          <input
            type='text'
            placeholder='Search doctor by name, specialty, or degree...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-zinc-900 dark:text-white placeholder-zinc-400 shadow-sm'
          />
        </div>

        <div className='flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0'>
          <Filter className='w-4 h-4 text-zinc-400 shrink-0 hidden sm:block' />
          <select
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer'
          >
            {specialities.map((spec, i) => (
              <option key={i} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm'>
          <div className='w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400 mb-3'>
            <UserCheck className='w-8 h-8' />
          </div>
          <h3 className='text-base font-bold text-zinc-900 dark:text-white'>No Doctors Found</h3>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto'>
            No doctor profiles match your current search query or filter. Try clearing your filters or add a new doctor.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
          {filteredDoctors.map((item, index) => (
            <div
              key={index}
              className='group bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1'
            >
              {/* Doctor Image & Badge */}
              <div className='relative bg-zinc-50 dark:bg-zinc-950/60 aspect-[4/3] overflow-hidden'>
                <img
                  className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                  src={getDoctorInstantImage(item, index)}
                  alt={item.name}
                  loading='eager'
                  decoding='async'
                />
                <div className='absolute top-2.5 right-2.5'>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-md shadow-sm ${
                    item.available 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-zinc-800/90 text-zinc-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-white animate-pulse' : 'bg-zinc-400'}`} />
                    {item.available ? 'Available' : 'Offline'}
                  </span>
                </div>
                <div className='absolute bottom-2.5 left-2.5'>
                  <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/80 text-white text-[10px] font-bold backdrop-blur-sm'>
                    <ShieldCheck className='w-3 h-3 text-primary' /> Verified
                  </span>
                </div>
              </div>

              {/* Doctor Details */}
              <div className='p-4 flex-1 flex flex-col justify-between space-y-3'>
                <div className='space-y-1'>
                  <h3 className='font-bold text-zinc-900 dark:text-white text-base truncate group-hover:text-primary transition-colors'>
                    {item.name}
                  </h3>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-semibold text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-md'>
                      {item.speciality}
                    </span>
                    <span className='text-[11px] text-zinc-400 font-medium'>
                      {item.experience || '1+ Yrs Exp'}
                    </span>
                  </div>
                  {item.degree && (
                    <p className='text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5'>
                      {item.degree}
                    </p>
                  )}
                </div>

                {/* Consultation Fee */}
                <div className='pt-2 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between text-xs'>
                  <span className='text-zinc-400 text-[11px] font-medium'>Consultation Fee</span>
                  <span className='font-black text-zinc-900 dark:text-zinc-100 text-sm'>
                    ₹{item.fees}
                  </span>
                </div>

                {/* Actions: Instant Toggle & Remove */}
                <div className='pt-2 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between gap-2'>
                  <label className='flex items-center gap-2 cursor-pointer select-none'>
                    <input
                      type='checkbox'
                      checked={item.available}
                      onChange={() => changeAvailability(item._id)}
                      className='w-4 h-4 text-primary rounded border-zinc-300 dark:border-zinc-700 focus:ring-primary cursor-pointer'
                    />
                    <span className='text-xs font-semibold text-zinc-700 dark:text-zinc-300'>
                      Active Slot
                    </span>
                  </label>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${item.name} from the roster?`)) {
                        removeDoctor(item._id)
                      }
                    }}
                    className='inline-flex items-center gap-1 text-red-500 hover:text-white border border-red-500/20 hover:bg-red-500 px-2.5 py-1 rounded-lg transition-all text-xs font-bold cursor-pointer active:scale-95'
                    title='Remove Doctor'
                  >
                    <Trash2 className='w-3 h-3' />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorsList