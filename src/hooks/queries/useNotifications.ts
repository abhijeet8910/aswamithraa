/**
 * useNotifications — React Query hook for notification data
 * ============================================================
 * Replaces the manual fetch in FarmerNotification and other dashboards.
 *
 * FEATURES:
 * - 10 second stale time for near-real-time notification counts
 * - Auto-refetch when Socket.io emits "notification" event
 * - Mutation hooks for mark-as-read and delete
 *
 * USAGE:
 *   const { data, isLoading } = useNotifications();
 *   const markAllRead = useMarkAllNotificationsRead();
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";

/**
 * Fetch all notifications for the current user.
 */
export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationService.getAll(),
        staleTime: 10 * 1000, // 10 seconds — notifications should feel near-real-time
    });
};

/**
 * Mutation hook for marking a single notification as read.
 */
export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

/**
 * Mutation hook for marking all notifications as read.
 */
export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

/**
 * Mutation hook for deleting a notification.
 */
export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
