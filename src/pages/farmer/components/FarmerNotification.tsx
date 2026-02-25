import React, { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { notificationService } from "@/services/notification.service";

type Notification = {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

const FarmerNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const typeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: "bg-blue-100 text-blue-700",
      payment: "bg-green-100 text-green-700",
      alert: "bg-yellow-100 text-yellow-700",
      system: "bg-gray-100 text-gray-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm opacity-90">Stay updated with your farm activity</p>
          </div>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-sm bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
        >
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No notifications yet</p>
          <p className="text-sm mt-1">You'll see updates about orders, payments, and alerts here</p>
        </div>
      ) : (
        <div className="bg-white border border-green-100 rounded-2xl shadow-sm divide-y">
          {notifications.map((note) => (
            <div
              key={note._id}
              className={`p-5 hover:bg-green-50 transition flex justify-between items-start ${!note.isRead ? "bg-green-50/50" : ""}`}
            >
              <div className="flex items-start gap-3">
                {!note.isRead && <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />}
                <div>
                  <p className="text-sm font-medium text-gray-800">{note.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{timeAgo(note.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColor(note.type)}`}>
                  {note.type}
                </span>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerNotification;