"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { orderService } from "@/services/order.service"

export default function DeliveryManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getAll({ limit: 50 })
        const deliveryOrders = (data?.orders || []).filter(
          (o: any) => ["Confirmed", "In Transit", "Delivered"].includes(o.status)
        )
        setOrders(deliveryOrders)
      } catch (err) {
        console.error("Failed to load deliveries:", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await orderService.updateStatus(id, newStatus)
      setOrders((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      )
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Delivery Management</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No deliveries to manage</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((d) => (
            <div key={d._id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{d.orderNumber}</h3>
                <span className={
                  d.status === "Delivered" ? "px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700" :
                    d.status === "Cancelled" ? "px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700" :
                      "px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700"
                }>
                  {d.status}
                </span>
              </div>

              <p className="text-sm font-medium">{d.buyer?.name || d.seller?.name || "—"}</p>
              <p className="text-xs text-gray-500">Items: {d.items?.map((i: any) => i.productName).join(", ")}</p>
              <p className="text-sm">Amount: <span className="font-semibold">₹{d.totalAmount?.toLocaleString()}</span></p>
              <p className="text-xs text-gray-500">Payment: {d.paymentStatus}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {d.status === "Confirmed" && (
                  <button onClick={() => updateStatus(d._id, "In Transit")} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">
                    Start Delivery
                  </button>
                )}
                {d.status === "In Transit" && (
                  <button onClick={() => updateStatus(d._id, "Delivered")} className="px-3 py-1 text-xs bg-green-600 text-white rounded-md">
                    Mark Delivered
                  </button>
                )}
                {d.status === "Delivered" && (
                  <span className="text-xs text-green-600 font-medium">Completed ✅</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}