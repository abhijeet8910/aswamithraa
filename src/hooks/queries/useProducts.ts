/**
 * useProducts — React Query hook for product data
 * ==================================================
 * Replaces manual useState + useEffect + setLoading pattern.
 *
 * FEATURES:
 * - Automatic caching (products are cached for 30 seconds by default)
 * - Deduplication (if 5 components call useProducts(), only 1 API call is made)
 * - Auto-refetch when Socket.io invalidates the "products" query key
 * - Background refetch on window focus
 *
 * USAGE:
 *   const { data: products, isLoading } = useProducts();
 *   const { data, isLoading } = useMyProducts(); // Farmer's own products
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

/**
 * Fetch all products (for customer shop / B2B marketplace).
 * Supports optional filters like category, search, etc.
 */
export const useProducts = (filters?: Record<string, any>) => {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => productService.getAll(filters),
        staleTime: 30 * 1000, // 30 seconds — fresh data without excessive API calls
    });
};

/**
 * Fetch the current farmer's own products.
 * Used in the FarmerProducts component.
 */
export const useMyProducts = () => {
    return useQuery({
        queryKey: ["products", "my"],
        queryFn: () => productService.getMyProducts(),
        staleTime: 15 * 1000, // 15 seconds — farmers need fresher data for their own products
    });
};

/**
 * Mutation hook for creating a new product.
 * Automatically invalidates the products cache on success.
 */
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => productService.create(data),
        onSuccess: () => {
            // Invalidate all product queries so lists refresh
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

/**
 * Mutation hook for updating a product.
 * Automatically invalidates the products cache on success.
 */
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            productService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

/**
 * Mutation hook for deleting a product (soft delete).
 * Automatically invalidates the products cache on success.
 */
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
