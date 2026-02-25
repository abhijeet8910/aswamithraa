import React, { useState, useEffect } from "react";
import { Loader2, Eye, X } from "lucide-react";
import { orderService } from "@/services/order.service";

type Order = {
  _id: string;
  orderNumber: string;
  seller: { _id: string; name: string };
  items: { productName: string; quantity: number; unit: string; unitPrice: number; total: number }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: { street: string; city: string; state: string; pincode: string; phone: string };
  createdAt: string;
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    "In Transit": "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100"}`}>{status}</span>;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data?.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-blue-100 text-sm">Track and manage procurement orders</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {["All", "Pending", "Confirmed", "In Transit", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 text-sm rounded-full font-medium transition ${filter === tab ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow" : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No orders found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {["Order ID", "Supplier", "Items", "Amount", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                  <td className="px-6 py-4">{o.seller?.name || "—"}</td>
                  <td className="px-6 py-4 text-sm">
                    {o.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(", ")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700">₹{o.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(o.createdAt)}</td>
                  <td className="px-6 py-4">{statusBadge(o.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="flex items-center gap-1 px-4 py-1 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-[440px] shadow-2xl relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={18} />
            </button>
            <h3 className="font-semibold text-xl text-indigo-700 mb-5">Order Details</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Order ID:</strong> {selectedOrder.orderNumber}</p>
              <p><strong>Supplier:</strong> {selectedOrder.seller?.name}</p>
              <p><strong>Items:</strong></p>
              <ul className="ml-4 list-disc">
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>{item.productName} — {item.quantity} {item.unit} × ₹{item.unitPrice} = ₹{item.total}</li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</p>
              <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>Shipping:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
              <div className="flex items-center gap-2"><strong>Status:</strong> {statusBadge(selectedOrder.status)}</div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:opacity-90">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;