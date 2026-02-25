import api from "./api";

export const orderService = {
    create: async (data: any) => {
        const res = await api.post("/orders", data);
        return res.data.data;
    },

    getAll: async (params: { status?: string; page?: number; limit?: number } = {}) => {
        const res = await api.get("/orders", { params });
        return res.data.data;
    },

    getById: async (id: string) => {
        const res = await api.get(`/orders/${id}`);
        return res.data.data;
    },

    updateStatus: async (id: string, status: string) => {
        const res = await api.patch(`/orders/${id}/status`, { status });
        return res.data.data;
    },

    acceptOrder: async (id: string, action: "accept" | "reject") => {
        const res = await api.patch(`/orders/${id}/accept`, { action });
        return res.data.data;
    },

    markPaymentDone: async (id: string) => {
        const res = await api.patch(`/orders/${id}/mark-paid`);
        return res.data.data;
    },

    getStats: async () => {
        const res = await api.get("/orders/stats");
        return res.data.data;
    },

    getFarmerDashboard: async () => {
        const res = await api.get("/orders/dashboard/farmer");
        return res.data.data;
    },

    getCustomerDashboard: async () => {
        const res = await api.get("/orders/dashboard/customer");
        return res.data.data;
    },
};
