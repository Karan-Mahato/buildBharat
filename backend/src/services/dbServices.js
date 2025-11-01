import prisma from '../config/prisma.js'

export async function upsertDistrictData(district_name, data, district_code = null) {
  return prisma.districtData.upsert({
    where: {
      district_name
    },
    update: {
      data,
      last_updated: new Date(),
      ...(district_code ? { district_code } : {})
    },
    create: {
      district_name,
      data,
      ...(district_code ? { district_code } : {})
    }
  })
}

export async function getDistrictData(district_name = null) {
  if (district_name) {
    return prisma.districtData.findUnique({
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