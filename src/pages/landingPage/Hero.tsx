import React from "react";
import { UserRole } from "@/context/AuthContext";
import { Wheat, Building2, ShoppingCart, Shield } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

interface HeroProps {
  onSelectRole: (role: UserRole) => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectRole }) => {
  const loginButtons = [
    {
      id: "farmer" as UserRole,
      label: "Farmer Login",
      icon: Wheat,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "b2b" as UserRole,
      label: "Business Login",
      icon: Building2,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "customer" as UserRole,
      label: "Customer Login",
      icon: ShoppingCart,
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      id: "admin" as UserRole,
      label: "Admin Login",
      icon: Shield,
      color: "bg-red-600 hover:bg-red-700",
    },
  ];

  const stats = [
    { value: "12,500+", label: "Farmers" },
    { value: "₹48Cr", label: "Transactions" },
    { value: "850+", label: "Businesses" },
    { value: "2.1L+", label: "Customers" },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroFarm})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-green-800/70" />

      <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
        {/* Logo */}
        {/* <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ASWAMITHRA</h1>
            <p className="text-xs text-yellow-300">Agricultural Marketplace</p>
          </div>
        </div> */}

        {/* Hero Content */}
        <div className="max-w-2xl">
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Connecting Farmers
            <span className="block text-yellow-400">
              Directly to Markets
            </span>
          </h2>

          <p className="text-lg text-green-100 mb-10">
            Empowering farmers, businesses, and customers through a transparent
            and fair agricultural marketplace platform.
          </p>

          {/* Login Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {loginButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.id}
                  onClick={() => onSelectRole(btn.id)}
                  className={`flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${btn.color}`}
                >
                  <Icon className="w-5 h-5" />
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20"
              >
                <div className="text-yellow-400 font-bold text-lg">
                  {stat.value}
                </div>
                <div className="text-xs text-green-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;