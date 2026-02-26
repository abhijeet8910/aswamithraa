/**
 * CustomerSection — Customer List with Block/Unblock
 * =====================================================
 * Displays a table of registered customers with the ability
 * to block or unblock them. Customers do NOT go through the
 * approval workflow — they can use the platform immediately.
 *
 * BLOCK/UNBLOCK LOGIC:
 * - Calls userService.blockUser(id) which toggles the `isBlocked` flag
 * - The backend toggleBlockUser controller handles the toggle
 * - After toggling, the user list is refreshed
 *
 * PROPS:
 * - users: Array of customer user objects
 * - loading: Whether data is still loading
 * - onBlockToggle: Callback to refresh the user list after blocking/unblocking
 *
 * Used in AdminDashboard → "Customers" tab.
 */

import React, { useState } from "react";
import { Loader2, ShieldOff, ShieldCheck } from "lucide-react";
import { userService } from "@/services/user.service";

interface CustomerSectionProps {
    users: any[];
    loading: boolean;
    onBlockToggle?: () => void; // Optional callback to refresh parent data
}

const CustomerSection: React.FC<CustomerSectionProps> = ({ users, loading, onBlockToggle }) => {
    // Track which user is currently being blocked/unblocked (for loading UI)
    const [processingId, setProcessingId] = useState<string | null>(null);

    /**
     * Toggle block/unblock for a customer.
     * The backend API toggles the isBlocked flag automatically.
     */
    const handleBlockToggle = async (id: string) => {
        setProcessingId(id);
        try {
            await userService.blockUser(id);
            // Notify parent to refresh the user list
            if (onBlockToggle) onBlockToggle();
        } catch (err) {
            console.error("Failed to toggle block:", err);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold">Customers</h1>

            {/* --- Loading State --- */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : (
                /* --- Customer Table --- */
                <div className="bg-card border border-border rounded-xl overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Name", "Email", "Phone", "Joined", "Status", "Action"].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((c: any) => (
                                <tr key={c._id} className="border-t hover:bg-gray-50">
                                    <td className="px-5 py-3 font-medium">{c.name}</td>
                                    <td className="px-5 py-3">{c.email}</td>
                                    <td className="px-5 py-3">{c.phone || "—"}</td>
                                    <td className="px-5 py-3 text-xs text-gray-500">
                                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                    {/* --- Status Badge --- */}
                                    <td className="px-5 py-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${c.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                            }`}>
                                            {c.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>
                                    {/* --- Block/Unblock Button --- */}
                                    <td className="px-5 py-3">
                                        <button
                                            onClick={() => handleBlockToggle(c._id)}
                                            disabled={processingId === c._id}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${c.isBlocked
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                        >
                                            {processingId === c._id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : c.isBlocked ? (
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                            ) : (
                                                <ShieldOff className="w-3.5 h-3.5" />
                                            )}
                                            {c.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomerSection;
