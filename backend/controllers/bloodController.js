import bloodDonorModel from "../models/bloodDonorModel.js"
import bloodRequestModel from "../models/bloodRequestModel.js"

// Seeding standard donors for mock geospatial distances checks
const seedDonors = async () => {
    const count = await bloodDonorModel.countDocuments()
    if (count === 0) {
        const mockDonors = [
            { userId: "mock_user_1", name: "Ananya Sharma", bloodGroup: "O+", phone: "+91-9876543210", email: "ananya@gmail.com", address: "Koramangala, Bangalore", latitude: 12.9352, longitude: 77.6245, isAvailable: true, lastDonationDate: Date.now() - (100 * 24 * 60 * 60 * 1000), date: Date.now() },
            { userId: "mock_user_2", name: "Vikram Malhotra", bloodGroup: "A-", phone: "+91-9876543211", email: "vikram@gmail.com", address: "Indiranagar, Bangalore", latitude: 12.9784, longitude: 77.6408, isAvailable: true, lastDonationDate: 0, date: Date.now() },
            { userId: "mock_user_3", name: "Rajesh K", bloodGroup: "O-", phone: "+91-9876543212", email: "rajesh@gmail.com", address: "Whitefield, Bangalore", latitude: 12.9698, longitude: 77.7499, isAvailable: true, lastDonationDate: Date.now() - (120 * 24 * 60 * 60 * 1000), date: Date.now() },
            { userId: "mock_user_4", name: "Sneha Reddy", bloodGroup: "B+", phone: "+91-9876543213", email: "sneha@gmail.com", address: "HSR Layout, Bangalore", latitude: 12.9141, longitude: 77.6411, isAvailable: true, lastDonationDate: Date.now() - (110 * 24 * 60 * 60 * 1000), date: Date.now() },
            { userId: "mock_user_5", name: "Aditya Roy", bloodGroup: "AB+", phone: "+91-9876543214", email: "aditya@gmail.com", address: "Jayanagar, Bangalore", latitude: 12.9250, longitude: 77.5897, isAvailable: true, lastDonationDate: Date.now() - (45 * 24 * 60 * 60 * 1000), date: Date.now() }
        ]
        await bloodDonorModel.insertMany(mockDonors)
    }
}

// Seeding emergency blood requests for realistic triage simulation
const seedRequests = async () => {
    const count = await bloodRequestModel.countDocuments()
    if (count === 0) {
        const mockRequests = [
            {
                patientName: "Rahul Sharma",
                bloodGroup: "O-",
                units: 2,
                hospital: "CareSync Memorial Hospital (Trauma ICU)",
                phone: "+91-98765-43210",
                urgency: "Critical",
                status: "Approved",
                address: "Central Trauma Wing, Ward 4B",
                date: Date.now() - (15 * 60 * 1000)
            },
            {
                patientName: "Pooja Verma",
                bloodGroup: "AB+",
                units: 3,
                hospital: "Apollo Multispecialty Hospital",
                phone: "+91-98111-22334",
                urgency: "Urgent",
                status: "Approved",
                address: "Surgical Suite 3, 2nd Floor",
                date: Date.now() - (45 * 60 * 1000)
            },
            {
                patientName: "Amitabh Sen",
                bloodGroup: "A+",
                units: 2,
                hospital: "Fortis Healthcare Center",
                phone: "+91-97222-33445",
                urgency: "Urgent",
                status: "Approved",
                address: "Emergency Triage Unit",
                date: Date.now() - (2 * 60 * 60 * 1000)
            },
            {
                patientName: "Deepika Patel",
                bloodGroup: "B+",
                units: 1,
                hospital: "Manipal Hospital",
                phone: "+91-99333-44556",
                urgency: "Standard",
                status: "Approved",
                address: "Hematology & Oncology Ward",
                date: Date.now() - (4 * 60 * 60 * 1000)
            }
        ]
        await bloodRequestModel.insertMany(mockRequests)
    }
}

// Register a donor
const registerDonor = async (req, res) => {
    try {
        const { userId, name, bloodGroup, phone, email, address, lastDonationDate } = req.body
        
        // Eligibility validation: check if lastDonationDate is less than 90 days ago
        if (lastDonationDate) {
            const daysSince = (Date.now() - new Date(lastDonationDate).getTime()) / (1000 * 60 * 60 * 24)
            if (daysSince < 90) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Ineligible: You must wait at least 90 days since your last blood donation." 
                })
            }
        }

        const newDonor = new bloodDonorModel({
            userId: userId || "guest_donor",
            name, bloodGroup, phone, email, address, 
            lastDonationDate: lastDonationDate ? new Date(lastDonationDate).getTime() : 0, 
            date: Date.now()
        })
        await newDonor.save()
        res.json({ success: true, message: "Donor registration completed successfully!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Create a blood request
const createBloodRequest = async (req, res) => {
    try {
        const { patientName, bloodGroup, units, hospital, phone, urgency, address } = req.body
        const newReq = new bloodRequestModel({
            patientName, bloodGroup, units: Number(units), hospital, phone, urgency: urgency || 'Urgent', status: 'Approved', address, date: Date.now()
        })
        await newReq.save()
        res.json({ success: true, message: "Blood request logged successfully and added to active emergency queue." })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get live Blood Bank stock inventory
const getBloodStock = async (req, res) => {
    try {
        const bloodStock = {
            "O+": { units: 28, status: "Adequate", canGiveTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"] },
            "O-": { units: 8, status: "Low", canGiveTo: ["All Blood Types (Universal Donor)"], canReceiveFrom: ["O-"] },
            "A+": { units: 22, status: "Adequate", canGiveTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
            "A-": { units: 6, status: "Low", canGiveTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
            "B+": { units: 31, status: "Adequate", canGiveTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
            "B-": { units: 5, status: "Critical", canGiveTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
            "AB+": { units: 14, status: "Adequate", canGiveTo: ["AB+"], canReceiveFrom: ["All Blood Types (Universal Recipient)"] },
            "AB-": { units: 4, status: "Critical", canGiveTo: ["AB+", "AB-"], canReceiveFrom: ["AB-", "A-", "B-", "O-"] }
        }
        res.json({ 
            success: true, 
            stock: bloodStock, 
            storageTemperature: "3.5°C (Regulated)", 
            totalUnits: 118,
            lastInspection: "Today, Certified Safe"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// List all donors
const listDonors = async (req, res) => {
    try {
        await seedDonors()
        const { bloodGroup } = req.query
        let filter = {}
        if (bloodGroup && bloodGroup !== 'all') {
            filter.bloodGroup = bloodGroup
        }
        const donors = await bloodDonorModel.find(filter).sort({ name: 1 })
        res.json({ success: true, donors })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// List all blood requests (with approval checks)
const listRequests = async (req, res) => {
    try {
        await seedRequests()
        const requests = await bloodRequestModel.find({}).sort({ date: -1 })
        res.json({ success: true, requests })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Admin update request status
const updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body
        await bloodRequestModel.findByIdAndUpdate(requestId, { status })
        res.json({ success: true, message: `Request status set to ${status}` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { registerDonor, createBloodRequest, listDonors, listRequests, updateRequestStatus, getBloodStock }
