import { Link } from "react-router-dom";
import { Wheat, ArrowLeft, Tractor, Building2, ShoppingBag, Shield } from "lucide-react";

/**
 * LoginPicker — /login route
 * When users click "Back to Login" from forgot/reset password pages,
 * they land here and pick their role to proceed to the role-specific auth page.
 */
const roles = [
    { label: "Farmer", path: "/farmer", icon: Tractor, emoji: "🌾", color: "from-green-500 to-emerald-600", desc: "Sell your produce directly" },
    { label: "Business (B2B)", path: "/b2b", icon: Building2, emoji: "🏢", color: "from-blue-500 to-indigo-600", desc: "Bulk purchase & supply chain" },
    { label: "Customer", path: "/customer", icon: ShoppingBag, emoji: "🛒", color: "from-amber-500 to-orange-600", desc: "Buy fresh farm produce" },
    { label: "Admin", path: "/admin", icon: Shield, emoji: "🛡️", color: "from-red-500 to-rose-600", desc: "Platform management" },
];

export default function LoginPicker() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                        <Wheat className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome to ASWAMITHRA</h1>
                    <p className="text-sm text-gray-500 mt-1">Choose your account type to sign in</p>
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-2 gap-3">
                    {roles.map((r) => (
                        <Link
                            key={r.path}
                            to={r.path}
                            className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-green-200 transition-all duration-200 text-center"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                                <r.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{r.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
