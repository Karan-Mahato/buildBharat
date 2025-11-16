-- Update existing records to have state_name if not already set
UPDATE "DistrictData" 
SET "state_name" = 'Jharkhand' 
WHERE "state_name" IS NULL OR "state_name" = '';

-- Drop the old unique constraint if it exists on just district_name
ALTER TABLE "DistrictData" 
DROP CONSTRAINT IF EXISTS "DistrictData_district_name_key";

-- Ensure the correct unique constraint exists on (state_name, district_name)
-- This constraint was already created in the init migration, but adding for safety
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'DistrictData' 
        AND constraint_name = 'DistrictData_state_name_district_name_key'
    ) THEN
        ALTER TABLE "DistrictData" 
        ADD CONSTRAINT "DistrictData_state_name_district_name_key" 
        UNIQUE("state_name", "district_name");
    END IF;
END $$;
