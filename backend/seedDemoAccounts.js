import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dns from 'node:dns';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';
import 'dotenv/config';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding demo accounts...");

    const salt = await bcrypt.genSalt(10);
    const doctorPass1 = await bcrypt.hash("password123", salt);
    const doctorPass2 = await bcrypt.hash("doctor123", salt);
    const patientPass1 = await bcrypt.hash("password123", salt);
    const patientPass2 = await bcrypt.hash("patient123", salt);

    // 1. Seed / Upsert Doctor 1: doc1@gmail.com / password123
    let doc1 = await doctorModel.findOne({ email: "doc1@gmail.com" });
    if (doc1) {
      doc1.password = doctorPass1;
      await doc1.save();
      console.log("✅ Updated doctor doc1@gmail.com / password123");
    } else {
      doc1 = new doctorModel({
        name: "Dr. Richard James",
        email: "doc1@gmail.com",
        password: doctorPass1,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
        speciality: "General physician",
        degree: "MBBS, MD",
        experience: "4 Years",
        about: "Experienced General Physician focused on holistic health and preventive medicine.",
        fees: 500,
        address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
        date: Date.now(),
        available: true
      });
      await doc1.save();
      console.log("✅ Created doctor doc1@gmail.com / password123");
    }

    // 2. Seed / Upsert Doctor 2: doctor@caresync.com / doctor123
    let doc2 = await doctorModel.findOne({ email: "doctor@caresync.com" });
    if (doc2) {
      doc2.password = doctorPass2;
      await doc2.save();
      console.log("✅ Updated doctor doctor@caresync.com / doctor123");
    } else {
      doc2 = new doctorModel({
        name: "Dr. Emily Sanders",
        email: "doctor@caresync.com",
        password: doctorPass2,
        image: "https://images.unsplash.com/photo-1594824813515-08146747d95b?q=80&w=300&auto=format&fit=crop",
        speciality: "Gynecologist",
        degree: "MBBS, MS",
        experience: "6 Years",
        about: "Senior consultant Gynecologist with expertise in maternal-fetal medicine.",
        fees: 700,
        address: { line1: "27th Cross, Indiranagar", line2: "Bengaluru, Karnataka" },
        date: Date.now(),
        available: true
      });
      await doc2.save();
      console.log("✅ Created doctor doctor@caresync.com / doctor123");
    }

    // 3. Seed / Upsert Patient 1: demo.patient@caresync.com / password123
    let patient1 = await userModel.findOne({ email: "demo.patient@caresync.com" });
    if (patient1) {
      patient1.password = patientPass1;
      await patient1.save();
      console.log("✅ Updated patient demo.patient@caresync.com / password123");
    } else {
      patient1 = new userModel({
        name: "Demo Patient",
        email: "demo.patient@caresync.com",
        password: patientPass1,
        phone: "9876543210",
        address: { line1: "MG Road", line2: "Bengaluru, Karnataka" },
        gender: "Male",
        dob: "1998-05-15"
      });
      await patient1.save();
      console.log("✅ Created patient demo.patient@caresync.com / password123");
    }

    // 4. Seed / Upsert Patient 2: patient@caresync.com / patient123
    let patient2 = await userModel.findOne({ email: "patient@caresync.com" });
    if (patient2) {
      patient2.password = patientPass2;
      await patient2.save();
      console.log("✅ Updated patient patient@caresync.com / patient123");
    } else {
      patient2 = new userModel({
        name: "Rahul Sharma",
        email: "patient@caresync.com",
        password: patientPass2,
        phone: "9123456780",
        address: { line1: "Sector 14", line2: "Gurugram, Haryana" },
        gender: "Male",
        dob: "1995-10-20"
      });
      await patient2.save();
      console.log("✅ Created patient patient@caresync.com / patient123");
    }

    console.log("🎉 All demo accounts successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
