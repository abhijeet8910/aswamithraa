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
    Available: "bg-green-100 text-green-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function FarmerProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "KG",
    price: "",
    status: "Available",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

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

      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your agricultural products
          </p>
        </div>

        <button
          onClick={() => {
            setOpen(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Products Table */}

      <div className="bg-card border rounded-xl overflow-x-auto">

        <table className="w-full">

          <thead className="bg-muted">
            <tr>
              {["Name", "Category", "Stock", "Price", "Status", "Actions"].map(
                (h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">

                <td className="px-5 py-3">{p.name}</td>

                <td className="px-5 py-3">{p.category}</td>

                <td className="px-5 py-3">
                  {p.quantity} {p.unit}
                </td>

                <td className="px-5 py-3">{p.price}</td>

                <td className="px-5 py-3">
                  {statusBadge(p.status)}
                </td>

                <td className="px-5 py-3 flex gap-2">

                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4"
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
                className="border rounded-lg px-4 py-2"
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
                  className="bg-primary text-white px-6 py-2 rounded-lg"
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