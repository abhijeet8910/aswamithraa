// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider, useAuth } from "@/context/AuthContext";
// import LandingPage from "@/pages/LandingPage";
// import FarmerDashboard from "@/pages/farmer/FarmerDashboard";
// import B2BDashboard from "@/pages/b2b/B2BDashboard";
// import CustomerDashboard from "@/pages/customer/CustomerDashboard";
// import AdminDashboard from "@/pages/admin/AdminDashboard";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const AppRouter = () => {
//   const { isAuthenticated, role } = useAuth();

//   if (!isAuthenticated) {
//     return <LandingPage />;
//   }

//   if (role === "farmer") return <FarmerDashboard />;
//   if (role === "b2b") return <B2BDashboard />;
//   if (role === "customer") return <CustomerDashboard />;
//   if (role === "admin") return <AdminDashboard />;

//   return <LandingPage />;
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <AppRouter />
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import LandingPage from "@/pages/LandingPage";
import FarmerDashboard from "@/pages/farmer/FarmerDashboard";
import B2BDashboard from "@/pages/b2b/B2BDashboard";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AuthForm from "@/components/auth/AuthForm";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/landingPage/ProtectedRoutes";
import Contact from "./pages/landingPage/Contact";

const queryClient = new QueryClient();

// 🔒 Protected Route
// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />
      {/* contact page */}
      <Route path="/contact" element={<Contact />} />

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
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
