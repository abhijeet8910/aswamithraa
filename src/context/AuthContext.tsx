import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, RegisterData, LoginData } from "@/services/auth.service";
import { getAccessToken, clearTokens } from "@/services/api";

export type UserRole = "farmer" | "b2b" | "customer" | "admin" | null;

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface UserLocationHierarchy {
  village?: string;
  panchayat?: string;
  mandal?: string;
  district?: string;
  state?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  // Farmer
  farmLocation?: string;
  farmerCategory?: "smallholder" | "bulk";
  locationHierarchy?: UserLocationHierarchy;
  // B2B
  businessName?: string;
  gstin?: string;
  pan?: string;
  contactPerson?: string;
  officeAddress?: UserAddress;
  warehouseAddress?: UserAddress;
  // Shared financial
  address?: UserAddress;
  upiId?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  // KYC
  applicationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  applicationNote?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData?: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (data: LoginData) => {
    const result = await authService.login(data);
    setUser(result.user as User);
  };

  const register = async (data: RegisterData) => {
    const result = await authService.register(data);
    setUser(result.user as User);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = async (userData?: Partial<User>) => {
    if (userData) {
      setUser((prev) => (prev ? { ...prev, ...userData } : null));
    } else {
      try {
        const freshUser = await authService.getMe();
        setUser(freshUser);
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: (user?.role as UserRole) ?? null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
