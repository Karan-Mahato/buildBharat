import { axiosinstance } from "./axiosInstance";

export const fetchSchemes = async () =>{
    const res = await axiosinstance.get('/api/schemes');
    return res.data;
};

export const fetchSchemeDetails = async (scheme_id) =>{
    const res = await axiosinstance.get(`/api/schemes/${scheme_id}`);
    return res.data;
};