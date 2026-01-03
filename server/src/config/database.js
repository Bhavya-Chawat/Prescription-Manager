const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  mongoose.set("strictQuery", true);

  if (!uri) {
    console.error("❌ MONGODB_URI is missing in .env file");
    console.error(
      "Please create a .env file with MONGODB_URI=mongodb+srv://..."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
    return mongoose.connection;
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB Atlas:", err.message);
    console.error("📝 Please ensure:");
    console.error(
      "   1. Your IP address is whitelisted in MongoDB Atlas (Network Access)"
    );
    console.error("   2. The connection string in .env is correct");
    console.error("   3. MongoDB Atlas cluster is active");
    process.exit(1);
  }
}

module.exports = { connectDB };
