import { fetchStates, fetchDistricts } from "../api/locationAPI";

export const detectLocation = async()=>{
    try{
        if(navigator.geolocation){
            const position = await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 8000,
                })
            );
            const { latitude, longitude } = position.coords;
            
            // Use backend proxy to avoid CORS issues with Nominatim from the browser.
            // Backend runs on port 5000 by default in this project.
            const backendOrigin =import.meta.env.VITE_API_BASE_URl || (window.location.hostname === "localhost"
                ? "http://localhost:5000"
                : "https://buildbharat.onrender.com");
            const geoRes = await fetch(
                `${backendOrigin}/api/reverse-geocode?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
                { cache: "no-store" }
            );
            // If backend proxy fails for any reason, fall back to the direct Nominatim request.
            let data;
            if (geoRes.ok) {
                data = await geoRes.json();
            } else {
                console.warn("Backend reverse-geocode proxy failed, falling back to direct Nominatim", geoRes.status);
                const directRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
                data = await directRes.json();
            }

            // Be defensive: Nominatim's address object can use different keys depending on region.
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

            // If state_name is still missing, log the raw response for debugging and fall back.
            if (!state_name) {
                console.warn("Reverse geocode response missing 'state' field, full data:", data);
            }

            return { 
                latitude, 
                longitude, 
                state_name: state_name || null, 
                district: district || null 
            };
        }

        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        return {
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            state_name: ipData.region,
            district: ipData.city
        };
    }catch (err) {
        console.error("Location detection failed:", err);
        return {
            state_name: null,
            district: null,
            latitude: null,
            longitude: null
        };
    }
};