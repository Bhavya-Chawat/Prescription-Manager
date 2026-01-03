require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
const app = require("./src/app");
const { connectDB } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// Serve static files from the React app (after build)
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// The "catchall" handler: for any request that doesn't
// match API routes, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Frontend: Serving from ${clientBuildPath}`);
    });

    // Keep process alive
    process.on("SIGINT", () => {
      console.log("\n👋 Shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
