import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import districtRoutes from "./routes/districtRoutes.js"
import reverseRoutes from "./routes/reverseGeocode.js";
import { startAutoUpdateJob } from "./jobs/autoUpdateJob.js";
import prisma from './config/prisma.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(_,res)=> res.send("MGNREGA Backend is live"));
app.use("/api/districts", districtRoutes);  // Mount at base path, routes handle params
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
