import { useState } from "react";
import { X, Plus } from "lucide-react";

type ProductStatus = "Available" | "Low Stock" | "Out of Stock";

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: string;
  status: ProductStatus;
};

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Other"];
const units = ["Gram", "KG", "Litre", "Quintal"];

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Tomatoes",
    category: "Vegetables",
    quantity: 50,
    unit: "KG",
    price: "₹40/kg",
    status: "Available",
  },
  {
    id: "2",
    name: "Potatoes",
    category: "Vegetables",
    quantity: 20,
    unit: "KG",
    price: "₹30/kg",
    status: "Low Stock",
  },
];

function statusBadge(status: ProductStatus) {
  const styles = {
    Available:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md",
    "Low Stock":
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md",
    "Out of Stock":
      "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function FarmerProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "KG",
    price: "",
    status: "Available",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const category =
      form.category === "Other" ? customCategory : form.category;

    const newProduct = { ...form, category };

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...newProduct, id: editingId } : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { ...newProduct, id: Date.now().toString() },
      ]);
    }

    setOpen(false);
    setEditingId(null);
    setCustomCategory("");
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product.id);
    setOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">

        <div>
          <h1 className="text-3xl font-bold ">
            Product Management
          </h1>

          <p className="text-sm text-white">
            Manage your agricultural products and stock
          </p>
        </div>

        <button
          onClick={() => {
            setOpen(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white
          bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition shadow-lg"
        >
          <Plus size={16} />
          Add Product
        </button>

      </div>

      {/* PRODUCTS TABLE */}

      <div className="bg-white border rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gradient-to-r from-green-50 to-emerald-50">

            <tr>
              {["Name", "Category", "Stock", "Price", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>

          </thead>

          <tbody>

            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-green-50 transition"
              >

                <td className="px-6 py-4 font-medium">{p.name}</td>

                <td className="px-6 py-4">{p.category}</td>

                <td className="px-6 py-4">
                  {p.quantity} {p.unit}
                </td>

                <td className="px-6 py-4 font-semibold text-green-700">
                  {p.price}
                </td>

                <td className="px-6 py-4">
                  {statusBadge(p.status)}
                </td>

                <td className="px-6 py-4 flex gap-2">

                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 text-xs rounded-md text-white
                    bg-gradient-to-r from-blue-500 to-indigo-600
                    hover:scale-105 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 text-xs rounded-md text-white
                    bg-gradient-to-r from-red-500 to-rose-600
                    hover:scale-105 transition"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {open && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative shadow-2xl">

            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              <input
                name="name"
                placeholder="Product Name"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <select
                name="category"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              >
                <option>Select Category</option>

                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              {form.category === "Other" && (
                <input
                  placeholder="Add Category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="border rounded-lg px-4 py-2 md:col-span-2"
                />
              )}

              <input
                name="quantity"
                type="number"
                placeholder="Quantity"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <select
                name="unit"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              >
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <input
                name="price"
                placeholder="Price"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <select
                name="status"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              >
                <option>Available</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>

              <div className="md:col-span-2 flex justify-end">

                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white
                  bg-gradient-to-r from-green-600 to-emerald-500
                  hover:scale-105 transition shadow-md"
                >
                  Save Product
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}