import React, { useState } from "react";
import { Eye, X } from "lucide-react";

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
    Pending:
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow",
    Completed:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow",
    Cancelled:
      "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-semibold ${styles[status]}`}
    >
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

      {/* HEADER */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">

<h1 className="text-2xl font-bold">
  Order Managements
</h1>

<p className="text-sm opacity-90">
  Track all incoming orders
</p>

</div>

      {/* FILTER TABS */}

      <div className="flex gap-3 flex-wrap">

        {["All", "Pending", "Completed", "Cancelled"].map((tab) => (

          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition font-medium
            ${
              filter === tab
                ? "text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md"
                : "bg-white border hover:bg-green-50"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-xl shadow-lg overflow-x-auto">

        <table className="w-full min-w-[800px]">

          <thead className="bg-gradient-to-r from-green-50 to-emerald-50">

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
                <th
                  key={h}
                  className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase"
                >
                  {h}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-green-50 transition"
              >

                <td className="px-6 py-4 font-medium">
                  {order.id}
                </td>

                <td className="px-6 py-4">
                  {order.buyer}
                </td>

                <td className="px-6 py-4">
                  {order.product}
                </td>

                <td className="px-6 py-4">
                  {order.quantity}
                </td>

                <td className="px-6 py-4 font-semibold text-green-700">
                  {order.amount}
                </td>

                <td className="px-6 py-4">
                  {order.date}
                </td>

                <td className="px-6 py-4">
                  {statusBadge(order.status)}
                </td>

                <td className="px-6 py-4">

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded-md
                    bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition"
                  >
                    <Eye size={14} />
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

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative">

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold mb-5">
              Order Details
            </h3>

            <div className="space-y-3 text-sm">

              <p><b>Order ID:</b> {selectedOrder.id}</p>
              <p><b>Buyer:</b> {selectedOrder.buyer}</p>
              <p><b>Product:</b> {selectedOrder.product}</p>
              <p><b>Quantity:</b> {selectedOrder.quantity}</p>
              <p><b>Total:</b> {selectedOrder.amount}</p>
              <p><b>Date:</b> {selectedOrder.date}</p>
              <p><b>Location:</b> {selectedOrder.location}</p>

              <div className="flex items-center gap-2">
                <b>Status:</b> {statusBadge(selectedOrder.status)}
              </div>

            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full py-2 rounded-lg text-white
              bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-105 transition"
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