import { axiosinstance } from "./axiosInstance";

// District name variations mapping (keep in sync with backend)
const districtMapping = {
    'EAST SINGHBUM': ['EAST SINGHBHUM', 'PURBI SINGHBHUM'],
    'WEST SINGHBHUM': ['WEST SINGHBHUM', 'PASHCHIMI SINGHBHUM'],
    'RANCHI':['Ranchi'],
    // Add more mappings as needed
};

// Normalize district names to match API format
export const normalizeDistrictName = (name) => {
    if (!name) return "";
    
    // Remove special characters and extra spaces, convert to uppercase
    const cleaned = name.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
    
    // Check if this is a known variation
    for (const [standard, variations] of Object.entries(districtMapping)) {
        if (variations.includes(cleaned) || standard === cleaned) {
            return standard;
        }
    }
    
    return cleaned;
};

// Get list of available districts
export const fetchAvailableDistricts = async () => {
    try {
        const res = await axiosinstance.get('/api/districts');
        return res.data;
    } catch (error) {
        console.error("Failed to fetch available districts:", error);
        return [];
    }
};

export const fetchDistrictData = async (districtName) => {
    try {
        const normalizedName = normalizeDistrictName(districtName);
        console.log(`Fetching district data for: ${normalizedName}`);
        
        const res = await axiosinstance.get(`/api/districts/${encodeURIComponent(normalizedName)}`);
        
        if (!res.data) {
            throw new Error(`No data found for district: ${normalizedName}`);
        }
        console.log(res.data);
        return res.data;
    } catch (error) {
        // Log the error with available districts if it's a 404
        if (error.response?.status === 404) {
            console.error("District not found:", {
                requested: districtName,
                normalized: normalizeDistrictName(districtName),
                availableDistricts: error.response.data.availableDistricts
            });
        } else {
            console.error("District API Error:", {
                district: districtName,
                normalized: normalizeDistrictName(districtName),
                error: error.response?.data || error.message
            });
        }
        throw error; // Re-throw to let the component handle it
    }
};
