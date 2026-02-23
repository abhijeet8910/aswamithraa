import React, { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Eye, EyeOff, Phone, Mail, Lock, User, ArrowLeft } from "lucide-react";
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

  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });

  const config = roleConfig[role!] || roleConfig.farmer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name || (role === "admin" ? "Admin User" : `${config.label} User`);
    login(role, name);
    navigate(`/${role}/dashboard`);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "hsl(var(--background))" }}>
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </button>

        <div className="bg-card rounded-2xl border border-border float-shadow p-8">
          {/* Header */}
          <div className="text-center mb-8">
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
                onClick={() => setMode(m)}
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
              <Label className="text-sm font-medium text-foreground">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="+91 98765 43210"
                  className="pl-10"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            {(mode === "register" || role === "b2b" || role === "admin") && (
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
                  />
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
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {mode === "login" && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Don't have an account?{" "}
              <button onClick={() => setMode("register")} className="font-medium" style={{ color: config.color }}>
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
