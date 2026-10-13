import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast  from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data });
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
    }
}));