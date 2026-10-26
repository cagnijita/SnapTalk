import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";



export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    unreadMessages: {},
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
        set((state) => {
            const unreadMessages = { ...state.unreadMessages };

            if (selectedUser?._id) {
                delete unreadMessages[String(selectedUser._id)];
            }

            return { selectedUser, unreadMessages };
        });
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

        if (String(get().selectedUser?._id) !== String(userId)) {
            return;
        }

        set({ messages: res.data });
    } catch (error) {
        toast.error(
            error.response?.data?.message || "Something went wrong"
        );
    } finally {
        if (String(get().selectedUser?._id) === String(userId)) {
            set({ isMessagesLoading: false });
        }
    }
},

    sendMessage: async (msgData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;

        //using only for ui
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
    },


subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Prevent duplicate event listeners
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
        const currentUser = useAuthStore.getState().authUser;
        if (!currentUser) return;

        const senderId = String(
            newMessage.senderId?._id ?? newMessage.senderId
        );

        const receiverId = String(
            newMessage.receiverId?._id ?? newMessage.receiverId
        );

        const currentUserId = String(currentUser._id);

        // Ignore messages that aren't addressed to this user
        if (receiverId !== currentUserId) return;

        const { selectedUser, isSoundEnabled } = get();
        const selectedUserId = String(selectedUser?._id ?? "");

        const isSelectedChat = senderId === selectedUserId;

        if (isSelectedChat) {
            // Add the message only if it isn't already present
            set((state) => {
                const exists = state.messages.some(
                    (message) =>
                        String(message._id) === String(newMessage._id)
                );

                if (exists) return state;

                return {
                    messages: [...state.messages, newMessage],
                };
            });
        } else {
            // Increment unread count for the sender
            set((state) => ({
                unreadMessages: {
                    ...state.unreadMessages,
                    [senderId]:
                        (state.unreadMessages[senderId] || 0) + 1,
                },
            }));

            // Play sound only for an unselected conversation
            if (isSoundEnabled) {
                const notificationSound = new Audio(
                    "/sounds/notification.mp3"
                );

                notificationSound.play().catch((error) => {
                    console.log("Notification sound failed:", error);
                });
            }
        }
    });
},


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    }
}));    