# BuildBharat Backend

## 🚀 Backend Server for MGNREGA Data Platform

Node.js/Express backend that handles data synchronization, API serving, and database management for the MGNREGA dashboard.

## ⚡ Quick Start

```bash
cd backend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev

# Server runs at http://localhost:5000
```

## 📦 Installation

### Prerequisites

- Node.js v18+
- PostgreSQL (or Supabase)
- npm or yarn

### Dependencies

```bash
npm install
```

### Key Packages

- `express` - Web framework
- `prisma` - ORM
- `axios` - HTTP client
- `node-cron` - Job scheduling
- `dotenv` - Environment management
- `pg` - PostgreSQL driver

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# API Configuration
MGNREGA_API_URL="https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722"
MGNREGA_API_KEY="your_api_key_here"

# Server Configuration
PORT=5000
NODE_ENV=development

# Scheduler Configuration
CRON_SCHEDULE="0 6 * * *"  # Daily at 6 AM

# Redis Configuration (Optional)
REDIS_ENABLED=false
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD="password"
```

### Database Setup

Using Supabase (Recommended):

```env
DATABASE_URL=postgresql://postgres.xxx:password@aws-x-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@aws-x-region.pooler.supabase.com:5432/postgres
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   ├── db.js              # PostgreSQL pool config
│   │   ├── prisma.js          # Prisma client
│   │   └── redis.js           # Redis config (optional)
│   ├── controllers/
│   │   └── districtController.js
│   ├── services/
│   │   └── mgnregaService.js  # Core data service
│   ├── jobs/
│   │   └── autoUpdateJob.js   # Cron job scheduler
│   ├── routes/
│   │   ├── districtRoutes.js
│   │   └── reverseGeocode.js
│   └── utils/
│       └── cache.js           # Caching utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── scripts/
│   ├── testUpsert.mjs
│   ├── migrateToMultiState.mjs
│   └── inspectConstraints.mjs
├── test-job.mjs               # Full sync test
├── test-connection.mjs        # Connection test
├── check-sync-status.mjs      # Status check
├── package.json
└── .env                       # Environment (DO NOT COMMIT)
```

## 📡 API Endpoints

### States & Districts

#### Get All States

```
GET /api/states
Response: ["Jharkhand", "Andhra Pradesh", ...]
```

#### Get Districts of a State

```
GET /api/states/:state/districts
Example: GET /api/states/Jharkhand/districts
Response: ["Ranchi", "Dhanbad", "Giridih", ...]
```

#### Get District Data

```
GET /api/states/:state/districts/:district
Example: GET /api/states/Jharkhand/districts/Ranchi

Response:
{
  "id": 1,
  "state_name": "JHARKHAND",
  "district_name": "RANCHI",
  "district_code": "3416",
  "data": {
    "Wages": "8975.13623",
    "month": "Dec",
    "fin_year": "2024-2025",
    "Total_No_of_Workers": 511878,
    ...
  },
  "last_updated": "2025-11-16T08:06:49.180Z"
}
```

### Reverse Geocoding

#### Get Location from Coordinates

```
GET /api/reverse-geocode?lat=23.3441&lon=85.3096
Response: { state: "Jharkhand", district: "Ranchi" }
```

### Health Check

```
GET /api/health
Response: { status: "ok", timestamp: "2025-11-16T08:06:49Z" }
```

## 🔄 Data Synchronization

### Automatic Daily Sync

- **Schedule**: 6 AM IST (configurable)
- **Triggered by**: `node-cron` job
- **Scope**: All 28 states and their districts
- **Source**: Government MGNREGA API

### Manual Full Sync

```bash
node test-job.mjs
```

Syncs all states and districts:

```
🚀 Starting sync for all states...
📍 Updating JHARKHAND (24 districts)...
  ✅ RANCHI
  ✅ DHANBAD
  ...
📊 Results:
   ⏱️  Time taken: 45.2s
   ✓  Successful updates: 740
   ✗  Failed updates: 0
```

### Check Sync Status

```bash
node check-sync-status.mjs
```

Output:

```
📊 Sync Status Report
==============================================================
📍 Total Districts in DB: 740
📋 Total Sync Logs: 5
📍 Districts by State:
   ANDHRA PRADESH: 26 districts
   JHARKHAND: 24 districts
   ...
📋 Recent Sync Logs:
   1. completed - 740 records - 45.2s - Nov 16, 2025
```

## 🧪 Testing & Validation

### Test Database Connection

```bash
node test-connection.mjs
```

Tests both pooler and direct connections:

```
1️⃣ Environment Variables:
   ✅ DATABASE_URL configured
   ✅ DIRECT_URL configured
2️⃣ Testing DIRECT_URL connection:
   ✅ Connection successful!
3️⃣ Testing DATABASE_URL (pooler) connection:
   ✅ Connection successful!
```

### Troubleshooting Connection Issues

If connection fails:

1. Verify credentials in `.env`
2. Check if Supabase is running
3. Ensure your IP is whitelisted
4. Verify network connectivity

## 🗄️ Database Schema

### DistrictData

```prisma
model DistrictData {
  id              Int     @id @default(autoincrement())
  state_name      String
  district_name   String
  district_code   String?
  data            Json    @default("{}")
  last_updated    DateTime @default(now()) @updatedAt

  @@unique([state_name, district_name])
  @@index([state_name])
  @@index([district_name])
}
```

### SyncLog

```prisma
model SyncLog {
  id         Int       @id @default(autoincrement())
  status     String    @default("pending")
  start_time DateTime  @default(now())
  end_time   DateTime?
  records    Int       @default(0)
  error      String?
}
```

## 🔄 Prisma Commands

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate deploy
```

### Create New Migration

```bash
npx prisma migrate dev --name migration_name
```

### View Database in Prisma Studio

```bash
npx prisma studio
```

## 📊 Data Fields

Each district record contains:

- `Wages` - Average wages
- `month` - Current month
- `fin_year` - Financial year
- `Total_No_of_Workers` - Total workers
- `Women_Persondays` - Women participation
- `SC_persondays`, `ST_persondays` - Inclusion metrics
- `Number_of_Ongoing_Works` - Active works
- `Number_of_Completed_Works` - Completed works
- `Average_days_of_employment_provided_per_Household` - Avg employment days
- And 20+ more metrics

## 🎯 Key Services

### mgnregaService.js

Handles all MGNREGA data operations:

- `fetchDistrictData(district, state)` - Fetch single district
- Caching layer
- Database upsert operations
- Error handling and fallbacks

### autoUpdateJob.js

Scheduled job service:

- Runs daily at configured time
- Iterates through all states/districts
- Creates sync logs
- Tracks success/failure metrics

## 🚨 Error Handling

### Common Errors & Solutions

**Error**: `Can't reach database server`

```bash
# Solution: Test connection
node test-connection.mjs
```

**Error**: `API returned no data`

- Check API credentials
- Verify district/state names are valid
- Check API rate limits

**Error**: `CORS error from frontend`

- Update frontend API URL
- Check CORS configuration
- Verify server is running

## 📈 Performance Optimization

### Database Indexes

- `state_name` - Fast state lookups
- `district_name` - Fast district lookups
- `state_name_district_name` - Unique constraint

### Caching

- In-memory caching with optional Redis
- 24-hour cache expiry
- Automatic invalidation on updates

### Connection Pooling

- PgBouncer for pooling (DATABASE_URL)
- Direct connection for long operations (DIRECT_URL)

## 🔐 Security

✅ Environment variables for sensitive data
✅ No credentials in code
✅ API key rotation ready
✅ Input validation
✅ SQL injection prevention (Prisma)
✅ HTTPS ready for production

## 📦 Building for Production

```bash
npm run build
npm start
```

Set NODE_ENV=production in production deployment.

## 🚀 Deployment

### Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure production database URL
- [ ] Set API keys securely
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up health check endpoint
- [ ] Monitor logs and errors
- [ ] Schedule regular backups

### Example: Deploy to Heroku

```bash
git push heroku main
```

## 📞 Support

For issues:

1. Check test-connection.mjs output
2. Review error logs
3. Check GitHub issues
4. Contact development team

## 📄 License

MIT License

## 🔄 Version Info

- **Current Version**: 1.0.0
- **Last Updated**: November 16, 2025
- **Status**: Production Ready

---

**Note**: Always backup database before running migrations!
