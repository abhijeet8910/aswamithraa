/**
 * NotificationDropdown — Bell Icon with Real-Time Notification Panel
 * ====================================================================
 * This component replaces the static bell icon in the DashboardLayout header.
 * It shows a badge with the unread count and opens a dropdown panel
 * displaying recent notifications with mark-as-read and delete actions.
 *
 * FEATURES:
 * - Unread count badge (red dot with number)
 * - Dropdown panel with notification list
 * - Mark individual as read / Mark all as read
 * - Delete notifications
 * - Uses React Query for fast caching
 * - Auto-updates via Socket.io (SocketContext invalidates the cache)
 *
 * USAGE (in DashboardLayout):
 *   <NotificationDropdown />
 */

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Loader2, X } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from "@/hooks/queries/useNotifications";

/** Type for a single notification item */
interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

const NotificationDropdown: React.FC = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- React Query hooks for data + mutations ---
    const { data, isLoading } = useNotifications();
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();
    const deleteNotif = useDeleteNotification();

    // --- Parse notification data ---
    const notifications: Notification[] = data?.notifications || data || [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // --- Close dropdown when clicking outside ---
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /**
     * Format a date string into a human-readable "time ago" format.
     * Example: "5 min ago", "2 hr ago", "3 days ago"
     */
    const timeAgo = (d: string) => {
        const diff = Date.now() - new Date(d).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    /** Color map for notification type badges */
    const typeColor = (type: string) => {
        const colors: Record<string, string> = {
            order: "bg-blue-100 text-blue-700",
            payment: "bg-emerald-100 text-emerald-700",
            alert: "bg-amber-100 text-amber-700",
            system: "bg-purple-100 text-purple-700",
            info: "bg-gray-100 text-gray-600",
        };
        return colors[type] || "bg-gray-100 text-gray-600";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- Bell Button with Unread Badge --- */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-4.5 h-4.5 text-muted-foreground" />
                {/* Unread count badge - only show if there are unread notifications */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-red-500 px-1 shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* --- Dropdown Panel --- */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-card border border-border rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Mark all as read button */}
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllRead.mutate()}
                                    className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition flex items-center gap-1"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" /> Read all
                                </button>
                            )}
                            {/* Close button */}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded hover:bg-muted transition"
                            >
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Bell className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 20).map((n) => (
                                <div
                                    key={n._id}
                                    className={`px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition cursor-pointer group ${!n.isRead ? "bg-blue-50/30" : ""
                                        }`}
                                    onClick={() => {
                                        if (!n.isRead) markRead.mutate(n._id);
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Unread dot indicator */}
                                        <div className="flex-shrink-0 mt-1.5">
                                            {!n.isRead ? (
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-transparent" />
                                            )}
                                        </div>

                                        {/* Notification content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {n.title || "Notification"}
                                                </span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${typeColor(n.type)}`}>
                                                    {n.type}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                                        </div>

                                        {/* Delete button (shows on hover) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotif.mutate(n._id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition flex-shrink-0"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-border bg-muted/30 text-center">
                            <span className="text-xs text-muted-foreground">
                                Showing {Math.min(notifications.length, 20)} of {notifications.length} notifications
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
