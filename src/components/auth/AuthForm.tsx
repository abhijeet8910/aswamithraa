import React, { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Eye, EyeOff, Phone, Mail, Lock, User, ArrowLeft, Loader2, MapPin, Building2, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  role: UserRole;
  onBack: () => void;
}

const roleConfig = {
  farmer: {
    label: "Farmer",
    color: "hsl(var(--primary))",
    lightColor: "hsl(var(--primary) / 0.08)",
    emoji: "🌾",
    description: "List your produce and connect with buyers directly",
  },
  b2b: {
    label: "B2B Business",
    color: "hsl(var(--info))",
    lightColor: "hsl(var(--info) / 0.08)",
    emoji: "🏢",
    description: "Source fresh agricultural produce in bulk",
  },
  customer: {
    label: "Customer",
    color: "hsl(var(--success))",
    lightColor: "hsl(var(--success) / 0.08)",
    emoji: "🛒",
    description: "Buy fresh farm produce at fair prices",
  },
  admin: {
    label: "Admin",
    color: "hsl(var(--destructive))",
    lightColor: "hsl(var(--destructive) / 0.08)",
    emoji: "🛡️",
    description: "Manage the ASWAMITHRA platform",
  },
};

type AuthMode = "login" | "register";

const AuthForm: React.FC<AuthFormProps> = ({ role, onBack }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    // Farmer
    farmLocation: "",
    farmerCategory: "smallholder" as "smallholder" | "bulk",
    village: "",
    panchayat: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",
    // B2B
    businessName: "",
    gstin: "",
    pan: "",
    contactPerson: "",
    // Shared financial
    upiId: "",
    bankAccountNumber: "",
    ifscCode: "",
  });

  const config = roleConfig[role!] || roleConfig.farmer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const payload: any = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: role as "farmer" | "b2b" | "customer" | "admin",
        };

        if (role === "farmer") {
          payload.farmLocation = form.farmLocation || undefined;
          payload.farmerCategory = form.farmerCategory;
          payload.locationHierarchy = {
            village: form.village || undefined,
            panchayat: form.panchayat || undefined,
            mandal: form.mandal || undefined,
            district: form.district || undefined,
            state: form.state || undefined,
          };
          payload.upiId = form.upiId || undefined;
          payload.bankAccountNumber = form.bankAccountNumber || undefined;
          payload.ifscCode = form.ifscCode || undefined;
          payload.address = {
            street: form.farmLocation || undefined,
            city: form.district || undefined,
            state: form.state || undefined,
            pincode: form.pincode || undefined,
          };
        }

        if (role === "b2b") {
          payload.businessName = form.businessName || undefined;
          payload.gstin = form.gstin || undefined;
          payload.pan = form.pan || undefined;
          payload.contactPerson = form.contactPerson || form.name;
          payload.upiId = form.upiId || undefined;
          payload.bankAccountNumber = form.bankAccountNumber || undefined;
          payload.ifscCode = form.ifscCode || undefined;
        }

        await register(payload);
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate(`/${role}/dashboard`);
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "hsl(var(--background))" }}>
      <div className="w-full max-w-lg">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </button>

        <div className="bg-card rounded-2xl border border-border float-shadow p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: config.lightColor }}
            >
              {config.emoji}
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {config.label} Portal — {config.description}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-lg p-1 mb-6" style={{ background: "hsl(var(--muted))" }}>
            {(["login", "register"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
                style={
                  mode === m
                    ? { background: "hsl(var(--card))", color: config.color, boxShadow: "var(--shadow-card)" }
                    : { color: "hsl(var(--muted-foreground))" }
                }
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="9876543210"
                    className="pl-10"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* ── Farmer Registration Fields ── */}
            {mode === "register" && role === "farmer" && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4" /> Farm Details
                </div>

                {/* Farmer Category Toggle */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Farmer Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["smallholder", "bulk"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleChange("farmerCategory", cat)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${form.farmerCategory === cat
                          ? "bg-green-50 border-green-400 text-green-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {cat === "smallholder" ? "🌱 Smallholder (UPI)" : "🚜 Bulk (Bank)"}
                      </button>
                    ))}
                  </div>
                </div>

                <input placeholder="Farm Location (e.g., Warangal)" className={inputClass} value={form.farmLocation} onChange={(e) => handleChange("farmLocation", e.target.value)} />

                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Village" className={inputClass} value={form.village} onChange={(e) => handleChange("village", e.target.value)} />
                  <input placeholder="Panchayat" className={inputClass} value={form.panchayat} onChange={(e) => handleChange("panchayat", e.target.value)} />
                  <input placeholder="Mandal" className={inputClass} value={form.mandal} onChange={(e) => handleChange("mandal", e.target.value)} />
                  <input placeholder="District" className={inputClass} value={form.district} onChange={(e) => handleChange("district", e.target.value)} />
                  <input placeholder="State" className={inputClass} value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
                  <input placeholder="PIN Code" className={inputClass} maxLength={6} value={form.pincode} onChange={(e) => handleChange("pincode", e.target.value)} />
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 pt-1">
                  <Landmark className="w-4 h-4" /> Payment Details
                </div>
                <input placeholder="UPI ID (e.g., name@upi)" className={inputClass} value={form.upiId} onChange={(e) => handleChange("upiId", e.target.value)} />
                {form.farmerCategory === "bulk" && (
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Bank Account Number *" className={inputClass} value={form.bankAccountNumber} onChange={(e) => handleChange("bankAccountNumber", e.target.value)} required />
                    <input placeholder="IFSC Code *" className={inputClass} value={form.ifscCode} onChange={(e) => handleChange("ifscCode", e.target.value)} required />
                  </div>
                )}
              </div>
            )}

            {/* ── B2B Registration Fields ── */}
            {mode === "register" && role === "b2b" && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building2 className="w-4 h-4" /> Business Details
                </div>
                <input placeholder="Business Name *" className={inputClass} value={form.businessName} onChange={(e) => handleChange("businessName", e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="GSTIN (optional)" className={inputClass} value={form.gstin} onChange={(e) => handleChange("gstin", e.target.value)} />
                  <input placeholder="PAN (optional)" className={inputClass} value={form.pan} onChange={(e) => handleChange("pan", e.target.value.toUpperCase())} maxLength={10} />
                </div>
                <input placeholder="Contact Person" className={inputClass} value={form.contactPerson} onChange={(e) => handleChange("contactPerson", e.target.value)} />

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 pt-1">
                  <CreditCard className="w-4 h-4" /> Payment Details
                </div>
                <input placeholder="UPI ID (optional)" className={inputClass} value={form.upiId} onChange={(e) => handleChange("upiId", e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Bank Account Number" className={inputClass} value={form.bankAccountNumber} onChange={(e) => handleChange("bankAccountNumber", e.target.value)} />
                  <input placeholder="IFSC Code" className={inputClass} value={form.ifscCode} onChange={(e) => handleChange("ifscCode", e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 font-semibold mt-2"
              style={{ background: config.color, color: "hsl(var(--primary-foreground))" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "login" ? "Signing In..." : "Creating Account..."}
                </span>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          {mode === "login" && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} className="font-medium" style={{ color: config.color }}>
                Register now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
