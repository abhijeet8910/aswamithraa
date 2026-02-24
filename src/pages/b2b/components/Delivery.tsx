import React, { useState } from "react";

type Delivery = {
  id: string;
  product: string;
  supplier: string;
  location: string;
  eta: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
};

const deliveries: Delivery[] = [
  {
    id: "DLV001",
    product: "Basmati Rice",
    supplier: "Ramu Reddy",
    location: "Hyderabad Warehouse",
    eta: "2 Days",
    status: "Shipped",
  },
  {
    id: "DLV002",
    product: "Turmeric",
    supplier: "Lakshmi Bai",
    location: "Warangal Hub",
    eta: "1 Day",
    status: "Out for Delivery",
  },
  {
    id: "DLV003",
    product: "Tomatoes",
    supplier: "Suresh Kumar",
    location: "Guntur Market",
    eta: "Delivered",
    status: "Delivered",
  },
];

const Delivery = () => {
  const [selected, setSelected] = useState<Delivery | null>(null);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Delivery Tracking
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor shipment updates
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs text-left">ID</th>
              <th className="px-5 py-3 text-xs text-left">Product</th>
              <th className="px-5 py-3 text-xs text-left">Supplier</th>
              <th className="px-5 py-3 text-xs text-left">Location</th>
              <th className="px-5 py-3 text-xs text-left">ETA</th>
              <th className="px-5 py-3 text-xs text-left">Status</th>
              <th className="px-5 py-3 text-xs text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {deliveries.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">

                <td className="px-5 py-3">{d.id}</td>
                <td className="px-5 py-3 font-medium">{d.product}</td>
                <td className="px-5 py-3">{d.supplier}</td>
                <td className="px-5 py-3">{d.location}</td>
                <td className="px-5 py-3">{d.eta}</td>

                <td className="px-5 py-3">

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      d.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : d.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : d.status === "Out for Delivery"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>

                </td>

                <td className="px-5 py-3">

                  <button
                    onClick={() => setSelected(d)}
                    className="px-4 py-1 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {selected && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">

            <h2 className="text-lg font-semibold mb-4">
              Delivery Details
            </h2>

            <div className="space-y-2 text-sm">
              <p><b>ID:</b> {selected.id}</p>
              <p><b>Product:</b> {selected.product}</p>
              <p><b>Supplier:</b> {selected.supplier}</p>
              <p><b>Location:</b> {selected.location}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Delivery;