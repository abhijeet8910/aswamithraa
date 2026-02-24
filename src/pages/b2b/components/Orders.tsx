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
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
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
    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-blue-100 text-sm">
            Track and manage procurement orders
          </p>
        </div>

        <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium shadow hover:bg-gray-100">
          + Create Order
        </button>
      </div>

      {/* FILTER TABS */}

      <div className="flex flex-wrap gap-3">
        {["All", "Pending", "Processing", "Completed", "Cancelled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 text-sm rounded-full font-medium transition ${
                filter === tab
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ORDERS TABLE */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">

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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((o) => (
              <tr
                key={o.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">{o.id}</td>

                <td className="px-6 py-4">{o.farmer}</td>

                <td className="px-6 py-4">{o.product}</td>

                <td className="px-6 py-4 font-semibold text-green-700">
                  {o.amount}
                </td>

                <td className="px-6 py-4">
                  {statusBadge(o.status)}
                </td>

                <td className="px-6 py-4">

                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-4 py-1 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-7 w-[440px] shadow-2xl">

            <h3 className="font-semibold text-xl text-indigo-700 mb-5">
              Order Details
            </h3>

            <div className="space-y-3 text-sm">

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
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:opacity-90"
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