import React, { useState } from "react";

type Order = {
  id: string;
  farmer: string;
  product: string;
  quantity: string;
  amount: string;
  date: string;
  location: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
};

const orders: Order[] = [
  {
    id: "ORD101",
    farmer: "Ramu Reddy",
    product: "Basmati Rice",
    quantity: "1000 kg",
    amount: "₹68,000",
    date: "12 Feb 2026",
    location: "Hyderabad",
    status: "Pending",
  },
  {
    id: "ORD102",
    farmer: "Lakshmi Bai",
    product: "Turmeric",
    quantity: "300 kg",
    amount: "₹28,500",
    date: "14 Feb 2026",
    location: "Warangal",
    status: "Processing",
  },
  {
    id: "ORD103",
    farmer: "Suresh Kumar",
    product: "Tomatoes",
    quantity: "500 kg",
    amount: "₹17,500",
    date: "15 Feb 2026",
    location: "Guntur",
    status: "Completed",
  },
  {
    id: "ORD104",
    farmer: "Mahesh Yadav",
    product: "Onions",
    quantity: "700 kg",
    amount: "₹22,000",
    date: "16 Feb 2026",
    location: "Nashik",
    status: "Cancelled",
  },
  {
    id: "ORD105",
    farmer: "Anil Kumar",
    product: "Potatoes",
    quantity: "1200 kg",
    amount: "₹36,000",
    date: "18 Feb 2026",
    location: "Agra",
    status: "Pending",
  },
];

const statusBadge = (status: Order["status"]) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${styles[status]}`}>
      {status}
    </span>
  );
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Order Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Track and manage procurement orders
          </p>
        </div>

        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
          + Create Order
        </button>
      </div>

      {/* FILTER TABS */}

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Processing", "Completed", "Cancelled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm rounded-lg border ${
                filter === tab
                  ? "bg-primary text-white"
                  : "bg-card text-foreground"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ORDERS TABLE */}

      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-muted">
            <tr>
              {[
                "Order ID",
                "Supplier",
                "Product",
                "Amount",
                "Status",
                "Actions",
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
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-muted/40">
                <td className="px-5 py-3">{o.id}</td>
                <td className="px-5 py-3">{o.farmer}</td>
                <td className="px-5 py-3">{o.product}</td>
                <td className="px-5 py-3 font-semibold">{o.amount}</td>
                <td className="px-5 py-3">{statusBadge(o.status)}</td>

                <td className="px-5 py-3">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[420px] shadow-lg">

            <h3 className="font-semibold text-lg mb-4">
              Order Details
            </h3>

            <div className="space-y-2 text-sm">

              <p><strong>Order ID:</strong> {selectedOrder.id}</p>

              <p><strong>Supplier:</strong> {selectedOrder.farmer}</p>

              <p><strong>Product:</strong> {selectedOrder.product}</p>

              <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>

              <p><strong>Amount:</strong> {selectedOrder.amount}</p>

              <p><strong>Status:</strong> {selectedOrder.status}</p>

              <p><strong>Date:</strong> {selectedOrder.date}</p>

              <p><strong>Location:</strong> {selectedOrder.location}</p>

            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-5 w-full px-4 py-2 bg-primary text-white rounded-lg"
            >
              Close
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Orders;