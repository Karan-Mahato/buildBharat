import { axiosinstance } from "./axiosInstance";

export const checkHealth = async () => {
    try {
        const response = await axiosinstance.get("/api/health");
        return response.data;
    } catch (err){
        console.error("Health check failed:", err);
        return { status: "error", message: err.message || "Backend not reachable" };   
    }
};