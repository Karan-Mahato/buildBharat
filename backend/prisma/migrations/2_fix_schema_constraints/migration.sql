-- Fix 1: Allow district_code to be NULL (matches Prisma schema)
ALTER TABLE "DistrictData" 
ALTER COLUMN "district_code" DROP NOT NULL;

-- Fix 2: Make sure we have state_name column
ALTER TABLE "DistrictData"
ADD COLUMN IF NOT EXISTS state_name TEXT DEFAULT 'Jharkhand';

-- Fix 3: Update all rows to have state_name = 'Jharkhand' if null
UPDATE "DistrictData"
SET state_name = 'Jharkhand'
WHERE state_name IS NULL OR state_name = '';

-- Fix 4: Drop old unique constraint on just district_name if it exists
ALTER TABLE "DistrictData" 
DROP CONSTRAINT IF EXISTS "DistrictData_district_name_key";

-- Fix 5: Create composite unique constraint
ALTER TABLE "DistrictData"
ADD CONSTRAINT IF NOT EXISTS "DistrictData_state_name_district_name_key" 
UNIQUE ("state_name", "district_name");

-- Fix 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS "DistrictData_state_name_idx" ON "DistrictData"("state_name");
CREATE INDEX IF NOT EXISTS "DistrictData_district_name_idx" ON "DistrictData"("district_name");
