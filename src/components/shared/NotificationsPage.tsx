/**
 * NotificationsPage — Full notification list view
 * Accessible via the farmer sidebar "Notifications" tab.
 * Can be reused for other roles by passing notifications data.
 */
import React, { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Loader2, Filter } from "lucide-react";
import { notificationService } from "@/services/notification.service";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getAll();
            setNotifications(data?.notifications || data || []);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id: string) => {
        setProcessing(id);
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        } finally {
            setProcessing(null);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.delete(id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    };

    const timeAgo = (d: string) => {
        const diff = Date.now() - new Date(d).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 30) return `${days}d ago`;
        return new Date(d).toLocaleDateString("en-IN");
    };

    const typeStyles: Record<string, string> = {
        order: "bg-blue-100 text-blue-700",
        payment: "bg-emerald-100 text-emerald-700",
        alert: "bg-amber-100 text-amber-700",
        system: "bg-purple-100 text-purple-700",
        info: "bg-gray-100 text-gray-600",
    };

    const filtered = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold">Notifications</h1>
                    <p className="text-sm text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(["all", "unread"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === f ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {f} {f === "unread" && unreadCount > 0 && <span className="ml-1">({unreadCount})</span>}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500">{filter === "unread" ? "No unread notifications" : "No notifications yet"}</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                    {filtered.map((n) => (
                        <div
                            key={n._id}
                            className={`px-5 py-4 flex items-start gap-4 group hover:bg-muted/50 transition ${!n.isRead ? "bg-blue-50/30" : ""
                                }`}
                        >
                            {/* Unread indicator */}
                            <div className="mt-1.5 flex-shrink-0">
                                {!n.isRead ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                ) : (
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-foreground truncate">{n.title || "Notification"}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${typeStyles[n.type] || typeStyles.info}`}>
                                        {n.type}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{n.message}</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                                {!n.isRead && (
                                    <button
                                        onClick={() => handleMarkRead(n._id)}
                                        disabled={processing === n._id}
                                        className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition"
                                        title="Mark as read"
                                    >
                                        {processing === n._id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(n._id)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
