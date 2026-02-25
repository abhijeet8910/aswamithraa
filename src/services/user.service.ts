import api from "./api";

export const userService = {
    getProfile: async () => {
        const res = await api.get("/users/profile");
        return res.data.data;
    },

    updateProfile: async (data: any) => {
        const res = await api.patch("/users/profile", data);
        return res.data.data;
    },

    applyForApproval: async () => {
        const res = await api.post("/users/profile/apply");
        return res.data.data;
    },

    getAllUsers: async (params: { role?: string; search?: string; page?: number; limit?: number } = {}) => {
        const res = await api.get("/users", { params });
        return res.data.data;
    },

    verifyUser: async (id: string) => {
        const res = await api.patch(`/users/${id}/verify`);
        return res.data.data;
    },

    blockUser: async (id: string) => {
        const res = await api.patch(`/users/${id}/block`);
        return res.data.data;
    },

    getVerifiedFarmers: async (filters?: { district?: string; state?: string; village?: string; mandal?: string; category?: string }) => {
        const res = await api.get("/users/farmers", { params: filters });
        return res.data.data;
    },

    getStats: async () => {
        const res = await api.get("/users/stats");
        return res.data.data;
    },

    getPendingApplications: async (status: string = 'pending') => {
        const res = await api.get("/users/applications", { params: { status } });
        return res.data.data;
    },

    handleApplication: async (id: string, status: 'approved' | 'rejected', note?: string) => {
        const res = await api.patch(`/users/${id}/application`, { status, note });
        return res.data.data;
    },
};
