import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ShoppingCart, CreditCard, TrendingUp, Package, Building2, ArrowUpRight,
  Loader2, AlertCircle, CheckCircle, Clock, XCircle, Send
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Payments from "./components/Payments";
import Delivery from "./components/Delivery";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { userService } from "@/services/user.service";

const orderStatus = (status: string) => {
  const styles: Record<string, string> = {
    Delivered: "bg-green-100 text-green-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Confirmed: "bg-yellow-100 text-yellow-700",
    Pending: "bg-gray-100 text-gray-600",
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
};

const B2BDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ purchases: 0, payments: 0, activeOrders: 0, savings: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [applying, setApplying] = useState(false);
  const { user, updateUser } = useAuth();

  const appStatus = user?.applicationStatus || 'none';
  const needsProfile = !user?.address?.city || !user?.businessName;
  const isApproved = appStatus === 'approved';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [ordersRes, paymentsRes] = await Promise.all([
          orderService.getAll({ limit: 10 }).catch(() => ({ orders: [] })),
          paymentService.getAll({ limit: 100 }).catch(() => ({ payments: [] })),
        ]);

        const orderList = ordersRes?.orders || [];
        const paymentList = paymentsRes?.payments || [];

        const totalPurchases = orderList.reduce((s: number, o: any) => s + o.totalAmount, 0);
        const totalPayments = paymentList.filter((p: any) => p.status === "Completed").reduce((s: number, p: any) => s + p.amount, 0);
        const active = orderList.filter((o: any) => !["Delivered", "Cancelled"].includes(o.status)).length;

        setStats({ purchases: totalPurchases, payments: totalPayments, activeOrders: active, savings: Math.round(totalPurchases * 0.18) });
        setRecentOrders(orderList.slice(0, 5));

        const map: Record<string, number> = {};
        orderList.forEach((o: any) => {
          const m = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short" });
          map[m] = (map[m] || 0) + o.totalAmount;
        });
        setChartData(Object.entries(map).map(([month, spend]) => ({ month, spend })));
      } catch (err) {
        console.error(err);
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

  const handleTabChange = (tab: string) => {
    if ((tab === "orders" || tab === "products") && !isApproved) {
      setActiveTab("dashboard");
      return;
    }
    setActiveTab(tab);
  };

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString()}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "dashboard" && (
        <div className="space-y-8 p-6 bg-[#fafaf9] min-h-screen">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">B2B Procurement</h1>
                <p className="text-blue-50 text-base opacity-90 font-medium">Manage bulk orders, suppliers and analytics</p>
              </div>
              <div className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-bold border border-white/20 shadow-inner">
                <Building2 className="w-4 h-4 text-blue-200" /> Business Account
              </div>
            </div>
          </div>

          {/* Profile Completion Banner */}
          {needsProfile && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Complete Your Profile</h3>
                <p className="text-sm text-orange-700 mt-0.5">Please update your business address and details to get started.</p>
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
                <h3 className="font-semibold text-blue-800">Apply for Bulk Purchase Permission</h3>
                <p className="text-sm text-blue-700 mt-0.5">Submit your application to start purchasing products in bulk at wholesale prices.</p>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                  {applying ? "Submitting..." : "Apply for Bulk Purchase"}
                </button>
              </div>
            </div>
          )}

          {appStatus === 'pending' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Application Under Review</h3>
                <p className="text-sm text-yellow-700 mt-0.5">Your application for bulk purchase is being reviewed by admin. You'll be notified once approved.</p>
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

          {appStatus === 'approved' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Approved for Bulk Purchase</h3>
                <p className="text-sm text-green-700">You can now browse and purchase products in bulk.</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Purchases", value: fmt(stats.purchases), icon: ShoppingCart, color: "from-blue-500 to-indigo-600" },
                  { label: "Payments Made", value: fmt(stats.payments), icon: CreditCard, color: "from-emerald-500 to-green-600" },
                  { label: "Active Orders", value: String(stats.activeOrders), icon: Package, color: "from-orange-400 to-orange-600" },
                  { label: "Est. Savings", value: fmt(stats.savings), icon: TrendingUp, color: "from-purple-500 to-violet-600" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between group">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg text-white transform group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
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

              {chartData.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Monthly Procurement</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Spend"]} />
                      <Bar dataKey="spend" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {recentOrders.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-xl">
                  <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                    {isApproved && (
                      <button onClick={() => setActiveTab("orders")} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">View All</button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          {["Order ID", "Items", "Amount", "Date", "Status"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium text-xs">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((o: any) => (
                          <tr key={o._id} className="border-t hover:bg-blue-50/60 transition">
                            <td className="px-5 py-3 text-xs text-gray-500 font-mono">{o.orderNumber}</td>
                            <td className="px-5 py-3 font-medium">{o.items?.map((i: any) => i.productName).join(", ")}</td>
                            <td className="px-5 py-3 font-semibold">₹{o.totalAmount?.toLocaleString()}</td>
                            <td className="px-5 py-3 text-gray-500">{fmtDate(o.createdAt)}</td>
                            <td className="px-5 py-3">{orderStatus(o.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "orders" && isApproved && <Orders />}
      {activeTab === "orders" && !isApproved && (
        <div className="text-center py-20 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Orders Locked</h3>
          <p className="text-sm">You need admin approval before you can place bulk orders.</p>
        </div>
      )}
      {activeTab === "products" && isApproved && <Products />}
      {activeTab === "products" && !isApproved && (
        <div className="text-center py-20 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Products Locked</h3>
          <p className="text-sm">Get admin approval to browse and purchase products.</p>
        </div>
      )}
      {activeTab === "payments" && <Payments />}
      {activeTab === "delivery" && <Delivery />}
      {activeTab === "analytics" && <Analytics />}
      {activeTab === "settings" && <Settings />}
    </DashboardLayout>
  );
};

export default B2BDashboard;