import prisma from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';

// Load states_districts.json
const statesDistrictsPath = path.resolve('../mgnrega/public/data/states_districts.json');

let statesDistricts;
try {
  const fileContent = fs.readFileSync(statesDistrictsPath, 'utf8');
  statesDistricts = JSON.parse(fileContent);
} catch (error) {
  console.error('Error loading states_districts.json:', error.message);
  console.error('Make sure the file exists at:', statesDistrictsPath);
  process.exit(1);
}

async function migrateData() {
  console.log('🚀 Starting multi-state migration...\n');
  console.log(`📦 Found ${Object.keys(statesDistricts).length} states\n`);
  
  let totalCount = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const [state, districts] of Object.entries(statesDistricts)) {
    console.log(`\n📍 Processing ${state} (${districts.length} districts)...`);
    
    for (const district of districts) {
      totalCount++;
      try {
        await prisma.districtData.upsert({
          where: {
            state_name_district_name: {
              state_name: state,
              district_name: district
            }
          },
          update: {
            last_updated: new Date()
          },
          create: {
            state_name: state,
            district_name: district,
            data: {}
          }
        });
        
        successCount++;
        process.stdout.write('.');
      } catch (error) {
        errorCount++;
        console.error(`\n  ❌ Error migrating ${state}/${district}: ${error.message}`);
      }
    }
    
    console.log(` ✓ Completed`);
  }
  
  console.log(`\n\n${'='.repeat(50)}`);
  console.log('📊 Migration Summary');
  console.log(`${'='.repeat(50)}`);
  console.log(`✓ Total records processed: ${totalCount}`);
  console.log(`✓ Successfully created/updated: ${successCount}`);
  console.log(`❌ Errors encountered: ${errorCount}`);
  console.log(`${'='.repeat(50)}\n`);
  
  if (errorCount === 0) {
    console.log('✅ Migration completed successfully!\n');
  } else {
    console.log('⚠️  Migration completed with errors. Please review the errors above.\n');
  }
}

migrateData()
  .catch(error => {
    console.error('💥 Fatal error during migration:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✓ Database connection closed');
  });
