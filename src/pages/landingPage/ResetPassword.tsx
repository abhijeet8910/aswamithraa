import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import api from "@/services/api";

/**
 * ResetPassword — Set a new password using the reset token from email.
 * Token is passed via URL query param: /reset-password?token=<token>
 * "Go to Login" uses navigate(-1) to return to the previous page.
 */
export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
        if (password !== confirmPassword) { setError("Passwords do not match"); return; }

        setLoading(true);
        try {
            await api.post("/auth/reset-password", { token, newPassword: password });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid or expired token");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 px-4">
                <div className="text-center space-y-4">
                    <h1 className="text-xl font-bold text-red-600">Invalid Reset Link</h1>
                    <p className="text-gray-500 text-sm">This password reset link is invalid or has expired.</p>
                    <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                        <ArrowLeft className="w-4 h-4" /> Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                        <p className="text-sm text-gray-500 mt-1">Enter your new password below</p>
                    </div>

                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Password Reset!</h2>
                            <p className="text-sm text-gray-500">Your password has been changed successfully.</p>
                            <button onClick={() => navigate(-1)} className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm text-center shadow-lg shadow-green-200">
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none text-sm transition"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none text-sm transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-lg shadow-green-200"
                            >
                                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
