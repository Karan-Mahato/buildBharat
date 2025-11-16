import prisma from '../src/config/prisma.js';

async function inspectConstraints() {
  try {
    console.log('\n=== CONSTRAINTS ON DistrictData ===\n');
    
    const constraints = await prisma.$queryRaw`
      SELECT 
        t.constraint_name,
        t.constraint_type,
        string_agg(a.attname, ', ' ORDER BY a.attnum) AS columns
      FROM information_schema.table_constraints t
      LEFT JOIN pg_constraint c ON c.conname = t.constraint_name
      LEFT JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      WHERE t.table_name = 'DistrictData' 
        AND t.table_schema = 'public'
      GROUP BY t.constraint_name, t.constraint_type
      ORDER BY t.constraint_type DESC, t.constraint_name
    `;
    
    console.log('Constraints found:');
    constraints.forEach(row => {
      console.log(`  ${row.constraint_name} (${row.constraint_type}): ${row.columns}`);
    });
    
    console.log('\n=== INDEXES ON DistrictData ===\n');
    
    const indexes = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'DistrictData' AND schemaname = 'public'
      ORDER BY indexname
    `;
    
    console.log('Indexes found:');
    indexes.forEach(row => {
      console.log(`  ${row.indexname}`);
      console.log(`    ${row.indexdef}`);
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

inspectConstraints();
