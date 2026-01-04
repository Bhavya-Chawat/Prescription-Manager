require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
const app = require("./src/app");
const { connectDB } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// Serve static files from the React app (after build)
const clientBuildPath = path.join(__dirname, "../client/dist");

// Serve static files with proper caching:
// - JS/CSS files have hashed names, can be cached forever
// - HTML files should never be cached to always get latest version
app.use(
  express.static(clientBuildPath, {
    maxAge: 0, // Don't cache by default
    etag: false, // Disable ETag to prevent 304 responses
    setHeaders: (res, filePath) => {
      // Cache static assets (JS, CSS, fonts, images) for 1 year
      if (filePath.match(/\.(js|css|woff|woff2|png|jpg|jpeg|gif|svg|ico)$/)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        // Never cache HTML files
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    },
  })
);

// The "catchall" handler: for any request that doesn't
// match API routes, send back React's index.html file.
app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
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
