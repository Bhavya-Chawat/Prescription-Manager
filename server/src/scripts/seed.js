const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

// Import models
const User = require("../models/User.model.js");
const Medicine = require("../models/Medicine.model.js");
const Batch = require("../models/Batch.model.js");
const Patient = require("../models/Patient.model.js");
const Supplier = require("../models/Supplier.model.js");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  await User.deleteMany({});

  const users = [
    {
      employeeId: "EMP001",
      name: "Admin User",
      email: "admin@pharmacy.local",
      username: "admin",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "admin",
      isActive: true,
    },
    {
      employeeId: "EMP002",
      name: "Pharmacist One",
      email: "pharmacist@pharmacy.local",
      username: "pharmacist",
      passwordHash: await bcrypt.hash("pharma123", 10),
      role: "pharmacist",
      isActive: true,
    },
    {
      employeeId: "EMP003",
      name: "Viewer User",
      email: "viewer@pharmacy.local",
      username: "viewer",
      passwordHash: await bcrypt.hash("view123", 10),
      role: "viewer",
      isActive: true,
    },
  ];

  await User.insertMany(users);
  console.log("✅ Users seeded");
};

const seedSuppliers = async () => {
  await Supplier.deleteMany({});

  const suppliers = [
    {
      name: "MediSupply Corp",
      contact: "+91-9876543210",
      email: "sales@medisupply.com",
      address: "123 Medical District, Mumbai",
      isActive: true,
    },
    {
      name: "PharmaDistributors Ltd",
      contact: "+91-9876543211",
      email: "orders@pharmadist.com",
      address: "456 Healthcare Avenue, Delhi",
      isActive: true,
    },
    {
      name: "HealthCare Supplies",
      contact: "+91-9876543212",
      email: "contact@healthcare.com",
      address: "789 Wellness Road, Bangalore",
      isActive: true,
    },
  ];

  const insertedSuppliers = await Supplier.insertMany(suppliers);
  console.log("✅ Suppliers seeded");
  return insertedSuppliers;
};

const seedMedicines = async (suppliers) => {
  await Medicine.deleteMany({});

  const medicines = [
    {
      code: "PARA500",
      name: "Paracetamol 500mg",
      genericName: "Paracetamol",
      category: "analgesic",
      unit: "tablet",
      unitPrice: 2.5,
      reorderThreshold: 50,
      supplierId: suppliers[0]._id,
      isActive: true,
    },
    {
      code: "AMOX250",
      name: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      category: "antibiotic",
      unit: "capsule",
      unitPrice: 12.0,
      reorderThreshold: 50,
      supplierId: suppliers[0]._id,
      isActive: true,
    },
    {
      code: "OMEP20",
      name: "Omeprazole 20mg",
      genericName: "Omeprazole",
      category: "antacid",
      unit: "tablet",
      unitPrice: 8.5,
      reorderThreshold: 30,
      supplierId: suppliers[1]._id,
      isActive: true,
    },
    {
      code: "DICLO50",
      name: "Diclofenac 50mg",
      genericName: "Diclofenac",
      category: "analgesic",
      unit: "tablet",
      unitPrice: 5.0,
      reorderThreshold: 50,
      supplierId: suppliers[1]._id,
      isActive: true,
    },
    {
      code: "AZITH500",
      name: "Azithromycin 500mg",
      genericName: "Azithromycin",
      category: "antibiotic",
      unit: "tablet",
      unitPrice: 15.0,
      reorderThreshold: 40,
      supplierId: suppliers[0]._id,
      isActive: true,
    },
    {
      code: "METF500",
      name: "Metformin 500mg",
      genericName: "Metformin",
      category: "diabetes",
      unit: "tablet",
      unitPrice: 3.0,
      reorderThreshold: 100,
      supplierId: suppliers[2]._id,
      isActive: true,
    },
    {
      code: "ASPIR75",
      name: "Aspirin 75mg",
      genericName: "Aspirin",
      category: "cardiovascular",
      unit: "tablet",
      unitPrice: 1.5,
      reorderThreshold: 80,
      supplierId: suppliers[2]._id,
      isActive: true,
    },
    {
      code: "CETIR10",
      name: "Cetirizine 10mg",
      genericName: "Cetirizine",
      category: "antihistamine",
      unit: "tablet",
      unitPrice: 2.0,
      reorderThreshold: 60,
      supplierId: suppliers[1]._id,
      isActive: true,
    },
  ];

  const insertedMedicines = await Medicine.insertMany(medicines);
  console.log("✅ Medicines seeded");
  return insertedMedicines;
};

const seedBatches = async (medicines) => {
  await Batch.deleteMany({});

  const batches = [];
  const today = new Date();

  medicines.forEach((medicine, index) => {
    // Create 2-3 batches per medicine with varying expiry dates
    const batchCount = Math.floor(Math.random() * 2) + 2;

    for (let i = 0; i < batchCount; i++) {
      const expiryDate = new Date(today);
      expiryDate.setMonth(today.getMonth() + (index * 2 + i * 3 + 3)); // Varying expiry

      const quantity = index === 3 ? 0 : Math.floor(Math.random() * 100) + 20; // Make Diclofenac out of stock

      batches.push({
        medicineId: medicine._id,
        batchNumber: `BT-${medicine.code}-${String(i + 1).padStart(3, "0")}`,
        quantity,
        expiryDate,
        receivedDate: new Date(
          today.getTime() - (30 + i * 10) * 24 * 60 * 60 * 1000
        ),
        costPrice: medicine.unitPrice * 0.6, // 60% of selling price
        isExpired: false,
      });
    }
  });

  await Batch.insertMany(batches);
  console.log("✅ Batches seeded");
};

const seedPatients = async () => {
  await Patient.deleteMany({});

  const patients = [
    {
      patientNumber: "P-001234",
      name: "Rajesh Kumar",
      age: 45,
      gender: "male",
      contact: "+91-9876501234",
      bloodGroup: "AB+",
      allergies: ["Penicillin"],
    },
    {
      patientNumber: "P-001235",
      name: "Priya Singh",
      age: 32,
      gender: "female",
      contact: "+91-9876501235",
      bloodGroup: "O+",
      allergies: [],
    },
    {
      patientNumber: "P-001236",
      name: "Amit Patel",
      age: 58,
      gender: "male",
      contact: "+91-9876501236",
      bloodGroup: "B+",
      allergies: ["Sulfa drugs"],
    },
    {
      patientNumber: "P-001237",
      name: "Sita Devi",
      age: 68,
      gender: "female",
      contact: "+91-9876501237",
      bloodGroup: "A+",
      allergies: [],
    },
    {
      patientNumber: "P-001238",
      name: "Ravi Kumar",
      age: 25,
      gender: "male",
      contact: "+91-9876501238",
      bloodGroup: "O-",
      allergies: [],
    },
  ];

  await Patient.insertMany(patients);
  console.log("✅ Patients seeded");
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...\n");

    await seedUsers();
    const suppliers = await seedSuppliers();
    const medicines = await seedMedicines(suppliers);
    await seedBatches(medicines);
    await seedPatients();

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("   Admin: admin / admin123");
    console.log("   Pharmacist: pharmacist / pharma123");
    console.log("   Viewer: viewer / view123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
