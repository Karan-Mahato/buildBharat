import prisma from '../config/prisma.js'

// ===== New Multi-State Functions =====

export async function getDistrictDataByStateAndDistrict(state_name, district_name) {
  return prisma.districtData.findUnique({
    where: {
      state_name_district_name: {
        state_name,
        district_name
      }
    }
  })
}

export async function getDistrictsByState(state_name) {
  return prisma.districtData.findMany({
    where: { state_name },
    orderBy: { district_name: 'asc' }
  })
}

export async function getAllStates() {
  const states = await prisma.districtData.groupBy({
    by: ['state_name'],
    orderBy: { state_name: 'asc' }
  })
  return states.map(s => s.state_name)
}

export async function upsertDistrictData(state_name, district_name, data, district_code = null) {
  return prisma.districtData.upsert({
    where: {
      state_name_district_name: {
        state_name,
        district_name
      }
    },
    update: {
      data,
      last_updated: new Date(),
      ...(district_code ? { district_code } : {})
    },
    create: {
      state_name,
      district_name,
      data,
      ...(district_code ? { district_code } : {})
    }
  })
}

// ===== Legacy Functions (Backward Compatibility) =====

export async function getDistrictData(district_name = null) {
  if (district_name) {
    return prisma.districtData.findFirst({
      where: { district_name }
    })
  }
  return prisma.districtData.findMany({
    orderBy: {
      district_name: 'asc'
    }
  })
}

export async function createSyncLog() {
  return prisma.syncLog.create({
    data: {}
  })
}

export async function updateSyncLog(id, data) {
  return prisma.syncLog.update({
    where: { id },
    data
  })
}