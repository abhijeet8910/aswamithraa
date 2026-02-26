import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SocketProvider } from "@/context/SocketContext";

import LandingPage from "@/pages/LandingPage";
import FarmerDashboard from "@/pages/farmer/FarmerDashboard";
import B2BDashboard from "@/pages/b2b/B2BDashboard";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AuthForm from "@/components/auth/AuthForm";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/landingPage/ProtectedRoutes";
import Contact from "./pages/landingPage/Contact";
import ForgotPassword from "./pages/landingPage/ForgotPassword";
import ResetPassword from "./pages/landingPage/ResetPassword";

// --- Optimized QueryClient for fast data fetching ---
// staleTime: Data stays "fresh" for 30s — prevents redundant API calls
// gcTime: Cache kept for 5 minutes even after components unmount
// refetchOnWindowFocus: Auto-refresh when user returns to tab
// retry: Only retry once on failure (don't hammer the server)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,       // 30 seconds — fast without excessive calls
      gcTime: 5 * 60 * 1000,      // 5 minutes cache retention
      refetchOnWindowFocus: true,  // Refresh when tab regains focus
      retry: 1,                    // One retry on failure
      refetchOnMount: true,        // Always check on mount
    },
  },
});


const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />
      {/* contact page */}
      <Route path="/contact" element={<Contact />} />

      {/* Password Reset */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Auth Pages */}
      <Route
        path="/farmer"
        element={<AuthForm role="farmer" onBack={() => window.history.back()} />}
      />
      <Route
        path="/b2b"
        element={<AuthForm role="b2b" onBack={() => window.history.back()} />}
      />
      <Route
        path="/customer"
        element={<AuthForm role="customer" onBack={() => window.history.back()} />}
      />
      <Route
        path="/admin"
        element={<AuthForm role="admin" onBack={() => window.history.back()} />}
      />

      {/* Dashboards (Protected) */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute role="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/b2b/dashboard"
        element={
          <ProtectedRoute role="b2b">
            <B2BDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
