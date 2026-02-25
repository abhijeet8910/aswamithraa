import api from "./api";

export const categoryService = {
    getAll: async () => {
        const res = await api.get("/categories");
        return res.data.data;
    },

    create: async (data: { name: string; description?: string }) => {
        const res = await api.post("/categories", data);
        return res.data.data;
    },

    update: async (id: string, data: any) => {
        const res = await api.patch(`/categories/${id}`, data);
        return res.data.data;
    },

    delete: async (id: string) => {
        const res = await api.delete(`/categories/${id}`);
        return res.data;
    },
};
