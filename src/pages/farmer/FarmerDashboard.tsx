import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Package, ShoppingCart, CreditCard, TrendingUp, ArrowUpRight,
  MapPin, Loader2, AlertCircle, CheckCircle, Clock, XCircle, Send
} from "lucide-react";
import FarmerProducts from "./components/FarmerProducts";
import FarmerOrders from "./components/FarmerOrders";
import FarmerPayments from "./components/FarmerPayments";
import FarmerAnalytics from "./components/FarmerAnalytics";
import FarmerNotification from "./components/FarmerNotification";
import FarmerSettings from "./components/FarmerSettings";
import { useAuth } from "@/context/AuthContext";
import { productService } from "@/services/product.service";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";

const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({
    products: 0, orders: 0, pendingPayments: 0, totalEarnings: 0,
    totalCommission: 0, grossRevenue: 0, estimatedTraditionalRevenue: 0, advantageOverTraditional: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const appStatus = user?.applicationStatus || 'none';
  const needsProfile = !user?.address?.city || !user?.farmLocation;
  const isApproved = user?.isVerified || appStatus === 'approved';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [prods, dashboard] = await Promise.all([
          productService.getMyProducts().catch(() => []),
          orderService.getFarmerDashboard().catch(() => ({})),
        ]);

        const productList = prods || [];

        setStats({
          products: dashboard.totalProducts ?? productList.length,
          orders: dashboard.totalSold ?? 0,
          pendingPayments: dashboard.pendingPayments ?? 0,
          totalEarnings: dashboard.totalEarnings ?? 0,
          totalCommission: dashboard.totalCommission ?? 0,
          grossRevenue: dashboard.grossRevenue ?? 0,
          estimatedTraditionalRevenue: dashboard.estimatedTraditionalRevenue ?? 0,
          advantageOverTraditional: dashboard.advantageOverTraditional ?? 0,
        });

        setRecentProducts(productList.slice(0, 4));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleApply = async () => {
    setApplying(true);
    try {
      await userService.applyForApproval();
      await updateUser();
    } catch (err: any) {
      console.error("Apply error:", err);
    } finally {
      setApplying(false);
    }
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 50) return "Low Stock";
    return "Available";
  };

  const statusBadge = (status: string) => {
    if (status === "Available") return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{status}</span>;
    if (status === "Low Stock") return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">{status}</span>;
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{status}</span>;
  };

  // If not approved, intercept "products" tab
  const handleTabChange = (tab: string) => {
    if (tab === "products" && !isApproved) {
      setActiveTab("dashboard"); // stay on dashboard
      return;
    }
    setActiveTab(tab);
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-8 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="relative z-10 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Farmer Dashboard</h1>
                <p className="text-emerald-50 text-base opacity-90 font-medium">Manage your produce and track your earnings</p>
              </div>
            </div>
          </div>

          {/* Profile Completion Banner */}
          {needsProfile && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Complete Your Profile</h3>
                <p className="text-sm text-orange-700 mt-0.5">Please update your address and farm location to get started.</p>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-medium hover:bg-orange-700 transition"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {/* Application Status Banners */}
          {appStatus === 'none' && !needsProfile && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <Send className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800">Apply to Sell</h3>
                <p className="text-sm text-blue-700 mt-0.5">Submit your application to start listing and selling your produce on the platform.</p>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                  {applying ? "Submitting..." : "Apply to Sell"}
                </button>
              </div>
            </div>
          )}

          {appStatus === 'pending' && !user?.isVerified && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">Application Under Review</h3>
                <p className="text-sm text-yellow-700 mt-0.5">Your application to sell is being reviewed by admin. You'll be notified once approved.</p>
                <button
                  onClick={() => updateUser()}
                  className="mt-2 text-xs font-semibold text-yellow-700 underline hover:text-yellow-900"
                >
                  Refresh Status
                </button>
              </div>
            </div>
          )}

          {appStatus === 'rejected' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Application Rejected</h3>
                {user?.applicationNote && (
                  <p className="text-sm text-red-700 mt-0.5">Reason: {user.applicationNote}</p>
                )}
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  Re-apply
                </button>
              </div>
            </div>
          )}

          {isApproved && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Approved Seller</h3>
                <p className="text-sm text-green-700">You're verified to sell on the platform. Start listing your products!</p>
              </div>
            </div>
          )}

          {user?.farmLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>{user.farmLocation}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Products", value: String(stats.products), icon: Package, delta: "Listed products", up: true },
                  { label: "Total Orders", value: String(stats.orders), icon: ShoppingCart, delta: "Received orders", up: true },
                  { label: "Pending Payments", value: `₹${stats.pendingPayments.toLocaleString()}`, icon: CreditCard, delta: "Awaiting clearance", up: false },
                  { label: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString()}`, icon: TrendingUp, delta: "Completed payments", up: true },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  // Vibrant color arrays for metrics
                  const bgGradients = [
                    "from-emerald-500 to-teal-400",
                    "from-blue-500 to-indigo-400",
                    "from-amber-400 to-orange-400",
                    "from-purple-500 to-pink-500"
                  ];
                  return (
                    <div key={stat.label} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradients[idx]} shadow-lg text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.up ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          <ArrowUpRight className={`w-3 h-3 ${stat.up ? "" : "rotate-90"}`} />
                          {stat.up ? "Up" : "Wait"}
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-sm font-semibold text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white border text-gray-900 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
                <div className="flex justify-between items-center p-5 border-b">
                  <h3 className="font-semibold text-gray-800">My Products</h3>
                  {isApproved && (
                    <button onClick={() => setActiveTab("products")} className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow hover:shadow-md">
                      View All
                    </button>
                  )}
                </div>

                {!isApproved ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Complete your profile and get approved to start listing products.
                  </div>
                ) : recentProducts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No products listed yet. Add your first product!</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {["Product", "Price", "Stock", "Status"].map((h) => (
                            <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.map((p: any) => (
                          <tr key={p._id} className="hover:bg-green-50 transition">
                            <td className="px-5 py-3 text-sm font-medium">{p.name}</td>
                            <td className="px-5 py-3 text-sm font-semibold">₹{p.price}/{p.unit}</td>
                            <td className="px-5 py-3 text-sm">{p.stock} {p.unit}</td>
                            <td className="px-5 py-3">{statusBadge(getStatus(p.stock))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "products" && isApproved && <FarmerProducts />}
      {activeTab === "products" && !isApproved && (
        <div className="text-center py-20 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Products Locked</h3>
          <p className="text-sm">You need admin approval before you can add products.</p>
        </div>
      )}
      {activeTab === "orders" && <FarmerOrders />}
      {activeTab === "payments" && <FarmerPayments />}
      {activeTab === "analytics" && <FarmerAnalytics />}
      {activeTab === "notifications" && <FarmerNotification />}
      {activeTab === "settings" && <FarmerSettings />}
    </DashboardLayout>
  );
};

export default FarmerDashboard;