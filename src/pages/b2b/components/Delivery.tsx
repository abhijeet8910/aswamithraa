import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { orderService } from "@/services/order.service";

type DeliveryOrder = {
  _id: string;
  orderNumber: string;
  seller: { name: string };
  items: { productName: string; quantity: number; unit: string }[];
  status: string;
  shippingAddress: { city: string; state: string };
  createdAt: string;
};

const Delivery = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getAll();
        const inTransit = (data?.orders || []).filter(
          (o: any) => ["Confirmed", "In Transit", "Delivered"].includes(o.status)
        );
        setOrders(inTransit);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Confirmed: "bg-blue-100 text-blue-700",
      "In Transit": "bg-purple-100 text-purple-700",
      Delivered: "bg-green-100 text-green-700",
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || "bg-gray-100"}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Delivery Tracking</h1>
        <p className="text-blue-100 text-sm">Monitor shipment updates</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No deliveries to track yet</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                {["Order", "Product", "Supplier", "Destination", "Status", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((d) => (
                <tr key={d._id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-3">{d.orderNumber}</td>
                  <td className="px-5 py-3 font-medium">{d.items.map((i) => i.productName).join(", ")}</td>
                  <td className="px-5 py-3">{d.seller?.name || "—"}</td>
                  <td className="px-5 py-3">{d.shippingAddress?.city}, {d.shippingAddress?.state}</td>
                  <td className="px-5 py-3">{statusBadge(d.status)}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(d)} className="px-4 py-1 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-2 text-sm">
              <p><b>Order:</b> {selected.orderNumber}</p>
              <p><b>Products:</b> {selected.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(", ")}</p>
              <p><b>Supplier:</b> {selected.seller?.name}</p>
              <p><b>Destination:</b> {selected.shippingAddress?.city}, {selected.shippingAddress?.state}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;