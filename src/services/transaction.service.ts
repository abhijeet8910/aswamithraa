import api from "./api";

export const transactionService = {
    getAll: async (params: { status?: string; paymentMode?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number } = {}) => {
        const res = await api.get("/transactions", { params });
        return res.data.data;
    },

    getById: async (id: string) => {
        const res = await api.get(`/transactions/${id}`);
        return res.data.data;
    },

    markPaid: async (id: string, remarks?: string) => {
        const res = await api.patch(`/transactions/${id}/mark-paid`, { remarks });
        return res.data.data;
    },

    getStats: async () => {
        const res = await api.get("/transactions/stats");
        return res.data.data;
    },
};
