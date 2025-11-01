import prisma from './src/config/prisma.js'

async function testConnection() {
  try {
    // Test basic query
    const result = await prisma.districtData.count()
    console.log('Connection successful! District count:', result)
    
    // Test sync logs
    const syncLog = await prisma.syncLog.create({
      data: {
        status: 'test',
        records: 0
      }
    })
    console.log('Sync log created:', syncLog)
    
    await prisma.syncLog.delete({
      where: { id: syncLog.id }
    })
    console.log('Test successful!')
  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()