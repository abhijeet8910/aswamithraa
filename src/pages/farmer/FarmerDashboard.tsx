import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Package, ShoppingCart, CreditCard, TrendingUp, Bell, ArrowUpRight,
  ArrowDownRight, Star, MapPin, Wheat, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
  { type: "sold", icon: CheckCircle, color: "text-green-600", title: "Product Sold!", desc: "50 kg Tomatoes sold to Ramesh Kumar", time: "2 min ago" },
  { type: "interest", icon: Star, color: "text-yellow-500", title: "Customer Interest", desc: "3 customers interested in your Rice stock", time: "15 min ago" },
  { type: "payment", icon: CreditCard, color: "text-blue-500", title: "Payment Received", desc: "₹4,250 credited via UPI", time: "1 hr ago" },
  { type: "pending", icon: Clock, color: "text-gray-500", title: "Order Pending", desc: "B2B order awaiting your confirmation", time: "3 hr ago" },
];

export const products = [
  { name: "Tomatoes", qty: "120 kg", price: "₹35/kg", status: "Available", category: "Vegetables" },
  { name: "Basmati Rice", qty: "500 kg", price: "₹68/kg", status: "Low Stock", category: "Grains" },
  { name: "Onions", qty: "0 kg", price: "₹28/kg", status: "Out of Stock", category: "Vegetables" },
  { name: "Turmeric", qty: "80 kg", price: "₹95/kg", status: "Available", category: "Spices" },
];

export const statusBadge = (status: string) => {
  if (status === "Available") return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{status}</span>;
  if (status === "Low Stock") return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">{status}</span>;
  return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{status}</span>;
};

const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>

      {activeTab === "dashboard" && (
        <div className="space-y-6">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 rounded-2xl p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
            <p className="text-white/80 text-sm">Manage your produce and track your earnings</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-green-600"/>
            <span>Rampur Village · Nalgonda Mandal · Telangana · 508001</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {[
              { label: "Total Products", value: "12", icon: Package, delta: "+2 this month", up: true },
              { label: "Products Sold", value: "847 kg", icon: ShoppingCart, delta: "+18% vs last month", up: true },
              { label: "Pending Payments", value: "₹12,400", icon: CreditCard, delta: "3 transactions", up: false },
              { label: "Total Earnings", value: "₹1.84L", icon: TrendingUp, delta: "+24% via ASWAMITHRA", up: true },
            ].map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition"
                >

                  <div className="flex justify-between mb-3">

                    <div className="p-2 rounded-lg bg-green-100">
                      <Icon className="w-4 h-4 text-green-700"/>
                    </div>

                    <span className={`flex items-center text-xs font-medium ${stat.up ? "text-green-600" : "text-yellow-600"}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                    </span>

                  </div>

                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.delta}</div>

                </div>
              );
            })}

          </div>

          {/* Chart + Notifications */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-6 shadow-md">

              <div className="flex justify-between mb-4">

                <div>
                  <h3 className="font-semibold text-gray-800">Earnings Comparison</h3>
                  <p className="text-xs text-gray-500">ASWAMITHRA vs Traditional Sales</p>
                </div>

              </div>

              <ResponsiveContainer width="100%" height={220}>

                <AreaChart data={earningsData}>

                  <defs>
                    <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3"/>

                  <XAxis dataKey="month"/>
                  <YAxis/>

                  <Tooltip/>

                  <Area
                    type="monotone"
                    dataKey="aswamithra"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fill="url(#earn)"
                  />

                  <Area
                    type="monotone"
                    dataKey="traditional"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-6 shadow-md">

              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-green-600"/>
                Notifications
              </h3>

              <div className="space-y-3">

                {notifications.map((n) => {

                  const Icon = n.icon;

                  return (
                    <div
                      key={n.title}
                      className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition"
                    >

                      <Icon className={`w-4 h-4 mt-1 ${n.color}`}/>

                      <div className="flex-1">
                        <div className="text-xs font-semibold">{n.title}</div>
                        <div className="text-xs text-gray-500">{n.desc}</div>
                        <div className="text-xs text-gray-400">{n.time}</div>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          {/* Products */}
          <div className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl shadow-md">

            <div className="flex justify-between items-center p-5 border-b">

              <h3 className="font-semibold text-gray-800">My Products</h3>

              <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow hover:shadow-md">
                + Add Product
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-green-50">

                  <tr>
                    {["Product","Category","Quantity","Price","Status"].map((h)=>(
                      <th key={h} className="px-5 py-3 text-xs text-gray-500 text-left">{h}</th>
                    ))}
                  </tr>

                </thead>

                <tbody>

                  {products.map((p)=>(
                    <tr key={p.name} className="hover:bg-green-50 transition">

                      <td className="px-5 py-3 text-sm font-medium">{p.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{p.category}</td>
                      <td className="px-5 py-3 text-sm">{p.qty}</td>
                      <td className="px-5 py-3 text-sm font-semibold">{p.price}</td>
                      <td className="px-5 py-3">{statusBadge(p.status)}</td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

      {activeTab === "products" && <FarmerProducts/>}
      {activeTab === "orders" && <FarmerOrders/>}
      {activeTab === "payments" && <FarmerPayments/>}
      {activeTab === "analytics" && <FarmerAnalytics/>}
      {activeTab === "notifications" && <FarmerNotification/>}
      {activeTab === "settings" && <FarmerSettings/>}

    </DashboardLayout>
  );
};

export default FarmerDashboard;