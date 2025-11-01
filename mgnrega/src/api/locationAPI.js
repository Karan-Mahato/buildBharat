import { axiosinstance } from "./axiosInstance";

export const fetchStates = async () =>{
    const res = await axiosinstance.get('/api/locations/states');
    return res.data;
};

export const fetchDistricts = async (state_name) =>{
    const res = await axiosinstance.get(`/api/locations/districts${state_name}`, {
        params: { state_name }
    });
    return res.data;
};