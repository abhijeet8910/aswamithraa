import React from "react";
import { Bell } from "lucide-react";

type Notification = {
  id: number;
  message: string;
  time: string;
  type: "sale" | "payment" | "alert";
  unread: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    message: "50kg Tomatoes sold successfully",
    time: "2 hours ago",
    type: "sale",
    unread: true,
  },
  {
    id: 2,
    message: "Payment of ₹4,250 received",
    time: "5 hours ago",
    type: "payment",
    unread: true,
  },
  {
    id: 3,
    message: "Low stock alert for Rice",
    time: "1 day ago",
    type: "alert",
    unread: false,
  },
];

const FarmerNotification = () => {
  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow flex justify-between items-center">

        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm opacity-90">
              Stay updated with your farm activity
            </p>
          </div>
        </div>

        <button className="text-sm bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
          Mark all as read
        </button>

      </div>


      {/* NOTIFICATIONS LIST */}

      <div className="bg-white border border-green-100 rounded-2xl shadow-sm divide-y">

        {notifications.map((note) => (
          <div
            key={note.id}
            className="p-5 hover:bg-green-50 transition flex justify-between items-start cursor-pointer"
          >

            <div className="flex items-start gap-3">

              {/* UNREAD DOT */}

              {note.unread && (
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
              )}

              <div>

                <p className="text-sm font-medium text-gray-800">
                  {note.message}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {note.time}
                </p>

              </div>

            </div>


            {/* TYPE BADGE */}

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium
                ${
                  note.type === "sale"
                    ? "bg-green-100 text-green-700"
                    : note.type === "payment"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}
            >
              {note.type}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
};

export default FarmerNotification;