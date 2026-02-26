import api from "./api";

export const reviewService = {
    getProductReviews: async (productId: string, params: { page?: number; limit?: number } = {}) => {
        const res = await api.get(`/reviews/product/${productId}`, { params });
        return res.data.data;
    },

    createReview: async (data: { productId: string; rating: number; comment?: string }) => {
        const res = await api.post("/reviews", data);
        return res.data.data;
    },

    updateReview: async (id: string, data: { rating: number; comment?: string }) => {
        const res = await api.patch(`/reviews/${id}`, data);
        return res.data.data;
    },

    deleteReview: async (id: string) => {
        const res = await api.delete(`/reviews/${id}`);
        return res.data;
    },
};
