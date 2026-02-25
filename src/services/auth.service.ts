import api, { setTokens, clearTokens } from "./api";

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "farmer" | "b2b" | "customer" | "admin";
    // Farmer fields
    farmLocation?: string;
    farmerCategory?: "smallholder" | "bulk";
    locationHierarchy?: {
        village?: string;
        panchayat?: string;
        mandal?: string;
        district?: string;
        state?: string;
    };
    // B2B fields
    businessName?: string;
    gstin?: string;
    pan?: string;
    contactPerson?: string;
    officeAddress?: { street?: string; city?: string; state?: string; pincode?: string };
    warehouseAddress?: { street?: string; city?: string; state?: string; pincode?: string };
    // Shared financial
    upiId?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    address?: { street?: string; city?: string; state?: string; pincode?: string };
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: any;
    accessToken: string;
    refreshToken: string;
}

export const authService = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const res = await api.post("/auth/register", data);
        const { accessToken, refreshToken, user } = res.data.data;
        setTokens(accessToken, refreshToken);
        return { user, accessToken, refreshToken };
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const res = await api.post("/auth/login", data);
        const { accessToken, refreshToken, user } = res.data.data;
        setTokens(accessToken, refreshToken);
        return { user, accessToken, refreshToken };
    },

    logout: async (): Promise<void> => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Ignore errors — clear tokens regardless
        }
        clearTokens();
    },

    getMe: async () => {
        const res = await api.get("/auth/me");
        return res.data.data;
    },
};
