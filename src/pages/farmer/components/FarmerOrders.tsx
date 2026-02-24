import React, { useState } from "react";

type OrderStatus = "Pending" | "Completed" | "Cancelled";

type Order = {
  id: string;
  buyer: string;
  product: string;
  quantity: string;
  amount: string;
  date: string;
  location: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: "#ORD001",
    buyer: "Ramesh Traders",
    product: "Tomatoes",
    quantity: "50kg",
    amount: "₹4250",
    date: "12 Feb 2026",
    location: "Hyderabad",
    status: "Pending",
  },
  {
    id: "#ORD002",
    buyer: "Lakshmi Vegetables",
    product: "Potatoes",
    quantity: "120kg",
    amount: "₹12800",
    date: "11 Feb 2026",
    location: "Warangal",
    status: "Completed",
  },
  {
    id: "#ORD003",
    buyer: "FreshMart Pvt Ltd",
    product: "Onions",
    quantity: "200kg",
    amount: "₹16000",
    date: "10 Feb 2026",
    location: "Guntur",
    status: "Pending",
  },
  {
    id: "#ORD004",
    buyer: "Green Basket",
    product: "Carrots",
    quantity: "80kg",
    amount: "₹5200",
    date: "9 Feb 2026",
    location: "Bangalore",
    status: "Cancelled",
  },
];

const statusBadge = (status: OrderStatus) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${styles[status]}`}>
      {status}
    </span>
  );
};

const FarmerOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Orders</h1>

      {/* FILTER TABS */}

      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Completed", "Cancelled"].map((tab) => (
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
        ))}
      </div>

      {/* TABLE */}

      <div className="bg-card border rounded-xl overflow-x-auto">

        <table className="w-full min-w-[800px]">

          <thead className="bg-muted">
            <tr>
              {[
                "Order ID",
                "Buyer",
                "Product",
                "Quantity",
                "Amount",
                "Date",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-muted/40">

                <td className="px-5 py-3">{order.id}</td>
                <td className="px-5 py-3">{order.buyer}</td>
                <td className="px-5 py-3">{order.product}</td>
                <td className="px-5 py-3">{order.quantity}</td>
                <td className="px-5 py-3">{order.amount}</td>
                <td className="px-5 py-3">{order.date}</td>
                <td className="px-5 py-3">{statusBadge(order.status)}</td>

                <td className="px-5 py-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h3 className="text-lg font-semibold mb-4">
              Order Details
            </h3>

            <div className="space-y-2 text-sm">

              <p><b>Order ID:</b> {selectedOrder.id}</p>
              <p><b>Buyer:</b> {selectedOrder.buyer}</p>
              <p><b>Product:</b> {selectedOrder.product}</p>
              <p><b>Quantity:</b> {selectedOrder.quantity}</p>
              <p><b>Total:</b> {selectedOrder.amount}</p>
              <p><b>Date:</b> {selectedOrder.date}</p>
              <p><b>Location:</b> {selectedOrder.location}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>

            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default FarmerOrders;