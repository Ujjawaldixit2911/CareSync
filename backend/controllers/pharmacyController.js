import medicineModel from "../models/medicineModel.js"
import pharmacyOrderModel from "../models/pharmacyOrderModel.js"

// Add dynamic clinical seed logic
const seedMedicines = async () => {
    const count = await medicineModel.countDocuments()
    // If fewer than 30 medicines, clear and re-seed full catalogue
    if (count < 30) {
        await medicineModel.deleteMany({}) // Clear old data
        const defaultMedicines = [
            {
                name: "Paracetamol 500mg",
                category: "Analgesics & Antipyretics",
                price: 15,
                stock: 150,
                sku: "RX-PARA-500",
                supplier: { name: "GSK Pharmaceuticals", phone: "+91-9988776655", email: "orders@gsk.com" },
                description: "First-line antipyretic and analgesic for fever, headache, body pain, and viral infections.",
                diseases: ["Fever", "Headache", "Body Pain", "Viral Infection"],
                genericName: "Paracetamol (Acetaminophen 500mg)",
                sideEffects: ["Mild nausea", "Skin rash (rare)", "Liver toxicity if overdosed"],
                interactions: ["Alcohol (increases liver toxicity risk)", "Warfarin"],
                alternatives: ["Calpol 500mg", "Crocin 500mg", "Pacimol 500mg"],
                date: Date.now()
            },
            {
                name: "Dolo 650mg",
                category: "Analgesics & Antipyretics",
                price: 32,
                stock: 220,
                sku: "RX-DOLO-650",
                supplier: { name: "Micro Labs Ltd", phone: "+91-9988776611", email: "care@microlabs.com" },
                description: "High-strength Paracetamol (650mg) for rapid relief from high-grade fever, Dengue, Typhoid, and severe body aches.",
                diseases: ["Fever", "High Fever", "Dengue", "Typhoid", "Body Pain", "Headache"],
                genericName: "Paracetamol 650mg",
                sideEffects: ["Nausea", "Mild sweating", "Drowsiness (rare)"],
                interactions: ["Alcohol", "Other Paracetamol combinations"],
                alternatives: ["Calpol 650mg", "Crocin 650 Advance", "P-650"],
                date: Date.now()
            },
            {
                name: "Pan-40 (Pantoprazole 40mg)",
                category: "Gastrointestinal",
                price: 85,
                stock: 180,
                sku: "RX-PAN-40",
                supplier: { name: "Alkem Laboratories", phone: "+91-9988776622", email: "sales@alkem.com" },
                description: "Proton Pump Inhibitor (PPI) that decreases stomach acid secretion to treat GERD, severe acidity, and peptic ulcers.",
                diseases: ["Acidity", "GERD", "Heartburn", "Gas", "Stomach Ulcer"],
                genericName: "Pantoprazole Sodium 40mg",
                sideEffects: ["Headache", "Mild diarrhea", "Flatulence"],
                interactions: ["Ketoconazole", "Iron supplements", "Methotrexate"],
                alternatives: ["Pantocid 40", "Pantodac 40", "Protium 40"],
                date: Date.now()
            },
            {
                name: "Pan-D (Pantoprazole + Domperidone)",
                category: "Gastrointestinal",
                price: 135,
                stock: 140,
                sku: "RX-PAN-D",
                supplier: { name: "Alkem Laboratories", phone: "+91-9988776622", email: "sales@alkem.com" },
                description: "Dual-action capsule combining Pantoprazole (antacid) and Domperidone (prokinetic) for acid reflux, nausea, gas, and indigestion.",
                diseases: ["Acidity", "Nausea", "GERD", "Vomiting", "Gas", "Indigestion"],
                genericName: "Pantoprazole 40mg + Domperidone 30mg SR",
                sideEffects: ["Dry mouth", "Mild stomach cramps", "Drowsiness"],
                interactions: ["Ketoconazole", "Erythromycin", "Cardiac antiarrhythmics"],
                alternatives: ["Pantocid-D", "Pantodac-DSR", "Dompan"],
                date: Date.now()
            },
            {
                name: "Omez 20mg (Omeprazole)",
                category: "Gastrointestinal",
                price: 48,
                stock: 160,
                sku: "RX-OMEZ-20",
                supplier: { name: "Dr. Reddy's Laboratories", phone: "+91-9988776633", email: "orders@drreddys.com" },
                description: "Effective PPI for rapid suppression of gastric acid, healing stomach ulcers and relieving chest burning sensation.",
                diseases: ["Acidity", "Heartburn", "Acid Reflux", "Gastritis"],
                genericName: "Omeprazole 20mg",
                sideEffects: ["Stomach pain", "Headache", "Nausea"],
                interactions: ["Clopidogrel", "Diazepam", "Warfarin"],
                alternatives: ["Omee 20", "Nogacid 20", "Ocid 20"],
                date: Date.now()
            },
            {
                name: "Digene Antacid Gel (200ml)",
                category: "Gastrointestinal",
                price: 130,
                stock: 90,
                sku: "RX-DIGENE-200",
                supplier: { name: "Abbott Healthcare", phone: "+91-9988776644", email: "orders@abbott.com" },
                description: "Soothing mint-flavored liquid antacid providing instant neutralisation of stomach acidity, bloating, and gas bubbles.",
                diseases: ["Acidity", "Heartburn", "Gas", "Bloating", "Indigestion"],
                genericName: "Magnesium Hydroxide + Aluminium Hydroxide + Simethicone",
                sideEffects: ["Chalky taste", "Mild constipation or loose stools"],
                interactions: ["Tetracyclines", "Fluoroquinolones (delays antibiotic absorption)"],
                alternatives: ["Gelusil MPS Syrup", "Mucaine Gel", "Eno Fruit Salt"],
                date: Date.now()
            },
            {
                name: "Meftal-Spas",
                category: "Analgesics & Antispasmodics",
                price: 52,
                stock: 130,
                sku: "RX-MEFT-SPAS",
                supplier: { name: "Blue Cross Labs", phone: "+91-9988776655", email: "sales@bluecross.com" },
                description: "Specialized antispasmodic and analgesic for relieving acute menstrual cramps, abdominal colic, and intestinal spasms.",
                diseases: ["Pet Dard", "Stomach Pain", "Period Pain", "Abdominal Cramps", "Colic"],
                genericName: "Mefenamic Acid 250mg + Dicyclomine HCl 10mg",
                sideEffects: ["Dizziness", "Dry mouth", "Blurred vision", "Sleepiness"],
                interactions: ["Anticoagulants", "Other NSAIDs", "Alcohol"],
                alternatives: ["Cyclopam", "Spasmo-Proxyvon", "Drotikind-M"],
                date: Date.now()
            },
            {
                name: "Drotin-M",
                category: "Analgesics & Antispasmodics",
                price: 88,
                stock: 95,
                sku: "RX-DROT-M",
                supplier: { name: "Walter Bushnell", phone: "+91-9988776666", email: "orders@wbushnell.com" },
                description: "Potent smooth muscle antispasmodic with Drotaverine and Mefenamic Acid for severe stomach cramps, kidney stone, and biliary colic pain.",
                diseases: ["Stomach Pain", "Severe Cramps", "Abdominal Pain", "Kidney Stone Pain"],
                genericName: "Drotaverine Hydrochloride 80mg + Mefenamic Acid 250mg",
                sideEffects: ["Nausea", "Dry mouth", "Vertigo"],
                interactions: ["Levodopa (reduces antiparkinson effect)", "Painkillers"],
                alternatives: ["Drotikind-M", "Spasmonil Plus", "Baralgan-M"],
                date: Date.now()
            },
            {
                name: "Combiflam",
                category: "Analgesics & NSAIDs",
                price: 42,
                stock: 200,
                sku: "RX-COMBI-FLAM",
                supplier: { name: "Sanofi India", phone: "+91-9988776677", email: "dist@sanofi.com" },
                description: "Trusted combination of Ibuprofen and Paracetamol for acute muscular pain, joint pain, toothache, and headache.",
                diseases: ["Body Pain", "Joint Pain", "Toothache", "Headache", "Fever"],
                genericName: "Ibuprofen 400mg + Paracetamol 325mg",
                sideEffects: ["Heartburn", "Stomach upset", "Nausea"],
                interactions: ["Aspirin", "Blood thinners", "Antihypertensives"],
                alternatives: ["Flexon", "Ibugesic Plus", "Brufen Plus"],
                date: Date.now()
            },
            {
                name: "Cetirizine 10mg",
                category: "Antihistamines",
                price: 22,
                stock: 250,
                sku: "RX-CETI-10",
                supplier: { name: "Cipla Ltd", phone: "+91-9988776600", email: "dist@cipla.com" },
                description: "Second-generation non-sedating antihistamine for sneezing, runny nose, allergic rhinitis, watery eyes, and skin itching.",
                diseases: ["Allergies", "Cold", "Sneezing", "Runny Nose", "Itching", "Skin Rash"],
                genericName: "Cetirizine Hydrochloride 10mg",
                sideEffects: ["Mild drowsiness", "Dry mouth", "Fatigue"],
                interactions: ["Alcohol", "CNS depressants"],
                alternatives: ["Okacet 10mg", "Cetzine 10mg", "Alerid 10mg"],
                date: Date.now()
            },
            {
                name: "Montair-LC",
                category: "Respiratory & Allergy",
                price: 165,
                stock: 130,
                sku: "RX-MONT-LC",
                supplier: { name: "Cipla Ltd", phone: "+91-9988776600", email: "dist@cipla.com" },
                description: "Combination of Levocetirizine and Montelukast for comprehensive control of allergic asthma, chronic cough, and seasonal rhinitis.",
                diseases: ["Allergies", "Asthma", "Cough", "Cold", "Sneezing", "Sinusitis"],
                genericName: "Montelukast 10mg + Levocetirizine 5mg",
                sideEffects: ["Headache", "Mild sleepiness", "Dryness in throat"],
                interactions: ["Phenobarbital", "Rifampicin"],
                alternatives: ["Montek-LC", "Telekast-L", "Levocet-M"],
                date: Date.now()
            },
            {
                name: "Ascoril-D Cough Syrup (100ml)",
                category: "Respiratory",
                price: 118,
                stock: 85,
                sku: "RX-ASCO-D",
                supplier: { name: "Glenmark Pharma", phone: "+91-9988776688", email: "orders@glenmark.com" },
                description: "Sugar-free dry cough syrup containing Dextromethorphan, Phenylephrine, and Chlorpheniramine for prompt relief from throat tickle and dry cough.",
                diseases: ["Cough", "Dry Cough", "Sore Throat", "Cold"],
                genericName: "Dextromethorphan Hydrobromide + Phenylephrine + Chlorpheniramine",
                sideEffects: ["Sleepiness", "Dizziness", "Dry mouth"],
                interactions: ["MAO inhibitors", "Sedatives"],
                alternatives: ["Benadryl DR", "Alex Syrup", "TusQ-DX"],
                date: Date.now()
            },
            {
                name: "Ascoril-LS Expectorant (100ml)",
                category: "Respiratory",
                price: 125,
                stock: 90,
                sku: "RX-ASCO-LS",
                supplier: { name: "Glenmark Pharma", phone: "+91-9988776688", email: "orders@glenmark.com" },
                description: "Mucolytic expectorant containing Levosalbutamol, Ambroxol, and Guaiphenesin to liquefy thick mucus and clear wet chest congestion.",
                diseases: ["Cough", "Wet Cough", "Chest Congestion", "Bronchitis"],
                genericName: "Levosalbutamol 1mg + Ambroxol 30mg + Guaiphenesin 50mg",
                sideEffects: ["Hand tremors", "Nausea", "Palpitations"],
                interactions: ["Beta-blockers", "Diuretics"],
                alternatives: ["Grilinctus-LS", "Bro-Zedex", "Macbery-LS"],
                date: Date.now()
            },
            {
                name: "Augmentin 625 Duo",
                category: "Antibiotics",
                price: 198,
                stock: 75,
                sku: "RX-AUGM-625",
                supplier: { name: "GSK Pharmaceuticals", phone: "+91-9988776655", email: "orders@gsk.com" },
                description: "Gold-standard broad-spectrum antibiotic containing Amoxicillin and Clavulanic acid for bacterial infections of chest, ENT, skin, and dental abscesses.",
                diseases: ["Bacterial Infection", "Throat Infection", "Chest Infection", "Dental Pain", "Fever"],
                genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
                sideEffects: ["Loose stools", "Nausea", "Vaginal thrush", "Skin rash"],
                interactions: ["Methotrexate", "Allopurinol", "Oral contraceptives"],
                alternatives: ["Moxikind-CV 625", "Clavam 625", "Advent 625"],
                date: Date.now()
            },
            {
                name: "Azithromycin 500mg (Azee 500)",
                category: "Antibiotics",
                price: 128,
                stock: 80,
                sku: "RX-AZEE-500",
                supplier: { name: "Cipla Ltd", phone: "+91-9988776600", email: "dist@cipla.com" },
                description: "Convenient once-daily 3-day macrolide antibiotic course for severe throat infections, tonsillitis, sinusitis, and respiratory infections.",
                diseases: ["Bacterial Infection", "Throat Infection", "Sinusitis", "Bronchitis", "Cough"],
                genericName: "Azithromycin Dihydrate 500mg",
                sideEffects: ["Diarrhea", "Abdominal discomfort", "Nausea"],
                interactions: ["Antacids with aluminium/magnesium", "Amiodarone"],
                alternatives: ["Azithral 500", "Azibact 500", "Zady 500"],
                date: Date.now()
            },
            {
                name: "Ciprofloxacin 500mg (Ciplox 500)",
                category: "Antibiotics",
                price: 45,
                stock: 90,
                sku: "RX-CIPLOX-500",
                supplier: { name: "Cipla Ltd", phone: "+91-9988776600", email: "dist@cipla.com" },
                description: "Broad-spectrum fluoroquinolone antibiotic for urinary tract infections (UTI), typhoid fever, bacterial diarrhea, and skin infections.",
                diseases: ["UTI", "Typhoid", "Bacterial Infection", "Loose Motions"],
                genericName: "Ciprofloxacin Hydrochloride 500mg",
                sideEffects: ["Nausea", "Headache", "Tendon sensitivity", "Dizziness"],
                interactions: ["Calcium/Iron supplements", "Theophylline", "Antacids"],
                alternatives: ["Cifran 500", "Ciprobid 500", "Zoxan 500"],
                date: Date.now()
            },
            {
                name: "Metformin 500mg (Glycomet 500)",
                category: "Antidiabetics",
                price: 35,
                stock: 190,
                sku: "RX-METF-500",
                supplier: { name: "USV Private Ltd", phone: "+91-9988776699", email: "sales@usv.in" },
                description: "First-choice clinical medication for Type-2 Diabetes to improve insulin sensitivity and lower hepatic glucose production.",
                diseases: ["Diabetes", "Type-2 Diabetes", "High Blood Sugar", "PCOS"],
                genericName: "Metformin Hydrochloride 500mg",
                sideEffects: ["GI disturbance", "Diarrhea", "Metallic taste"],
                interactions: ["Iodinated contrast dyes", "Alcohol", "Cimetidine"],
                alternatives: ["Obimet 500", "Cetapin 500", "Gluconorm 500"],
                date: Date.now()
            },
            {
                name: "Glimepiride 2mg (Amaryl 2mg)",
                category: "Antidiabetics",
                price: 78,
                stock: 120,
                sku: "RX-GLIM-2",
                supplier: { name: "Sanofi India", phone: "+91-9988776677", email: "dist@sanofi.com" },
                description: "Sulfonylurea antidiabetic agent that stimulates pancreatic beta cells to produce more insulin in Type-2 diabetes.",
                diseases: ["Diabetes", "Type-2 Diabetes", "High Blood Sugar"],
                genericName: "Glimepiride 2mg",
                sideEffects: ["Hypoglycemia (low blood sugar)", "Weight gain", "Mild nausea"],
                interactions: ["Fluconazole", "Aspirin", "Beta-blockers"],
                alternatives: ["Glimisave 2", "Zoryl 2", "Gemer 2"],
                date: Date.now()
            },
            {
                name: "Telmisartan 40mg (Telma 40)",
                category: "Cardiovascular",
                price: 95,
                stock: 140,
                sku: "RX-TELMA-40",
                supplier: { name: "Glenmark Pharma", phone: "+91-9988776688", email: "orders@glenmark.com" },
                description: "Angiotensin II Receptor Blocker (ARB) providing 24-hour blood pressure control with renal and cardiovascular protection.",
                diseases: ["Hypertension", "High Blood Pressure", "Heart Disease"],
                genericName: "Telmisartan 40mg",
                sideEffects: ["Dizziness", "Back pain", "Sinus congestion"],
                interactions: ["Potassium supplements", "NSAIDs", "Lithium"],
                alternatives: ["Telmikind 40", "Telsartan 40", "Cresar 40"],
                date: Date.now()
            },
            {
                name: "Amlodipine 5mg (Amlokind 5)",
                category: "Cardiovascular",
                price: 38,
                stock: 170,
                sku: "RX-AMLO-5",
                supplier: { name: "Mankind Pharma", phone: "+91-9988776611", email: "sales@mankind.com" },
                description: "Calcium Channel Blocker that relaxes vascular smooth muscles, lowering elevated blood pressure and preventing angina.",
                diseases: ["Hypertension", "High Blood Pressure", "Chest Pain"],
                genericName: "Amlodipine Besylate 5mg",
                sideEffects: ["Ankle swelling (edema)", "Flushing", "Fatigue"],
                interactions: ["Simvastatin", "Sildenafil", "Grapefruit juice"],
                alternatives: ["Amlopin 5", "Stamp 5", "Norvasc 5"],
                date: Date.now()
            },
            {
                name: "Atorvastatin 20mg (Atorva 20)",
                category: "Cardiovascular",
                price: 110,
                stock: 115,
                sku: "RX-ATOR-20",
                supplier: { name: "Zydus Cadila", phone: "+91-9988776622", email: "orders@zydus.com" },
                description: "Potent HMG-CoA reductase inhibitor (Statin) that reduces LDL bad cholesterol, triglycerides, and prevents coronary heart attacks.",
                diseases: ["High Cholesterol", "Cholesterol", "Heart Disease Prevention", "Triglycerides"],
                genericName: "Atorvastatin Calcium 20mg",
                sideEffects: ["Muscle pain", "Mild headache", "Elevated liver enzymes"],
                interactions: ["Grapefruit juice", "Gemfibrozil", "Clarithromycin"],
                alternatives: ["Lipvas 20", "Storvas 20", "Tonact 20"],
                date: Date.now()
            },
            {
                name: "Shelcal 500 (Calcium + Vit D3)",
                category: "Vitamins & Supplements",
                price: 115,
                stock: 190,
                sku: "RX-SHEL-500",
                supplier: { name: "Torrent Pharma", phone: "+91-9988776633", email: "sales@torrent.com" },
                description: "Daily elemental Calcium (500mg) and Vitamin D3 (250 IU) supplement for strong bones, osteoporosis prevention, and joint vitality.",
                diseases: ["Joint Pain", "Bone Weakness", "Calcium Deficiency", "Osteoporosis"],
                genericName: "Calcium Carbonate 1250mg eq to Calcium 500mg + Vitamin D3 250 IU",
                sideEffects: ["Mild constipation", "Bloating", "Gas"],
                interactions: ["Thyroid medications (separate by 4 hrs)", "Tetracyclines"],
                alternatives: ["Cipcal 500", "Calcimax 500", "Gemcal"],
                date: Date.now()
            },
            {
                name: "Becosules Z Capsules",
                category: "Vitamins & Supplements",
                price: 46,
                stock: 210,
                sku: "RX-BECO-Z",
                supplier: { name: "Pfizer India", phone: "+91-9988776644", email: "orders@pfizer.com" },
                description: "Complete Vitamin B-Complex fortified with Vitamin C and Zinc for mouth ulcers, weakness, skin rejuvenation, and nerve vitality.",
                diseases: ["Mouth Ulcers", "Weakness", "Vitamin Deficiency", "Fatigue", "Immunity"],
                genericName: "Vitamin B Complex + Vitamin C + Zinc Sulphate",
                sideEffects: ["Bright yellow urine (harmless)", "Mild gastric fullness"],
                interactions: ["Levodopa (without carbidopa)"],
                alternatives: ["Cobadex CZS", "Zincovit", "Neurobion Forte"],
                date: Date.now()
            },
            {
                name: "Limcee 500mg Chewable (Vitamin C)",
                category: "Vitamins & Supplements",
                price: 25,
                stock: 300,
                sku: "RX-LIMC-500",
                supplier: { name: "Abbott Healthcare", phone: "+91-9988776655", email: "care@abbott.com" },
                description: "Orange-flavored chewable Vitamin C 500mg antioxidant tablets for immune enhancement, collagen repair, and viral defense.",
                diseases: ["Immunity", "Cold", "Viral Infection", "Vitamin Deficiency", "Skin Health"],
                genericName: "Ascorbic Acid (Vitamin C 500mg)",
                sideEffects: ["Mild stomach warmth if taken excess"],
                interactions: ["Iron supplements (enhances absorption safely)"],
                alternatives: ["Celin 500", "Suckcee", "Chewcee 500"],
                date: Date.now()
            },
            {
                name: "Neurobion Forte",
                category: "Vitamins & Supplements",
                price: 38,
                stock: 230,
                sku: "RX-NEUR-FORTE",
                supplier: { name: "Procter & Gamble Health", phone: "+91-9988776666", email: "sales@pghealth.com" },
                description: "Therapeutic formulation of Vitamin B1, B6, and B12 for nerve regeneration, tingling sensations in hands/feet, and diabetic neuropathy.",
                diseases: ["Nerve Pain", "Tingling", "Weakness", "Diabetic Neuropathy", "Vitamin Deficiency"],
                genericName: "Vitamin B1 + B6 + B12 (Cyanocobalamin) + Nicotinamide",
                sideEffects: ["None at therapeutic doses"],
                interactions: ["None significant"],
                alternatives: ["Nurokind-Plus", "Cobal Forte", "Meconerve"],
                date: Date.now()
            },
            {
                name: "Electral ORS Powder (21.8g Sachet)",
                category: "Electrolytes & Hydration",
                price: 22,
                stock: 350,
                sku: "RX-ELEC-ORS",
                supplier: { name: "FDC Ltd", phone: "+91-9988776677", email: "orders@fdc.com" },
                description: "WHO-standard oral rehydration formulation to restore lost water and vital electrolytes during dehydration, diarrhea, and vomiting.",
                diseases: ["Dehydration", "Loose Motions", "Vomiting", "Diarrhea", "Heat Stroke"],
                genericName: "Oral Rehydration Salts (WHO Formula)",
                sideEffects: ["None when properly diluted in 1 Litre boiled water"],
                interactions: ["None"],
                alternatives: ["PBLyte", "Enerzal Powder", "Walyte ORS"],
                date: Date.now()
            },
            {
                name: "Sporlac Probiotic Tablets",
                category: "Gastrointestinal & Probiotics",
                price: 92,
                stock: 140,
                sku: "RX-SPOR-LAC",
                supplier: { name: "Sanzyme Biogenics", phone: "+91-9988776688", email: "care@sanzyme.com" },
                description: "Lactic acid bacillus probiotic to restore healthy gut microbiome after antibiotics, loose motions, and irritable bowel syndrome.",
                diseases: ["Loose Motions", "Diarrhea", "IBS", "Antibiotic Associated Diarrhea", "Gut Health"],
                genericName: "Lactobacillus Sporogenes (Bacillus coagulans)",
                sideEffects: ["Mild bloating for initial 2 days"],
                interactions: ["Take 2 hours apart from oral antibiotics"],
                alternatives: ["Darolac", "Econorm", "Bifilac"],
                date: Date.now()
            },
            {
                name: "Vomikind 4mg (Ondansetron)",
                category: "Gastrointestinal & Antiemetics",
                price: 45,
                stock: 150,
                sku: "RX-VOMI-4",
                supplier: { name: "Mankind Pharma", phone: "+91-9988776611", email: "sales@mankind.com" },
                description: "Fast-acting 5-HT3 receptor antagonist for stopping sudden nausea, acute vomiting, food poisoning, and motion sickness.",
                diseases: ["Vomiting", "Nausea", "Food Poisoning", "Motion Sickness"],
                genericName: "Ondansetron 4mg Fast Dissolving",
                sideEffects: ["Headache", "Constipation", "Feeling warm"],
                interactions: ["Apomorphine", "Tramadol"],
                alternatives: ["Emeset 4", "Ondem 4", "Periset 4"],
                date: Date.now()
            },
            {
                name: "Volini Pain Relief Gel (50g)",
                category: "Topical Pain Relief",
                price: 145,
                stock: 120,
                sku: "RX-VOLI-50G",
                supplier: { name: "Sun Pharma", phone: "+91-9988776622", email: "care@sunpharma.com" },
                description: "Quick-absorbing topical pain relief gel with micro-particles for sprains, low backache, joint stiffness, and neck pain.",
                diseases: ["Body Pain", "Back Pain", "Joint Pain", "Muscle Strain", "Sprains"],
                genericName: "Diclofenac Diethylamine + Linseed Oil + Methyl Salicylate + Menthol",
                sideEffects: ["Mild skin tingling", "Local redness"],
                interactions: ["Avoid applying to open cuts or broken skin"],
                alternatives: ["Moov Gel", "Omnigel", "Fast Relief Gel"],
                date: Date.now()
            },
            {
                name: "Betadine 10% Ointment (20g)",
                category: "First Aid & Antiseptics",
                price: 110,
                stock: 130,
                sku: "RX-BETA-10",
                supplier: { name: "Win-Medicare", phone: "+91-9988776633", email: "orders@winmedicare.com" },
                description: "Broad-spectrum microbicidal topical ointment for minor cuts, wounds, burns, abrasions, and skin infections.",
                diseases: ["Cuts & Wounds", "Burns", "Skin Infection", "Antiseptic"],
                genericName: "Povidone-Iodine 10% w/w",
                sideEffects: ["Mild local staining (washes off with water)", "Local irritation"],
                interactions: ["Silver sulfadiazine"],
                alternatives: ["Cipladine Ointment", "Wokadine 10%", "Povidine"],
                date: Date.now()
            },
            {
                name: "Otrivin Nasal Spray (10ml)",
                category: "Respiratory & ENT",
                price: 98,
                stock: 110,
                sku: "RX-OTRI-10",
                supplier: { name: "GSK Healthcare", phone: "+91-9988776644", email: "orders@gsk.com" },
                description: "Fast-acting nasal decongestant providing unblocked breathing within 2 minutes for blocked nose due to cold or sinusitis.",
                diseases: ["Blocked Nose", "Cold", "Sinusitis", "Allergies"],
                genericName: "Xylometazoline Hydrochloride 0.1% w/v",
                sideEffects: ["Dryness in nose", "Rebound congestion if used > 5 days"],
                interactions: ["MAO inhibitors"],
                alternatives: ["Nasivion Adult", "Sinarest Nasal Spray", "Xylomist"],
                date: Date.now()
            },
            {
                name: "Calpol 250mg Suspension (60ml)",
                category: "Pediatrics",
                price: 42,
                stock: 140,
                sku: "RX-CALP-250",
                supplier: { name: "GSK Healthcare", phone: "+91-9988776655", email: "care@gsk.com" },
                description: "Strawberry flavored pediatric Paracetamol syrup formulated for gentle fever reduction and pain relief in infants and children.",
                diseases: ["Fever", "Pediatric Fever", "Body Pain", "Teething Pain"],
                genericName: "Paracetamol Pediatric Suspension 250mg/5ml",
                sideEffects: ["None when administered according to child weight"],
                interactions: ["Other Paracetamol containing syrups"],
                alternatives: ["Dolo 250 Syrup", "Crocin 240 DS", "Pacimol 250 Syrup"],
                date: Date.now()
            }
        ]
        await medicineModel.insertMany(defaultMedicines)
    }
}

// Add a new medicine
const addMedicine = async (req, res) => {
    try {
        const { name, category, price, stock, sku, supplier, description, diseases } = req.body
        const newMed = new medicineModel({
            name, category, price: Number(price), stock: Number(stock), sku, supplier, description, diseases, date: Date.now()
        })
        await newMed.save()
        res.json({ success: true, message: "Medicine added to catalog" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// List all medicines
const listMedicines = async (req, res) => {
    try {
        await seedMedicines()
        const { search, category, disease } = req.query
        let filter = {}
        
        // If keyword search is specified, match name, description, diseases array, or category
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { diseases: { $regex: search, $options: 'i' } }
            ]
        }
        
        if (category && category !== 'all') {
            filter.category = category
        }
        
        if (disease && disease !== 'all') {
            filter.diseases = { $regex: new RegExp(`^${disease}$`, 'i') }
        }
        
        const medicines = await medicineModel.find(filter).sort({ name: 1 })
        res.json({ success: true, medicines })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Adjust stock
const updateMedicineStock = async (req, res) => {
    try {
        const { medicineId, stock } = req.body
        await medicineModel.findByIdAndUpdate(medicineId, { stock: Number(stock) })
        res.json({ success: true, message: "Stock updated successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Place pharmacy order
const createPharmacyOrder = async (req, res) => {
    try {
        const { patientId, patientName, appointmentId, items, totalAmount, paymentMethod, phone, address, paymentStatus } = req.body
        
        // Decrement stock for ordered items
        for (const item of items) {
            await medicineModel.findOneAndUpdate({ name: item.name }, {
                $inc: { stock: -Number(item.quantity) }
            })
        }

        const newOrder = new pharmacyOrderModel({
            patientId,
            patientName,
            appointmentId,
            items,
            totalAmount: Number(totalAmount),
            paymentStatus: paymentStatus || 'Pending',
            paymentMethod: paymentMethod || 'Cash on Delivery',
            phone: phone || '',
            address: address || '',
            orderStatus: 'Pending',
            date: Date.now()
        })
        await newOrder.save()
        res.json({ success: true, message: "Order placed successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// List all pharmacy orders (Admin view)
const listPharmacyOrders = async (req, res) => {
    try {
        const orders = await pharmacyOrderModel.find({}).sort({ date: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Update order delivery status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body
        await pharmacyOrderModel.findByIdAndUpdate(orderId, { orderStatus })
        res.json({ success: true, message: `Order status set to ${orderStatus}` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { addMedicine, listMedicines, updateMedicineStock, createPharmacyOrder, listPharmacyOrders, updateOrderStatus }
