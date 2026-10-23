import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => {
        set({ activeTab: tab })
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data })
        } catch (error) {
            toast.error("Error fetching contacts", error);

        } finally {
            set({ isUsersLoading: false });
        }
    },
    getChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data })
        } catch (error) {
            toast.error("Error fetching chats", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (msgData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;

        //using only fi ui
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: msgData.text,
            image: msgData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, msgData);
            set({ messages: get().messages.map(msg => msg._id === tempId ? res.data : msg) });
        }
        catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went  wrong");
            set({ messages: get().messages.filter(msg => msg._id !== tempId) })
        }
    }
}));    