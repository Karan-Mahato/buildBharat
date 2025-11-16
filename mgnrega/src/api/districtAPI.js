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

// ===== New Multi-State API Functions =====

/**
 * Fetch all available states
 * @returns {Promise<string[]>} Array of state names
 */
export const fetchAllStates = async () => {
    try {
        const res = await axiosinstance.get('/api/states');
        return res.data;
    } catch (error) {
        console.error("Failed to fetch states:", error);
        return [];
    }
};

/**
 * Fetch all districts for a specific state
 * @param {string} stateName - Name of the state
 * @returns {Promise<string[]>} Array of district names
 */
export const fetchDistrictsByState = async (stateName) => {
    try {
        const res = await axiosinstance.get(`/api/states/${encodeURIComponent(stateName)}/districts`);
        return res.data;
    } catch (error) {
        console.error(`Failed to fetch districts for ${stateName}:`, error);
        return [];
    }
};

/**
 * Fetch detailed data for a specific district in a state
 * @param {string} stateName - Name of the state
 * @param {string} districtName - Name of the district
 * @returns {Promise<Object>} District data object
 */
export const fetchDistrictData = async (stateName, districtName) => {
    try {
        const normalizedName = normalizeDistrictName(districtName);
        console.log(`Fetching district data for: ${stateName}/${normalizedName}`);
        
        const res = await axiosinstance.get(
            `/api/states/${encodeURIComponent(stateName)}/districts/${encodeURIComponent(normalizedName)}`
        );
        
        if (!res.data) {
            throw new Error(`No data found for district: ${normalizedName}`);
        }
        console.log(res.data);
        return res.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error("District not found:", {
                state: stateName,
                requested: districtName,
                normalized: normalizeDistrictName(districtName)
            });
        } else {
            console.error("District API Error:", {
                state: stateName,
                district: districtName,
                error: error.response?.data || error.message
            });
        }
        throw error;
    }
};

// ===== Legacy API Functions (Backward Compatibility) =====

/**
 * @deprecated Use fetchAllStates() instead
 * Get list of available districts (legacy endpoint)
 */
export const fetchAvailableDistricts = async () => {
    try {
        const res = await axiosinstance.get('/api/districts');
        return res.data;
    } catch (error) {
        console.error("Failed to fetch available districts:", error);
        return [];
    }
};
