import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from 'react-hot-toast';

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data.user });
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data.user });

            //toast notification
            toast.success("Signed up successfully!");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });

            //toast notification
            toast.success("Logged in successfully!");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");
        }
        catch (error) {
            console.error("Error logging out:", error);
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
toast.success("Profile pic is updated successfully");
        }
        catch (error) {
            console.log("Error min update profile", error);
            toast.error(error.response.data.message);
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    }

}));