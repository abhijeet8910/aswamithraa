import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { MapPin, Loader2, X } from "lucide-react";

export default function SetAddressModal({ onClose }: { onClose: () => void }) {
    const { user, updateUser } = useAuth();
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError("");

        try {
            await userService.updateProfile({
                address: {
                    ...user?.address,
                    city: city.trim(),
                }
            });
            await updateUser();
            onClose();
        } catch (err: any) {
            setError("Failed to update address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                        <MapPin size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Delivery Location</h2>
                    <p className="text-gray-500 text-sm">Please enter your city to see available fresh produce in your area.</p>
                </div>

                {error && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-600 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="e.g. Hyderabad, Mumbai, Bangalore"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center font-medium"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !city.trim()}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Saving..." : "Confirm Location"}
                    </button>
                </form>
            </div>
        </div>
    );
}
