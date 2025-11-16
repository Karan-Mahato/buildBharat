import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import districtRoutes from "./routes/districtRoutes.js"
import reverseRoutes from "./routes/reverseGeocode.js";
import { startAutoUpdateJob } from "./jobs/autoUpdateJob.js";
import prisma from './config/prisma.js';

dotenv.config();

// Surface fatal/unhandled errors during startup so they don't fail silently
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Keep process alive for debugging; in production you may want to exit
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(_,res)=> res.send("MGNREGA Backend is live"));
// Mount district routes under /api so endpoints like /api/states work with the frontend
app.use("/api", districtRoutes);
app.use("/api/reverse-geocode", reverseRoutes);

app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: "ok",
      message: "Backend connected successfully!",
      database: "connected"
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: "error", 
      message: error.message,
      database: error instanceof Error ? error.message : "unknown error"
    });
  }
});


startAutoUpdateJob();

// Add Prisma shutdown handler
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
