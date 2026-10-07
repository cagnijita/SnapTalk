import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: { name: "John", _id: 123, age: 24 },
    isLoggedIn: false,
    login: () => {
        console.log("login called");
        set({ isLoggedIn: true });
    }
}));