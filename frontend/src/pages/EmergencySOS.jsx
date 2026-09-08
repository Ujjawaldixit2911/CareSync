import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import io from 'socket.io-client'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Shield, 
  Clock, 
  Truck, 
  Activity, 
  Check, 
  RotateCcw,
  Compass
} from 'lucide-react'

// Custom Leaflet Icons using SVG/HTML
const createPulseIcon = () => L.divIcon({
  className: 'custom-pulse-marker',
  html: `<div style="
    width: 20px;
    height: 20px;
    background: #ef4444;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
    position: relative;
  ">
    <div style="
      position: absolute;
      width: 36px;
      height: 36px;
      top: -11px;
      left: -11px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.4);
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    "></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

const createAmbulanceIcon = () => L.divIcon({
  className: 'custom-ambulance-marker',
  html: `<div style="
    width: 36px;
    height: 36px;
    background: #ffffff;
    border: 2px solid #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    font-size: 20px;
  ">🚑</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

const EmergencySOS = () => {
  const { backendUrl, token } = useContext(AppContext)
  const theme = useSelector((state) => state.ui.theme)

  // SOS States: 'idle', 'locating', 'triggered', 'responding', 'rescued'
  const [sosStatus, setSosStatus] = useState('idle')

  // GPS Coordinates
  const [gpsCoords, setGpsCoords] = useState({ lat: 12.9716, lng: 77.5946 })
  const [phoneNum, setPhoneNum] = useState('')
  const [patientName, setPatientName] = useState('')
  const [sosRecordId, setSosRecordId] = useState(null)

  // Ambulance Tracker
  const [assignedAmbulance, setAssignedAmbulance] = useState(null)
  const [ambulanceCoords, setAmbulanceCoords] = useState({ lat: 12.9916, lng: 77.6146 }) // Starts slightly offset
  const [eta, setEta] = useState('12 mins')

  // List of nearby facilities
  const nearbyFacilities = [
    { name: "Apollo Emergency Center", dist: "1.4 km", contact: "+91-9988771122" },
    { name: "Fortis Cardiac Critical Care", dist: "2.8 km", contact: "+91-9988771133" },
    { name: "CareSync Trauma Clinic", dist: "3.2 km", contact: "+91-9988771144" }
  ]

  // Leaflet Map State & Refs
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const patientMarkerRef = useRef(null)
  const ambulanceMarkerRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Fetch user current position immediately on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setGpsCoords(coords)
          setAmbulanceCoords({
            lat: coords.lat + 0.015,
            lng: coords.lng + 0.015
          })
        },
        (error) => {
          console.warn('Geolocation prompt deferred or failed on mount:', error.message)
        },
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // Initialize Leaflet Map with OpenStreetMap / CartoDB tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [gpsCoords.lat, gpsCoords.lng],
      zoom: 14,
      zoomControl: false
    })

    L.control.zoom({ position: 'topright' }).addTo(map)

    // 100% Free OpenStreetMap Tile Layer - No API Key Required
    const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    tileLayerRef.current = tileLayer

    // Patient Marker
    const patientMarker = L.marker([gpsCoords.lat, gpsCoords.lng], {
      icon: createPulseIcon()
    }).addTo(map).bindPopup('<b>Your Current Location</b>')
    patientMarkerRef.current = patientMarker

    mapInstanceRef.current = map
    setMapLoaded(true)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Sync Map view if theme changes
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current)
      const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

      const newTileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)

      tileLayerRef.current = newTileLayer
    }
  }, [theme])

  // Update Patient Marker & Map view when GPS changes
  useEffect(() => {
    if (!mapInstanceRef.current || !patientMarkerRef.current) return
    patientMarkerRef.current.setLatLng([gpsCoords.lat, gpsCoords.lng])
    mapInstanceRef.current.setView([gpsCoords.lat, gpsCoords.lng], mapInstanceRef.current.getZoom())
  }, [gpsCoords])

  // Handle ambulance tracking marker and fitting bounds
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (sosStatus === 'responding') {
      if (ambulanceMarkerRef.current) {
        ambulanceMarkerRef.current.setLatLng([ambulanceCoords.lat, ambulanceCoords.lng])
      } else {
        const ambulanceMarker = L.marker([ambulanceCoords.lat, ambulanceCoords.lng], {
          icon: createAmbulanceIcon()
        }).addTo(mapInstanceRef.current).bindPopup('<b>Responding Ambulance</b>')
        ambulanceMarkerRef.current = ambulanceMarker
      }

      // Auto-fit bounds to show both patient and ambulance
      const bounds = L.latLngBounds([
        [gpsCoords.lat, gpsCoords.lng],
        [ambulanceCoords.lat, ambulanceCoords.lng]
      ])
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] })
    } else {
      if (ambulanceMarkerRef.current) {
        mapInstanceRef.current.removeLayer(ambulanceMarkerRef.current)
        ambulanceMarkerRef.current = null
      }
    }
  }, [sosStatus, ambulanceCoords, gpsCoords])

  // WebSocket for live responder dispatch tracking
  useEffect(() => {
    if (token) {
      const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const socket = io(socketUrl)

      // Join sandbox user room
      socket.emit('join_user', 'patient_local')

      socket.on('sos_dispatched', (data) => {
        toast.error(`🚨 Emergency ambulance ${data.ambulanceId} has been dispatched to your location!`)
        setSosStatus('responding')
        setAssignedAmbulance(data.ambulanceId)
        setEta(data.eta || '10 mins')
        if (data.coords) {
          setAmbulanceCoords(data.coords)
        }
      })

      // Simulated live route movement every 2.5 seconds
      let moveInterval = null
      if (sosStatus === 'responding') {
        moveInterval = setInterval(() => {
          setAmbulanceCoords((prev) => {
            const stepLat = (gpsCoords.lat - prev.lat) * 0.15
            const stepLng = (gpsCoords.lng - prev.lng) * 0.15
            return {
              lat: prev.lat + stepLat,
              lng: prev.lng + stepLng
            }
          })
        }, 2500)
      }

      return () => {
        socket.disconnect()
        if (moveInterval) clearInterval(moveInterval)
      }
    }
  }, [token, sosStatus, gpsCoords])

  // Fetch real geolocation on SOS Trigger
  const handleTriggerSOS = () => {
    setSosStatus('locating')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setGpsCoords(coords)
          setAmbulanceCoords({
            lat: coords.lat + 0.012,
            lng: coords.lng + 0.012
          })
          setSosStatus('triggered')
          toast.warning('📍 Live GPS coordinates locked. Confirm your SOS alert!')
        },
        (error) => {
          console.warn('Geolocation failed:', error)
          // Default to current state coords
          setSosStatus('triggered')
          toast.info('Using local approximate GPS pin.')
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    } else {
      setSosStatus('triggered')
    }
  }

  // Confirm and broadcast SOS event to backend
  const handleConfirmSOS = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/sos-emergency`, {
        patientName: patientName || 'Emergency Patient',
        phone: phoneNum,
        location: gpsCoords,
        notes: 'Critical SOS dispatch requested via CareSync platform.'
      }, { headers: { token } })

      if (data.success) {
        setSosStatus('responding')
        setSosRecordId(data.sosId)
        toast.error('🔥 SOS beacon transmitted. Admin and ambulance dispatch notified!')
      }
    } catch (err) {
      toast.error('SOS request failed')
    }
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto py-4">
      
      {/* Title */}
      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-red-650 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-red-500 animate-pulse" /> Emergency Response Room (SOS)
        </h1>
        <p className="text-zinc-505 dark:text-zinc-400 text-xs">Press the emergency trigger to broadcast location coordinates to medical dispatchers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* LEFT COLUMN: ACTIVE SOS BUTTON CONTROLLER */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 min-h-[360px]">
          
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-red-500" /> Emergency Beacon
            </h3>
            
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              Transmitting an SOS instantly logs your latitude/longitude coordinates on the hospital triage board and assigns the nearest active ambulance responder.
            </p>
          </div>

          {/* SOS Pulsing Button container */}
          <div className="flex flex-col items-center justify-center py-6">
            {sosStatus === 'idle' && (
              <button 
                onClick={handleTriggerSOS}
                className="w-28 h-28 rounded-full bg-red-500 hover:bg-red-600 flex flex-col items-center justify-center text-white font-extrabold text-sm shadow-xl shadow-red-500/25 border-4 border-red-200 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <AlertTriangle className="w-6 h-6 mb-1" />
                TRIGGER SOS
              </button>
            )}

            {sosStatus === 'locating' && (
              <div className="w-28 h-28 rounded-full border-4 border-dashed border-red-500 flex flex-col items-center justify-center animate-spin">
                <Compass className="w-6 h-6 text-red-500" />
              </div>
            )}

            {sosStatus === 'triggered' && (
              <form onSubmit={handleConfirmSOS} className="w-full space-y-3">
                <input
                  type="text"
                  placeholder="Enter Contact Phone No. *"
                  required
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-xl bg-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Enter Patient Name (Optional)"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-xl bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirm & Broadcast SOS
                </button>
              </form>
            )}

            {(sosStatus === 'responding' || sosStatus === 'rescued') && (
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto animate-bounce">
                  <Truck className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-sm text-zinc-900 mt-2">Ambulance Responding</h4>
                <p className="text-zinc-500 text-[11px]">ETA: <span className="font-bold text-red-500">{eta}</span></p>
                <button 
                  onClick={() => setSosStatus('idle')}
                  className="px-3 py-1 border border-zinc-200 rounded-lg text-[10px] text-zinc-500 hover:bg-zinc-50 cursor-pointer flex items-center gap-0.5 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Cancel SOS
                </button>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <span className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider">Triage Location GPS</span>
            <p className="text-zinc-700 mt-1 leading-none font-mono">
              Lat: {gpsCoords.lat.toFixed(4)} | Lng: {gpsCoords.lng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* RIGHT TWO COLUMNS: TRACKING MAP & QUICK DIALS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* MAP VISUAL CONTAINER */}
          <div className="relative w-full h-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-zinc-50 dark:bg-zinc-950 z-0">
            {/* Leaflet Map element */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 bg-opacity-90 z-20">
                <div className="text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-zinc-505 dark:text-zinc-400 text-[10px]">Loading Live GPS Map (OpenStreetMap)...</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 z-[1000] text-[9px] text-zinc-650 dark:text-zinc-350 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm max-w-[210px]">
              🗺️ 100% Free OpenStreetMap & Live Dispatch.
            </div>
          </div>

          {/* Dial Directory Facilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nearby facilities */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3">
              <h4 className="font-bold text-zinc-450 uppercase text-[9px] tracking-wider">Nearby Trauma Centers</h4>
              
              <div className="space-y-2">
                {nearbyFacilities.map((facility, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b last:border-0 border-zinc-100">
                    <div>
                      <p className="font-bold text-zinc-805">{facility.name}</p>
                      <p className="text-[10px] text-zinc-400">{facility.dist} away</p>
                    </div>
                    <a href={`tel:${facility.contact}`} className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick response dials */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
              <h4 className="font-bold text-zinc-450 uppercase text-[9px] tracking-wider">Critical Desk Dials</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="tel:102" className="p-3 border rounded-xl hover:bg-red-50/50 flex flex-col items-center gap-1 cursor-pointer">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="font-bold">Ambulance</span>
                  <span className="text-[9px] text-zinc-400">Dial 102</span>
                </a>
                <a href="tel:100" className="p-3 border rounded-xl hover:bg-zinc-50 flex flex-col items-center gap-1 cursor-pointer">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-bold">Police</span>
                  <span className="text-[9px] text-zinc-400">Dial 100</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default EmergencySOS
