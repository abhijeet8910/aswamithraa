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
  {
    id: "DLV004",
    product: "Onions",
    supplier: "Mahesh Yadav",
    location: "Nashik Storage",
    eta: "3 Days",
    status: "Processing",
  },
];

const statusBadge = (status: Delivery["status"]) => {
  const styles = {
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    "Out for Delivery": "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${styles[status]}`}>
      {status}
    </span>
  );
};

const Delivery = () => {
  const [selected, setSelected] = useState<Delivery | null>(null);

  return (
    <div>
      <div className="space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Delivery Tracking
          </h1>

          <p className="text-muted-foreground text-sm">
            Monitor shipment and logistics updates
          </p>
        </div>

        {/* DELIVERY TABLE */}

        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-muted">
              <tr>
                {[
                  "Delivery ID",
                  "Product",
                  "Supplier",
                  "Location",
                  "ETA",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {deliveries.map((d) => (
                <tr
                  key={d.id}
                  className="border-t cursor-pointer hover:bg-muted/40"
                  onClick={() => setSelected(d)}
                >
                  <td className="px-5 py-3">{d.id}</td>

                  <td className="px-5 py-3 font-medium">{d.product}</td>

                  <td className="px-5 py-3">{d.supplier}</td>

                  <td className="px-5 py-3">{d.location}</td>

                  <td className="px-5 py-3">{d.eta}</td>

                  <td className="px-5 py-3">{statusBadge(d.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DELIVERY DETAILS */}

        {selected && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Delivery Details</h3>

            <p>Delivery ID: {selected.id}</p>
            <p>Product: {selected.product}</p>
            <p>Supplier: {selected.supplier}</p>
            <p>Warehouse: {selected.location}</p>
            <p>ETA: {selected.eta}</p>
            <p>Status: {selected.status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;