import prisma from '../src/config/prisma.js';

async function run() {
  try {
    const state = 'Jharkhand';
    const district = 'RANCHI';
    const data = { test: 'upsert-check', timestamp: new Date().toISOString() };

    const upserted = await prisma.districtData.upsert({
      where: {
        // Prisma generated unique field name for composite unique may differ; use raw query fallback
        // But try composite unique if Prisma schema supports it.
        state_name_district_name: {
          state_name: state.toUpperCase(),
          district_name: district.toUpperCase()
        }
      },
      update: {
        data,
        last_updated: new Date()
      },
      create: {
        state_name: state.toUpperCase(),
        district_name: district.toUpperCase(),
        data,
        last_updated: new Date()
      }
    });

    console.log('Upsert succeeded:', upserted);
  } catch (err) {
    console.error('Upsert error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
