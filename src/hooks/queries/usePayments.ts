/**
 * usePayments — React Query hook for payment data
 * ==================================================
 * Used in Farmer/B2B payment tabs and admin transaction views.
 *
 * FEATURES:
 * - Auto-refetch when Socket.io emits "payment:created"
 * - 30 second stale time
 *
 * USAGE:
 *   const { data: payments, isLoading } = usePayments();
 */

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";

/**
 * Fetch all payments for the current user.
 * Farmers see payments for their sold products.
 * Admin sees all platform payments.
 */
export const usePayments = (filters?: Record<string, any>) => {
    return useQuery({
        queryKey: ["payments", filters],
        queryFn: () => paymentService.getAll(filters),
        staleTime: 30 * 1000, // 30 seconds
    });
};
