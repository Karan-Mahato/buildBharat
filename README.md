# BuildBharat - MGNREGA Data Dashboard

## 🌾 Project Overview

BuildBharat is a comprehensive data visualization platform for MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) that provides real-time insights into employment, wages, and rural development metrics across India.

### Key Features

- **Multi-State Support**: Data for 28 Indian states and union territories
- **Real-Time Data**: Automatic daily synchronization with government APIs
- **Interactive Dashboard**: Visual metrics and comparisons by state and district
- **Bilingual Interface**: Support for English and Hindi
- **Location Detection**: Auto-detect user location and show relevant data
- **Offline Support**: Works offline with cached data

## 📂 Project Structure

```
buildBharat/
├── backend/              # Node.js/Express server with Prisma ORM
│   ├── src/
│   │   ├── app.js        # Main Express app
│   │   ├── config/       # Database & Redis config
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── jobs/         # Scheduled tasks
│   │   └── routes/       # API routes
│   ├── prisma/           # Database schema
│   ├── package.json
│   └── .env              # Environment variables
├── mgnrega/              # React frontend application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   ├── api/          # API clients
│   │   ├── store/        # State management
│   │   ├── i18n/         # Translations
│   │   └── utils/        # Utilities
│   ├── package.json
│   └── .env.local        # Environment variables
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL (or Supabase for cloud DB)
- Git

### Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update with your database credentials
# DATABASE_URL=postgresql://user:password@host:5432/dbname
# DIRECT_URL=postgresql://user:password@host:5432/dbname

npm run dev
```

### Setup Frontend

```bash
cd mgnrega
npm install

# Create .env.local
echo "VITE_API_BASE_URL=http://localhost:5000" > .env.local

npm run dev
```

Access at: `http://localhost:5173`

## 🔧 Technology Stack

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **node-cron** - Job scheduling
- **Axios** - HTTP requests

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **i18next** - Translations
- **Lucide React** - Icons
- **Axios** - API calls

## 📊 Data Flow

```
Government API
    ↓
Backend (Fetch & Store)
    ↓
PostgreSQL Database
    ↓
Frontend Dashboard
    ↓
User Browser
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/postgres

# API
MGNREGA_API_URL=https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722
MGNREGA_API_KEY=your_api_key_here

# Server
PORT=5000
NODE_ENV=production

# Scheduler
CRON_SCHEDULE=0 6 * * *

# Cache (optional)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
```

## 📋 Available Commands

### Backend

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run start            # Start production server
node test-job.mjs        # Run full data sync for all states
node check-sync-status.mjs  # Check database sync status
node test-connection.mjs # Test database connection
```

### Frontend

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## 📡 API Endpoints

### States & Districts

- `GET /api/states` - Get all states
- `GET /api/states/:state/districts` - Get districts of a state
- `GET /api/states/:state/districts/:district` - Get district metrics

### Location Services

- `GET /api/reverse-geocode?lat=&lon=` - Get state/district from coordinates

### Data Management

- `GET /api/health` - Health check

## 🗄️ Database Schema

### DistrictData

Stores MGNREGA metrics for each state-district combination:

- Wages data
- Employment metrics
- Work statistics
- Inclusion metrics
- Governance metrics

### SyncLog

Tracks synchronization history:

- Status (running, completed, failed)
- Records processed
- Error messages if any

## 🔄 Automated Data Sync

### Daily Schedule

- **Time**: 6 AM IST (configurable via CRON_SCHEDULE)
- **Scope**: All 28 states and their districts
- **Source**: Government MGNREGA API

### Manual Sync

```bash
cd backend
node test-job.mjs
```

### Monitoring

```bash
node check-sync-status.mjs
```

## 📊 Metrics Displayed

### Employment

- Total workers
- Active workers
- Families worked
- 100-day employment completion

### Wages

- Average wage rate
- Timely payment percentage
- Total wages paid

### Works

- Ongoing works
- Completed works
- Total works taken up

### Inclusion

- Women participation %
- SC/ST participation %

### Governance

- Job cards issued
- Active job cards
- Government participation metrics

## 🌍 Supported Regions

**States**: Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal

**Union Territories**: Andaman & Nicobar, Chandigarh, Dadra & Nagar Haveli, Ladakh, Lakshadweep, Puducherry

## 🐛 Troubleshooting

### Database Connection Failed

```bash
node backend/test-connection.mjs
```

### API Not Responding

- Check backend is running on port 5000
- Verify CORS configuration
- Check network connectivity

### Data Not Updating

- Check cron job logs
- Run manual sync: `node test-job.mjs`
- Verify API credentials in .env

### Frontend Issues

- Clear browser cache
- Check VITE_API_BASE_URL
- Open browser developer console for errors

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Best Practices

✅ Environment variables for sensitive data
✅ API key rotation recommended
✅ HTTPS in production
✅ CORS properly configured
✅ Input validation on backend
✅ SQL injection prevention via Prisma

## 📈 Performance Metrics

- Frontend bundle size: ~250KB
- Dashboard load time: <2s
- API response time: <500ms
- Database query optimization with indexes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support & Contact

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Government MGNREGA API for data
- OpenStreetMap/Nominatim for reverse geocoding
- React, Vite, and Tailwind communities

---

**Last Updated**: November 16, 2025
**Version**: 1.0.0
**Status**: Active Development
