import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { doctorImages, getDoctorInstantImage } from "../assets/assets";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const urlParams = new URLSearchParams(window.location.search);
    const urlAToken = urlParams.get('aToken');
    if (urlAToken) {
        localStorage.setItem('aToken', urlAToken);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const [aToken, setAToken] = useState(urlAToken || localStorage.getItem('aToken') || '')
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [appointments, setAppointments] = useState([])

    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)


    const getAllDoctors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                const enriched = data.doctors.map((d, i) => ({
                    ...d,
                    image: getDoctorInstantImage(d, i)
                }))
                setDoctors(enriched)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to approve appointment using API
    const approveAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/approve-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
                if (getDashData) getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const removeDoctor = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/remove-doctor', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Real-Time Socket.io Connection for instant updates
    useEffect(() => {
        if (aToken) {
            getAllDoctors()
            getAllAppointments()
            getDashData()

            const socketUrl = backendUrl || 'http://localhost:8080'
            const socket = io(socketUrl)

            socket.emit('join_admin')

            socket.on('doctor_list_updated', () => {
                getAllDoctors()
                getDashData()
            })

            socket.on('appointment_list_updated', () => {
                getAllAppointments()
                getDashData()
            })

            socket.on('appointment_booked', () => {
                getAllAppointments()
                getDashData()
            })

            socket.on('appointment_cancelled', () => {
                getAllAppointments()
                getDashData()
            })

            socket.on('appointment_approved', () => {
                getAllAppointments()
                getDashData()
            })

            socket.on('appointment_completed', () => {
                getAllAppointments()
                getDashData()
            })

            socket.on('dashboard_updated', () => {
                getDashData()
                getAllDoctors()
                getAllAppointments()
            })

            return () => {
                socket.disconnect()
            }
        }
    }, [aToken, backendUrl])

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments, cancelAppointment, approveAppointment,
        getDashData, dashData, removeDoctor
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>

    )

}
export default AdminContextProvider