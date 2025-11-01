import express from "express";
import { fetchDistrictData } from "../services/mgnregaService.js";
import prisma from '../config/prisma.js';

const router = express.Router();

// District name mapping for common variations
const districtMapping = {
    'EAST SINGHBUM': ['EAST SINGHBUM', 'PURBI SINGHBHUM'],
    'WEST SINGHBUM': ['WEST SINGHBUM', 'PASHCHIMI SINGHBHUM'],
    'SARAIKELA KHARSAWAN': ['SERAIKELA KHARSAWAN', 'SERAIKELA'],
    // Add more mappings as needed
};

// Get all available districts
router.get("/", async (req, res) => {
    try {
        const districts = await prisma.districtData.findMany({
            select: { district_name: true }
        });
        res.json(districts.map(d => d.district_name));
    } catch (err) {
        console.error("[API] Error fetching districts:", err);
        res.status(500).json({ message: "Failed to fetch districts" });
    }
});

// Get specific district data
router.get("/:district", async (req, res) => {
    // Decode and clean the district name
    const requestedName = decodeURIComponent(req.params.district).trim();
    console.log(`[API] Received request for district: ${requestedName}`);
    
    try {
        // Try exact match first
        let data = await fetchDistrictData(requestedName);
        
        // If no exact match, try known variations
        if (!data) {
            // Check all mappings for variations
            for (const [standard, variations] of Object.entries(districtMapping)) {
                if (variations.includes(requestedName)) {
                    console.log(`[API] Trying variation: ${standard} for ${requestedName}`);
                    data = await fetchDistrictData(standard);
                    if (data) break;
                }
            }
        }
        
        if (!data) {
            console.log(`[API] No data found for district: ${requestedName}`);
            // List available districts in error response
            const available = await prisma.districtData.findMany({
                select: { district_name: true }
            });
            return res.status(404).json({
                message: "NO DATA FOUND",
                district: requestedName,
                availableDistricts: available.map(d => d.district_name)
            });
        }
        
        console.log(`[API] Successfully retrieved data for: ${requestedName}`);
        res.json(data);
    } catch (err) {
        console.error("[API] District route error:", {
            district: requestedName,
            error: err.message,
            stack: err.stack
        });
        
        res.status(500).json({
            message: "SERVER ERROR",
            error: err.message,
            district: requestedName
        });
    }
});

export default router;