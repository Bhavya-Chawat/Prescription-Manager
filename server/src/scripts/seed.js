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
const Prescription = require("../models/Prescription.model.js");
const QueueEntry = require("../models/QueueEntry.model.js");

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
      name: "Crocin Advance 500mg",
      genericName: "Paracetamol",
      category: "Analgesic",
      unit: "tablet",
      unitPrice: 5.5,
      reorderThreshold: 100,
      supplierId: suppliers[0]._id,
      manufacturer: "GSK",
      isActive: true,
    },
    {
      code: "AMOX250",
      name: "Amoxil 250mg",
      genericName: "Amoxicillin",
      category: "Antibiotic",
      unit: "capsule",
      unitPrice: 18.75,
      reorderThreshold: 100,
      supplierId: suppliers[0]._id,
      manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd",
      isActive: true,
    },
    {
      code: "DICLO50",
      name: "Voveran 50mg",
      genericName: "Diclofenac",
      category: "Pain Relief",
      unit: "tablet",
      unitPrice: 12.25,
      reorderThreshold: 80,
      supplierId: suppliers[1]._id,
      manufacturer: "Novartis India Ltd",
      isActive: true,
    },
    {
      code: "OMEP20",
      name: "Omez 20mg",
      genericName: "Omeprazole",
      category: "Gastrointestinal",
      unit: "capsule",
      unitPrice: 8.5,
      reorderThreshold: 70,
      supplierId: suppliers[1]._id,
      manufacturer: "Dr. Reddy's Laboratories",
      isActive: true,
    },
    {
      code: "MET500",
      name: "Glucophage 500mg",
      genericName: "Metformin",
      category: "Diabetes",
      unit: "tablet",
      unitPrice: 15.0,
      reorderThreshold: 120,
      supplierId: suppliers[2]._id,
      manufacturer: "Merck India",
      isActive: true,
    },
    {
      code: "IBU400",
      name: "Ibugesic Plus 400mg",
      genericName: "Ibuprofen",
      category: "Pain Relief",
      unit: "tablet",
      unitPrice: 7.25,
      reorderThreshold: 150,
      supplierId: suppliers[0]._id,
      manufacturer: "Abbott India Ltd",
      isActive: true,
    },
  ];

  const insertedMedicines = await Medicine.insertMany(medicines);
  console.log(`✅ ${insertedMedicines.length} Medicines seeded`);
  return insertedMedicines;
};

const seedBatches = async (medicines) => {
  await Batch.deleteMany({});

  const batches = [];
  const today = new Date();

  // Strategy: Create specific stock levels
  // - Some medicines will have CRITICAL stock (< 50% of threshold)
  // - Some will have LOW stock (50-99% of threshold)
  // - Some will have NORMAL stock (> threshold)

  const stockStrategies = [
    { type: "CRITICAL", multiplier: 0.3 }, // 30% of threshold
    { type: "LOW", multiplier: 0.7 }, // 70% of threshold
    { type: "NORMAL", multiplier: 1.5 }, // 150% of threshold
  ];

  medicines.forEach((medicine, index) => {
    // Assign strategy based on index to ensure variety
    const strategyIndex = index % 3;
    const strategy = stockStrategies[strategyIndex];

    // Calculate total quantity based on threshold and strategy
    const totalQuantity = Math.floor(
      medicine.reorderThreshold * strategy.multiplier
    );

    // Decide number of batches (1-3)
    const numBatches = Math.floor(Math.random() * 2) + 1; // 1 or 2 batches

    // Split quantity across batches
    let remainingQuantity = totalQuantity;

    for (let i = 0; i < numBatches; i++) {
      const isLastBatch = i === numBatches - 1;
      const quantity = isLastBatch
        ? remainingQuantity
        : Math.floor(remainingQuantity / (numBatches - i));

      remainingQuantity -= quantity;

      // Expiry dates: some near expiry, some far
      const expiryDate = new Date(today);
      if (i === 0 && Math.random() > 0.7) {
        // 30% chance first batch expires soon (1-3 months)
        expiryDate.setMonth(
          today.getMonth() + Math.floor(Math.random() * 3) + 1
        );
      } else {
        // Normal expiry (6-18 months)
        expiryDate.setMonth(today.getMonth() + (6 + i * 6));
      }

      const receivedDate = new Date();
      receivedDate.setDate(receivedDate.getDate() - i * 30);

      batches.push({
        medicineId: medicine._id,
        batchNumber: `BATCH-${medicine.code}-${String(i + 1).padStart(3, "0")}`,
        quantity,
        expiryDate,
        receivedDate,
        costPrice: medicine.unitPrice * (0.5 + Math.random() * 0.2),
        isExpired: false,
      });
    }

    console.log(
      `  ${medicine.code}: ${totalQuantity} units (${strategy.type}) - threshold: ${medicine.reorderThreshold}`
    );
  });

  await Batch.insertMany(batches);
  console.log(`✅ ${batches.length} Batches seeded with varied stock levels`);
  console.log("ℹ️  Stock distribution:");
  console.log("   - Critical stock (red): ~4 medicines");
  console.log("   - Low stock (yellow): ~4 medicines");
  console.log("   - Normal stock (green): ~4 medicines");
};

const seedPatients = async () => {
  await Patient.deleteMany({});

  const patients = [
    {
      name: "Rahul Sharma",
      age: 42,
      gender: "Male",
      phone: "+91-9876543210",
      address: "Mumbai, Maharashtra",
      email: "rahul.sharma@example.com",
      bloodGroup: "B+",
      medicalHistory: "Hypertension",
    },
    {
      name: "Priya Patel",
      age: 28,
      gender: "Female",
      phone: "+91-9876543211",
      address: "Ahmedabad, Gujarat",
      email: "priya.patel@example.com",
      bloodGroup: "O+",
      medicalHistory: "Asthma",
    },
    {
      name: "Amit Kumar",
      age: 35,
      gender: "Male",
      phone: "+91-9876543212",
      address: "New Delhi",
      email: "amit.kumar@example.com",
      bloodGroup: "A+",
      medicalHistory: "None",
    },
    {
      name: "Sneha Desai",
      age: 31,
      gender: "Female",
      phone: "+91-9876543213",
      address: "Pune, Maharashtra",
      email: "sneha.desai@example.com",
      bloodGroup: "AB+",
      medicalHistory: "Diabetes Type 2",
    },
    {
      name: "Vikram Singh",
      age: 45,
      gender: "Male",
      phone: "+91-9876543214",
      address: "Jaipur, Rajasthan",
      email: "vikram.singh@example.com",
      bloodGroup: "O-",
      medicalHistory: "Arthritis",
    },
    {
      name: "Anjali Reddy",
      age: 26,
      gender: "Female",
      phone: "+91-9876543215",
      address: "Hyderabad, Telangana",
      email: "anjali.reddy@example.com",
      bloodGroup: "B-",
      medicalHistory: "Migraine",
    },
    {
      name: "Rajesh Verma",
      age: 52,
      gender: "Male",
      phone: "+91-9876543216",
      address: "Bangalore, Karnataka",
      email: "rajesh.verma@example.com",
      bloodGroup: "A-",
      medicalHistory: "Heart Disease",
    },
    {
      name: "Kavita Joshi",
      age: 38,
      gender: "Female",
      phone: "+91-9876543217",
      address: "Kolkata, West Bengal",
      email: "kavita.joshi@example.com",
      bloodGroup: "AB-",
      medicalHistory: "Thyroid",
    },
    {
      name: "Suresh Nair",
      age: 48,
      gender: "Male",
      phone: "+91-9876543218",
      address: "Chennai, Tamil Nadu",
      email: "suresh.nair@example.com",
      bloodGroup: "B+",
      medicalHistory: "High Cholesterol",
    },
    {
      name: "Deepa Iyer",
      age: 29,
      gender: "Female",
      phone: "+91-9876543219",
      address: "Surat, Gujarat",
      email: "deepa.iyer@example.com",
      bloodGroup: "O+",
      medicalHistory: "Allergy",
    },
  ];

  const insertedPatients = await Patient.insertMany(patients);
  console.log(`✅ ${insertedPatients.length} Patients seeded`);
  return insertedPatients;
};

const seedPrescriptionsAndQueues = async (patients, medicines) => {
  await Prescription.deleteMany({});
  await QueueEntry.deleteMany({});

  const { createPrescription } = require("../services/prescription.service.js");

  const doctors = [
    "Dr. Anil Sharma",
    "Dr. Priya Gupta",
    "Dr. Rajesh Patel",
    "Dr. Sunita Reddy",
    "Dr. Vikram Joshi",
  ];

  const departments = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
  ];

  const prescriptions = [];
  const queueEntries = [];

  // Create 10 prescriptions - all auto-queued, some already dispensed
  const statuses = [
    { type: "queued", count: 5 }, // 5 queued (waiting to be dispensed)
    { type: "dispensed", count: 5 }, // 5 already dispensed
  ];

  let prescriptionIndex = 0;

  for (const statusGroup of statuses) {
    for (let i = 0; i < statusGroup.count; i++) {
      // Distribute prescriptions evenly across patients for uniqueness
      const patient = patients[prescriptionIndex % patients.length];
      const doctor = doctors[prescriptionIndex % doctors.length];
      const department = departments[prescriptionIndex % departments.length];

      // Select 1-4 random medicines for each prescription
      const numMedicines = Math.floor(Math.random() * 3) + 2; // 2-4 medicines
      const selectedMedicines = [];
      const usedMedicines = new Set();

      // Use different medicine combinations for variety
      const startIdx = prescriptionIndex % (medicines.length - 1);
      for (let j = 0; j < numMedicines && j < medicines.length; j++) {
        const medicine = medicines[(startIdx + j) % medicines.length];

        if (!usedMedicines.has(medicine._id.toString())) {
          usedMedicines.add(medicine._id.toString());

          selectedMedicines.push({
            medicineId: medicine._id,
            dosage:
              medicine.name.match(/(\d+\s*(?:mg|ml|g|units?))/i)?.[1] ||
              "1 unit",
            quantity: Math.floor(Math.random() * 10) + 10, // 10-20 units for better variety
          });
        }
      }

      // Use the updated service method that properly handles patient references
      const insertedPrescription = await createPrescription({
        patientId: patient._id,
        patientName: patient.name,
        doctor,
        department,
        items: selectedMedicines,
      });

      // Update status if needed
      if (statusGroup.type === "dispensed") {
        await Prescription.findByIdAndUpdate(insertedPrescription._id, {
          status: "dispensed",
        });
        insertedPrescription.status = "dispensed";
      } else if (statusGroup.type === "queued") {
        await Prescription.findByIdAndUpdate(insertedPrescription._id, {
          status: "queued",
        });
        insertedPrescription.status = "queued";
      }

      prescriptions.push(insertedPrescription);

      // Add to queue only if status is 'queued'
      if (statusGroup.type === "queued") {
        queueEntries.push({
          prescriptionId: insertedPrescription._id,
          priority: Math.floor(Math.random() * 4), // 0-3 priority levels (0=Emergency, 1=High, 2=Normal, 3=Low)
          status: "waiting",
        });
      }

      prescriptionIndex++;
    }
  }

  if (queueEntries.length > 0) {
    await QueueEntry.insertMany(queueEntries);
    console.log(
      `✅ ${queueEntries.length} Queue entries seeded (all prescriptions auto-queued)`
    );
  }

  console.log(`✅ ${prescriptions.length} Prescriptions seeded`);
  console.log(`   - ${statuses[0].count} Queued (ready to dispense)`);
  console.log(`   - ${statuses[1].count} Dispensed (already processed)`);

  return prescriptions;
};

const seedDispensesAndBills = async (prescriptions, medicines) => {
  const Dispense = require("../models/Dispense.model.js");
  const Bill = require("../models/Bill.model.js");
  const Batch = require("../models/Batch.model.js");
  const Medicine = require("../models/Medicine.model.js");
  const QueueEntry = require("../models/QueueEntry.model.js");

  await Dispense.deleteMany({});
  await Bill.deleteMany({});

  // Find all dispensed prescriptions
  const dispensedPrescriptions = prescriptions.filter(
    (p) => p.status === "dispensed"
  );

  for (const prescription of dispensedPrescriptions) {
    const allocations = [];
    const billItems = [];
    const backorders = [];

    for (const item of prescription.items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) continue;

      // Find available batches
      const batches = await Batch.find({
        medicineId: item.medicineId,
        quantity: { $gt: 0 },
      })
        .sort({ expiryDate: 1 })
        .limit(2);

      let remainingQty = item.quantity;

      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const allocatedQty = Math.min(remainingQty, batch.quantity);

        // Use correct schema: allocations with itemId and batchId
        allocations.push({
          itemId: item._id,
          batchId: batch._id,
          quantity: allocatedQty,
        });

        billItems.push({
          name: medicine.name,
          quantity: allocatedQty,
          unitPrice: medicine.unitPrice || 10,
          total: (medicine.unitPrice || 10) * allocatedQty,
        });

        remainingQty -= allocatedQty;

        // Reduce batch quantity
        await Batch.findByIdAndUpdate(batch._id, {
          $inc: { quantity: -allocatedQty },
        });
      }

      // If still remaining, add to backorders
      if (remainingQty > 0) {
        backorders.push({
          itemId: item._id,
          remainingQty: remainingQty,
        });
      }
    }

    // Create dispense record with correct schema
    const dispense = await Dispense.create({
      prescriptionId: prescription._id,
      allocations: allocations,
      backorders: backorders,
      status: backorders.length > 0 ? "partial" : "full",
    });

    // Create bill
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    await Bill.create({
      dispenseId: dispense._id,
      items: billItems,
      subtotal,
      discount: 0,
      total: subtotal,
      status: "paid",
    });

    // Mark queue entry as completed for dispensed prescriptions
    await QueueEntry.updateOne(
      { prescriptionId: prescription._id },
      { status: "completed", completedAt: new Date() }
    );
  }

  console.log(
    `✅ ${dispensedPrescriptions.length} Dispenses and Bills created for dispensed prescriptions`
  );
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...\n");

    await seedUsers();
    const suppliers = await seedSuppliers();
    const medicines = await seedMedicines(suppliers);
    await seedBatches(medicines);
    const patients = await seedPatients();
    const prescriptions = await seedPrescriptionsAndQueues(patients, medicines);
    await seedDispensesAndBills(prescriptions, medicines);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("   Admin: admin / admin123");
    console.log("   Pharmacist: pharmacist / pharma123");
    console.log("\n📦 Database Contents:");
    console.log("   • 6 medicines (2 Critical, 2 Low Stock, 2 Normal)");
    console.log("   • 10 unique patients with complete data");
    console.log("   • 10 prescriptions (5 Queued, 5 Dispensed)");
    console.log("   • 5 queue entries (prescriptions auto-queued)");
    console.log("\n💡 Complete Flow:");
    console.log("   1. Prescriptions → All auto-queued on creation");
    console.log("   2. Queue → Shows 5 queued prescriptions by priority");
    console.log("   3. Dispense → Process from queue (FEFO allocation)");
    console.log("   4. History → View 5 dispensed prescriptions with bills");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
