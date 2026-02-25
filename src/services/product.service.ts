import api from "./api";

export interface ProductFilters {
    search?: string;
    category?: string;
    organic?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export const productService = {
    getAll: async (params: ProductFilters = {}) => {
        const res = await api.get("/products", { params });
        return res.data.data; // { products, pagination }
    },

    getById: async (id: string) => {
        const res = await api.get(`/products/${id}`);
        return res.data.data;
    },

    getMyProducts: async () => {
        const res = await api.get("/products/my");
        return res.data.data;
    },

    create: async (data: any) => {
        const res = await api.post("/products", data);
        return res.data.data;
    },

    update: async (id: string, data: any) => {
        const res = await api.patch(`/products/${id}`, data);
        return res.data.data;
    },

    delete: async (id: string) => {
        const res = await api.delete(`/products/${id}`);
        return res.data;
    },
};
