# MGNREGA Frontend - React Dashboard

## 🎨 Interactive Dashboard for MGNREGA Data Visualization

A modern, responsive React application for visualizing MGNREGA employment and development metrics across Indian states and districts.

## ⚡ Quick Start

```bash
cd mgnrega
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000" > .env.local

npm run dev

# Access at http://localhost:5173
```

## 📦 Installation

### Prerequisites

- Node.js v18+
- npm or yarn
- Backend server running (http://localhost:5000)

### Dependencies

```bash
npm install
```

### Key Packages

- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `i18next` - Translations (English & Hindi)
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `zustand` - State management

## 🎯 Pages & Components

### Pages

#### Home Page (src/pages/home.jsx)

- State selection dropdown
- District selection dropdown
- Location auto-detection
- Language toggle (English/Hindi)
- **Selected State Display**: Shows 📍 state name below title

#### Dashboard (src/pages/dashboard.jsx)

**Main features:**

- District metrics cards showing:
  - Number of workers
  - Total wages
  - Employment days
  - Women participation
  - SC/ST representation
- Category tabs (Employment, Wages, Works, Inclusion, Governance)
- Trend indicators
- Comparison with state averages
- Share functionality

#### Help Page (src/pages/help.jsx)

- FAQs about MGNREGA
- How to use the dashboard
- Data interpretation guide
- Scheme benefits explanation

#### Share Page (src/pages/share.jsx)

- Share dashboard report
- Generate downloadable reports
- Print functionality

### Components

#### schemeCard.jsx

- Card component for displaying metric information
- Shows metric name, value, and trend

#### schemeList.jsx

- List view of schemes
- Category filtering
- Sorting functionality

## 🌐 API Integration

### API Layer (src/api/)

#### axiosInstance.js

- Configured axios client
- Base URL from env variable
- Error handling and response interceptors

#### districtAPI.js

- Fetch districts for a state
- Fetch district details
- Cache management

#### healthAPI.js

- Health check endpoint
- Backend connectivity verification

#### locationAPI.js

- Reverse geocoding
- Coordinates to location mapping

#### schemesAPI.js

- Fetch schemes data
- Filter by category
- Sort and paginate results

### API Endpoints

```javascript
// Health check
GET /api/health

// Fetch districts for a state
GET /api/states/:state/districts

// Get district data
GET /api/states/:state/districts/:district

// Reverse geocoding
GET /api/reverse-geocode?lat=23.34&lon=85.30

// Fetch schemes
GET /api/schemes?state=Bihar&category=employment
```

## 🎨 Styling

- **Framework**: Tailwind CSS with custom configuration
- **Icons**: Lucide React (ChevronDown, MapPin, etc.)
- **Colors**:
  - Primary: Green (#15803d)
  - Secondary: Amber (#f59e0b)
  - Neutral: Gray (#6b7280)
- **Responsive**: Mobile-first approach with breakpoints at 640px, 1024px, 1280px

### Color Scheme

- Success/Green: Employment success metrics
- Amber/Orange: Warnings and secondary actions
- Blue: Information and details
- Red: Important alerts

## 🌍 Internationalization (i18n)

### Supported Languages

- English (en)
- Hindi (hi)

### Configuration

- Located in `src/i18n/i18n.js`
- Translations in `src/i18n/locales/`
- Language toggle on home page
- Persists user preference to localStorage

### Adding Translations

1. Add key-value pairs to `src/i18n/locales/en.json`
2. Add corresponding Hindi translation to `src/i18n/locales/hi.json`
3. Use `useTranslation()` hook or `t("key")` function

## 📊 Dashboard Metrics

### Employment Category

- Workers engaged
- Families employed
- 100-day completion rate

### Wages Category

- Wage rate
- Timely payment percentage
- Total wages disbursed

### Works Category

- Ongoing works
- Completed works
- Total works

### Inclusion Category

- Women participation
- SC (Scheduled Caste) participation
- ST (Scheduled Tribe) participation

### Governance Category

- Job cards issued
- Active workers
- Enrollment rate

## 🪝 Custom Hooks

### useAutoLocation.js

- Automatic location detection
- Geolocation API integration
- Fallback to manual selection
- Error handling

## 🗂️ State Management

### locationStore.js (Zustand)

```javascript
{
  selectedState: 'Bihar',
  selectedDistrict: 'Patna',
  latitude: 25.5941,
  longitude: 85.1376,
  setSelectedState: (state) => {},
  setSelectedDistrict: (district) => {},
  setLocation: (lat, lon) => {}
}
```

## 📱 Responsive Design

- **Mobile**: 320px - 640px
  - Single column layout
  - Full-width cards
  - Dropdown menus
- **Tablet**: 641px - 1024px
  - Two column layout
  - Larger touch targets
- **Desktop**: 1025px+
  - Multi-column layout
  - Hover effects
  - Grid-based dashboard

## 🛠️ Utilities

### dataTransform.js

- Transform raw API response to dashboard data
- Extract nested metrics from `apiData.data`
- Format numbers for display
- Calculate percentages
- Handle missing values

### locationDetector.js

- Geolocation services
- Reverse geocode coordinates
- Handle permission requests
- Fallback mechanisms

## ⚙️ Build & Deployment

### Development

```bash
npm run dev
```

Starts Vite dev server with HMR on http://localhost:5173

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/`

### Preview Build

```bash
npm run preview
```

Locally preview production build

### Environment Configuration

Create `.env.local`:

```
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=MGNREGA Dashboard
```

## 🐛 Troubleshooting

### API Not Responding

- Check backend running on port 5000
- Verify `VITE_API_BASE_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure backend has correct database credentials

### Data Not Loading

- Open browser DevTools → Network tab
- Check if API calls are returning 200 status
- Clear browser cache (Ctrl+Shift+Delete)
- Verify database has synchronized data
- Check that backend server is running

### Geolocation Not Working

- Enable location permission in browser
- Reload page after granting permission
- Use HTTPS (required for geolocation)
- Manually select state and district as fallback

### Styling Issues

- Clear `.next` or `dist/` folder
- Rebuild: `npm run build`
- Clear browser cache
- Check Tailwind CSS configuration

### Language Not Changing

- Check that localStorage is enabled
- Browser console should show i18n initialization
- Verify locale files exist in `src/i18n/locales/`
- Hard reload page (Ctrl+Shift+R)

## 📦 Project Structure

```
mgnrega/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── api/           # API calls
│   ├── hooks/         # Custom hooks
│   ├── i18n/          # Internationalization
│   ├── store/         # State management
│   ├── utils/         # Utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── data/          # Static data files
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Performance Optimization

- Lazy loading of pages with React.lazy()
- Memoization of expensive components
- Caching of API responses
- Optimized images and assets
- Code splitting for production build

## 📝 Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

## 📚 Dependencies Overview

| Package          | Purpose          | Version |
| ---------------- | ---------------- | ------- |
| react            | UI library       | ^18.2.0 |
| react-router-dom | Routing          | ^6.x    |
| axios            | HTTP requests    | ^1.x    |
| i18next          | Translations     | ^23.x   |
| react-i18next    | i18n integration | ^13.x   |
| tailwindcss      | Styling          | ^3.x    |
| lucide-react     | Icons            | ^latest |
| zustand          | State management | ^4.x    |

## 🔐 Security

- Environment variables for sensitive data
- Input validation on forms
- XSS protection via React
- CORS configuration on backend
- No hardcoded credentials

## 📄 License

MIT License

## 🔄 Version Info

- **Current Version**: 1.0.0
- **Last Updated**: November 16, 2025
- **React Version**: 18.2.0
- **Vite Version**: 5.0.0
- **Node.js**: 18+

## 👥 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📞 Support

For issues and questions:

1. Check troubleshooting section
2. Review backend logs
3. Check API response format
4. Verify environment configuration

## 🎯 Future Enhancements

- [ ] Offline data caching
- [ ] Advanced filtering and search
- [ ] Data export to CSV/Excel
- [ ] Performance analytics
- [ ] Multiple year comparison
- [ ] Email notifications
- [ ] Mobile app version
