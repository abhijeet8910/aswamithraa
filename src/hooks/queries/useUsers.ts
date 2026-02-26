/**
 * useUsers — React Query hook for user/admin data
 * ==================================================
 * Used primarily in the AdminDashboard to fetch user lists,
 * pending applications, stats, and handle user actions.
 *
 * FEATURES:
 * - Auto-refetch when Socket.io emits "user:updated" or "user:blocked"
 * - Mutation hooks for verify, block/unblock, and application handling
 *
 * USAGE:
 *   const { data } = useAllUsers({ role: "farmer" });
 *   const { data } = usePendingApplications();
 *   const blockMutation = useBlockUser();
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

/**
 * Fetch all users (admin only). Supports role and search filters.
 */
export const useAllUsers = (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => userService.getAllUsers(params),
        staleTime: 20 * 1000,
    });
};

/**
 * Fetch pending applications (farmer/B2B).
 * @param status - "pending" | "approved" | "rejected"
 */
export const usePendingApplications = (status: string = "pending") => {
    return useQuery({
        queryKey: ["users", "applications", status],
        queryFn: () => userService.getPendingApplications(status),
        staleTime: 15 * 1000,
    });
};

/**
 * Fetch user stats for admin dashboard (total, by role, verified, blocked).
 */
export const useUserStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats", "users"],
        queryFn: () => userService.getStats(),
        staleTime: 30 * 1000,
    });
};

/**
 * Fetch the current user's profile.
 */
export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: () => userService.getProfile(),
        staleTime: 60 * 1000, // 1 minute — profile doesn't change often
    });
};

/**
 * Mutation: Block/unblock a user (toggles isBlocked).
 */
export const useBlockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.blockUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

/**
 * Mutation: Verify a user.
 */
export const useVerifyUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.verifyUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

/**
 * Mutation: Handle application (approve/reject).
 */
export const useHandleApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, note }: { id: string; status: "approved" | "rejected"; note?: string }) =>
            userService.handleApplication(id, status, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};
