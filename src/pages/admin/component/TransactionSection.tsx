/**
 * TransactionSection — All Platform Transactions Table
 * ======================================================
 * Displays a full table of all payment transactions on the platform.
 * Shows sender, receiver, amount, payment mode, date, and status.
 *
 * PROPS:
 * - payments: Array of transaction objects from the API
 * - loading: Whether data is still loading
 *
 * Used in AdminDashboard → "Transactions" tab.
 */

import React from "react";
import { Loader2 } from "lucide-react";

interface TransactionSectionProps {
    payments: any[];
    loading: boolean;
}

const TransactionSection: React.FC<TransactionSectionProps> = ({ payments, loading }) => (
    <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">All Transactions</h1>

        {/* --- Loading State --- */}
        {loading ? (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        ) : (
            /* --- Transactions Table --- */
            <div className="bg-card border border-border rounded-xl overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {["From", "To", "Amount", "Mode", "Date", "Status"].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((t: any) => (
                            <tr key={t._id} className="border-t hover:bg-gray-50">
                                <td className="px-5 py-3">{t.from?.name || "—"}</td>
                                <td className="px-5 py-3">{t.to?.name || "—"}</td>
                                <td className="px-5 py-3 font-semibold">₹{t.amount?.toLocaleString()}</td>
                                <td className="px-5 py-3 text-xs">{t.mode}</td>
                                <td className="px-5 py-3 text-xs">
                                    {new Date(t.createdAt).toLocaleDateString("en-IN")}
                                </td>
                                {/* --- Status Badge --- */}
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${t.status === "Completed" ? "bg-green-100 text-green-700" :
                                            t.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default TransactionSection;
