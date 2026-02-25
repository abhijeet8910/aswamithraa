import React, { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { productService } from "@/services/product.service";
import {
  Search, Filter, Star, MapPin, Truck, ShieldCheck, ChevronRight,
  Package, TrendingDown, Clock, X, ShoppingCart, Wheat, Leaf,
  Cherry, Flame, Droplets, Award, ArrowRight, Plus, Minus,
  Check, Eye, Heart, BadgePercent, Zap, Users, BarChart3,
} from "lucide-react";

/* ─────────── TYPES ─────────── */
type PriceTier = { minQty: number; maxQty: number | null; price: number };

type Product = {
  id: string;
  name: string;
  farmer: string;
  location: string;
  state: string;
  category: string;
  subCategory: string;
  price: number;
  marketPrice: number;
  stock: number;
  unit: string;
  minOrder: number;
  rating: number;
  reviews: number;
  delivery: string;
  description: string;
  image: string;
  organic: boolean;
  verified: boolean;
  priceTiers: PriceTier[];
  tags: string[];
};

/* ─────────── CATEGORIES ─────────── */
const categories = [
  { id: "all", label: "All Products", icon: Package, emoji: "📦", color: "from-slate-500 to-slate-700" },
  { id: "Grains", label: "Grains & Cereals", icon: Wheat, emoji: "🌾", color: "from-amber-500 to-yellow-600" },
  { id: "Vegetables", label: "Fresh Vegetables", icon: Leaf, emoji: "🥬", color: "from-emerald-500 to-green-600" },
  { id: "Fruits", label: "Fruits", icon: Cherry, emoji: "🍎", color: "from-red-400 to-rose-600" },
  { id: "Spices", label: "Spices & Herbs", icon: Flame, emoji: "🌶️", color: "from-orange-500 to-red-500" },
  { id: "Dairy", label: "Dairy & Poultry", icon: Droplets, emoji: "🥛", color: "from-sky-400 to-blue-500" },
  { id: "Pulses", label: "Pulses & Lentils", icon: Award, emoji: "🫘", color: "from-yellow-600 to-amber-700" },
];

/* ─────────── PRODUCT DATA (fetched from API) ─────────── */
const defaultPriceTiers: PriceTier[] = [
  { minQty: 1, maxQty: 100, price: 0 },
  { minQty: 101, maxQty: 500, price: 0 },
  { minQty: 501, maxQty: null, price: 0 },
];

const mapApiProduct = (p: any): Product => ({
  id: p._id,
  name: p.name,
  farmer: p.farmer?.name || "Verified Farmer",
  location: p.farmer?.farmLocation || "India",
  state: "",
  category: p.category?.name || p.category || "General",
  subCategory: p.category?.name || p.category || "General",
  price: p.price,
  marketPrice: p.marketPrice || Math.round(p.price * 1.3),
  stock: p.stock || 0,
  unit: p.unit || "kg",
  minOrder: p.minOrder || 1,
  rating: p.rating || 4.5,
  reviews: p.numReviews || 0,
  delivery: "3-5 days",
  description: p.description || "",
  image: p.images?.[0] || "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80&auto=format&fit=crop",
  organic: p.organic || false,
  verified: p.farmer?.isVerified || false,
  priceTiers: defaultPriceTiers.map((t) => ({ ...t, price: Math.round(p.price * (1 - t.minQty * 0.0001)) })),
  tags: [p.organic ? "Organic" : "", p.farmer?.isVerified ? "Verified" : ""].filter(Boolean),
});

const fallbackProducts: Product[] = [
  {
    id: "2", name: "Organic Turmeric Powder", farmer: "Lakshmi Bai", location: "Nizamabad", state: "Telangana",
    category: "Spices", subCategory: "Turmeric", price: 145, marketPrice: 195, stock: 2800, unit: "kg",
    minOrder: 50, rating: 4.9, reviews: 189, delivery: "4-6 days",
    description: "High curcumin content (5%+). USDA organic certified turmeric powder, lab tested. Ideal for food producers and exporters.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 145 }, { minQty: 201, maxQty: 500, price: 132 }, { minQty: 501, maxQty: null, price: 118 }],
    tags: ["Organic", "Lab Tested"],
  },
  {
    id: "3", name: "Fresh Tomatoes (Grade A)", farmer: "Suresh Kumar", location: "Madanapalle", state: "Andhra Pradesh",
    category: "Vegetables", subCategory: "Tomatoes", price: 28, marketPrice: 42, stock: 8000, unit: "kg",
    minOrder: 100, rating: 4.5, reviews: 312, delivery: "1-2 days",
    description: "Grade-A firm red tomatoes, ideal for wholesale veg markets, HoReCa and food processing. Daily fresh harvest.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 28 }, { minQty: 501, maxQty: 2000, price: 24 }, { minQty: 2001, maxQty: null, price: 20 }],
    tags: ["Fast Delivery", "Daily Fresh"],
  },
  {
    id: "4", name: "Red Onions (Export Quality)", farmer: "Mahesh Yadav", location: "Nashik", state: "Maharashtra",
    category: "Vegetables", subCategory: "Onions", price: 24, marketPrice: 35, stock: 15000, unit: "kg",
    minOrder: 200, rating: 4.6, reviews: 276, delivery: "2-3 days",
    description: "Export quality red onions. Sizes 45-65mm, uniform shape and color. Cold storage available.",
    image: "https://images.unsplash.com/photo-1582515073490-dc2c6b38e3d3?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 200, maxQty: 1000, price: 24 }, { minQty: 1001, maxQty: 5000, price: 21 }, { minQty: 5001, maxQty: null, price: 18 }],
    tags: ["Export Quality", "Cold Storage"],
  },
  {
    id: "5", name: "Sharbati Wheat", farmer: "Anil Sharma", location: "Sehore", state: "Madhya Pradesh",
    category: "Grains", subCategory: "Wheat", price: 2450, marketPrice: 3200, stock: 500, unit: "quintal",
    minOrder: 5, rating: 4.7, reviews: 198, delivery: "5-7 days",
    description: "MP Sharbati wheat known for golden colour and high protein. Perfect for flour mills and chapati production.",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 5, maxQty: 20, price: 2450 }, { minQty: 21, maxQty: 50, price: 2280 }, { minQty: 51, maxQty: null, price: 2100 }],
    tags: ["MP Origin", "High Protein"],
  },
  {
    id: "6", name: "Kashmiri Red Chilli", farmer: "Rajesh Patel", location: "Byadgi", state: "Karnataka",
    category: "Spices", subCategory: "Chilli", price: 285, marketPrice: 380, stock: 1500, unit: "kg",
    minOrder: 25, rating: 4.8, reviews: 167, delivery: "3-5 days",
    description: "Byadgi variety known for deep red color. Low pungency, high color value. Used by spice brands and food companies.",
    image: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 25, maxQty: 100, price: 285 }, { minQty: 101, maxQty: 500, price: 260 }, { minQty: 501, maxQty: null, price: 238 }],
    tags: ["High Color Value", "Byadgi"],
  },
  {
    id: "7", name: "Alphonso Mangoes", farmer: "Vijay Desai", location: "Ratnagiri", state: "Maharashtra",
    category: "Fruits", subCategory: "Mangoes", price: 650, marketPrice: 900, stock: 3000, unit: "dozen",
    minOrder: 20, rating: 4.9, reviews: 456, delivery: "2-3 days",
    description: "GI-tagged Ratnagiri Alphonso. Naturally ripened, carbide-free. Available in 3kg and 5kg branded boxes.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 20, maxQty: 50, price: 650 }, { minQty: 51, maxQty: 200, price: 580 }, { minQty: 201, maxQty: null, price: 520 }],
    tags: ["GI Tagged", "Carbide Free"],
  },
  {
    id: "8", name: "A2 Gir Cow Ghee", farmer: "Gopal Dairy Farm", location: "Jamnagar", state: "Gujarat",
    category: "Dairy", subCategory: "Ghee", price: 1850, marketPrice: 2400, stock: 600, unit: "litre",
    minOrder: 10, rating: 4.9, reviews: 321, delivery: "3-4 days",
    description: "Traditional bilona method A2 ghee from pure Gir cow milk. Lab certified. Perfect for premium retail and HoReCa.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 10, maxQty: 50, price: 1850 }, { minQty: 51, maxQty: 200, price: 1720 }, { minQty: 201, maxQty: null, price: 1580 }],
    tags: ["A2 Milk", "Bilona Method"],
  },
  {
    id: "9", name: "Fresh Green Peas", farmer: "Harpal Singh", location: "Ambala", state: "Haryana",
    category: "Vegetables", subCategory: "Peas", price: 55, marketPrice: 78, stock: 4000, unit: "kg",
    minOrder: 100, rating: 4.4, reviews: 134, delivery: "2-3 days",
    description: "Sweet green peas harvested fresh. Perfect for wholesale veggie markets and frozen food companies.",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 55 }, { minQty: 501, maxQty: 2000, price: 48 }, { minQty: 2001, maxQty: null, price: 42 }],
    tags: ["Seasonal", "Fresh Harvest"],
  },
  {
    id: "10", name: "Organic Moong Dal", farmer: "Kamla Devi", location: "Bikaner", state: "Rajasthan",
    category: "Pulses", subCategory: "Moong", price: 115, marketPrice: 155, stock: 3500, unit: "kg",
    minOrder: 100, rating: 4.6, reviews: 201, delivery: "4-5 days",
    description: "Split yellow moong dal, organically grown. Clean and polished. Suitable for retail packing and institutional use.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 115 }, { minQty: 501, maxQty: 2000, price: 105 }, { minQty: 2001, maxQty: null, price: 95 }],
    tags: ["Organic", "Double Washed"],
  },
  {
    id: "11", name: "Coriander Seeds (Dhaniya)", farmer: "Rajesh Meena", location: "Kota", state: "Rajasthan",
    category: "Spices", subCategory: "Coriander", price: 120, marketPrice: 165, stock: 2200, unit: "kg",
    minOrder: 50, rating: 4.7, reviews: 143, delivery: "3-4 days",
    description: "Eagle variety coriander seeds. High essential oil content, aromatic. Used by masala manufacturers.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 120 }, { minQty: 201, maxQty: 500, price: 108 }, { minQty: 501, maxQty: null, price: 96 }],
    tags: ["Eagle Variety", "Aromatic"],
  },
  {
    id: "12", name: "Pomegranate (Bhagwa)", farmer: "Sanjay Patil", location: "Solapur", state: "Maharashtra",
    category: "Fruits", subCategory: "Pomegranate", price: 95, marketPrice: 140, stock: 5000, unit: "kg",
    minOrder: 50, rating: 4.6, reviews: 189, delivery: "2-4 days",
    description: "Bhagwa variety pomegranate, deep red arils. Export-grade sizing and sorting. Cold chain logistics available.",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 95 }, { minQty: 201, maxQty: 1000, price: 85 }, { minQty: 1001, maxQty: null, price: 75 }],
    tags: ["Export Grade", "Cold Chain"],
  },
];

/* ─────────── SORT ─────────── */
const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Max Savings", value: "savings" },
];

/* ─────────── HELPERS ─────────── */
const calcSaving = (p: Product) => Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100);

const formatPrice = (n: number) =>
  n >= 10000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n.toLocaleString("en-IN")}`;

/* ─────────── COMPONENT ─────────── */
const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQty, setOrderQty] = useState<number>(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allProducts, setAllProducts] = useState<Product[]>(fallbackProducts);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll({ limit: 100 });
        const apiProds = (data?.products || []).map(mapApiProduct);
        if (apiProds.length > 0) setAllProducts(apiProds);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setApiLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* Filtered + sorted products */
  const products = useMemo(() => {
    let result = allProducts.filter((p) => {
      const catMatch = activeCategory === "all" || p.category === activeCategory;
      const searchMatch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.farmer.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return catMatch && searchMatch;
    });

    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "savings": result.sort((a, b) => calcSaving(b) - calcSaving(a)); break;
    }

    return result;
  }, [activeCategory, search, sort, allProducts]);

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const openDetail = (p: Product) => { setSelectedProduct(p); setOrderQty(p.minOrder); };

  const currentTier = (p: Product, qty: number): PriceTier =>
    p.priceTiers.slice().reverse().find((t) => qty >= t.minQty) || p.priceTiers[0];

  /* ─── CATEGORY COUNT ─── */
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: allProducts.length };
    allProducts.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [allProducts]);

  /* ─────────────────────────────────── RENDER ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6 space-y-6">

      {/* ════════ HEADER ════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -right-8 -bottom-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full">B2B MARKETPLACE</span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-400/20 text-yellow-200 rounded-full">
                <Zap className="w-3 h-3" /> LIVE PRICES
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Product Discovery</h1>
            <p className="text-green-100 text-sm mt-1 max-w-md">Source farm-fresh produce at wholesale rates. Verified suppliers, bulk pricing tiers & fast delivery across India.</p>
          </div>

          <div className="flex gap-3 text-center">
            {[
              { label: "Products", value: allProducts.length.toString(), icon: Package },
              { label: "Suppliers", value: "48+", icon: Users },
              { label: "Avg Savings", value: "28%", icon: TrendingDown },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[80px]">
                <s.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
                <div className="text-lg font-bold">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide opacity-70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ CATEGORIES (Horizontal Scroll) ════════ */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap
                  ${isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-emerald-200/50 scale-[1.02]`
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════ SEARCH + SORT BAR ════════ */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, farmers, or categories..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all focus:shadow-md outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-9 pr-10 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm outline-none cursor-pointer"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* View Toggle */}
        <div className="hidden md:flex bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-4 py-3.5 text-sm font-medium transition-colors ${viewMode === v ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
      </div>

      {/* ════════ RESULTS SUMMARY ════════ */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{products.length}</span> products
          {activeCategory !== "all" && <span> in <span className="font-semibold text-green-600">{categories.find((c) => c.id === activeCategory)?.label}</span></span>}
        </p>
        {search && <p className="text-xs text-gray-400 italic">Results for "{search}"</p>}
      </div>

      {/* ════════ PRODUCT GRID ════════ */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No products found</h3>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or category filter</p>
          <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-4 px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-4"}>
          {products.map((p) => {
            const saving = calcSaving(p);
            const inWishlist = wishlist.has(p.id);
            const lowestPrice = p.priceTiers[p.priceTiers.length - 1].price;

            return viewMode === "grid" ? (
              /* ─── GRID CARD ─── */
              <div
                key={p.id}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top-left badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {saving >= 20 && (
                      <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded-lg shadow-lg">
                        <BadgePercent className="w-3 h-3" /> {saving}% OFF
                      </span>
                    )}
                    {p.organic && (
                      <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-green-500 text-white rounded-lg">
                        <Leaf className="w-3 h-3" /> ORGANIC
                      </span>
                    )}
                    {p.tags[0] === "Bestseller" && (
                      <span className="px-2 py-1 text-[10px] font-bold bg-amber-500 text-white rounded-lg">🔥 BESTSELLER</span>
                    )}
                  </div>

                  {/* Top-right wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm
                      ${inWishlist ? "bg-red-500/90 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
                  >
                    <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
                  </button>

                  {/* Bottom image overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 bg-amber-400/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3" fill="currentColor" /> {p.rating}
                      </span>
                      <span className="text-[10px] text-white/90">({p.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  {/* Category + sub */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wide">{p.subCategory}</span>
                    {p.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-blue-600 font-medium">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-green-700 transition-colors">{p.name}</h3>

                  {/* Supplier */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.farmer}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
                  </div>

                  {/* Price Block */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-green-700">₹{p.price}</span>
                      <span className="text-xs text-gray-400">/{p.unit}</span>
                      <span className="text-xs text-gray-400 line-through ml-auto">₹{p.marketPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-600 font-semibold">Save {saving}% vs market</span>
                      <span className="text-gray-400">From ₹{lowestPrice}/{p.unit}</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg py-1.5 px-1">
                      <Package className="w-3 h-3 text-gray-400 mb-0.5" />
                      <span className="font-semibold text-gray-700">{p.stock.toLocaleString()} {p.unit}</span>
                      <span className="text-gray-400">Stock</span>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg py-1.5 px-1">
                      <ShoppingCart className="w-3 h-3 text-gray-400 mb-0.5" />
                      <span className="font-semibold text-gray-700">{p.minOrder} {p.unit}</span>
                      <span className="text-gray-400">MOQ</span>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg py-1.5 px-1">
                      <Truck className="w-3 h-3 text-gray-400 mb-0.5" />
                      <span className="font-semibold text-gray-700">{p.delivery}</span>
                      <span className="text-gray-400">Delivery</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openDetail(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-4 h-4" /> Bulk Order
                    </button>
                    <button
                      onClick={() => openDetail(p)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ─── LIST CARD ─── */
              <div
                key={p.id}
                className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative sm:w-56 h-44 sm:h-auto shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {saving >= 20 && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded-lg shadow">
                      <BadgePercent className="w-3 h-3" />{saving}% OFF
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full uppercase">{p.subCategory}</span>
                      {p.organic && <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">🌿 Organic</span>}
                      {p.verified && <span className="flex items-center gap-0.5 text-[10px] text-blue-600"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.farmer}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}, {p.state}</span>
                      <span className="flex items-center gap-1 text-amber-600"><Star className="w-3 h-3" fill="currentColor" />{p.rating} ({p.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-green-700">₹{p.price}</span>
                        <span className="text-sm text-gray-400">/{p.unit}</span>
                        <span className="text-sm text-gray-400 line-through">₹{p.marketPrice}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-gray-400">
                        <span>MOQ: {p.minOrder} {p.unit}</span>
                        <span>Stock: {p.stock.toLocaleString()} {p.unit}</span>
                        <span>🚚 {p.delivery}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetail(p)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" /> Order
                      </button>
                      <button onClick={() => toggleWishlist(p.id)} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${inWishlist ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
                        <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════ PRODUCT DETAIL MODAL ════════ */}
      {selectedProduct && (() => {
        const p = selectedProduct;
        const saving = calcSaving(p);
        const tier = currentTier(p, orderQty);
        const totalCost = tier.price * orderQty;

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

              {/* Modal Image */}
              <div className="relative h-56 md:h-64 overflow-hidden rounded-t-3xl">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-lg">
                  <X className="w-4 h-4 text-gray-700" />
                </button>

                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur px-2 py-1 rounded-lg">{p.category}</span>
                    {p.organic && <span className="text-[10px] font-bold text-white bg-green-500/80 px-2 py-1 rounded-lg">🌿 Organic</span>}
                    {saving >= 20 && <span className="text-[10px] font-bold text-white bg-red-500/80 px-2 py-1 rounded-lg">{saving}% OFF</span>}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">{p.name}</h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">

                {/* Supplier Info */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{p.farmer.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{p.farmer}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{p.location}, {p.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-600"><Star className="w-4 h-4" fill="currentColor" />{p.rating}</div>
                    <div className="text-[10px] text-gray-400">{p.reviews} reviews</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Available Stock", value: `${p.stock.toLocaleString()} ${p.unit}`, icon: Package },
                    { label: "Min Order (MOQ)", value: `${p.minOrder} ${p.unit}`, icon: ShoppingCart },
                    { label: "Delivery Time", value: p.delivery, icon: Truck },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <s.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-sm font-bold text-gray-800">{s.value}</div>
                      <div className="text-[10px] text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">{t}</span>
                  ))}
                  {p.verified && (
                    <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      <ShieldCheck className="w-3 h-3" /> Verified Supplier
                    </span>
                  )}
                </div>

                {/* ═══ BULK PRICING TABLE ═══ */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-600" /> Bulk Pricing Tiers
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {p.priceTiers.map((t, i) => {
                      const isActive = tier === t;
                      const tierSaving = Math.round(((p.marketPrice - t.price) / p.marketPrice) * 100);
                      return (
                        <div
                          key={i}
                          className={`relative rounded-xl p-3 text-center transition-all border-2 ${isActive
                            ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                            : "border-gray-100 bg-gray-50 hover:border-gray-200"
                            }`}
                        >
                          {isActive && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">
                              YOUR TIER
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 mt-1">
                            {t.minQty}–{t.maxQty ? t.maxQty : "∞"} {p.unit}
                          </div>
                          <div className={`text-lg font-extrabold mt-1 ${isActive ? "text-green-700" : "text-gray-700"}`}>
                            ₹{t.price}
                          </div>
                          <div className="text-[10px] text-gray-400">per {p.unit}</div>
                          <div className={`text-[10px] font-semibold mt-1 ${isActive ? "text-green-600" : "text-emerald-500"}`}>
                            Save {tierSaving}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ═══ QUANTITY SELECTOR ═══ */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Order Quantity ({p.unit})</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOrderQty(Math.max(p.minOrder, orderQty - p.minOrder))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      min={p.minOrder}
                      max={p.stock}
                      value={orderQty}
                      onChange={(e) => setOrderQty(Math.max(p.minOrder, Math.min(p.stock, Number(e.target.value) || p.minOrder)))}
                      className="flex-1 text-center text-lg font-bold py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                    />

                    <button
                      onClick={() => setOrderQty(Math.min(p.stock, orderQty + p.minOrder))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">Minimum order: {p.minOrder} {p.unit} · Max: {p.stock.toLocaleString()} {p.unit}</p>
                </div>

                {/* ═══ ORDER SUMMARY ═══ */}
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl p-5 space-y-2 border border-green-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Unit Price (Tier Rate)</span>
                    <span className="font-semibold">₹{tier.price}/{p.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Quantity</span>
                    <span className="font-semibold">{orderQty.toLocaleString()} {p.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Market Total</span>
                    <span className="line-through">₹{(p.marketPrice * orderQty).toLocaleString("en-IN")}</span>
                  </div>
                  <hr className="border-green-200" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-extrabold text-green-700">{formatPrice(totalCost)}</span>
                  </div>
                  <div className="text-right text-xs font-semibold text-emerald-600">
                    You save ₹{((p.marketPrice - tier.price) * orderQty).toLocaleString("en-IN")} ({Math.round(((p.marketPrice - tier.price) / p.marketPrice) * 100)}%)
                  </div>
                </div>

                {/* ═══ ACTION BUTTONS ═══ */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200 transition-all active:scale-[0.98]">
                    <Check className="w-5 h-5" /> Place Order
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    💬 Negotiate
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Products;