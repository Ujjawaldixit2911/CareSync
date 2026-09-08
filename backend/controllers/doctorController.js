import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { cacheGet, cacheSet, cacheDelete } from '../config/cache.js';
import { emitToUser, emitToAdmin, emitBroadcast } from '../config/socket.js';


// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user.id;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      cancelled: true, 
      status: 'Declined',
      $push: { timeline: { status: 'Declined', label: 'Consultation declined by doctor', timestamp: Date.now() } }
    });
    
    // Release doctor slot
    const { slotDate, slotTime } = appointment;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Emit Socket Event
    emitToUser(appointment.userId, 'appointment_cancelled', { appointmentId });
    emitToAdmin('appointment_cancelled', { appointmentId });
    emitBroadcast('appointment_list_updated', { appointmentId, status: 'Declined' });
    emitBroadcast('dashboard_updated', {});
    emitBroadcast('doctor_list_updated', {});

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete appointment
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      isCompleted: true, 
      status: 'Completed',
      $push: { timeline: { status: 'Completed', label: 'Consultation completed by doctor', timestamp: Date.now() } }
    });

    // Emit Socket Event
    emitToUser(appointment.userId, 'appointment_completed', { appointmentId });
    emitToAdmin('appointment_completed', { appointmentId });
    emitBroadcast('appointment_list_updated', { appointmentId, status: 'Completed' });
    emitBroadcast('dashboard_updated', {});

    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors (for frontend list) - cached with Redis
const doctorList = async (req, res) => {
  try {
    const cached = await cacheGet('doctors_list');
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return res.json({ success: true, doctors: cached });
    }

    const rawDoctors = await doctorModel.find({}).select("-password -email");
    // Ensure all default doctors have available: true and consultation hours
    const doctors = rawDoctors.map(d => {
      const docObj = d.toObject ? d.toObject() : { ...d };
      return {
        ...docObj,
        available: docObj.available !== false, // default to true
        availableFrom: docObj.availableFrom || '09:00 AM',
        availableTo: docObj.availableTo || '08:00 PM',
        breakTime: docObj.breakTime || '01:00 PM - 02:00 PM',
        workingDays: docObj.workingDays && docObj.workingDays.length > 0 ? docObj.workingDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        emergencyAvailable: docObj.emergencyAvailable !== false,
        emergencyFee: docObj.emergencyFee || 150
      };
    });

    await cacheSet('doctors_list', doctors, 300); // cache for 5 minutes

    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle doctor's availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    // Invalidate doctors list cache
    await cacheDelete('doctors_list');

    // Broadcast Real-time update
    emitBroadcast('doctor_list_updated', { docId, available: doctor.available });

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's profile
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const profile = await doctorModel.findById(docId).select("-password");
    if (profile) {
      if (profile.available === undefined) profile.available = true;
      if (!profile.availableFrom) profile.availableFrom = '09:00 AM';
      if (!profile.availableTo) profile.availableTo = '08:00 PM';
      if (!profile.breakTime) profile.breakTime = '01:00 PM - 02:00 PM';
      if (profile.emergencyAvailable === undefined) profile.emergencyAvailable = true;
      if (!profile.emergencyFee) profile.emergencyFee = 150;
    }
    res.json({ success: true, profileData: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor's profile
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const { 
      fees, 
      address, 
      available, 
      about,
      availableFrom,
      availableTo,
      breakTime,
      workingDays,
      emergencyAvailable,
      emergencyFee
    } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      about,
      availableFrom: availableFrom || '09:00 AM',
      availableTo: availableTo || '08:00 PM',
      breakTime: breakTime || '01:00 PM - 02:00 PM',
      workingDays: workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      emergencyAvailable: emergencyAvailable !== false,
      emergencyFee: Number(emergencyFee) || 150
    });

    // Invalidate doctors list cache
    await cacheDelete('doctors_list');
    emitBroadcast('doctor_list_updated', { docId, available });

    res.json({ success: true, message: "Profile & Consultation Timings Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.id;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount;
      patientSet.add(a.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI Copilot: Synthesize consultation summary
const doctorAiVisitSummary = async (req, res) => {
  try {
    const { patientName, patientAge, gender, symptoms, doctorNotes, history } = req.body;
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    const response = await axios.post(`${aiServiceUrl}/api/ai/copilot/visit-summary`, {
      patient_name: patientName,
      patient_age: Number(patientAge) || 30,
      gender: gender || 'Unspecified',
      symptoms: symptoms || 'No symptoms specified',
      doctor_notes: doctorNotes || '',
      history: history || ''
    });
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('AI copilot visit summary error:', error.message);
    res.json({
      success: true,
      data: {
        summary: `Clinical assessment for patient ${req.body.patientName || 'Patient'}. Core symptoms presented: ${req.body.symptoms || 'None'}. Review: ${req.body.doctorNotes || 'None'}.`,
        suggested_diagnoses: ['General consultation'],
        suggested_questions: ['How long has this issue persisted?'],
        recommended_follow_ups: ['Assess symptoms in 3-5 days'],
        provider: 'backup-controller-mock'
      }
    });
  }
};

// AI Copilot: Patient history trends analysis
const doctorAiPatientAnalysis = async (req, res) => {
  try {
    const { appointments, patientProfile } = req.body;
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    const response = await axios.post(`${aiServiceUrl}/api/ai/copilot/patient-analysis`, {
      appointments: appointments || [],
      patient_profile: patientProfile || {}
    });
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('AI copilot patient analysis error:', error.message);
    res.json({
      success: true,
      data: {
        health_trajectory: 'Review of past medical consultations shows normal baseline status with no critical warnings.',
        risk_factors: ['Observe age-related baseline metrics'],
        preventative_steps: ['Advise periodic full physical examination', 'Recommend healthy stress and sleep routines'],
        provider: 'backup-controller-mock'
      }
    });
  }
};

// Add or edit prescription for an appointment
const addPrescription = async (req, res) => {
  try {
    const docId = req.user.id
    const { appointmentId, prescription, notes } = req.body

    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" })
    }

    // Save prescription & notes
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      prescription,
      notes,
      isCompleted: true,
      status: 'Completed',
      $push: { timeline: { status: 'Completed', label: 'Consultation completed and prescription generated', timestamp: Date.now() } }
    })

    // Emit socket event to update patient dashboard in real-time
    emitToUser(appointment.userId, 'appointment_completed', { appointmentId })
    emitToAdmin('appointment_completed', { appointmentId })

    res.json({ success: true, message: 'Prescription saved and consultation marked complete' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Change doctor password
const changeDoctorPassword = async (req, res) => {
  try {
    const docId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, doctor.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    doctor.password = hashedPassword;
    await doctor.save();

    res.json({ success: true, message: "Password changed successfully! You can now log in with your new password." });
  } catch (error) {
    console.error("Change doctor password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorList,
  changeAvailability,
  doctorProfile,
  updateDoctorProfile,
  changeDoctorPassword,
  doctorDashboard,
  doctorAiVisitSummary,
  doctorAiPatientAnalysis,
  addPrescription,
};


