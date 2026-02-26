/**
 * useDashboardStats — React Query hook for dashboard overview stats
 * ===================================================================
 * Fetches aggregated stats used on dashboard overview pages.
 * Auto-refetches when Socket.io invalidates "dashboard-stats" key.
 *
 * USAGE:
 *   const { data: stats, isLoading } = useDashboardStats("farmer");
 */

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import api from "@/services/api";

/**
 * Fetch dashboard stats based on the user's role.
 * Uses the appropriate API endpoint for each role.
 */
export const useDashboardStats = (role: string) => {
    return useQuery({
        queryKey: ["dashboard-stats", role],
        queryFn: async () => {
            if (role === "admin") {
                // Admin gets user stats
                return userService.getStats();
            }
            // Farmer and B2B get their own dashboard stats
            const res = await api.get(`/orders/dashboard-stats`);
            return res.data.data;
        },
        staleTime: 30 * 1000, // 30 seconds
    });
};

/**
 * Fetch order stats (admin only).
 * Returns order counts by status, total revenue, commission totals.
 */
export const useOrderStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats", "orders"],
        queryFn: async () => {
            const res = await api.get("/orders/stats");
            return res.data.data;
        },
        staleTime: 30 * 1000,
    });
};
