import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Package, ShoppingCart, CreditCard, TrendingUp, Bell, ArrowUpRight,
  ArrowDownRight, Star, MapPin, Wheat, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import FarmerProducts from "./components/FarmerProducts";
import FarmerOrders from "./components/FarmerOrders";
import FarmerPayments from "./components/FarmerPayments";
import FarmerAnalytics from "./components/FarmerAnalytics";
import FarmerNotification from "./components/FarmerNotification";
import FarmerSettings from "./components/FarmerSettings";

export const earningsData = [
  { month: "Aug", aswamithra: 18500, traditional: 12000 },
  { month: "Sep", aswamithra: 22000, traditional: 14500 },
  { month: "Oct", aswamithra: 19800, traditional: 13200 },
  { month: "Nov", aswamithra: 26500, traditional: 16000 },
  { month: "Dec", aswamithra: 31200, traditional: 18500 },
  { month: "Jan", aswamithra: 28900, traditional: 17800 },
];

const notifications = [
  { type: "sold", icon: CheckCircle, color: "hsl(var(--success))", title: "Product Sold!", desc: "50 kg Tomatoes sold to Ramesh Kumar", time: "2 min ago" },
  { type: "interest", icon: Star, color: "hsl(var(--warning))", title: "Customer Interest", desc: "3 customers interested in your Rice stock", time: "15 min ago" },
  { type: "payment", icon: CreditCard, color: "hsl(var(--info))", title: "Payment Received", desc: "₹4,250 credited via UPI", time: "1 hr ago" },
  { type: "pending", icon: Clock, color: "hsl(var(--muted-foreground))", title: "Order Pending", desc: "B2B order awaiting your confirmation", time: "3 hr ago" },
];

export const products = [
  { name: "Tomatoes", qty: "120 kg", price: "₹35/kg", status: "Available", category: "Vegetables" },
  { name: "Basmati Rice", qty: "500 kg", price: "₹68/kg", status: "Low Stock", category: "Grains" },
  { name: "Onions", qty: "0 kg", price: "₹28/kg", status: "Out of Stock", category: "Vegetables" },
  { name: "Turmeric", qty: "80 kg", price: "₹95/kg", status: "Available", category: "Spices" },
];

export const statusBadge = (status: string) => {
  if (status === "Available") return <span className="badge-success">{status}</span>;
  if (status === "Low Stock") return <span className="badge-warning">{status}</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{status}</span>;
};

const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Farmer Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your produce and track your earnings</p>
          </div>

          {/* Location badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            <span>Rampur Village · Nalgonda Mandal · Telangana · 508001</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Products", value: "12", icon: Package, delta: "+2 this month", up: true, variant: "default" },
              { label: "Products Sold", value: "847 kg", icon: ShoppingCart, delta: "+18% vs last month", up: true, variant: "success" },
              { label: "Pending Payments", value: "₹12,400", icon: CreditCard, delta: "3 transactions", up: false, variant: "warning" },
              { label: "Total Earnings", value: "₹1.84L", icon: TrendingUp, delta: "+24% via ASWAMITHRA", up: true, variant: "accent" },
            ].map((stat) => {
              const Icon = stat.icon;
              const isAccent = stat.variant === "accent";
              const isSuccess = stat.variant === "success";
              return (
                <div
                  key={stat.label}
                  className={isAccent ? "stat-card-accent" : isSuccess ? "stat-card-success" : "stat-card"}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: isAccent || isSuccess ? "hsl(0 0% 100% / 0.2)" : "hsl(var(--primary) / 0.1)",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isAccent || isSuccess ? "white" : "hsl(var(--primary))" }} />
                    </div>
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.8)" : stat.up ? "hsl(var(--success))" : "hsl(var(--warning))" }}
                    >
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </span>
                  </div>
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: isAccent || isSuccess ? "white" : "hsl(var(--foreground))" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-medium mb-0.5"
                    style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.9)" : "hsl(var(--foreground))" }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.7)" : "hsl(var(--muted-foreground))" }}
                  >
                    {stat.delta}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-foreground">Earnings Comparison</h3>
                  <p className="text-xs text-muted-foreground">ASWAMITHRA vs Traditional Sales (₹)</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} /><span className="text-muted-foreground">ASWAMITHRA</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--border))" }} /><span className="text-muted-foreground">Traditional</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorAswa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150,57%,22%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(150,57%,22%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
                  <Area type="monotone" dataKey="aswamithra" stroke="hsl(150,57%,22%)" strokeWidth={2.5} fill="url(#colorAswa)" />
                  <Area type="monotone" dataKey="traditional" stroke="hsl(150,12%,78%)" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Notifications */}
            <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                Recent Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.title} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: n.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground">{n.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                        <div className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground) / 0.7)" }}>{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">My Products</h3>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                + Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["Product", "Category", "Quantity", "Price", "Status"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.name} className="data-table-row">
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{p.name}</td>
                      <td className="px-5 py-3.5"><span className="badge-info">{p.category}</span></td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{p.qty}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{p.price}</td>
                      <td className="px-5 py-3.5">{statusBadge(p.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* products section */}
{activeTab === "products" && (
  <FarmerProducts/>
)}
{/* orders section  */}
{activeTab === "orders" && (
  <FarmerOrders/>
)}

{/* payment section */}
{activeTab === "payments" && (
  <FarmerPayments/>
)}
{/* Analytics Section */}
{activeTab === "analytics" && (
  <FarmerAnalytics/>
)}
{/* Notification Section */}
{activeTab === "notifications" && (
  <FarmerNotification/>
)}

{activeTab === 'settings' && (
  <FarmerSettings/>
)}

    
    </DashboardLayout>
  );
};

export default FarmerDashboard;
