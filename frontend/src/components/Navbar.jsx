import React, { useContext, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../store/uiSlice'
import { 
  Sun, 
  Moon, 
  Sparkles, 
  ChevronDown, 
  User, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  Shield,
  Activity,
  Building2,
  FolderLock,
  LayoutDashboard,
  HeartPulse,
  ArrowRight
} from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  const theme = useSelector((state) => state.ui.theme)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    setShowProfileDropdown(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between py-3.5 text-sm font-medium transition-all gap-4'>
      {/* Logo & Brand Name with RED Heart */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
      >
        <div className="w-10 h-10 rounded-2xl bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 flex items-center justify-center shadow-md shadow-red-500/15 transition-transform group-hover:scale-105 duration-200">
          <HeartPulse className="w-5 h-5 text-red-500 fill-red-500/25 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 leading-none flex items-center gap-1.5">
            CareSync
          </span>
          <span className="text-[9px] text-red-500 dark:text-red-400 font-bold tracking-wider uppercase leading-none mt-1">
            Unified Health Platform
          </span>
        </div>
      </div>

      {/* Primary Nav Links (Properly Structured, Single-line, No Wrapping) */}
      <ul className='hidden xl:flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300 font-semibold'>
        <li>
          <NavLink 
            to='/' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive && location.pathname === '/' 
                  ? 'text-primary dark:text-white bg-primary/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/doctors' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary dark:text-white bg-primary/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Doctors
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/dashboard' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary dark:text-white bg-primary/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/hospital' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Hospital
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/blood-donation' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Blood Bank
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/pharmacy-shop' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Pharmacy
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/ai-hub' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            AI Hub
          </NavLink>
        </li>

        <li>
          <NavLink 
            to='/contact' 
            className={({ isActive }) => 
              `whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary dark:text-white bg-primary/10 dark:bg-zinc-800 font-bold' 
                  : 'hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
              }`
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Right Section: Appointment CTA, Theme toggle, Auth */}
      <div className='flex items-center gap-2 sm:gap-2.5 flex-shrink-0'>
        
        {/* Book Appointment CTA Button */}
        <button
          onClick={() => navigate('/doctors')}
          className='bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer whitespace-nowrap'
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Appointment</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl border border-zinc-200 dark:border-[#27272a] text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-all cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {token && userData ? (
          <div className='relative'>
            <div 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className='flex items-center gap-2 cursor-pointer select-none p-1 rounded-xl hover:bg-zinc-50 dark:hover:bg-[#27272a] border border-transparent hover:border-zinc-200/50 dark:hover:border-[#27272a] transition-all'
            >
              <img 
                className='w-8 h-8 rounded-full border border-zinc-200 dark:border-[#27272a] object-cover' 
                src={userData.image || '/fallback-user.png'} 
                alt="profile" 
              />
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </div>
            
            {showProfileDropdown && (
              <>
                <div onClick={() => setShowProfileDropdown(false)} className="fixed inset-0 z-10" />
                <div className='absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f1f23] border border-zinc-200 dark:border-[#27272a] rounded-2xl shadow-2xl z-20 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150'>
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-[#27272a] mb-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{userData.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{userData.email}</p>
                  </div>
                  <button 
                    onClick={() => { navigate('/my-profile'); setShowProfileDropdown(false); }}
                    className='w-full px-3 py-2 rounded-xl text-left text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-[#27272a] flex items-center gap-2 transition-colors cursor-pointer'
                  >
                    <User className="w-3.5 h-3.5 text-primary" /> My Profile
                  </button>
                  <button 
                    onClick={() => { navigate('/my-appointments'); setShowProfileDropdown(false); }}
                    className='w-full px-3 py-2 rounded-xl text-left text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-[#27272a] flex items-center gap-2 transition-colors cursor-pointer'
                  >
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Appointments &amp; Records
                  </button>
                  <hr className="my-1 border-zinc-100 dark:border-[#27272a]" />
                  <button 
                    onClick={logout}
                    className='w-full px-3 py-2 rounded-xl text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition-colors cursor-pointer'
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className='bg-primary hover:bg-primary-dark text-white text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all hidden sm:block cursor-pointer'
            >
              Login / Sign Up
            </button>
          </div>
        )}

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setShowMenu(true)} 
          className='xl:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer'
          aria-label="Open Navigation Menu"
        >
          <Menu className='w-5 h-5' />
        </button>

        {/* ---- Mobile Menu Drawer ---- */}
        {showMenu && (
          <>
            <div 
              onClick={() => setShowMenu(false)} 
              className='xl:hidden fixed inset-0 z-40 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200'
            />
            <div className='xl:hidden fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-850 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-250 overflow-hidden'>
              <div className="flex flex-col h-full overflow-hidden">
                <div className='flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900 flex-shrink-0'>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center font-bold">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50">CareSync</span>
                      <p className="text-[9px] text-zinc-400 leading-none">Unified Health</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowMenu(false)} 
                    className='p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 cursor-pointer'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>

                {token && userData && (
                  <div className='flex items-center gap-3 p-3 my-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex-shrink-0'>
                    <img 
                      className='w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover' 
                      src={userData.image || '/fallback-user.png'} 
                      alt="profile" 
                    />
                    <div className="truncate">
                      <p className='font-bold text-xs text-zinc-900 dark:text-zinc-50 leading-tight'>{userData.name}</p>
                      <p className='text-[10px] text-zinc-400 truncate leading-none mt-0.5'>{userData.email}</p>
                    </div>
                  </div>
                )}

                {/* Scrollable Navigation List */}
                <ul className='flex-1 overflow-y-auto space-y-1 py-2 pr-1 text-xs font-semibold no-scrollbar'>
                  <NavLink onClick={() => setShowMenu(false)} to='/' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    Home
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/doctors' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    Find Doctors
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/dashboard' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    Dashboard
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/hospital' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    <Building2 className="w-3.5 h-3.5 text-teal-500" /> Hospital Management
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/blood-donation' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-red-500/10 text-red-500 font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    <HeartPulse className="w-3.5 h-3.5 text-red-500" /> Blood Bank &amp; Donors
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/pharmacy-shop' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-sky-500/10 text-sky-500 font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    <Activity className="w-3.5 h-3.5 text-sky-500" /> Central Pharmacy Shop
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/ai-hub' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-purple-500/10 text-purple-500 font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Diagnostic Hub
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/my-appointments' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    <FolderLock className="w-3.5 h-3.5 text-indigo-500" /> Health Records Vault
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/about' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    About Us
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/contact' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                    Contact
                  </NavLink>
                  
                  {token && userData && (
                    <>
                      <hr className='w-full border-zinc-100 dark:border-zinc-900 my-2' />
                      <NavLink onClick={() => setShowMenu(false)} to='/my-profile' className={({isActive}) => `px-4 py-2.5 rounded-xl flex items-center transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}>
                        My Profile
                      </NavLink>
                    </>
                  )}
                </ul>

                {/* Footer Buttons in Drawer */}
                <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex-shrink-0">
                  {token && userData ? (
                    <button 
                      onClick={() => { logout(); setShowMenu(false); }} 
                      className='w-full py-2.5 rounded-xl border border-red-200 dark:border-red-950/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  ) : (
                    <button 
                      onClick={() => { navigate('/login'); setShowMenu(false); }} 
                      className='w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-md'
                    >
                      Login / Sign Up
                    </button>
                  )}

                  <a 
                    href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5180'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className='w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all'
                  >
                    <Shield className="w-3.5 h-3.5 text-primary" /> Doctor / Admin Console
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
