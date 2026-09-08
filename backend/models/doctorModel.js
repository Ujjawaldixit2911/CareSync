import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    availableFrom: { type: String, default: '09:00 AM' },
    availableTo: { type: String, default: '08:00 PM' },
    breakTime: { type: String, default: '01:00 PM - 02:00 PM' },
    workingDays: { type: Array, default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
    emergencyAvailable: { type: Boolean, default: true },
    emergencyFee: { type: Number, default: 150 },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    ratings: { type: Array, default: [] },
    averageRating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;