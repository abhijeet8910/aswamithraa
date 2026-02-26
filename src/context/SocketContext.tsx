/**
 * Socket.io Context — Real-Time Data Sync
 * ==========================================
 * This context manages the WebSocket connection to the backend.
 *
 * HOW IT WORKS:
 * 1. When a user logs in, we connect to Socket.io and join a private room (userId).
 * 2. The backend emits events when data changes (products, orders, users, etc.).
 * 3. We listen for these events and invalidate the matching React Query cache.
 * 4. React Query automatically re-fetches the stale data, so the UI updates instantly.
 * 5. For notifications, we also show a toast popup using sonner.
 *
 * RESULT: No manual refresh needed. Changes appear across all open tabs/browsers.
 *
 * USAGE: Wrap your app with <SocketProvider> (already done in App.tsx after setup).
 */

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// --- Types ---
interface SocketContextType {
    /** The raw Socket.io client instance (null if not connected) */
    socket: Socket | null;
}

// --- Context ---
const SocketContext = createContext<SocketContextType>({ socket: null });

/**
 * Hook to access the Socket.io connection from any component.
 * Example: const { socket } = useSocket();
 */
export const useSocket = () => useContext(SocketContext);

// --- The backend URL for Socket.io (same as API but without /api/v1) ---
const SOCKET_URL = import.meta.env.PROD
    ? "https://backendofaswamithra-production.up.railway.app"
    : "http://localhost:5000";

/**
 * SocketProvider — Wraps the app and manages the WebSocket lifecycle.
 *
 * When the user is logged in:
 *   - Connects to Socket.io
 *   - Joins the user's private room
 *   - Listens for data-change events and invalidates React Query caches
 *   - Shows toast notifications for new notifications
 *
 * When the user logs out:
 *   - Disconnects from Socket.io cleanly
 */
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    useEffect(() => {
        // --- Only connect when the user is logged in ---
        if (!user?._id) {
            // If user logged out, disconnect existing socket
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // --- Connect to Socket.io ---
        const socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"], // WebSocket first, fallback to polling
            withCredentials: true,
        });

        socketRef.current = socket;

        // --- Join the user's private room so we receive targeted notifications ---
        socket.on("connect", () => {
            console.log("🔌 Socket.io connected:", socket.id);
            socket.emit("join-room", user._id);
        });

        // ════════════════════════════════════════
        // REAL-TIME DATA SYNC LISTENERS
        // Each listener invalidates the matching React Query cache,
        // which triggers an automatic re-fetch of that data.
        // ════════════════════════════════════════

        // --- Product changes (create/update/delete) ---
        socket.on("product:created", () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        });
        socket.on("product:updated", () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        });
        socket.on("product:deleted", () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        });

        // --- Order changes (create/update) ---
        socket.on("order:created", () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        });
        socket.on("order:updated", () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        });

        // --- Payment changes ---
        socket.on("payment:created", () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        });

        // --- User changes (verify/block/unblock) ---
        socket.on("user:updated", () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        });
        socket.on("user:blocked", () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        });

        // --- Notifications (show toast + update notification list) ---
        socket.on("notification", (data: any) => {
            // Show a toast popup so the user sees it immediately
            toast(data.title || "New Notification", {
                description: data.message,
                duration: 5000,
            });
            // Invalidate the notifications cache so the bell icon updates
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });

        // --- Disconnect handler ---
        socket.on("disconnect", () => {
            console.log("🔌 Socket.io disconnected");
        });

        // --- Cleanup: disconnect when component unmounts or user changes ---
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user?._id, queryClient]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
