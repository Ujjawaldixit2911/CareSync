import add_icon from './add_icon.svg'
import admin_logo from './admin_logo.png'
import appointment_icon from './appointment_icon.svg'
import cancel_icon from './cancel_icon.svg'
import doctor_icon from './doctor_icon.svg'
import home_icon from './home_icon.svg'
import people_icon from './people_icon.svg'
import upload_area from './upload_area.svg'
import list_icon from './list_icon.svg'
import tick_icon from './tick_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import patients_icon from './patients_icon.svg'

import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'

export const doctorImages = {
    'doc1@gmail.com': doc1,
    'doc2@gmail.com': doc2,
    'doc3@gmail.com': doc3,
    'doc4@gmail.com': doc4,
    'doc5@gmail.com': doc5,
    'doc6@gmail.com': doc6,
    'doc7@gmail.com': doc7,
    'doc8@gmail.com': doc8,
    'doc9@gmail.com': doc9,
    'doc10@gmail.com': doc10,
    'doc11@gmail.com': doc11,
    'doc12@gmail.com': doc12,
    'doc13@gmail.com': doc13,
    'doc14@gmail.com': doc14,
    'doc15@gmail.com': doc15,
    'doctor@caresync.com': doc1,
}

export const doctorImagesByName = {
    'Dr. Richard James': doc1,
    'Dr. Emily Sanders': doc1,
    'Dr. Emily Larson': doc2,
    'Dr. Sarah Patel': doc3,
    'Dr. Christopher Lee': doc4,
    'Dr. Jennifer Garcia': doc5,
    'Dr. Andrew Williams': doc6,
    'Dr. Christopher Davis': doc7,
    'Dr. Timothy White': doc8,
    'Dr. Ava Mitchell': doc9,
    'Dr. Jeffrey King': doc10,
    'Dr. Zoe Kelly': doc11,
    'Dr. Patrick Harris': doc12,
    'Dr. Chloe Evans': doc13,
    'Dr. Ryan Martinez': doc14,
    'Dr. Amelia Hill': doc15,
}

export const doctorImagesByFile = {
    'doc1.png': doc1,
    'doc2.png': doc2,
    'doc3.png': doc3,
    'doc4.png': doc4,
    'doc5.png': doc5,
    'doc6.png': doc6,
    'doc7.png': doc7,
    'doc8.png': doc8,
    'doc9.png': doc9,
    'doc10.png': doc10,
    'doc11.png': doc11,
    'doc12.png': doc12,
    'doc13.png': doc13,
    'doc14.png': doc14,
    'doc15.png': doc15,
};

// Preload all instant doctor assets into browser memory for 0ms render
if (typeof window !== 'undefined') {
    [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10, doc11, doc12, doc13, doc14, doc15].forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

export const getDoctorInstantImage = (doctor, index = 0) => {
    if (!doctor) return doc1;
    if (doctor.email && doctorImages[doctor.email]) return doctorImages[doctor.email];
    if (doctor.name && doctorImagesByName[doctor.name]) return doctorImagesByName[doctor.name];
    if (typeof doctor.image === 'string' && doctor.image.length > 0) {
        // Fast match local file name
        const file = doctor.image.split('/').pop()?.split('?')[0];
        if (file && doctorImagesByFile[file]) return doctorImagesByFile[file];

        // Regex match doc1-doc15 anywhere in the path or URL
        const match = doctor.image.match(/doc(1[0-5]|[1-9])(?:\.|\b|_)/i);
        if (match) {
            const fileName = `doc${match[1]}.png`;
            if (doctorImagesByFile[fileName]) return doctorImagesByFile[fileName];
        }

        // Base64 or direct data URI
        if (doctor.image.startsWith('data:')) return doctor.image;
        if (doctor.image.startsWith('http')) return doctor.image;
    }
    const fallbackList = [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10, doc11, doc12, doc13, doc14, doc15];
    return fallbackList[index % fallbackList.length];
};

export const assets = {
    add_icon,
    admin_logo,
    appointment_icon,
    cancel_icon,
    doctor_icon,
    upload_area,
    home_icon,
    patients_icon,
    people_icon,
    list_icon,
    tick_icon,
    appointments_icon,
    earning_icon,
    doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10, doc11, doc12, doc13, doc14, doc15
}
