import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { z } from 'zod'
import { 
  User, 
  Mail, 
  Lock, 
  PlusCircle, 
  Award, 
  Compass, 
  ShieldAlert, 
  DollarSign, 
  Stethoscope, 
  FileText, 
  MapPin, 
  UploadCloud,
  CheckCircle2,
  Loader2
} from 'lucide-react'

// Zod validation schema
const doctorValidationSchema = z.object({
  name: z.string().min(2, 'Doctor name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  degree: z.string().min(2, 'Degree credentials are required (e.g. MBBS, MD)'),
  fees: z.string().or(z.number()),
  about: z.string().min(10, 'About details must be at least 10 characters'),
  address1: z.string().min(2, 'Primary address line is required'),
  address2: z.string().optional(),
})

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrors({})
    setIsLoading(true)

    if (!docImg) {
      setIsLoading(false)
      return toast.error('Please upload a doctor profile photo');
    }

    // Run Zod validation
    try {
      doctorValidationSchema.parse({
        name,
        email,
        password,
        degree,
        fees,
        about,
        address1,
        address2,
      })
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
      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const response = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken }
      })
      const data = response.data;
      
      if (data.success) {
        toast.success(data.message || "Doctor registered successfully!")
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 text-left max-w-5xl mx-auto w-full'>
      {/* Header Banner */}
      <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm'>
        <div className='flex items-center gap-2.5'>
          <div className='p-2 bg-primary/10 text-primary rounded-xl'>
            <Stethoscope className='w-5 h-5' />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              Register New Doctor
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
              Add credentialed physicians, schedule slots, and consultation fees to the system.
            </p>
          </div>
        </div>
      </div>

      <form 
        onSubmit={onSubmitHandler} 
        className='bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 sm:p-8 shadow-sm space-y-8'
      >
        {/* Upload picture */}
        <div className='bg-zinc-50 dark:bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center gap-5'>
          <label htmlFor="doc-img" className="relative group cursor-pointer block shrink-0">
            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 group-hover:border-primary transition-colors bg-white dark:bg-zinc-900 flex items-center justify-center'>
              {docImg ? (
                <img 
                  className='w-full h-full object-cover' 
                  src={URL.createObjectURL(docImg)} 
                  alt="Doctor Avatar" 
                />
              ) : (
                <div className='flex flex-col items-center justify-center text-zinc-400 gap-1 p-2 text-center'>
                  <UploadCloud className='w-6 h-6 text-primary' />
                  <span className='text-[10px] font-bold'>Upload Photo</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" accept="image/*" hidden />
          
          <div className='text-center sm:text-left space-y-1'>
            <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Doctor Profile Photograph</p>
            <p className="text-xs text-zinc-400">Supported formats: JPG, PNG, WEBP. Max file size: 5MB.</p>
            {docImg && (
              <p className='text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center sm:justify-start gap-1'>
                <CheckCircle2 className='w-3.5 h-3.5' /> File selected: {docImg.name}
              </p>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-xs'>
          
          {/* Left Column */}
          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Doctor Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={e => setName(e.target.value)} 
                  value={name} 
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs ${
                    errors.name ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
                  }`} 
                  type="text" 
                  placeholder='Dr. Alexander Fleming' 
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Doctor Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={e => setEmail(e.target.value)} 
                  value={email} 
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs ${
                    errors.email ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
                  }`} 
                  type="email" 
                  placeholder='doctor@caresync.com' 
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.email}</p>}
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Login Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={e => setPassword(e.target.value)} 
                  value={password} 
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs ${
                    errors.password ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
                  }`} 
                  type="password" 
                  placeholder='••••••••' 
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.password}</p>}
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Years of Experience</label>
              <select 
                onChange={e => setExperience(e.target.value)} 
                value={experience} 
                className='w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs cursor-pointer'
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="10+ Years">10+ Years</option>
                <option value="15+ Years">15+ Years</option>
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Consultation Fees (₹ INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-zinc-400">₹</span>
                <input 
                  onChange={e => setFees(e.target.value)} 
                  value={fees} 
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs ${
                    errors.fees ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
                  }`} 
                  type="number" 
                  placeholder='500' 
                />
              </div>
              {errors.fees && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.fees}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Speciality</label>
              <select 
                onChange={e => setSpeciality(e.target.value)} 
                value={speciality} 
                className='w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs cursor-pointer'
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Orthopedic">Orthopedic</option>
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Education / Degrees</label>
              <div className="relative">
                <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={e => setDegree(e.target.value)} 
                  value={degree} 
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs ${
                    errors.degree ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
                  }`} 
                  type="text" 
                  placeholder='MBBS, MD (General Medicine)' 
                />
              </div>
              {errors.degree && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.degree}</p>}
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Clinic / Hospital Address Line 1</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={e => setAddress1(e.target.value)} 
                  value={address1} 
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs ${
                    errors.address1 ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
                  }`} 
                  type="text" 
                  placeholder='12th Cross, Indiranagar' 
                />
              </div>
              {errors.address1 && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.address1}</p>}
            </div>

            <div className='space-y-1.5'>
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Address Line 2 (City, State, Zip)</label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  onChange={e => setAddress2(e.target.value)} 
                  value={address2} 
                  className='w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 text-xs' 
                  type="text" 
                  placeholder='Bengaluru, Karnataka 560038' 
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className='space-y-1.5 text-xs'>
          <label className="font-bold text-zinc-700 dark:text-zinc-300">About Doctor & Clinical Background</label>
          <textarea 
            onChange={e => setAbout(e.target.value)} 
            value={about} 
            className={`w-full p-4 border rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-zinc-100 resize-none ${
              errors.about ? 'border-red-500' : 'border-zinc-250 dark:border-zinc-800'
            }`} 
            rows={4} 
            placeholder='Write a short professional biography, areas of clinical focus, certifications, and hospital affiliations...'
          />
          {errors.about && <p className="text-[10px] text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.about}</p>}
        </div>

        {/* Submit Button */}
        <div className='pt-2 flex justify-end'>
          <button 
            type='submit' 
            disabled={isLoading}
            className='w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-sm tracking-wide shadow-md shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50'
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Doctor...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Add Doctor to Directory</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDoctor