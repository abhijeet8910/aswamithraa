import api from "./api";

export const paymentService = {
    /** Create a Razorpay order (or dummy) for an internal order */
    createOrder: async (orderId: string) => {
        const res = await api.post("/payments/create-order", { orderId });
        return res.data.data;
    },

    /** Verify payment after Razorpay checkout completes */
    verifyPayment: async (data: {
        orderId: string;
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => {
        const res = await api.post("/payments/verify", data);
        return res.data.data;
    },

    /** Fetch all transactions (for admin) */
    getAll: async (params?: { limit?: number; page?: number; status?: string }) => {
        // Fallback to transactions endpoint if /payments doesn't have a GET route yet
        const res = await api.get("/transactions", { params }).catch(() => api.get("/payments", { params }));
        return res.data.data;
    },
};
