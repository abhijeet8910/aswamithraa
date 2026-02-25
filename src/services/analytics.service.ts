import api from "./api";

export const analyticsService = {
    getOverview: async () => {
        const res = await api.get("/analytics/overview");
        return res.data.data;
    },

    getTimeSeries: async (params: { from?: string; to?: string; interval?: string } = {}) => {
        const res = await api.get("/analytics/time-series", { params });
        return res.data.data;
    },

    exportOrdersCsv: async (params: { status?: string; from?: string; to?: string } = {}) => {
        const res = await api.get("/analytics/export/orders", { params, responseType: "blob" });
        downloadBlob(res.data, "orders.csv");
    },

    exportTransactionsCsv: async (params: { status?: string; from?: string; to?: string } = {}) => {
        const res = await api.get("/analytics/export/transactions", { params, responseType: "blob" });
        downloadBlob(res.data, "transactions.csv");
    },

    exportUsersCsv: async (params: { role?: string } = {}) => {
        const res = await api.get("/analytics/export/users", { params, responseType: "blob" });
        downloadBlob(res.data, "users.csv");
    },
};

function downloadBlob(data: Blob, filename: string) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
