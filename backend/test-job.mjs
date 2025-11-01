import dotenv from 'dotenv';
import { startAutoUpdateJob } from './src/jobs/autoUpdateJob.js';
import prisma from './src/config/prisma.js';

// Load environment variables
dotenv.config();

async function runTest() {
    console.log('\nStarting test with configuration:');
    console.log('- API URL:', process.env.MGNREGA_API_URL);
    console.log('- Database:', process.env.DATABASE_URL ? 'Configured' : 'Missing');
    
    // Force immediate run for testing
    process.env.CRON_SCHEDULE = '* * * * *';
    
    // Clear old sync logs
    await prisma.syncLog.deleteMany({
        where: {
            start_time: {
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }
    });
    
    console.log('\nStarting auto-update job...');
    const job = startAutoUpdateJob();

    console.log('\nWaiting for scheduled run (up to 70s)...');
    await new Promise((resolve) => setTimeout(resolve, 70 * 1000));

    const [latestSync, districtCount] = await Promise.all([
        prisma.syncLog.findFirst({ 
            orderBy: { start_time: 'desc' } 
        }),
        prisma.districtData.count()
    ]);

    console.log('\nResults:');
    console.log('Latest sync log:', latestSync);
    console.log('Districts stored:', districtCount);

    job.stop();
    await prisma.$disconnect();

    const success = latestSync?.status === 'completed' && districtCount > 0;
    process.exit(success ? 0 : 1);
}

runTest().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});