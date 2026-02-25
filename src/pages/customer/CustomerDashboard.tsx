"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Home, ShoppingCart, Package, User, Loader2, Minus, Plus, Eye } from "lucide-react";
import { productService } from "@/services/product.service";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartComponent from "./components/CartComponent";
import OrdersComponent from "./components/OrdersComponent";
import ProfileComponent from "./components/ProfileComponent";
import ProductDetailModal from "./components/ProductDetailModal";
import SetAddressModal from "./components/SetAddressModal";
import { categoryService } from "@/services/category.service";
export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { addToCart, getItemQty, incrementQty, decrementQty, getItemCount } = useCart();
  const { user } = useAuth();

  const [showAddressModal, setShowAddressModal] = useState(false);
  useEffect(() => {
    if (user && (!user.address || !user.address.city)) {
      setShowAddressModal(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          productService.getAll({ limit: 100 }),
          categoryService.getAll()
        ]);
        setProducts(prodData?.products || []);

        // Transform categories to include "All"
        const cats = catData || [];
        setCategories([{ _id: "all", name: "All" }, ...cats]);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredProducts = products.filter((product: any) => {
    const catId = product.category?._id || product.category || "";
    const catName = categories.find(c => c._id === catId)?.name || "";

    const matchCategory = selectedCategory === "All" || catName === selectedCategory;
    const matchSearch = (product.name || "").toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const cartCount = getItemCount();

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      marketPrice: product.marketPrice,
      image: product.images?.[0] || "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80&auto=format&fit=crop",
      farmer: product.farmer?.name || "Local Farmer",
      farmerId: product.farmer?._id || "",
      unit: product.unit || "kg",
      stock: product.stock || 100,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans pb-24 sm:pb-10">
      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-green-700 font-medium">
            <MapPin className="w-4 h-4" />
            {user?.address?.city ? `Delivering to ${user.address.city}` : "Set your delivery address"}
          </div>
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text" placeholder="Search fresh vegetables, fruits..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white text-sm transition-all shadow-inner"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {[
              { tab: "shop", label: "Shop", Icon: Home },
              { tab: "orders", label: "Orders", Icon: Package },
              { tab: "cart", label: "Cart", Icon: ShoppingCart, badge: cartCount },
              { tab: "profile", label: "Profile", Icon: User },
            ].map(({ tab, label, Icon, badge }) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all relative ${activeTab === tab ? "text-emerald-700 bg-emerald-50 font-bold" : "text-gray-500 hover:text-emerald-600 hover:bg-gray-50"}`}
              >
                <Icon size={activeTab === tab ? 20 : 18} className={activeTab === tab ? "text-emerald-600" : ""} /> {label}
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-28 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === "shop" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HEROBANNER Placeholder */}
            <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden hidden sm:block">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Fresh from Farm to You</h1>
              <p className="text-emerald-50">Discover organic, freshly harvested produce at the best prices.</p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-6 mb-2 custom-scrollbar">
              {categories.map((cat) => (
                <button key={cat._id} onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${selectedCategory === cat.name ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                    }`}
                >{cat.name}</button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No products found. Try a different category or search term.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map((product: any) => {
                  const mktPrice = product.marketPrice || Math.round(product.price * 1.3);
                  const discount = Math.round(((mktPrice - product.price) / mktPrice) * 100);
                  const qty = getItemQty(product._id);
                  return (
                    <div key={product._id} className="bg-white rounded-2xl border border-green-100 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                      {/* Clickable image area for product detail */}
                      <div
                        className="relative cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img
                          src={product.images?.[0] || "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80&auto=format&fit=crop"}
                          alt={product.name} className="h-36 w-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-md">
                            <Eye className="w-4 h-4 text-green-700" />
                          </div>
                        </div>
                        {product.organic && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px] font-medium">Organic</span>
                        )}
                      </div>

                      <h3 className="mt-3 text-sm font-semibold text-green-800 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                          {product.category?.name === "Other" ? product.subCategory : product.category?.name || "Uncategorized"}
                        </p>
                        <p className="text-[10px] text-gray-400">{product.farmer?.name || "Local Farmer"}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-green-700 text-sm">₹{product.price}</span>
                        <span className="text-xs line-through text-gray-400">₹{mktPrice}</span>
                        {discount > 0 && <span className="text-xs text-red-500 font-medium">-{discount}%</span>}
                      </div>

                      {/* Add to Cart / Quantity Controls */}
                      {qty === 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-semibold hover:scale-105 transition active:scale-95"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center justify-between mt-3 bg-green-50 border border-green-200 rounded-full px-2 py-1">
                          <button
                            onClick={() => decrementQty(product._id)}
                            className="w-7 h-7 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700 hover:bg-green-100 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-green-800">{qty}</span>
                          <button
                            onClick={() => incrementQty(product._id)}
                            className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && <OrdersComponent />}
        {activeTab === "cart" && <CartComponent />}
        {activeTab === "profile" && <ProfileComponent />}
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-inner z-50 sm:hidden">
        <div className="flex justify-around items-center py-3 text-xs font-medium">
          {[
            { tab: "shop", label: "Shop", Icon: Home },
            { tab: "orders", label: "Orders", Icon: Package },
            { tab: "cart", label: "Cart", Icon: ShoppingCart, badge: cartCount },
            { tab: "profile", label: "Profile", Icon: User },
          ].map(({ tab, label, Icon, badge }) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center relative ${activeTab === tab ? "text-green-600" : "text-gray-500"}`}
            >
              <Icon size={20} />
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* Set Address Modal */}
      {showAddressModal && (
        <SetAddressModal onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
}