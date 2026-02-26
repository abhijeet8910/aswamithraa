/**
 * ApplicationsSection — Farmer & B2B Approval Management
 * ========================================================
 * This component is used in the Admin Dashboard ("Applications" tab).
 * It displays a list of farmer and B2B applications that need
 * approval or rejection from the admin.
 *
 * FEATURES:
 * - Filter by status: pending / approved / rejected
 * - Approve with one click
 * - Reject with an optional reason note
 * - Shows application details (email, phone, business info, location)
 *
 * NOTE: Customers do NOT go through the approval flow.
 *       They are managed via the CustomerSection (block/unblock).
 */

import React, { useState, useEffect } from "react";
import {
    CheckCircle, XCircle, Loader2, FileText, MapPin, Phone, Mail,
    Wheat, Building2
} from "lucide-react";
import { userService } from "@/services/user.service";

const ApplicationsSection: React.FC = () => {
    // --- State for the applications list and UI ---
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("pending"); // "pending" | "approved" | "rejected"
    const [rejectNote, setRejectNote] = useState<Record<string, string>>({}); // Per-app rejection notes
    const [processing, setProcessing] = useState<string | null>(null); // ID of app currently being processed

    // --- Fetch applications whenever the filter changes ---
    useEffect(() => {
        fetchApplications();
    }, [filter]);

    /**
     * Fetches applications from the API filtered by status.
     * The backend already filters to only farmer and B2B roles.
     */
    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await userService.getPendingApplications(filter);
            setApplications(data || []);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle approve or reject action on an application.
     * On rejection, includes the optional note if provided.
     */
    const handleAction = async (id: string, status: "approved" | "rejected") => {
        setProcessing(id);
        try {
            const note = status === "rejected" ? rejectNote[id] : undefined;
            await userService.handleApplication(id, status, note);
            // Remove from the list after successful action
            setApplications((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error(`Failed to ${status}:`, err);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* --- Header --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold">Seller & Buyer Applications</h1>
                    <p className="text-sm text-muted-foreground">Manage farmer and B2B approval requests</p>
                </div>
            </div>

            {/* --- Status Filter Tabs --- */}
            <div className="flex gap-2">
                {["pending", "approved", "rejected"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === s
                                ? s === "pending" ? "bg-yellow-100 text-yellow-800"
                                    : s === "approved" ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {s} {s === "pending" && <span className="ml-1">({applications.length})</span>}
                    </button>
                ))}
            </div>

            {/* --- Loading / Empty / Application Cards --- */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No {filter} applications found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                            {/* --- Application Header (name, role badge, status) --- */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${app.role === "farmer" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {(app.name || "U")[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${app.role === "farmer" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {app.role === "farmer" ? "🌾 Farmer — Apply to Sell" : "🏢 B2B — Bulk Purchase"}
                                        </span>
                                    </div>
                                </div>
                                {/* Status badge */}
                                <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${app.applicationStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        app.applicationStatus === "approved" ? "bg-green-100 text-green-700" :
                                            "bg-red-100 text-red-700"
                                    }`}>
                                    {app.applicationStatus}
                                </span>
                            </div>

                            {/* --- Contact & Business Details --- */}
                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-3.5 h-3.5" /> {app.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-3.5 h-3.5" /> {app.phone}
                                </div>
                                {app.businessName && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building2 className="w-3.5 h-3.5" /> {app.businessName}
                                    </div>
                                )}
                                {app.farmLocation && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Wheat className="w-3.5 h-3.5" /> {app.farmLocation}
                                    </div>
                                )}
                                {app.address?.city && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-3.5 h-3.5" /> {app.address.street ? `${app.address.street}, ` : ""}{app.address.city}, {app.address.state} - {app.address.pincode}
                                    </div>
                                )}
                                {app.gstin && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FileText className="w-3.5 h-3.5" /> GSTIN: {app.gstin}
                                    </div>
                                )}
                            </div>

                            {/* --- Rejection Note (if previously rejected) --- */}
                            {app.applicationNote && (
                                <div className="text-sm bg-red-50 border border-red-100 rounded-lg p-2 text-red-700">
                                    Admin note: {app.applicationNote}
                                </div>
                            )}

                            {/* --- Approve/Reject Action Buttons (only for pending) --- */}
                            {filter === "pending" && (
                                <div className="flex items-center gap-3 pt-2 border-t">
                                    <button
                                        onClick={() => handleAction(app._id, "approved")}
                                        disabled={processing === app._id}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                                    >
                                        {processing === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                        Approve
                                    </button>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            placeholder="Rejection reason (optional)"
                                            value={rejectNote[app._id] || ""}
                                            onChange={(e) => setRejectNote({ ...rejectNote, [app._id]: e.target.value })}
                                            className="flex-1 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-red-200 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleAction(app._id, "rejected")}
                                            disabled={processing === app._id}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition"
                                        >
                                            <XCircle className="w-3.5 h-3.5" /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationsSection;
