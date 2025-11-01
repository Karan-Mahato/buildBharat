import { useEffect } from "react";
import { useLocationStore } from "../store/locationStore";
import { detectLocation } from "../utils/locationDetector";

export const useAutoLocation = () => {
    const { setLocations, state, district } = useLocationStore();
    useEffect(() =>{
    const fetchlocation = async () =>{
        const detected = await detectLocation();
        setLocations({
            state: detected.state_name,
            district: detected.district,
            coords: {
                lat: detected.latitude,
                lon: detected.longitude,
            },
        });
        console.log("Detected Location:", detected);
    };
    if(!state || !district) fetchlocation();
    },[]);

    return { state, district };
};