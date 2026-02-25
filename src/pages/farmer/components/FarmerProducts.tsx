import { useState, useEffect } from "react";
import { X, Plus, Loader2, UploadCloud, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { productService } from "@/services/product.service";
import { uploadImage } from "@/services/api";
import { categoryService } from "@/services/category.service";

type Product = {
  _id: string;
  name: string;
  description?: string;
  category?: any;
  subCategory?: string;
  stock: number;
  unit: string;
  price: number;
  marketPrice?: number;
  minOrder?: number;
  organic?: boolean;
  isActive: boolean;
  images?: string[];
};

type ProductStatus = "Available" | "Low Stock" | "Out of Stock";

const units = ["kg", "quintal", "ton", "litre", "piece", "dozen"];
const API_BASE_URL = "http://localhost:5000";

function getStatus(stock: number): ProductStatus {
  if (stock === 0) return "Out of Stock";
  if (stock < 50) return "Low Stock";
  return "Available";
}

function statusBadge(status: ProductStatus) {
  const styles = {
    Available: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
    "Low Stock": "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-500/30",
    "Out of Stock": "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-red-500/30",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function FarmerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    marketPrice: "",
    stock: "",
    unit: "kg",
    minOrder: "",
    organic: false,
    category: "",
    subCategory: "",
    images: [] as string[],
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getMyProducts();
      setProducts(data || []);
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("Uploading file:", file.name);

    try {
      setUploadingImage(true);
      setError("");
      const response = await uploadImage(file);
      if (response && response.url) {
        setForm((prev) => ({
          ...prev,
          images: [response.url], // currently supporting 1 primary image
        }));
      }
    } catch (err: any) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", marketPrice: "", stock: "", unit: "kg", minOrder: "", organic: false, category: "", subCategory: "", images: [] });
    setEditingId(null);
    setIsOtherSelected(false);
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      marketPrice: form.marketPrice ? Number(form.marketPrice) : undefined,
      stock: Number(form.stock),
      unit: form.unit,
      minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      organic: form.organic,
      category: form.category || undefined,
      subCategory: form.subCategory || undefined,
      images: form.images.length > 0 ? form.images : undefined,
    };

    try {
      if (editingId) {
        await productService.update(editingId, payload);
      } else {
        await productService.create(payload);
      }
      setOpen(false);
      resetForm();
      await fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.delete(id);
      await fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      marketPrice: product.marketPrice ? String(product.marketPrice) : "",
      stock: String(product.stock),
      unit: product.unit,
      minOrder: product.minOrder ? String(product.minOrder) : "",
      organic: product.organic || false,
      category: product.category?._id || product.category || "",
      subCategory: product.subCategory || "",
      images: product.images || [],
    });
    setEditingId(product._id);
    const catId = product.category?._id || product.category || "";
    const catName = categories.find(c => c._id === catId)?.name || "";
    setIsOtherSelected(catName === "Other");
    setOpen(true);
  };

  // Helper to get full image URL
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-8 rounded-3xl text-white shadow-xl shadow-teal-900/20 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">My Produce</h1>
            <p className="text-emerald-50 text-base opacity-90 font-medium">Manage your farm's inventory and listings beautifully.</p>
          </div>
          <button
            onClick={() => { setOpen(true); resetForm(); }}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-teal-800 font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 w-full md:w-auto"
          >
            <Plus size={20} className="text-teal-600" />
            <span className="hidden md:inline">Add New Product</span>
            <span className="md:hidden">Add Product</span>
          </button>
        </div>
      </div>

      {/* ERROR MSG */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium shadow-sm flex items-center gap-3">
          <div className="w-2 h-full bg-rose-500 rounded-l flex-shrink-0"></div>
          {error}
        </div>
      )}

      {/* CONTENT LISTING */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          <p className="text-teal-800/60 font-medium animate-pulse">Loading your harvest...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-teal-100 flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 mb-2 shadow-inner">
            <ImageIcon size={32} />
          </div>
          <p className="text-xl font-bold text-gray-800">Your farm stand is empty</p>
          <p className="text-gray-500 max-w-md">Start by adding your first product. Upload beautiful photos to attract more buyers.</p>
          <button onClick={() => { setOpen(true); resetForm(); }} className="mt-4 px-6 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 font-semibold transition">
            Add First Product
          </button>
        </div>
      ) : (
        /* PRODUCT CARDS GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => {
            const imageUrl = getImageUrl(p.images?.[0]);
            return (
              <div key={p._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 w-full overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <ImageIcon size={40} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}

                  {/* Status & Organic Badges Overlay */}
                  <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                    {statusBadge(getStatus(p.stock))}
                    {p.organic && (
                      <span className="px-2.5 py-1 text-xs rounded-full font-bold bg-green-500/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                        🌿 Organic
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay (shows on hover) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button onClick={() => handleEdit(p)} className="p-3 bg-white text-blue-600 rounded-full hover:scale-110 hover:shadow-lg transition-transform">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-3 bg-white text-rose-600 rounded-full hover:scale-110 hover:shadow-lg transition-transform">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md">
                      {p.category?.name === "Other" ? (p.subCategory || "Other") : (p.category?.name || "Uncategorized")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
                  {p.description && <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{p.description}</p>}
                  {!p.description && <div className="flex-grow"></div>}

                  <div className="bg-gray-50 rounded-2xl p-4 mt-auto border border-gray-100/50">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Price</span>
                        <div className="font-extrabold text-teal-700 text-xl">
                          ₹{p.price}<span className="text-sm font-semibold text-teal-600/70">/{p.unit}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">In Stock</span>
                        <div className="font-bold text-gray-700">
                          {p.stock} <span className="text-sm font-medium text-gray-500">{p.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OVERLAY MODAL */}
      {open && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">

            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                {editingId ? "Edit Produce Listing" : "Add New Produce"}
              </h3>
              <button onClick={() => { setOpen(false); resetForm(); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto w-full p-6 custom-scrollbar">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  {error}
                </div>
              )}

              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload Section */}
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Photo</label>
                  <div className="relative">
                    {form.images.length > 0 ? (
                      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden group border-2 border-gray-100">
                        <img src={getImageUrl(form.images[0])!} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer px-4 py-2 bg-white rounded-lg text-sm font-semibold text-gray-900 shadow-lg hover:scale-105 transition-transform">
                            Change Photo
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 md:h-64 border-2 border-dashed border-teal-200 rounded-2xl cursor-pointer bg-teal-50/50 hover:bg-teal-50 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingImage ? (
                            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
                          ) : (
                            <UploadCloud className="w-10 h-10 text-teal-400 group-hover:text-teal-500 mb-3 transition-colors" />
                          )}
                          <p className="mb-1 text-sm font-semibold text-teal-800">
                            {uploadingImage ? "Uploading..." : "Click to upload an image"}
                          </p>
                          <p className="text-xs text-teal-600/70">PNG, JPG or WEBP (MAX. 5MB)</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Product Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium" required placeholder="e.g. Fresh Red Tomatoes" />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none" placeholder="Provide details about the quality, origin, etc." />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Selling Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                      <input name="price" value={form.price} type="number" onChange={handleChange} className="w-full border-0 bg-gray-50 rounded-xl pl-8 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-bold" required placeholder="0.00" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Market Price (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                      <input name="marketPrice" value={form.marketPrice} type="number" onChange={handleChange} className="w-full border-0 bg-gray-50 rounded-xl pl-8 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Available Stock</label>
                    <input name="stock" value={form.stock} type="number" onChange={handleChange} className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-bold" required placeholder="Quantity" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Unit of Measurement</label>
                    <select name="unit" value={form.unit} onChange={handleChange} className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all appearance-none cursor-pointer font-medium">
                      {units.map((u) => (
                        <option key={u} value={u}>{u.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, category: val });
                        const selectedCat = categories.find(c => c._id === val);
                        setIsOtherSelected(selectedCat?.name === "Other");
                      }}
                      className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all appearance-none cursor-pointer font-medium"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {isOtherSelected && (
                    <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Specify Category</label>
                      <input
                        name="subCategory"
                        value={form.subCategory}
                        onChange={handleChange}
                        className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                        placeholder="e.g. Flowers, Exotic, etc."
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Minimum Order Qty</label>
                    <input name="minOrder" value={form.minOrder} type="number" onChange={handleChange} className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all" placeholder="Default: 1" />
                  </div>

                  <div className="col-span-1 flex items-center justify-start pt-6">
                    <label className="relative flex items-center p-3 rounded-full cursor-pointer">
                      <input type="checkbox" name="organic" checked={form.organic} onChange={handleChange} className="before:content[''] peer relative h-6 w-6 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-green-500 checked:bg-green-500 checked:before:bg-green-500 hover:before:opacity-10" />
                      <div className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </label>
                    <label className="cursor-pointer ml-2 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                      🌿 Certified Organic
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={() => { setOpen(false); resetForm(); }}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={saving || uploadingImage}
                className="px-8 py-2.5 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-500 font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 disabled:opacity-50 flex items-center gap-2 transition-all hover:-translate-y-0.5"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Publishing..." : "Publish Produce"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Required for custom scrollbar in modal to hide overflow nicely */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
      `}} />
    </div>
  );
}