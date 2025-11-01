import { useState, useEffect } from "react";
import { Home as HomeIcon, MapPin, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { detectLocation } from "../utils/locationDetector";
// Language options
const LANGUAGES = ['en', 'hi'];
const LANGUAGE_NAMES = { en: 'English', hi: 'हिन्दी' };

export default function Home({ 
  selectedState, 
  setSelectedState, 
  selectedDistrict, 
  setSelectedDistrict,
  onNavigateToDashboard,
  onNavigateToHelp,
  statesData,
  language,
  setLanguage
}) {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [detecting, setDetecting] = useState(false);

  // Normalize state name to match statesData keys
  const normalizeState = (stateName) => {
    if (!stateName) return "";
    
    // Map ISO codes and common variations to proper state names
    const stateMap = {
      // ISO codes
      'IN-DL': 'Delhi',
      'IN-JH': 'Jharkhand',
      'IN-AP': 'Andhra Pradesh',
      'IN-AR': 'Arunachal Pradesh',
      'IN-AS': 'Assam',
      'IN-BR': 'Bihar',
      'IN-CT': 'Chhattisgarh',
      'IN-GA': 'Goa',
      'IN-GJ': 'Gujarat',
      'IN-HR': 'Haryana',
      'IN-HP': 'Himachal Pradesh',
      'IN-JK': 'Jammu and Kashmir',
      'IN-KA': 'Karnataka',
      'IN-KL': 'Kerala',
      'IN-MP': 'Madhya Pradesh',
      'IN-MH': 'Maharashtra',
      'IN-MN': 'Manipur',
      'IN-ML': 'Meghalaya',
      'IN-MZ': 'Mizoram',
      'IN-NL': 'Nagaland',
      'IN-OR': 'Odisha',
      'IN-PB': 'Punjab',
      'IN-RJ': 'Rajasthan',
      'IN-SK': 'Sikkim',
      'IN-TN': 'Tamil Nadu',
      'IN-TS': 'Telangana',
      'IN-TR': 'Tripura',
      'IN-UP': 'Uttar Pradesh',
      'IN-UK': 'Uttarakhand',
      'IN-WB': 'West Bengal',
      'IN-AN': 'Andaman and Nicobar Islands',
      'IN-CH': 'Chandigarh',
      'IN-DH': 'Dadra and Nagar Haveli and Daman and Diu',
      'IN-LA': 'Ladakh',
      'IN-LD': 'Lakshadweep',
      'IN-PY': 'Puducherry',
      
      // Common variations
      'Delhi': 'Delhi',
      'Delhi NCR': 'Delhi',
      'New Delhi': 'Delhi',
      'National Capital Territory': 'Delhi',
      'NCT of Delhi': 'Delhi',
      'Jharkhand': 'Jharkhand',
      'jharkhand': 'Jharkhand',
      'JHARKHAND': 'Jharkhand',
      'Jharkhand State': 'Jharkhand',
      'Andhra Pradesh': 'Andhra Pradesh',
      'AP': 'Andhra Pradesh',
    };
    
    // Check state map first
    const mappedState = stateMap[stateName];
    if (mappedState && statesData[mappedState]) {
      return mappedState;
    }
    
    // Try exact match
    if (statesData[stateName]) return stateName;
    
    // Try case-insensitive match
    const stateKeys = Object.keys(statesData || {});
    const matched = stateKeys.find(
      key => key.toLowerCase() === stateName.toLowerCase()
    );
    if (matched) return matched;
    
    // Try partial match (e.g., "Delhi" matches "Delhi")
    const partialMatch = stateKeys.find(
      key => key.toLowerCase().includes(stateName.toLowerCase()) ||
             stateName.toLowerCase().includes(key.toLowerCase())
    );
    if (partialMatch) return partialMatch;
    
    // Don't fallback to first state - return empty if no match found
    console.warn(`State "${stateName}" not found in available states`);
    return "";
  };

  // Normalize district name
  const normalizeDistrict = (districtName, state) => {
    if (!districtName || !state || !statesData[state]) return "";
    
    const availableDistricts = statesData[state] || [];
    const lowerDistrictName = districtName.toLowerCase().trim();
    
    // Map common variations and nicknames
    const districtMap = {
      // Jharkhand
      'ranchi': 'Ranchi',
      'रांची': 'Ranchi',
      'east singhbhum': 'East Singhbhum',
      'east singhbum': 'East Singhbhum',
      'purba singhbhum': 'East Singhbhum',
      'west singhbhum': 'West Singhbhum',
      'west singhbum': 'West Singhbhum',
      'pashchim singhbhum': 'West Singhbhum',
      'SARAIKELA KHARSAWAN': 'Seraikela Kharsawan',
      'SARAIKELA KHARSAWAN': 'Seraikela Kharsawan',
      'dhanbad': 'Dhanbad',
      'bokaro': 'Bokaro',
      'jamshedpur': 'East Singhbhum', // Jamshedpur is in East Singhbhum
      
      // Delhi - match "Delhi" to appropriate district
      'delhi': 'New Delhi', // Default to New Delhi
      'new delhi': 'New Delhi',
      'old delhi': 'Central Delhi',
      'north delhi': 'North Delhi',
      'south delhi': 'South Delhi',
      'east delhi': 'East Delhi',
      'west delhi': 'West Delhi',
      'central delhi': 'Central Delhi',
    };
    
    // Check mapped names first
    if (districtMap[lowerDistrictName]) {
      const mapped = availableDistricts.find(
        d => d === districtMap[lowerDistrictName]
      );
      if (mapped) return mapped;
    }
    
    // Try exact match (case-insensitive)
    const exactMatch = availableDistricts.find(
      d => d.toLowerCase() === lowerDistrictName
    );
    if (exactMatch) return exactMatch;
    
    // Try partial match - check if detected name contains district name or vice versa
    const partialMatch = availableDistricts.find(
      d => {
        const lowerD = d.toLowerCase();
        return lowerD.includes(lowerDistrictName) || 
               lowerDistrictName.includes(lowerD);
      }
    );
    if (partialMatch) return partialMatch;
    
    // Try matching without special characters and spaces
    const cleanDistrict = lowerDistrictName.replace(/[^\w]/g, '');
    const cleanMatch = availableDistricts.find(
      d => d.toLowerCase().replace(/[^\w]/g, '') === cleanDistrict
    );
    if (cleanMatch) return cleanMatch;
    
    // Try word-by-word matching
    const districtWords = lowerDistrictName.split(/\s+/);
    const wordMatch = availableDistricts.find(
      d => {
        const dWords = d.toLowerCase().split(/\s+/);
        return districtWords.some(w => dWords.includes(w)) ||
               dWords.some(w => districtWords.includes(w));
      }
    );
    if (wordMatch) return wordMatch;
    
    // No match found - return empty string (don't fallback to first district)
    console.warn(`District "${districtName}" not found in available districts for ${state}`);
    return "";
  };

  const handleDetectLocation = async () => {
    try {
      setDetecting(true);
      
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        alert(t("locationFailed") + "\n" + "Geolocation is not supported by your browser. Please select location manually.");
        setDetecting(false);
        return;
      }

      // Request location permission with error handling
      let position;
      try {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              // Handle different types of geolocation errors
              let errorMessage = t("locationFailed");
              
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = t("locationFailed") + "\n\n" + 
                    "Location access was denied. Please:\n" +
                    "1. Allow location access in your browser settings\n" +
                    "2. Or select your location manually from the dropdown";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = t("locationFailed") + "\n\n" + 
                    "Location information is unavailable. Please select your location manually.";
                  break;
                case error.TIMEOUT:
                  errorMessage = t("locationFailed") + "\n\n" + 
                    "Location request timed out. Please try again or select location manually.";
                  break;
                default:
                  errorMessage = t("locationFailed") + "\n\n" + 
                    "Could not detect your location. Please select it manually from the dropdown.";
                  break;
              }
              reject(new Error(errorMessage));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
      } catch (geoError) {
        // Show error message to user
        alert(geoError.message || t("locationFailed"));
        setDetecting(false);
        return;
      }

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding with the coordinates we already have
      let detected;
      try {
        // Use backend proxy to avoid CORS issues
        const backendOrigin = `${window.location.protocol}//${window.location.hostname}:5000`;
        const geoRes = await fetch(
          `${backendOrigin}/api/reverse-geocode?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
          { cache: "no-store" }
        );
        
        let data;
        if (geoRes.ok) {
          data = await geoRes.json();
        } else {
          console.warn("Backend reverse-geocode proxy failed, falling back to direct Nominatim", geoRes.status);
          const directRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          data = await directRes.json();
        }

        // Extract state and district from Nominatim response
        const addr = data?.address || {};
        const state_name =
          addr.state ||
          addr.region ||
          addr.state_district ||
          addr['ISO3166-2-lvl4'] ||
          addr.county ||
          null;

        const district =
          addr.county ||
          addr.district ||
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          null;

        detected = {
          latitude,
          longitude,
          state_name: state_name || null,
          district: district || null
        };
      } catch (reverseGeoError) {
        console.error("Reverse geocoding error:", reverseGeoError);
        alert(
          t("locationFailed") + "\n\n" +
          "Could not determine your location from coordinates.\n" +
          "Please select your location manually from the dropdown."
        );
        setDetecting(false);
        return;
      }
      
      if (!detected || !detected.state_name || !detected.district) {
        alert(
          t("locationFailed") + "\n\n" +
          "Could not determine your state/district from location.\n" +
          "Please select your location manually from the dropdown."
        );
        setDetecting(false);
        return;
      }

      console.log("Detected location:", detected);
      
      // Normalize and match the detected location
      const normalizedState = normalizeState(detected.state_name);
      const normalizedDistrict = normalizeDistrict(detected.district, normalizedState);

      // Automatically populate dropdowns if match found (no alert, no auto-submit)
      if (normalizedState && normalizedDistrict) {
        setSelectedState(normalizedState);
        setSelectedDistrict(normalizedDistrict);
        console.log(`Location detected and selected: ${normalizedDistrict}, ${normalizedState}`);
      } else if (normalizedState) {
        // State found but district not matched - still set the state
        setSelectedState(normalizedState);
        alert(
          "Location partially detected!\n\n" +
          `State: ${normalizedState}\n` +
          `District "${detected.district}" not found.\n\n` +
          "Please select your district manually from the dropdown."
        );
      } else {
        alert(
          t("locationFailed") + "\n\n" +
          `Detected: ${detected.district}, ${detected.state_name}\n` +
          "Could not match with available locations.\n\n" +
          "Please select your location manually from the dropdown."
        );
      }
    } catch (error) {
      console.error("Location detection error:", error);
      // Show error to user if it's not already handled
      if (error.message && !error.message.includes("PERMISSION_DENIED") && 
          !error.message.includes("POSITION_UNAVAILABLE") && 
          !error.message.includes("TIMEOUT")) {
        alert(t("locationFailed") + "\n\n" + "Please select your location manually from the dropdown.");
      }
    } finally {
      setDetecting(false);
    }
  };

  const handleViewProgress = () => {
    if (selectedState && selectedDistrict && onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4">
      {isOffline && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm">
          {t("offlineMessage")}
        </div>
      )}
      
      <header className="text-center mb-8 pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white px-3 py-2 rounded-full shadow-md border-2 border-green-200 font-semibold text-sm"
            >
              {LANGUAGES?.map(code => (
                <option key={code} value={code}>
                  {LANGUAGE_NAMES?.[code] || code}
                </option>
              )) || (
                <>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </>
              )}
            </select>
          </div>
          <HomeIcon className="w-8 h-8 text-green-700" />
        </div>
        
        <h1 className="text-2xl font-bold text-green-800 mb-1 leading-tight">
          {t("title")}
        </h1>
        <p className="text-xl text-brown-700 font-semibold">
          {t("stateName")}
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-4">
        <button
          onClick={handleDetectLocation}
          disabled={detecting}
          className="w-full bg-white hover:bg-green-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-green-800 font-semibold py-5 px-6 rounded-2xl shadow-lg border-2 border-green-300 flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-lg">
            {detecting ? t("loading") : t("detectDistrict")}
          </span>
        </button>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-200">
          <label className="block text-gray-700 font-semibold mb-3 text-base">
            {t("selectState")}
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict("");
            }}
            className="w-full p-4 text-lg border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 mb-3"
          >
            <option value="">{t("selectState")}</option>
            {Object.keys(statesData || {}).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {selectedState && (
            <>
              <label className="block text-gray-700 font-semibold mb-3 text-base">
                {t("selectDistrictLabel")}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-4 text-lg border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                <option value="">{t("selectDistrict")}</option>
                {statesData[selectedState]?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button
          onClick={handleViewProgress}
          disabled={!selectedState || !selectedDistrict}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-6 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95 text-lg"
        >
          <span>{t("viewProgress")}</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <footer className="mt-12 text-center space-x-6 text-gray-600">
        <button 
          onClick={onNavigateToHelp}
          className="text-green-700 underline font-semibold"
        >
          {t("help")}
        </button>
        <span>•</span>
        <button className="text-green-700 underline font-semibold">
          {t("about")}
        </button>
      </footer>
    </div>
  );
}
