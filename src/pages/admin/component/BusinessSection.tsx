/**
 * BusinessSection — B2B Business Accounts List
 * ===============================================
 * Displays a grid of registered B2B business accounts.
 * Shows account name, verification status, email, and phone.
 *
 * PROPS:
 * - users: Array of B2B user objects
 * - loading: Whether data is still loading
 *
 * Used in AdminDashboard → "Businesses" tab.
 */

import React from "react";
import { Loader2 } from "lucide-react";

interface BusinessSectionProps {
    users: any[];
    loading: boolean;
}

const BusinessSection: React.FC<BusinessSectionProps> = ({ users, loading }) => (
    <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Business Accounts</h1>

        {/* --- Loading State --- */}
        {loading ? (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        ) : users.length === 0 ? (
            /* --- Empty State --- */
            <div className="text-center py-20 text-gray-500">No business accounts found</div>
        ) : (
            /* --- Business Cards Grid --- */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((b: any) => (
                    <div key={b._id} className="bg-card border border-border rounded-xl p-5 space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{b.businessName || b.name}</h3>
                            {/* Verification status badge */}
                            <span className={`px-2.5 py-0.5 text-xs rounded-full ${b.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {b.isVerified ? "Verified" : "Pending"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">{b.email}</p>
                        <p className="text-sm">Phone: <span className="font-semibold">{b.phone || "—"}</span></p>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default BusinessSection;
