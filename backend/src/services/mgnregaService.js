import axios from "axios";
import prisma from "../config/prisma.js";
import { getCache, setCache } from "../utils/cache.js";

const BASE_URL = process.env.MGNREGA_API_URL;
const API_KEY = process.env.MGNREGA_API_KEY;

// Normalize district names to match API format and ensure consistency
const normalizeDistrictName = (name) => {
    if (!name) return "";
    // Remove special chars and extra spaces, convert to uppercase
    return name.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
};

export async function fetchDistrictData(districtName) {
    const normalizedName = normalizeDistrictName(districtName);
    const cacheKey = `mgnrega:${normalizedName.toLowerCase()}`;

    try {
        // Try cache first
        const cache = await getCache(cacheKey);
        if (cache) {
            console.log(`Serving ${normalizedName} from cache`);
            return cache;
        }
    } catch (error) {
        console.log('Cache error (non-fatal):', error.message);
    }

    // Check database
    const record = await prisma.districtData.findUnique({
        where: { district_name: normalizedName }
    });

    if (record) {
        const lastUpdate = new Date(record.last_updated);
        const isRecent = (Date.now() - lastUpdate.getTime() < 24 * 3600 * 1000);
        if (isRecent) {
            console.log(`Serving ${districtName} from db`);
            try {
                await setCache(cacheKey, record.data);
            } catch (error) {
                console.log('Cache set error (non-fatal):', error.message);
            }
            return record.data;
        }
    }

    
    try {
        console.log(`Fetching ${districtName} from API...`);
        // Manually build query string to ensure spaces are encoded as %20 instead of +
        const queryParams = {
            'api-key': API_KEY,
            'format': 'json',
            'filters[state_name]': 'JHARKHAND',
            'filters[district_name]': normalizedName,
            'limit': 1
        };
        
        // Build query string manually, using encodeURIComponent which encodes spaces as %20
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        
        const requestUrl = `${BASE_URL}?${queryString}`;
        console.log('API request:', requestUrl);
        
        const response = await axios.get(requestUrl);
        
        // Log API response structure for debugging
        console.log(`API response for ${normalizedName}:`, {
            status: response.status,
            recordCount: response.data?.records?.length,
            hasData: !!response.data?.records?.[0],
            fields: Object.keys(response.data?.records?.[0] || {})
        });

        const data = response.data?.records?.[0];
        if (!data) {
            console.error(`No data returned for ${normalizedName}. Response:`, 
                JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
            throw new Error("No data from API");
        }

        console.log(`Storing data for ${normalizedName}...`);
        
        // Update cache and database
        try {
            await setCache(cacheKey, data);
        } catch (error) {
            console.log('Cache set error (non-fatal):', error.message);
        }

        const districtCode = data?.district_code ?? data?.district_code?.toString?.() ?? null;
        const upserted = await prisma.districtData.upsert({
            where: { district_name: normalizedName },
            update: {
                data: data,
                last_updated: new Date(),
                ...(districtCode ? { district_code: districtCode } : {})
            },
            create: {
                district_name: normalizedName,
                data: data,
                last_updated: new Date(),
                ...(districtCode ? { district_code: districtCode } : {})
            }
        });

        console.log(`Successfully stored data for ${districtName} (ID: ${upserted.id})`);
        return data;
    } catch (err) {
        if (err.response) {
            // API responded with error
            console.error(`API error for ${districtName}:`, {
                status: err.response.status,
                statusText: err.response.statusText,
                data: err.response.data
            });
        } else {
            // Network/other error
            console.error(`Error fetching ${districtName}:`, err.message);
        }
        
        if (record) {
            console.log(`Serving stale data for ${districtName} due to API error`);
            return record.data;
        }
        return null;
    }
}