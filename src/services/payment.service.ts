import api from "./api";

export const paymentService = {
    create: async (data: any) => {
        const res = await api.post("/payments", data);
        return res.data.data;
    },

    getAll: async (params: { status?: string; page?: number; limit?: number } = {}) => {
        const res = await api.get("/payments", { params });
        return res.data.data; // { payments, pagination }
    },

    getById: async (id: string) => {
        const res = await api.get(`/payments/${id}`);
        return res.data.data;
    },

    getStats: async () => {
        const res = await api.get("/payments/stats");
        return res.data.data;
    },
};
