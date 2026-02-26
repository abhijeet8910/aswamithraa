import React, { useState, useEffect } from "react";
import { Eye, X, Loader2 } from "lucide-react";
import { orderService } from "@/services/order.service";

type OrderStatus = "Pending" | "Confirmed" | "In Transit" | "Delivered" | "Cancelled";

type Order = {
  _id: string;
  orderNumber: string;
  buyer: { _id: string; name: string; email?: string; phone?: string };
  items: { productName: string; quantity: number; unit: string; unitPrice: number; total: number }[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  paymentMode: string;
  shippingAddress: { street: string; city: string; state: string; pincode: string; phone: string };
  notes?: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  Pending: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow",
  Confirmed: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow",
  "In Transit": "bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow",
  Delivered: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow",
  Cancelled: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow",
};

const statusBadge = (status: string) => (
  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusColors[status] || "bg-gray-200"}`}>
    {status}
  </span>
);

const FarmerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data?.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-sm opacity-90">Track all incoming orders</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 flex-wrap">
        {["All", "Pending", "Confirmed", "In Transit", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition font-medium ${filter === tab
              ? "text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md"
              : "bg-white border hover:bg-green-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm mt-1">Orders from buyers will appear here</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
              <tr>
                {["Order ID", "Buyer", "Items", "Amount", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-green-50 transition">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.buyer?.name || "—"}</td>
                  <td className="px-6 py-4 text-sm">
                    {order.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(", ")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">{statusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-nowrap gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition"
                      >
                        <Eye size={14} /> View
                      </button>
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, "Confirmed")}
                          disabled={updatingStatus === order._id}
                          className="px-3 py-1 text-xs text-white rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingStatus === order._id ? "..." : "Confirm"}
                        </button>
                      )}
                      {order.status === "Confirmed" && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, "In Transit")}
                          disabled={updatingStatus === order._id}
                          className="px-3 py-1 text-xs text-white rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                        >
                          {updatingStatus === order._id ? "..." : "Ship"}
                        </button>
                      )}
                      {order.status === "In Transit" && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, "Delivered")}
                          disabled={updatingStatus === order._id}
                          className="px-3 py-1 text-xs text-white rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {updatingStatus === order._id ? "..." : "Delivered"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute right-4 top-4 text-gray-500 hover:text-black">
              <X size={18} />
            </button>
            <h3 className="text-xl font-semibold mb-5">Order Details</h3>
            <div className="space-y-3 text-sm">
              <p><b>Order ID:</b> {selectedOrder.orderNumber}</p>
              <p><b>Buyer:</b> {selectedOrder.buyer?.name}</p>
              <p><b>Items:</b></p>
              <ul className="ml-4 list-disc">
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>{item.productName} — {item.quantity} {item.unit} × ₹{item.unitPrice} = ₹{item.total}</li>
                ))}
              </ul>
              <p><b>Total:</b> ₹{selectedOrder.totalAmount.toLocaleString()}</p>
              <p><b>Date:</b> {formatDate(selectedOrder.createdAt)}</p>
              <p><b>Payment Status:</b> {selectedOrder.paymentStatus}</p>
              <p><b>Payment Mode:</b> {selectedOrder.paymentMode}</p>
              <p><b>Shipping:</b> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
              {selectedOrder.notes && <p><b>Notes:</b> {selectedOrder.notes}</p>}
              <div className="flex items-center gap-2">
                <b>Status:</b> {statusBadge(selectedOrder.status)}
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full py-2 rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-105 transition"
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