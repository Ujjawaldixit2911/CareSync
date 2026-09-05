import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

import { doctors as defaultDoctors } from "../assets/assets";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState(defaultDoctors)
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success && data.doctors && data.doctors.length > 0) {
                // Merge backend doctors with default fallback images if missing
                const enriched = data.doctors.map((d, i) => ({
                    ...d,
                    image: d.image || defaultDoctors[i % defaultDoctors.length]?.image
                }))
                setDoctors(enriched)
            } else {
                setDoctors(defaultDoctors)
            }
        } catch (error) {
            console.log("Could not fetch backend doctor list, using static doctors:", error)
            setDoctors(defaultDoctors)
        }
    }

    const loadUserProfileData = async () => {
        try {
            if (!token || token === 'undefined' || token === 'null') return;
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            })

            if (data.success) {
                const safeUserData = {
                    ...data.userData,
                    address: data.userData.address || { line1: '', line2: '' },
                    gender: data.userData.gender || '',
                    dob: data.userData.dob || ''
                }
                setUserData(safeUserData)
            } else {
                // If token is invalid or expired, gracefully reset state
                setToken('')
                localStorage.removeItem('token')
                setUserData(false)
            }
        } catch (error) {
            console.log("Profile load failed:", error)
            setToken('')
            localStorage.removeItem('token')
            setUserData(false)
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
