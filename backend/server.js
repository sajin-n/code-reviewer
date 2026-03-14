const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

const app = express();

// --------------- Security Middleware ---------------
app.use(helmet());

// CORS configuration - allow frontend to communicate with backend
const allowedOrigins = [
  process.env.CLIENT_URL, // Production frontend (from env)
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3001",
  // Allow any Vercel deployment for flexibility
  ...(process.env.NODE_ENV === 'production' 
    ? [] 
    : ['http://127.0.0.1:5173', 'http://127.0.0.1:3000']
  ),
];

// Remove undefined values
const validOrigins = allowedOrigins.filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (validOrigins.includes(origin)) {
        callback(null, true);
      } 
      // In production, allow if it's from vercel.app domain (your Vercel deployments)
      else if (process.env.NODE_ENV === 'production' && origin.includes('vercel.app')) {
        callback(null, true);
      }
      else {
        console.log("❌ CORS rejected origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Groq-API-Key"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: "1mb" }));

// --------------- Routes ---------------
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --------------- Global Error Handler ---------------
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// --------------- Database & Start ---------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-code-reviewer";

console.log("🔐 CORS Configuration:");
console.log("   Allowed Origins:", validOrigins);
console.log("   CLIENT_URL from env:", process.env.CLIENT_URL || "NOT SET");
console.log("   Vercel deployments auto-allowed in production");
console.log("✅ Server starting...");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
