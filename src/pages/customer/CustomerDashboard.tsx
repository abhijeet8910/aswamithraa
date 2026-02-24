// import React, { useState } from "react";
// import DashboardLayout from "@/components/layout/DashboardLayout";
// import {
//   ShoppingCart, CreditCard, TrendingUp, ArrowUpRight, IndianRupee,
//   Sparkles, MapPin, Star, Heart
// } from "lucide-react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// const savingsData = [
//   { month: "Aug", savings: 620, spent: 3200 },
//   { month: "Sep", savings: 890, spent: 4100 },
//   { month: "Oct", savings: 750, spent: 3800 },
//   { month: "Nov", savings: 1100, spent: 5200 },
//   { month: "Dec", savings: 980, spent: 4800 },
//   { month: "Jan", savings: 1250, spent: 6100 },
// ];

// const purchases = [
//   { product: "Tomatoes", qty: "5 kg", paid: "₹175", market: "₹225", saved: "₹50", farmer: "Ramu Reddy", date: "Jan 20" },
//   { product: "Basmati Rice", qty: "10 kg", paid: "₹680", market: "₹820", saved: "₹140", farmer: "Suresh Kumar", date: "Jan 18" },
//   { product: "Turmeric", qty: "500g", paid: "₹48", market: "₹65", saved: "₹17", farmer: "Lakshmi Bai", date: "Jan 15" },
//   { product: "Onions", qty: "3 kg", paid: "₹84", market: "₹105", saved: "₹21", farmer: "Govind Rao", date: "Jan 12" },
//   { product: "Spinach", qty: "2 kg", paid: "₹60", market: "₹80", saved: "₹20", farmer: "Sita Devi", date: "Jan 10" },
// ];

// const featured = [
//   { name: "Fresh Tomatoes", price: "₹32/kg", farmer: "Nalgonda", rating: 4.8, emoji: "🍅", tag: "Organic" },
//   { name: "Basmati Rice", price: "₹68/kg", farmer: "Warangal", rating: 4.9, emoji: "🌾", tag: "Premium" },
//   { name: "Green Chilli", price: "₹45/kg", farmer: "Adilabad", rating: 4.6, emoji: "🌶️", tag: "Fresh" },
//   { name: "Turmeric", price: "₹90/kg", farmer: "Nizamabad", rating: 4.7, emoji: "🟡", tag: "Export Quality" },
// ];

// const CustomerDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   return (
//     <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
//       {activeTab === "dashboard" && (
//         <div className="space-y-6">
//           <div>
//             <h1 className="font-display text-2xl font-bold text-foreground">Customer Dashboard</h1>
//             <p className="text-muted-foreground text-sm">Fresh produce, fair prices — straight from the farm</p>
//           </div>

//           {/* Savings Banner */}
//           <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--gradient-success)" }}>
//             <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "hsl(0 0% 100% / 0.2)" }}>
//               🎉
//             </div>
//             <div className="flex-1">
//               <div className="text-white font-bold text-lg">You saved ₹1,250 this month!</div>
//               <div className="text-sm" style={{ color: "hsl(0 0% 100% / 0.85)" }}>
//                 That's 18% less than local market prices. Keep shopping smart!
//               </div>
//             </div>
//             <Sparkles className="w-8 h-8 text-white/60 hidden md:block" />
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {[
//               { label: "Total Purchases", value: "47", icon: ShoppingCart, delta: "+8 this month", variant: "default" },
//               { label: "Amount Spent", value: "₹27,450", icon: CreditCard, delta: "Since joining", variant: "default" },
//               { label: "Total Savings", value: "₹5,590", icon: TrendingUp, delta: "vs local market", variant: "success" },
//               { label: "Savings %", value: "16.9%", icon: IndianRupee, delta: "Average per purchase", variant: "accent" },
//             ].map((stat) => {
//               const Icon = stat.icon;
//               const isAccent = stat.variant === "accent";
//               const isSuccess = stat.variant === "success";
//               return (
//                 <div key={stat.label} className={isAccent ? "stat-card-accent" : isSuccess ? "stat-card-success" : "stat-card"}>
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: isAccent || isSuccess ? "hsl(0 0% 100% / 0.2)" : "hsl(var(--success) / 0.1)" }}>
//                       <Icon className="w-4 h-4" style={{ color: isAccent || isSuccess ? "white" : "hsl(var(--success))" }} />
//                     </div>
//                     <ArrowUpRight className="w-3.5 h-3.5" style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.7)" : "hsl(var(--success))" }} />
//                   </div>
//                   <div className="text-2xl font-bold mb-1" style={{ color: isAccent || isSuccess ? "white" : "hsl(var(--foreground))" }}>{stat.value}</div>
//                   <div className="text-xs font-medium mb-0.5" style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.9)" : "hsl(var(--foreground))" }}>{stat.label}</div>
//                   <div className="text-xs" style={{ color: isAccent || isSuccess ? "hsl(0 0% 100% / 0.7)" : "hsl(var(--muted-foreground))" }}>{stat.delta}</div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="grid lg:grid-cols-3 gap-6">
//             {/* Savings Chart */}
//             <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
//               <div className="flex items-center justify-between mb-5">
//                 <div>
//                   <h3 className="font-semibold text-foreground">Monthly Savings Tracker</h3>
//                   <p className="text-xs text-muted-foreground">Savings vs amount spent (₹)</p>
//                 </div>
//               </div>
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={savingsData}>
//                   <defs>
//                     <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="hsl(142,70%,35%)" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="hsl(142,70%,35%)" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
//                   <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
//                   <Tooltip formatter={(v: number, name) => [`₹${v.toLocaleString("en-IN")}`, name === "savings" ? "Saved" : "Spent"]} />
//                   <Area type="monotone" dataKey="savings" stroke="hsl(142,70%,35%)" strokeWidth={2.5} fill="url(#colorSavings)" />
//                   <Line type="monotone" dataKey="spent" stroke="hsl(38,90%,55%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Featured Products */}
//             <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
//               <h3 className="font-semibold text-foreground mb-4">Fresh Today 🌿</h3>
//               <div className="space-y-3">
//                 {featured.map((p) => (
//                   <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
//                     <span className="text-2xl">{p.emoji}</span>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-sm font-medium text-foreground">{p.name}</div>
//                       <div className="text-xs text-muted-foreground flex items-center gap-1">
//                         <MapPin className="w-3 h-3" /> {p.farmer}
//                         <Star className="w-3 h-3 ml-1 fill-current" style={{ color: "hsl(var(--secondary))" }} />
//                         {p.rating}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>{p.price}</div>
//                       <span className="badge-success">{p.tag}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Purchase History */}
//           <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
//             <div className="p-5 border-b border-border">
//               <h3 className="font-semibold text-foreground">Purchase History & Savings</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
//                     {["Product", "Quantity", "Paid", "Market Price", "You Saved", "Farmer", "Date"].map((h) => (
//                       <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.map((p) => (
//                     <tr key={p.product + p.date} className="data-table-row">
//                       <td className="px-5 py-3.5 text-sm font-medium text-foreground">{p.product}</td>
//                       <td className="px-5 py-3.5 text-sm text-foreground">{p.qty}</td>
//                       <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{p.paid}</td>
//                       <td className="px-5 py-3.5 text-sm text-muted-foreground line-through">{p.market}</td>
//                       <td className="px-5 py-3.5"><span className="badge-success">{p.saved}</span></td>
//                       <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.farmer}</td>
//                       <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {activeTab !== "dashboard" && (
//         <div className="space-y-6">
//           <h1 className="font-display text-2xl font-bold text-foreground capitalize">{activeTab}</h1>
//           <div className="bg-card rounded-xl border border-border p-12 text-center">
//             <div className="text-5xl mb-4">🛒</div>
//             <p className="text-muted-foreground">This section is under development.</p>
//           </div>
//         </div>
//       )} */}
//       {/* SHOP TAB */}
// {activeTab === "shop" && (
//   <div className="space-y-6">
//     <h1 className="text-2xl font-bold text-foreground">Shop Fresh Products</h1>

//     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {featured.map((p) => (
//         <div
//           key={p.name}
//           className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition"
//         >
//           <div className="text-4xl mb-3">{p.emoji}</div>
//           <h3 className="font-semibold text-foreground">{p.name}</h3>
//           <p className="text-sm text-muted-foreground">{p.farmer}</p>

//           <div className="mt-3 flex items-center justify-between">
//             <span className="font-bold text-primary">{p.price}</span>
//             <span className="badge-success">{p.tag}</span>
//           </div>

//           <button className="mt-4 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
//             Add to Cart
//           </button>
//         </div>
//       ))}
//     </div>
//   </div>
// )}

// {/* ORDERS TAB */}
// {activeTab === "orders" && (
//   <div>
//     <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

//     <div className="space-y-4">
//       {purchases.map((p) => (
//         <div key={p.product} className="bg-card p-4 rounded-lg border border-border">
//           <div className="flex justify-between">
//             <div>
//               <p className="font-semibold">{p.product}</p>
//               <p className="text-sm text-muted-foreground">
//                 {p.qty} • {p.date}
//               </p>
//             </div>
//             <p className="font-bold">{p.paid}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}
//     </DashboardLayout>
//   );
// };

// export default CustomerDashboard;


// "use client";

// import React, { useState } from "react";
// import { Search, MapPin, Home, ShoppingCart, Package, User } from "lucide-react";
// import { products } from "@/data/Products";

// const categories = ["All", "Vegetables", "Fruits", "Grains"];

// export default function CustomerDashboard() {
//   const [activeTab, setActiveTab] = useState("shop");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [search, setSearch] = useState("");

//   const filteredProducts = products.filter((product) => {
//     const matchCategory =
//       selectedCategory === "All" || product.category === selectedCategory;

//     const matchSearch =
//       product.name.toLowerCase().includes(search.toLowerCase());

//     return matchCategory && matchSearch;
//   });

//   return (
//     <div className="min-h-screen bg-yellow-50">

//       {/* ===================== */}
//       {/* 🟢 Fixed Top Navbar */}
//       {/* ===================== */}
//       <div className="fixed top-0 left-0 right-0 bg-green-600 text-white z-50 shadow-md">
//         <div className="p-4 space-y-3">

//           {/* Location */}
//           <div className="flex items-center gap-2 text-sm">
//             <MapPin className="w-4 h-4" />
//             Delivering to Hyderabad
//           </div>

//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search fresh products..."
//               className="w-full pl-9 pr-3 py-2 rounded-lg bg-white text-sm text-black focus:outline-none"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ===================== */}
//       {/* 📦 Main Scrollable Area */}
//       {/* ===================== */}
//       <div className="pt-28 pb-24">

//         {/* Category Filter */}
//         <div className="bg-yellow-100 sticky top-28 z-40 border-b border-yellow-200">
//           <div className="flex gap-3 overflow-x-auto px-4 py-3">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
//                   selectedCategory === cat
//                     ? "bg-green-600 text-white"
//                     : "bg-white text-green-700"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Grid */}
//         <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
//           {filteredProducts.map((product) => {
//             const discount = Math.round(
//               ((product.marketPrice - product.price) /
//                 product.marketPrice) *
//                 100
//             );

//             return (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-xl border border-yellow-200 p-3 shadow-sm"
//               >
//                 <div className="relative">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="h-28 w-full object-cover rounded-lg"
//                   />

//                   {discount > 0 && (
//                     <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
//                       {discount}% OFF
//                     </span>
//                   )}
//                 </div>

//                 <div className="mt-2 space-y-1">
//                   <h3 className="text-sm font-medium text-green-800 line-clamp-1">
//                     {product.name}
//                   </h3>

//                   <p className="text-xs text-gray-500">
//                     {product.farmer}
//                   </p>

//                   <div className="flex items-center gap-2">
//                     <span className="font-semibold text-green-700 text-sm">
//                       ₹{product.price}
//                     </span>
//                     <span className="text-xs line-through text-gray-400">
//                       ₹{product.marketPrice}
//                     </span>
//                   </div>

//                   <button className="w-full mt-2 py-1.5 rounded-full bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition">
//                     Add
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ===================== */}
//       {/* 🟢 Fixed Bottom Navigation */}
//       {/* ===================== */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-200 shadow-inner z-50">
//         <div className="flex justify-around items-center py-3 text-sm">

//           <button
//             onClick={() => setActiveTab("shop")}
//             className={`flex flex-col items-center ${
//               activeTab === "shop" ? "text-green-600" : "text-gray-500"
//             }`}
//           >
//             <Home size={20} />
//             Shop
//           </button>

//           <button
//             onClick={() => setActiveTab("orders")}
//             className="flex flex-col items-center text-gray-500"
//           >
//             <Package size={20} />
//             Orders
//           </button>

//           <button
//             onClick={() => setActiveTab("cart")}
//             className="flex flex-col items-center text-gray-500"
//           >
//             <ShoppingCart size={20} />
//             Cart
//           </button>

//           <button
//             onClick={() => setActiveTab("profile")}
//             className="flex flex-col items-center text-gray-500"
//           >
//             <User size={20} />
//             Profile
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  ShoppingCart,
  Package,
  User,
} from "lucide-react";
import { products } from "@/data/Products";

const categories = ["All", "Vegetables", "Fruits", "Grains"];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">

      {/* ===================== */}
      {/* 🟢 Top Navbar */}
      {/* ===================== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Left Section */}
          <div className="flex items-center gap-2 text-green-700 font-medium">
            <MapPin className="w-4 h-4" />
            Delivering to Hyderabad
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fresh vegetables, fruits..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-green-50 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <button className="text-green-700 hover:text-green-900">Shop</button>
            <button className="text-gray-600 hover:text-green-700">
              Orders
            </button>
            <button className="text-gray-600 hover:text-green-700">
              Cart
            </button>
            <button className="text-gray-600 hover:text-green-700">
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* 📦 Main Section */}
      {/* ===================== */}
      <div className="pt-24 pb-24 sm:pb-10">

        <div className="max-w-7xl mx-auto px-4">

          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => {
              const discount = Math.round(
                ((product.marketPrice - product.price) /
                  product.marketPrice) *
                  100
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-green-100 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-36 w-full object-cover rounded-xl"
                    />

                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-semibold text-green-800 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {product.farmer}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-green-700 text-sm">
                        ₹{product.price}
                      </span>
                      <span className="text-xs line-through text-gray-400">
                        ₹{product.marketPrice}
                      </span>
                    </div>

                    <button className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-semibold hover:scale-105 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ===================== */}
      {/* 📱 Mobile Bottom Nav */}
      {/* ===================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-inner z-50 sm:hidden">
        <div className="flex justify-around items-center py-3 text-xs font-medium">

          <button className="flex flex-col items-center text-green-600">
            <Home size={20} />
            Shop
          </button>

          <button className="flex flex-col items-center text-gray-500">
            <Package size={20} />
            Orders
          </button>

          <button className="flex flex-col items-center text-gray-500">
            <ShoppingCart size={20} />
            Cart
          </button>

          <button className="flex flex-col items-center text-gray-500">
            <User size={20} />
            Profile
          </button>

        </div>
      </div>
    </div>
  );
}