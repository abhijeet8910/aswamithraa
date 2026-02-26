/**
 * useOrders — React Query hook for order data
 * ===============================================
 * Replaces manual useState + useEffect pattern for order fetching.
 *
 * FEATURES:
 * - Auto-cache with 20 second stale time
 * - Auto-refetch when Socket.io emits "order:created" or "order:updated"
 * - Mutation hooks for order actions (accept, reject, update status)
 *
 * USAGE:
 *   const { data: orders, isLoading } = useOrders();
 *   const { data: orders } = useOrders({ status: "Pending" });
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";

/**
 * Fetch orders for the current user (role-contextual).
 * - Farmers see orders for their products
 * - Customers/B2B see their placed orders
 * - Admin sees all orders
 */
export const useOrders = (filters?: Record<string, any>) => {
    return useQuery({
        queryKey: ["orders", filters],
        queryFn: () => orderService.getAll(filters),
        staleTime: 20 * 1000, // 20 seconds
    });
};

/**
 * Fetch a single order by ID.
 * Used in order detail views.
 */
export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => orderService.getById(id),
        enabled: !!id, // Only fetch when id is provided
        staleTime: 15 * 1000,
    });
};

/**
 * Mutation hook for placing a new order.
 * Invalidates orders + dashboard stats on success.
 */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => orderService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};

/**
 * Mutation hook for farmer accepting/rejecting an order.
 */
export const useAcceptOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: "accept" | "reject" }) =>
            orderService.acceptOrder(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};

/**
 * Mutation hook for updating order status.
 * Used by farmers/admin to move orders through the pipeline.
 */
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            orderService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};
