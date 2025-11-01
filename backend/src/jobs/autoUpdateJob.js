import cron from "node-cron";
import { fetchDistrictData } from "../services/mgnregaService.js";
import prisma from "../config/prisma.js";

const jharkhandDistricts = [
    "BOKARO",
    "CHATRA",
    "DEOGHAR",
    "DHANBAD", 
    "DUMKA",
    "EAST SINGHBUM",
    "GARHWA",
    "GIRIDIH",
    "GODDA",
    "GUMLA",
    "HAZARIBAGH",
    "JAMTARA",
    "KHUNTI",
    "KODERMA",
    "LATEHAR",
    "LOHARDAGA",
    "PAKUR",
    "PALAMU",
    "RAMGARH",
    "RANCHI",
    "SAHEBGANJ",
    "SARAIKELA KHARSAWAN",
    "SIMDEGA",
    "WEST SINGHBHUM"
];

export function startAutoUpdateJob() {
    const schedule = process.env.CRON_SCHEDULE || "0 6 * * *";
    console.log(`Auto-update job scheduled: ${schedule}`);
    
    const job = cron.schedule(schedule, async () => {
        console.log("Starting daily MGNREGA data update...");
        
        const startTime = Date.now();
        let successCount = 0;
        let failCount = 0;
        
        try {
            // Create a sync log entry
            const syncLog = await prisma.syncLog.create({
                data: { status: 'running' }
            });
            
            for (const district of jharkhandDistricts) {
                try {
                    await fetchDistrictData(district);
                    console.log(`✅ Updated data for ${district}`);
                    successCount++;
                } catch (err) {
                    console.error(`❌ Failed to update ${district}:`, err.message);
                    failCount++;
                }
            }
            
            // Update sync log with results
            await prisma.syncLog.update({
                where: { id: syncLog.id },
                data: {
                    status: failCount === 0 ? 'completed' : 'completed_with_errors',
                    end_time: new Date(),
                    records: successCount,
                    error: failCount > 0 ? `Failed to update ${failCount} districts` : null
                }
            });
            
            const duration = (Date.now() - startTime) / 1000;
            console.log("Daily MGNREGA update completed:");
            console.log(`- Time taken: ${duration.toFixed(1)}s`);
            console.log(`- Successful updates: ${successCount}`);
            console.log(`- Failed updates: ${failCount}`);
            
        } catch (error) {
            console.error("Auto-update job failed:", error);
            try {
                await prisma.syncLog.create({
                    data: {
                        status: 'failed',
                        error: error.message,
                        records: successCount,
                        end_time: new Date()
                    }
                });
            } catch (logError) {
                console.error("Failed to log sync error:", logError);
            }
        }
    });

    return job;
}