-- CreateTable "DistrictData"
CREATE TABLE IF NOT EXISTS "DistrictData" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "state_name" TEXT NOT NULL DEFAULT 'Jharkhand',
    "district_name" TEXT NOT NULL,
    "district_code" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "DistrictData_state_name_district_name_key" UNIQUE("state_name", "district_name")
);

-- CreateTable "SyncLog"
CREATE TABLE IF NOT EXISTS "SyncLog" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "records" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "DistrictData_state_name_idx" ON "DistrictData"("state_name");
CREATE INDEX IF NOT EXISTS "DistrictData_district_name_idx" ON "DistrictData"("district_name");
