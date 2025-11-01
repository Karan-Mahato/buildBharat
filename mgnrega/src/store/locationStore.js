import { create } from "zustand";

export const useLocationStore = create((set) =>({
    state: null,
    district: null,
    coords: null,
    setLocations: (data) =>set(data),
}));