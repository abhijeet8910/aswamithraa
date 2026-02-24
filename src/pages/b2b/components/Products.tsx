import React, { useState } from "react";

type Product = {
  id: string;
  name: string;
  farmer: string;
  location: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  minOrder: number;
  rating: number;
  delivery: string;
  description: string;
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Basmati Rice",
    farmer: "Ramu Reddy",
    location: "Hyderabad",
    category: "Grains",
    price: 68,
    stock: 12000,
    unit: "kg",
    minOrder: 200,
    rating: 4.7,
    delivery: "3-5 days",
    description:
      "Premium long grain basmati rice suitable for export and bulk purchase."
  },
  {
    id: "2",
    name: "Turmeric",
    farmer: "Lakshmi Bai",
    location: "Warangal",
    category: "Spices",
    price: 95,
    stock: 2800,
    unit: "kg",
    minOrder: 100,
    rating: 4.5,
    delivery: "4-6 days",
    description:
      "Organic turmeric harvested directly from farm with high curcumin content."
  },
  {
    id: "3",
    name: "Tomatoes",
    farmer: "Suresh Kumar",
    location: "Guntur",
    category: "Vegetables",
    price: 35,
    stock: 5200,
    unit: "kg",
    minOrder: 50,
    rating: 4.3,
    delivery: "1-2 days",
    description:
      "Fresh red tomatoes ideal for wholesale vegetable markets."
  },
  {
    id: "4",
    name: "Onions",
    farmer: "Mahesh Yadav",
    location: "Nashik",
    category: "Vegetables",
    price: 30,
    stock: 8000,
    unit: "kg",
    minOrder: 100,
    rating: 4.4,
    delivery: "2-4 days",
    description:
      "High quality onions available for large scale distribution."
  },
  {
    id: "5",
    name: "Wheat",
    farmer: "Anil Sharma",
    location: "Punjab",
    category: "Grains",
    price: 28,
    stock: 20000,
    unit: "quintal",
    minOrder: 5,
    rating: 4.6,
    delivery: "5-7 days",
    description:
      "Premium wheat grains used for flour production."
  },
  {
    id: "6",
    name: "Coriander Seeds",
    farmer: "Rajesh Patel",
    location: "Gujarat",
    category: "Spices",
    price: 120,
    stock: 1500,
    unit: "kg",
    minOrder: 50,
    rating: 4.8,
    delivery: "3-4 days",
    description:
      "Aromatic coriander seeds used in spice processing industries."
  }
];

const categories = ["All", "Grains", "Spices", "Vegetables"];
const units = ["All", "kg", "gram", "litre", "quintal"];

const Products = () => {
  const [category, setCategory] = useState("All");
  const [unitFilter, setUnitFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter((p) => {
    const categoryMatch = category === "All" || p.category === category;
    const unitMatch = unitFilter === "All" || p.unit === unitFilter;
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && unitMatch && searchMatch;
  });

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Product Discovery</h1>
        <p className="text-green-100 text-sm">
          Explore farm products for bulk procurement
        </p>
      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="🔎 Search products..."
        className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY FILTER */}

      <div className="flex gap-3 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              category === c
                ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* UNIT FILTER */}

      <div className="flex gap-3 flex-wrap">
        {units.map((u) => (
          <button
            key={u}
            onClick={() => setUnitFilter(u)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              unitFilter === u
                ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >

            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {p.category}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Supplier: {p.farmer}
            </p>

            <p className="text-xs text-gray-500">
              📍 {p.location}
            </p>

            <p className="text-xs mt-2 text-yellow-600">
              ⭐ {p.rating} Supplier Rating
            </p>

            <div className="mt-4 space-y-1 text-sm">

              <p>
                📦 Stock: {p.stock} {p.unit}
              </p>

              <p>
                MOQ: {p.minOrder} {p.unit}
              </p>

              <p>
                🚚 Delivery: {p.delivery}
              </p>

              <p className="font-bold text-green-700 text-lg">
                ₹{p.price}/{p.unit}
              </p>

            </div>

            <div className="flex gap-3 mt-5">

              <button
                onClick={() => setSelectedProduct(p)}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90"
              >
                Bulk Order
              </button>

              <button className="flex-1 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50">
                Negotiate
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* PRODUCT MODAL */}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl">

            <h3 className="text-xl font-semibold mb-4 text-green-700">
              Product Details
            </h3>

            <div className="space-y-2 text-sm">

              <p><b>Product:</b> {selectedProduct.name}</p>
              <p><b>Category:</b> {selectedProduct.category}</p>
              <p><b>Supplier:</b> {selectedProduct.farmer}</p>
              <p><b>Location:</b> {selectedProduct.location}</p>
              <p><b>Rating:</b> ⭐ {selectedProduct.rating}</p>

              <p>
                <b>Price:</b> ₹{selectedProduct.price}/{selectedProduct.unit}
              </p>

              <p>
                <b>Minimum Order:</b> {selectedProduct.minOrder} {selectedProduct.unit}
              </p>

              <p>
                <b>Available Stock:</b> {selectedProduct.stock} {selectedProduct.unit}
              </p>

              <p>
                <b>Delivery Time:</b> {selectedProduct.delivery}
              </p>

              <p><b>Description:</b> {selectedProduct.description}</p>

            </div>

            <div className="flex gap-3 mt-6">

              <button className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-lg">
                Proceed Order
              </button>

              <button className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                Request Negotiation
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Products;