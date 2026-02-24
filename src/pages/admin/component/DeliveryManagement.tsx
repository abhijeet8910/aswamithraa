"use client"

import { useState } from "react"

interface DeliveryItem {
  id: string
  order: string
  customer: string
  partner: string
  status: string
  payment: string
  amount: string
}

const initialDeliveryData: DeliveryItem[] = [
  {
    id: "DLV-501",
    order: "ORD-1001",
    customer: "Anita Sharma",
    partner: "BlueDart",
    status: "Pending Approval",
    payment: "Paid",
    amount: "₹1,240",
  },
  {
    id: "DLV-502",
    order: "ORD-1002",
    customer: "Rahul Verma",
    partner: "Delhivery",
    status: "Processing",
    payment: "COD",
    amount: "₹890",
  },
]

export default function DeliveryManagement() {
  const [deliveryData, setDeliveryData] = useState(initialDeliveryData)

  const updateStatus = (id: string, newStatus: string) => {
    setDeliveryData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">
        Delivery Management
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryData.map((d) => (
          <div
            key={d.id}
            className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{d.id}</h3>
              <span
                className={
                  d.status === "Delivered"
                    ? "badge-success"
                    : d.status === "Cancelled"
                    ? "badge-destructive"
                    : "badge-warning"
                }
              >
                {d.status}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Order: {d.order}
            </p>
            <p className="text-sm font-medium">{d.customer}</p>
            <p className="text-xs text-muted-foreground">
              Partner: {d.partner}
            </p>
            <p className="text-sm">
              Amount: <span className="font-semibold">{d.amount}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Payment: {d.payment}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2 pt-2">

              {d.status === "Pending Approval" && (
                <>
                  <button
                    onClick={() => updateStatus(d.id, "Processing")}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(d.id, "Cancelled")}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
                  >
                    Reject
                  </button>
                </>
              )}

              {d.status === "Processing" && (
                <button
                  onClick={() =>
                    updateStatus(d.id, "Out for Delivery")
                  }
                  className="px-3 py-1 text-xs bg-yellow-600 text-white rounded-md"
                >
                  Start Delivery
                </button>
              )}

              {d.status === "Out for Delivery" && (
                <button
                  onClick={() => updateStatus(d.id, "Delivered")}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded-md"
                >
                  Mark Delivered
                </button>
              )}

              {d.status === "Delivered" && (
                <span className="text-xs text-green-600 font-medium">
                  Completed
                </span>
              )}

              {d.status === "Cancelled" && (
                <span className="text-xs text-red-600 font-medium">
                  Cancelled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}