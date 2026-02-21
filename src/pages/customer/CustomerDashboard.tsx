import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ShoppingCart, CreditCard, TrendingUp, ArrowUpRight, IndianRupee,
  Sparkles, MapPin, Star, Heart
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const savingsData = [
  { month: "Aug", savings: 620, spent: 3200 },
  { month: "Sep", savings: 890, spent: 4100 },
  { month: "Oct", savings: 750, spent: 3800 },
  { month: "Nov", savings: 1100, spent: 5200 },
  { month: "Dec", savings: 980, spent: 4800 },
  { month: "Jan", savings: 1250, spent: 6100 },
];

const purchases = [
  { product: "Tomatoes", qty: "5 kg", paid: "₹175", market: "₹225", saved: "₹50", farmer: "Ramu Reddy", date: "Jan 20" },
  { product: "Basmati Rice", qty: "10 kg", paid: "₹680", market: "₹820", saved: "₹140", farmer: "Suresh Kumar", date: "Jan 18" },
  { product: "Turmeric", qty: "500g", paid: "₹48", market: "₹65", saved: "₹17", farmer: "Lakshmi Bai", date: "Jan 15" },
  { product: "Onions", qty: "3 kg", paid: "₹84", market: "₹105", saved: "₹21", farmer: "Govind Rao", date: "Jan 12" },
  { product: "Spinach", qty: "2 kg", paid: "₹60", market: "₹80", saved: "₹20", farmer: "Sita Devi", date: "Jan 10" },
];

const featured = [
  { name: "Fresh Tomatoes", price: "₹32/kg", farmer: "Nalgonda", rating: 4.8, emoji: "🍅", tag: "Organic" },
  { name: "Basmati Rice", price: "₹68/kg", farmer: "Warangal", rating: 4.9, emoji: "🌾", tag: "Premium" },
  { name: "Green Chilli", price: "₹45/kg", farmer: "Adilabad", rating: 4.6, emoji: "🌶️", tag: "Fresh" },
  { name: "Turmeric", price: "₹90/kg", farmer: "Nizamabad", rating: 4.7, emoji: "🟡", tag: "Export Quality" },
];

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Customer Dashboard</h1>
            <p className="text-muted-foreground text-sm">Fresh produce, fair prices — straight from the farm</p>
          </div>

          {/* Savings Banner */}
          <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--gradient-success)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "hsl(0 0% 100% / 0.2)" }}>
              🎉
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-lg">You saved ₹1,250 this month!</div>
              <div className="text-sm" style={{ color: "hsl(0 0% 100% / 0.85)" }}>
                That's 18% less than local market prices. Keep shopping smart!
              </div>
            </div>
            <Sparkles className="w-8 h-8 text-white/60 hidden md:block" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Purchases", value: "47", icon: ShoppingCart, delta: "+8 this month", variant: "default" },
              { label: "Amount Spent", value: "₹27,450", icon: CreditCard, delta: "Since joining", variant: "default" },
              { label: "Total Savings", value: "₹5,590", icon: TrendingUp, delta: "vs local market", variant: "success" },
              { label: "Savings %", value: "16.9%", icon: IndianRupee, delta: "Average per purchase", variant: "accent" },
            ].map((stat) => {
              const Icon = stat.icon;
              const isAccent = stat.variant === "accent";
              const isSuccess = stat.variant === "success";
              return (
                <div key={stat.label} className={isAccent ? "stat-card-accent" : isSuccess ? "stat-card-success" : "stat-card"}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: isAccent || isSuccess ? "hsl(0 0% 100% / 0.2)" : "hsl(var(--success) / 0.1)" }}>
                      <Icon className="w-4 h-4" style={{ color: isAccent || isSuccess ? "white" : "hsl(var(--success))" }} />
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
            {/* Savings Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-foreground">Monthly Savings Tracker</h3>
                  <p className="text-xs text-muted-foreground">Savings vs amount spent (₹)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142,70%,35%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(142,70%,35%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v: number, name) => [`₹${v.toLocaleString("en-IN")}`, name === "savings" ? "Saved" : "Spent"]} />
                  <Area type="monotone" dataKey="savings" stroke="hsl(142,70%,35%)" strokeWidth={2.5} fill="url(#colorSavings)" />
                  <Line type="monotone" dataKey="spent" stroke="hsl(38,90%,55%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Featured Products */}
            <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold text-foreground mb-4">Fresh Today 🌿</h3>
              <div className="space-y-3">
                {featured.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className="text-2xl">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {p.farmer}
                        <Star className="w-3 h-3 ml-1 fill-current" style={{ color: "hsl(var(--secondary))" }} />
                        {p.rating}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>{p.price}</div>
                      <span className="badge-success">{p.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Purchase History & Savings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["Product", "Quantity", "Paid", "Market Price", "You Saved", "Farmer", "Date"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.product + p.date} className="data-table-row">
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{p.product}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{p.qty}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{p.paid}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground line-through">{p.market}</td>
                      <td className="px-5 py-3.5"><span className="badge-success">{p.saved}</span></td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.farmer}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab !== "dashboard" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold text-foreground capitalize">{activeTab}</h1>
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        </div>
      )} */}
      {/* SHOP TAB */}
{activeTab === "shop" && (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-foreground">Shop Fresh Products</h1>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {featured.map((p) => (
        <div
          key={p.name}
          className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">{p.emoji}</div>
          <h3 className="font-semibold text-foreground">{p.name}</h3>
          <p className="text-sm text-muted-foreground">{p.farmer}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-primary">{p.price}</span>
            <span className="badge-success">{p.tag}</span>
          </div>

          <button className="mt-4 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{/* ORDERS TAB */}
{activeTab === "orders" && (
  <div>
    <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

    <div className="space-y-4">
      {purchases.map((p) => (
        <div key={p.product} className="bg-card p-4 rounded-lg border border-border">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{p.product}</p>
              <p className="text-sm text-muted-foreground">
                {p.qty} • {p.date}
              </p>
            </div>
            <p className="font-bold">{p.paid}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </DashboardLayout>
  );
};

export default CustomerDashboard;
