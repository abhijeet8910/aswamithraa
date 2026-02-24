import React from 'react'
import { Bell } from 'lucide-react'

const FarmerNotification = () => {
  return (
    <div>
      <div className="space-y-8">
  <h1 className="text-2xl font-bold flex items-center gap-2">
    <Bell className="w-5 h-5 text-primary" />
    Notifications
  </h1>

  <div className="bg-card border border-border rounded-2xl divide-y">
    {[
      "50kg Tomatoes sold successfully",
      "Payment of ₹4,250 received",
      "Low stock alert for Rice",
    ].map((note, i) => (
      <div
        key={i}
        className="p-5 hover:bg-muted/40 transition cursor-pointer"
      >
        <div className="text-sm">{note}</div>
        <div className="text-xs text-muted-foreground mt-1">
          2 hours ago
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  )
}

export default FarmerNotification
