import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dns from 'node:dns';
import doctorModel from './models/doctorModel.js';
import { cacheDelete } from './config/cache.js';
import 'dotenv/config';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const allDoctorsData = [
  {
    name: 'Dr. Richard James',
    email: 'doc1@gmail.com',
    speciality: 'General physician',
    degree: 'MBBS, MD',
    experience: '4 Years',
    about: 'Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 500,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc1.png',
    available: true
  },
  {
    name: 'Dr. Emily Larson',
    email: 'doc2@gmail.com',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (OB-GYN)',
    experience: '3 Years',
    about: 'Dr. Emily Larson specializes in maternal-fetal medicine, prenatal health, and comprehensive women wellness therapies.',
    fees: 600,
    address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc2.png',
    available: true
  },
  {
    name: 'Dr. Sarah Patel',
    email: 'doc3@gmail.com',
    speciality: 'Dermatologist',
    degree: 'MBBS, DVD',
    experience: '5 Years',
    about: 'Dr. Sarah Patel is a clinical dermatologist with deep clinical experience in aesthetic treatments and laser skin therapy.',
    fees: 450,
    address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc3.png',
    available: true
  },
  {
    name: 'Dr. Christopher Lee',
    email: 'doc4@gmail.com',
    speciality: 'Pediatricians',
    degree: 'MBBS, DCH',
    experience: '2 Years',
    about: 'Dr. Christopher Lee provides dedicated pediatric care, neonatal health monitoring, and adolescent development programs.',
    fees: 400,
    address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc4.png',
    available: true
  },
  {
    name: 'Dr. Jennifer Garcia',
    email: 'doc5@gmail.com',
    speciality: 'Neurologist',
    degree: 'MBBS, DM (Neurology)',
    experience: '8 Years',
    about: 'Dr. Jennifer Garcia focuses on cerebrovascular health, stroke management, migraines, and neuropathic disorders.',
    fees: 750,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc5.png',
    available: true
  },
  {
    name: 'Dr. Andrew Williams',
    email: 'doc6@gmail.com',
    speciality: 'Neurologist',
    degree: 'MBBS, DM',
    experience: '4 Years',
    about: 'Expert neuro-physician dedicated to complex diagnostic analysis, spine health, and restorative nerve therapies.',
    fees: 500,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc6.png',
    available: true
  },
  {
    name: 'Dr. Christopher Davis',
    email: 'doc7@gmail.com',
    speciality: 'General physician',
    degree: 'MBBS, MD',
    experience: '6 Years',
    about: 'Dr. Christopher Davis delivers proactive primary health evaluations, lifestyle management, and chronic disease mitigation.',
    fees: 500,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc7.png',
    available: true
  },
  {
    name: 'Dr. Timothy White',
    email: 'doc8@gmail.com',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS',
    experience: '3 Years',
    about: 'Specialist in reproductive endocrinology, obstetrical ultrasonography, and pelvic health treatments.',
    fees: 600,
    address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc8.png',
    available: true
  },
  {
    name: 'Dr. Ava Mitchell',
    email: 'doc9@gmail.com',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    experience: '4 Years',
    about: 'Dr. Ava Mitchell is recognized for clinical dermato-surgery, allergy diagnostics, and restorative skin rejuvenation.',
    fees: 400,
    address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc9.png',
    available: true
  },
  {
    name: 'Dr. Jeffrey King',
    email: 'doc10@gmail.com',
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Pediatrics)',
    experience: '5 Years',
    about: 'Chief pediatric consultant providing immunizations, pediatric nutrition consultation, and developmental monitoring.',
    fees: 500,
    address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc10.png',
    available: true
  },
  {
    name: 'Dr. Zoe Kelly',
    email: 'doc11@gmail.com',
    speciality: 'Neurologist',
    degree: 'MBBS, DM',
    experience: '4 Years',
    about: 'Specialist in cognitive neurology, clinical electrophysiology, and advanced memory care diagnostics.',
    fees: 550,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc11.png',
    available: true
  },
  {
    name: 'Dr. Patrick Harris',
    email: 'doc12@gmail.com',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastro)',
    experience: '7 Years',
    about: 'Dr. Patrick Harris provides comprehensive hepatology, endoscopic diagnostics, and gastrointestinal therapeutics.',
    fees: 700,
    address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc12.png',
    available: true
  },
  {
    name: 'Dr. Chloe Evans',
    email: 'doc13@gmail.com',
    speciality: 'General physician',
    degree: 'MBBS, MRCGP',
    experience: '4 Years',
    about: 'Committed to evidence-based holistic medical care, acute illness recovery, and patient-centered health coaching.',
    fees: 500,
    address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc13.png',
    available: true
  },
  {
    name: 'Dr. Ryan Martinez',
    email: 'doc14@gmail.com',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS',
    experience: '6 Years',
    about: 'Consultant in minimally invasive gynecological care, high-risk pregnancies, and postpartum rehabilitation.',
    fees: 650,
    address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc14.png',
    available: true
  },
  {
    name: 'Dr. Amelia Hill',
    email: 'doc15@gmail.com',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD',
    experience: '3 Years',
    about: 'Specialist in clinical dermatology, hair restoration therapies, and customized dermatological regimens.',
    fees: 400,
    address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    image: 'http://localhost:8080/images/doc15.png',
    available: true
  }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for restoring full doctor directory...");

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("password123", salt);

    for (let docData of allDoctorsData) {
      const existing = await doctorModel.findOne({ email: docData.email });
      if (existing) {
        existing.name = docData.name;
        existing.speciality = docData.speciality;
        existing.degree = docData.degree;
        existing.experience = docData.experience;
        existing.about = docData.about;
        existing.fees = docData.fees;
        existing.address = docData.address;
        existing.image = docData.image;
        existing.available = true;
        await existing.save();
        console.log(`✅ Updated doctor: ${docData.name} (${docData.email})`);
      } else {
        const newDoc = new doctorModel({
          ...docData,
          password: defaultPassword,
          date: Date.now(),
          slots_booked: {}
        });
        await newDoc.save();
        console.log(`✅ Seeded doctor: ${docData.name} (${docData.email})`);
      }
    }

    await cacheDelete('doctors_list');
    console.log("🎉 All 15 Doctors restored and active in MongoDB database!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding doctors:", err);
    process.exit(1);
  }
};

seedDoctors();
