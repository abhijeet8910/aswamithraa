import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ShoppingCart, CreditCard, TrendingUp, Truck, Package, Building2,
  ArrowUpRight, MapPin, CheckCircle, Clock, BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const procurementData = [
  { month: "Aug", spend: 145000, orders: 12 },
  { month: "Sep", spend: 188000, orders: 16 },
  { month: "Oct", spend: 162000, orders: 14 },
  { month: "Nov", spend: 210000, orders: 18 },
  { month: "Dec", spend: 245000, orders: 22 },
  { month: "Jan", spend: 228000, orders: 20 },
];

const recentOrders = [
  { id: "ORD-2401", product: "Basmati Rice", qty: "2000 kg", farmer: "Ramu Reddy, Nalgonda", amount: "₹1,36,000", status: "Delivered", date: "Jan 18" },
  { id: "ORD-2398", product: "Tomatoes", qty: "500 kg", farmer: "Suresh Kumar, Warangal", amount: "₹17,500", status: "In Transit", date: "Jan 20" },
  { id: "ORD-2392", product: "Turmeric", qty: "200 kg", farmer: "Lakshmi Bai, Nizamabad", amount: "₹19,000", status: "Confirmed", date: "Jan 22" },
  { id: "ORD-2390", product: "Onions", qty: "1000 kg", farmer: "Govind Rao, Adilabad", amount: "₹28,000", status: "Pending", date: "Jan 23" },
];

const orderStatus = (status: string) => {
  if (status === "Delivered") return <span className="badge-success">{status}</span>;
  if (status === "In Transit") return <span className="badge-info">{status}</span>;
  if (status === "Confirmed") return <span className="badge-warning">{status}</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{status}</span>;
};

const topProducts = [
  { name: "Basmati Rice", volume: "12,400 kg", savings: "18%", icon: "🌾" },
  { name: "Turmeric", volume: "2,800 kg", savings: "22%", icon: "🟡" },
  { name: "Tomatoes", volume: "5,200 kg", savings: "15%", icon: "🍅" },
  { name: "Onions", volume: "8,000 kg", savings: "12%", icon: "🧅" },
];

const B2BDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">B2B Business Dashboard</h1>
              <p className="text-muted-foreground text-sm">Procurement analytics and order management</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
              <Building2 className="w-3.5 h-3.5" />
              GSTIN: 36AABCS1234F1Z5 · Verified
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Purchases", value: "₹11.78L", icon: ShoppingCart, delta: "+28% this year", variant: "default" },
              { label: "Payments Made", value: "₹10.24L", icon: CreditCard, delta: "87% settled", variant: "success" },
              { label: "Active Orders", value: "6", icon: Package, delta: "2 in transit", variant: "default" },
              { label: "Cost Savings", value: "₹2.14L", icon: TrendingUp, delta: "vs market price", variant: "accent" },
            ].map((stat) => {
              const Icon = stat.icon;
              const isAccent = stat.variant === "accent";
              const isSuccess = stat.variant === "success";
              return (
                <div key={stat.label} className={isAccent ? "stat-card-accent" : isSuccess ? "stat-card-success" : "stat-card"}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: isAccent || isSuccess ? "hsl(0 0% 100% / 0.2)" : "hsl(210 80% 45% / 0.1)" }}>
                      <Icon className="w-4 h-4" style={{ color: isAccent || isSuccess ? "white" : "hsl(210 80% 45%)" }} />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5" style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.7)" : "hsl(var(--success))" }} />
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: isAccent || isSuccess ? "white" : "hsl(var(--foreground))" }}>{stat.value}</div>
                  <div className="text-xs font-medium mb-0.5" style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.9)" : "hsl(var(--foreground))" }}>{stat.label}</div>
                  <div className="text-xs" style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.7)" : "hsl(var(--muted-foreground))" }}>{stat.delta}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Spend Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-foreground">Monthly Procurement</h3>
                  <p className="text-xs text-muted-foreground">Spend & order volume trend</p>
                </div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "hsl(210 80% 45% / 0.1)", color: "hsl(210 80% 45%)" }}>
                  Download CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={procurementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Spend"]} />
                  <Bar dataKey="spend" fill="hsl(210,80%,45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" style={{ color: "hsl(210 80% 45%)" }} />
                Top Procured Items
              </h3>
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    <span className="text-xl">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.volume} procured</div>
                    </div>
                    <span className="badge-success">{p.savings} saved</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Orders</h3>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "hsl(210 80% 45% / 0.1)", color: "hsl(210 80% 45%)" }}>
                + New Order
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["Order ID", "Product", "Quantity", "Farmer", "Amount", "Date", "Status"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="data-table-row">
                      <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{o.id}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{o.product}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{o.qty}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{o.farmer}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{o.amount}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{o.date}</td>
                      <td className="px-5 py-3.5">{orderStatus(o.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

     {/* Orders section */}
     {activeTab === "orders" && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Order Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Track and manage procurement orders
        </p>
      </div>
      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
        + Create Order
      </button>
    </div>

    <div className="bg-card rounded-xl border border-border overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-muted">
          <tr>
            {["Order ID", "Supplier", "Product", "Amount", "Status"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((o) => (
            <tr key={o.id} className="data-table-row">
              <td className="px-5 py-3">{o.id}</td>
              <td className="px-5 py-3">{o.farmer}</td>
              <td className="px-5 py-3">{o.product}</td>
              <td className="px-5 py-3 font-semibold">{o.amount}</td>
              <td className="px-5 py-3">{orderStatus(o.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
{/* products section */}
{activeTab === "products" && (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">
        Product Discovery
      </h1>
      <p className="text-muted-foreground text-sm">
        Explore available farm products for bulk purchase
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { name: "Basmati Rice", farmer: "Ramu Reddy", price: "₹68/kg", stock: "12,000kg" },
        { name: "Turmeric", farmer: "Lakshmi Bai", price: "₹95/kg", stock: "2,800kg" },
        { name: "Tomatoes", farmer: "Suresh Kumar", price: "₹35/kg", stock: "5,200kg" },
      ].map((p) => (
        <div key={p.name} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground">{p.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Supplier: {p.farmer}
          </p>
          <div className="mt-4 text-sm">
            <div>Stock: {p.stock}</div>
            <div className="font-semibold text-primary mt-1">
              {p.price}
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-primary text-white rounded-lg text-sm">
            Place Bulk Order
          </button>
        </div>
      ))}
    </div>
  </div>
)}
{/* payments section */}
{activeTab === "payments" && (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">
        Payments
      </h1>
      <p className="text-muted-foreground text-sm">
        Track settlements and transaction history
      </p>
    </div>

    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {recentOrders.map((p) => (
        <div key={p.id} className="flex justify-between items-center border-b border-border pb-3 last:border-none">
          <div>
            <div className="text-sm font-medium">{p.product}</div>
            <div className="text-xs text-muted-foreground">{p.date}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{p.amount}</div>
            <div className="text-xs text-muted-foreground">Paid</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* delivery section */}
{activeTab === "delivery" && (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">
        Delivery Tracking
      </h1>
      <p className="text-muted-foreground text-sm">
        Monitor shipment and logistics updates
      </p>
    </div>

    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {recentOrders.map((d) => (
        <div key={d.id} className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">{d.product}</div>
            <div className="text-xs text-muted-foreground">
              ETA: 2 days
            </div>
          </div>
          <span className="badge-info">{d.status}</span>
        </div>
      ))}
    </div>
  </div>
)}
{/* analytics seciton */}
{activeTab === "analytics" && (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">
        Procurement Analytics
      </h1>
      <p className="text-muted-foreground text-sm">
        Monthly spend overview
      </p>
    </div>

    <div className="bg-card border border-border rounded-xl p-6">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={procurementData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="spend" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

    </DashboardLayout>
  );
};

export default B2BDashboard;
