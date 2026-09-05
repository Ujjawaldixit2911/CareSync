import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { 
  Flame, 
  Footprints, 
  Droplets, 
  Moon, 
  Dumbbell, 
  Trophy, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  Zap, 
  Heart, 
  Apple, 
  Utensils, 
  Clock, 
  Award,
  X,
  Target,
  ArrowUpRight
} from 'lucide-react'
import { toast } from 'react-toastify'

const FitnessTracker = () => {
  const { userData } = useContext(AppContext)
  
  // User name for greeting
  const userName = userData?.name ? userData.name.split(' ')[0] : 'Alex'

  // Dynamic greeting based on current local hour
  const [greeting, setGreeting] = useState('Good morning')
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Streak state
  const [streakDays, setStreakDays] = useState(14)

  // 4 Daily Summary Metrics State
  const [metrics, setMetrics] = useState({
    steps: 8450,
    stepsGoal: 10000,
    calories: 640,
    caloriesGoal: 750,
    water: 2.25, // Liters
    waterGoal: 3.0,
    sleep: 7.5, // Hours
    sleepGoal: 8.0
  })

  // Selected Day on Weekly Chart
  const [selectedDayIndex, setSelectedDayIndex] = useState(6) // Sunday / Today

  // Weekly Activity Bar Chart Data (Mon - Sun)
  const weeklyData = [
    { day: 'Mon', steps: 9200, calories: 710, completion: 92 },
    { day: 'Tue', steps: 10400, calories: 820, completion: 100 },
    { day: 'Wed', steps: 7800, calories: 590, completion: 78 },
    { day: 'Thu', steps: 11200, calories: 880, completion: 100 },
    { day: 'Fri', steps: 8900, calories: 690, completion: 89 },
    { day: 'Sat', steps: 12500, calories: 950, completion: 100 },
    { day: 'Sun', steps: 8450, calories: 640, completion: 85 } // Today
  ]

  // Workout Plans (Horizontal Scroll Carousel)
  const workoutPlans = [
    {
      id: 1,
      name: 'HIIT Cardio Burn',
      tag: 'High Intensity',
      tagColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      duration: '25 min',
      burn: '320 kcal',
      difficulty: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
      exercises: ['Jumping Jacks (45s)', 'Burpees (30s)', 'High Knees (45s)', 'Mountain Climbers (45s)', 'Rest (30s)']
    },
    {
      id: 2,
      name: 'Core & Abs Sculpt',
      tag: 'Strength',
      tagColor: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20',
      duration: '20 min',
      burn: '180 kcal',
      difficulty: 'All Levels',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
      exercises: ['Plank Holds (60s)', 'Bicycle Crunches (40s)', 'Russian Twists (40s)', 'Leg Raises (45s)']
    },
    {
      id: 3,
      name: 'Upper Body Power',
      tag: 'Hypertrophy',
      tagColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      duration: '35 min',
      burn: '410 kcal',
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
      exercises: ['Push-up Variations (3 sets)', 'Dumbbell Rows (4 sets)', 'Shoulder Press (3 sets)', 'Bicep Curls (3 sets)']
    },
    {
      id: 4,
      name: 'Post-Run Mobility & Flow',
      tag: 'Recovery',
      tagColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      duration: '15 min',
      burn: '90 kcal',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
      exercises: ['Hamstring Stretch (45s)', 'Pigeon Pose (60s)', 'Cat-Cow Stretch (60s)', 'Deep Hip Opener (60s)']
    }
  ]

  // Goals State
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Weight Target Goal',
      current: '71.2 kg',
      target: '68.0 kg',
      remaining: '3.2 kg to go',
      progress: 68,
      accentColor: 'bg-lime-500'
    },
    {
      id: 2,
      title: 'Weekly Active Minutes',
      current: '195 mins',
      target: '240 mins',
      remaining: '45 mins left',
      progress: 81,
      accentColor: 'bg-orange-500'
    },
    {
      id: 3,
      title: 'Water Hydration Consistency',
      current: '6 of 7 days',
      target: '7 days',
      remaining: '1 day to hit weekly crown',
      progress: 86,
      accentColor: 'bg-cyan-500'
    }
  ])

  // Modals state
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false)

  // Active workout session timer state
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [workoutSeconds, setWorkoutSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutSeconds(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Quick Log Actions
  const handleAddWater = (amountLiters) => {
    const newAmount = Math.min(+(metrics.water + amountLiters).toFixed(2), 5.0)
    setMetrics(prev => ({ ...prev, water: newAmount }))
    setIsWaterModalOpen(false)
    toast.success(`💧 Logged +${(amountLiters * 1000).toFixed(0)}ml of water!`)
  }

  const [mealInput, setMealInput] = useState({ name: '', calories: 350, type: 'Lunch' })
  const handleLogMeal = (e) => {
    e.preventDefault()
    if (!mealInput.name.trim()) return toast.error('Please enter meal name')
    
    setMetrics(prev => ({
      ...prev,
      calories: Math.min(prev.calories + Number(mealInput.calories), 2500)
    }))
    setIsMealModalOpen(false)
    setMealInput({ name: '', calories: 350, type: 'Lunch' })
    toast.success(`🥗 Logged ${mealInput.name} (+${mealInput.calories} kcal)!`)
  }

  const handleStartWorkoutSession = (workout) => {
    setActiveWorkout(workout)
    setWorkoutSeconds(0)
    setIsTimerRunning(true)
    setIsWorkoutModalOpen(true)
  }

  const handleFinishWorkout = () => {
    setIsTimerRunning(false)
    const burned = Math.round((workoutSeconds / 60) * 12) + 50
    setMetrics(prev => ({
      ...prev,
      calories: prev.calories + burned,
      steps: prev.steps + Math.round(workoutSeconds * 1.5)
    }))
    setIsWorkoutModalOpen(false)
    toast.success(`🔥 Great job! Completed ${activeWorkout?.name || 'Workout'} (${formatTimer(workoutSeconds)}) • +${burned} kcal burned!`)
  }

  // Ring Calculation Helper
  const getRingStroke = (current, goal) => {
    const pct = Math.min(Math.round((current / goal) * 100), 100)
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (pct / 100) * circumference
    return { pct, circumference, strokeDashoffset }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-8 text-slate-900 dark:text-zinc-50 pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HEADER: Greeting, Streak Counter, Profile Avatar                        */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        
        {/* Left: Greeting */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img 
              src={userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt={userName} 
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl object-cover border-2 border-lime-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-500 border-2 border-white dark:border-zinc-900" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-lime-500" />
              <span>{greeting}</span>
            </div>
            <h1 className="text-xl sm:text-2.5xl font-black tracking-tight text-slate-900 dark:text-white">
              {userName} <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Ready to crush your daily targets?
            </p>
          </div>
        </div>

        {/* Right: Gamified Streak Counter Badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500/15 to-lime-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-xs">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-bounce" />
            <div className="text-right">
              <span className="text-base sm:text-lg font-black leading-none block">{streakDays}-Day</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-90">Active Streak</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 hidden sm:block">Top 5% consistency rank</span>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. QUICK LOG BUTTONS STRIP                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        
        {/* Quick Log Water */}
        <button
          onClick={() => setIsWaterModalOpen(true)}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 transition-all active:scale-98 cursor-pointer shadow-xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-black block">Log Water</span>
            <span className="text-[10px] text-cyan-700 dark:text-cyan-300 opacity-80">+250ml quick</span>
          </div>
        </button>

        {/* Quick Log Meal */}
        <button
          onClick={() => setIsMealModalOpen(true)}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-lime-500/10 hover:bg-lime-500/20 text-lime-700 dark:text-lime-400 border border-lime-500/25 transition-all active:scale-98 cursor-pointer shadow-xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-lime-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-black block">Log Meal</span>
            <span className="text-[10px] text-lime-800 dark:text-lime-300 opacity-80">+350 kcal</span>
          </div>
        </button>

        {/* Quick Start Workout */}
        <button
          onClick={() => handleStartWorkoutSession(workoutPlans[0])}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/25 transition-all active:scale-98 cursor-pointer shadow-xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-black block">Start Workout</span>
            <span className="text-[10px] text-orange-700 dark:text-orange-300 opacity-80">HIIT / Cardio</span>
          </div>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 3. DAILY SUMMARY RING CHARTS (4 CARDS)                                    */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-lime-500" />
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Daily Target Rings
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Live Apple & Garmin Sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Ring 1: Steps */}
          {(() => {
            const { pct, circumference, strokeDashoffset } = getRingStroke(metrics.steps, metrics.stepsGoal)
            return (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:border-lime-500/50 transition-all">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-zinc-800" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#84cc16"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <Footprints className="w-5 h-5 text-lime-500 mb-0.5" />
                    <span className="text-xs font-black">{pct}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Daily Steps</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {metrics.steps.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Goal: {metrics.stepsGoal.toLocaleString()}</span>
                </div>
              </div>
            )
          })()}

          {/* Ring 2: Calories Burned */}
          {(() => {
            const { pct, circumference, strokeDashoffset } = getRingStroke(metrics.calories, metrics.caloriesGoal)
            return (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:border-orange-500/50 transition-all">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-zinc-800" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#f97316"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <Flame className="w-5 h-5 text-orange-500 mb-0.5 fill-orange-500/20" />
                    <span className="text-xs font-black">{pct}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Calories</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {metrics.calories} <span className="text-xs font-bold text-slate-400">kcal</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Goal: {metrics.caloriesGoal} kcal</span>
                </div>
              </div>
            )
          })()}

          {/* Ring 3: Water Intake */}
          {(() => {
            const { pct, circumference, strokeDashoffset } = getRingStroke(metrics.water, metrics.waterGoal)
            return (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-zinc-800" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <Droplets className="w-5 h-5 text-cyan-500 mb-0.5" />
                    <span className="text-xs font-black">{pct}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hydration Level</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {metrics.water} <span className="text-xs font-bold text-slate-400">Liters</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Goal: {metrics.waterGoal} L</span>
                </div>
              </div>
            )
          })()}

          {/* Ring 4: Sleep Hours */}
          {(() => {
            const { pct, circumference, strokeDashoffset } = getRingStroke(metrics.sleep, metrics.sleepGoal)
            return (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-zinc-800" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#6366f1"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <Moon className="w-5 h-5 text-indigo-500 mb-0.5" />
                    <span className="text-xs font-black">{pct}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Sleep Score</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {metrics.sleep} <span className="text-xs font-bold text-slate-400">hrs</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Goal: {metrics.sleepGoal} hrs</span>
                </div>
              </div>
            )
          })()}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. WEEKLY ACTIVITY BAR CHART                                              */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Weekly Activity & Calorie Burn
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Average weekly completion rate: <span className="text-lime-500 font-bold">92.4%</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500" /> Goal Met
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High Energy
            </span>
          </div>
        </div>

        {/* 7-Day Bar Chart Bars */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-100 dark:border-zinc-800">
          {weeklyData.map((item, idx) => {
            const isSelected = selectedDayIndex === idx
            const heightPct = Math.round((item.steps / 13000) * 100)
            const isTopBurn = item.calories >= 800

            return (
              <div 
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className="flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
              >
                {/* Hover / Active Tooltip */}
                <div className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md transition-all ${
                  isSelected 
                    ? 'bg-[#0071e3] text-white shadow-xs' 
                    : 'opacity-0 group-hover:opacity-100 bg-[#f5f5f7] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}>
                  {item.steps.toLocaleString()}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[36px] bg-slate-100 dark:bg-zinc-800 rounded-2xl h-full flex items-end p-1 relative overflow-hidden">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-xl transition-all duration-500 ${
                      isTopBurn 
                        ? 'bg-gradient-to-t from-orange-500 to-amber-400' 
                        : 'bg-gradient-to-t from-lime-600 to-lime-400'
                    } ${isSelected ? 'ring-2 ring-slate-900 dark:ring-white scale-y-[1.02]' : 'group-hover:opacity-90'}`}
                  />
                </div>

                {/* Day Label */}
                <span className={`text-xs font-bold transition-colors ${
                  isSelected ? 'text-lime-600 dark:text-lime-400 font-extrabold' : 'text-slate-400'
                }`}>
                  {item.day}
                </span>
              </div>
            )
          })}
        </div>

        {/* Selected Day Breakdown Strip */}
        <div className="flex flex-wrap items-center justify-between text-xs p-3.5 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-700 dark:text-zinc-300">
              {weeklyData[selectedDayIndex].day}'s Performance:
            </span>
            <span className="text-slate-500">
              {weeklyData[selectedDayIndex].steps.toLocaleString()} steps • {weeklyData[selectedDayIndex].calories} active kcal
            </span>
          </div>

          <span className="font-extrabold text-lime-600 dark:text-lime-400 bg-lime-500/10 px-2.5 py-0.5 rounded-lg border border-lime-500/20">
            {weeklyData[selectedDayIndex].completion}% of daily objective
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. WORKOUT PLAN CARDS (HORIZONTAL SCROLL CAROUSEL)                        */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-lime-500" />
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Recommended Workout Plans
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Swipe to view routines →</span>
        </div>

        {/* Horizontal Carousel Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {workoutPlans.map((plan) => (
            <div
              key={plan.id}
              className="w-72 sm:w-80 shrink-0 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Card Image Cover with Badges */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${plan.tagColor}`}>
                    {plan.tag}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                    {plan.difficulty}
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-extrabold text-base leading-tight drop-shadow-sm">{plan.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-300 mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-lime-400" /> {plan.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> {plan.burn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Exercises List & Launcher */}
              <div className="p-4 space-y-4">
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Routine Circuit:</span>
                  {plan.exercises.slice(0, 3).map((ex, exIdx) => (
                    <div key={exIdx} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-lime-500 shrink-0" />
                      <span className="truncate">{ex}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleStartWorkoutSession(plan)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-extrabold text-xs shadow-md shadow-lime-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Routine
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. GOAL PROGRESS BARS                                                     */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-lime-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Target Milestone Progress
            </h3>
          </div>
          <span className="text-xs font-bold text-lime-600 dark:text-lime-400">3 Active Goals</span>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2 p-3.5 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-white">{goal.title}</span>
                <span className="text-slate-500">{goal.remaining}</span>
              </div>

              {/* Progress Track Bar */}
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${goal.progress}%` }}
                  className={`${goal.accentColor} h-full rounded-full transition-all duration-1000`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-0.5">
                <span>Current: {goal.current}</span>
                <span className="font-extrabold text-slate-800 dark:text-zinc-200">{goal.progress}% Completed</span>
                <span>Target: {goal.target}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: QUICK LOG WATER                                                  */}
      {/* ========================================================================= */}
      {isWaterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsWaterModalOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500" /> Log Hydration Intake
              </h3>
              <button onClick={() => setIsWaterModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-3xl font-black text-cyan-500">{metrics.water} L</span>
              <p className="text-xs text-slate-400">Current today • Target 3.0 L</p>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleAddWater(0.25)}
                className="py-3 px-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20 transition-all cursor-pointer"
              >
                +250 ml <br /><span className="text-[10px] text-slate-400 font-normal">Glass</span>
              </button>
              <button
                onClick={() => handleAddWater(0.5)}
                className="py-3 px-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20 transition-all cursor-pointer"
              >
                +500 ml <br /><span className="text-[10px] text-slate-400 font-normal">Bottle</span>
              </button>
              <button
                onClick={() => handleAddWater(1.0)}
                className="py-3 px-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20 transition-all cursor-pointer"
              >
                +1.0 L <br /><span className="text-[10px] text-slate-400 font-normal">Flask</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUICK LOG MEAL                                                   */}
      {/* ========================================================================= */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={() => setIsMealModalOpen(false)} className="fixed inset-0" />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-lime-500" /> Log Meal Calories
              </h3>
              <button onClick={() => setIsMealModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogMeal} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Meal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Toast with Eggs"
                  value={mealInput.name}
                  onChange={e => setMealInput({ ...mealInput, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Meal Type</label>
                  <select
                    value={mealInput.type}
                    onChange={e => setMealInput({ ...mealInput, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Healthy Snack</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Estimated Calories</label>
                  <input
                    type="number"
                    value={mealInput.calories}
                    onChange={e => setMealInput({ ...mealInput, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Record Meal to Health Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ACTIVE WORKOUT SESSION TRACKER                                   */}
      {/* ========================================================================= */}
      {isWorkoutModalOpen && activeWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Live Workout Session
              </span>
              <button 
                onClick={() => setIsWorkoutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {activeWorkout.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{activeWorkout.tag} • Target {activeWorkout.burn}</p>
            </div>

            {/* Live Stopwatch Display */}
            <div className="py-6 px-4 bg-slate-50 dark:bg-zinc-950 rounded-3xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-5xl font-black tracking-widest text-slate-900 dark:text-white font-mono">
                {formatTimer(workoutSeconds)}
              </span>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4 fill-orange-500" /> ~{Math.round((workoutSeconds / 60) * 12)} kcal
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500 animate-pulse" /> 138 BPM
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-4 rounded-2xl text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                  isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-lime-500 hover:bg-lime-600'
                }`}
              >
                {isTimerRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              <button
                onClick={() => setWorkoutSeconds(0)}
                className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold transition-all active:scale-95 cursor-pointer"
                title="Reset Stopwatch"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={handleFinishWorkout}
                className="px-6 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Finish & Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default FitnessTracker
