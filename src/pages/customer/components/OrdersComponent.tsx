import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { orderService } from "@/services/order.service";

type Order = {
  _id: string;
  orderNumber: string;
  seller: { name: string };
  items: { productName: string; quantity: number; unit: string; unitPrice: number; total: number }[];
  totalAmount: number;
  status: string;
  shippingAddress: { city: string; state: string };
  createdAt: string;
};

const OrdersComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <h2 className="text-xl font-bold text-green-800">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No orders yet. Start shopping to see your orders here!</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-green-800">
                  {order.items.map((i) => i.productName).join(", ")}
                </p>
                <p className="text-sm text-gray-500">Seller: {order.seller?.name || "—"}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {order.items.map((i) => `${i.quantity} ${i.unit}`).join(", ")} • {formatDate(order.createdAt)}
                </p>
                <p className="text-xs text-gray-400">
                  Delivery: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700">₹{order.totalAmount?.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-700"
                  }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersComponent;