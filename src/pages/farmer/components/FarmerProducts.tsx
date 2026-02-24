import { useState } from "react";
import { X } from "lucide-react";

export default function FarmerProducts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your farm inventory
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm hover:opacity-90 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {["Name", "Category", "Stock", "Price", "Status"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-muted/40 transition">
              <td className="px-6 py-4 font-medium">Tomatoes</td>
              <td className="px-6 py-4">Vegetables</td>
              <td className="px-6 py-4">120kg</td>
              <td className="px-6 py-4 font-semibold">₹35/kg</td>
              <td className="px-6 py-4 text-primary">Available</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-xl p-6 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              Add New Product
            </h2>

            <form className="space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full mt-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="w-full mt-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Vegetables</option>
                  <option>Grains</option>
                  <option>Spices</option>
                  <option>Fruits</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium">Quantity (kg)</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="w-full mt-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-medium">Price per kg</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  className="w-full mt-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full mt-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Available</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Write product description..."
                  className="w-full mt-1 px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium">Product Image</label>
                <input
                  type="file"
                  className="w-full mt-1 text-sm"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-4 bg-primary text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                Save Product
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}