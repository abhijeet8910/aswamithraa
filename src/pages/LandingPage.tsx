// import React, { useState } from "react";
// import { UserRole } from "@/context/AuthContext";
// import { ArrowRight, Wheat, Building2, ShoppingCart, Shield, CheckCircle2 } from "lucide-react";
// import heroFarm from "@/assets/hero-farm.jpg";
// import AuthForm from "@/components/auth/AuthForm";

// const roles = [
//   {
//     id: "farmer" as UserRole,
//     label: "Farmer",
//     icon: Wheat,
//     emoji: "🌾",
//     color: "hsl(var(--primary))",
//     lightColor: "hsl(var(--primary) / 0.08)",
//     borderColor: "hsl(var(--primary) / 0.25)",
//     tagline: "Sell your produce directly",
//     features: ["List products easily", "UPI & bank payments", "Earnings analytics"],
//   },
//   {
//     id: "b2b" as UserRole,
//     label: "B2B Business",
//     icon: Building2,
//     emoji: "🏢",
//     color: "hsl(var(--info))",
//     lightColor: "hsl(210 80% 45% / 0.08)",
//     borderColor: "hsl(210 80% 45% / 0.25)",
//     tagline: "Source produce in bulk",
//     features: ["Bulk order management", "Procurement analytics", "Audit-ready records"],
//   },
//   {
//     id: "customer" as UserRole,
//     label: "Customer",
//     icon: ShoppingCart,
//     emoji: "🛒",
//     color: "hsl(var(--success))",
//     lightColor: "hsl(142 70% 35% / 0.08)",
//     borderColor: "hsl(142 70% 35% / 0.25)",
//     tagline: "Buy fresh at fair prices",
//     features: ["Farm-fresh produce", "Transparent pricing", "Track your savings"],
//   },
//   {
//     id: "admin" as UserRole,
//     label: "Admin",
//     icon: Shield,
//     emoji: "🛡️",
//     color: "hsl(var(--destructive))",
//     lightColor: "hsl(var(--destructive) / 0.08)",
//     borderColor: "hsl(var(--destructive) / 0.25)",
//     tagline: "Manage the platform",
//     features: ["Approve registrations", "Monitor transactions", "Download reports"],
//   },
// ];

// const stats = [
//   { value: "12,500+", label: "Registered Farmers" },
//   { value: "₹48Cr", label: "Transactions Processed" },
//   { value: "850+", label: "B2B Partners" },
//   { value: "2.1 Lakh", label: "Happy Customers" },
// ];

// const LandingPage: React.FC = () => {
//   const [selectedRole, setSelectedRole] = useState<UserRole>(null);

//   if (selectedRole) {
//     return <AuthForm role={selectedRole} onBack={() => setSelectedRole(null)} />;
//   }

//   return (
//     <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${heroFarm})` }}
//         />
//         <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(150 57% 8% / 0.88), hsl(150 57% 16% / 0.72))" }} />

//         <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-32">
//           {/* Top bar */}
//           <div className="flex items-center justify-between mb-16">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--secondary))" }}>
//                 <Wheat className="w-5 h-5" style={{ color: "hsl(var(--secondary-foreground))" }} />
//               </div>
//               <div>
//                 <div className="font-display font-bold text-xl text-white">ASWAMITHRA</div>
//                 <div className="text-xs" style={{ color: "hsl(45 60% 80%)" }}>Agricultural Marketplace</div>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: "hsl(var(--secondary) / 0.4)", background: "hsl(var(--secondary) / 0.1)" }}>
//               <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(var(--secondary))" }} />
//               <span className="text-xs font-medium" style={{ color: "hsl(var(--secondary))" }}>Live Platform</span>
//             </div>
//           </div>

//           {/* Hero content */}
//           <div className="max-w-2xl">
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ background: "hsl(var(--secondary) / 0.15)", color: "hsl(var(--secondary))", border: "1px solid hsl(var(--secondary) / 0.3)" }}>
//               🌾 India's Trusted Agricultural Marketplace
//             </div>
//             <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
//               Connecting Farmers
//               <span className="block" style={{ color: "hsl(var(--secondary))" }}>
//                 to Markets
//               </span>
//               Directly.
//             </h1>
//             <p className="text-lg leading-relaxed mb-8" style={{ color: "hsl(45 30% 80%)" }}>
//               ASWAMITHRA bridges the gap between farmers and buyers — eliminating middlemen,
//               ensuring fair prices, and empowering India's agricultural community.
//             </p>

//             {/* Stats */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {stats.map((stat) => (
//                 <div key={stat.label} className="text-center rounded-xl p-3" style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
//                   <div className="font-display font-bold text-xl" style={{ color: "hsl(var(--secondary))" }}>{stat.value}</div>
//                   <div className="text-xs" style={{ color: "hsl(45 20% 70%)" }}>{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Role Selection */}
//       <section className="max-w-6xl mx-auto px-4 py-16">
//         <div className="text-center mb-12">
//           <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
//             Choose Your Role
//           </h2>
//           <p className="text-muted-foreground text-lg">
//             Select your role to access your personalized dashboard
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {roles.map((role) => {
//             const Icon = role.icon;
//             return (
//               <button
//                 key={role.id}
//                 onClick={() => setSelectedRole(role.id)}
//                 className="group text-left bg-card rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
//                 style={{
//                   borderColor: role.borderColor,
//                   boxShadow: "var(--shadow-card)",
//                 }}
//                 onMouseEnter={(e) => {
//                   (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 40px -8px ${role.color}30`;
//                 }}
//                 onMouseLeave={(e) => {
//                   (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-card)";
//                 }}
//               >
//                 {/* Icon */}
//                 <div
//                   className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform group-hover:scale-110"
//                   style={{ background: role.lightColor }}
//                 >
//                   {role.emoji}
//                 </div>

//                 {/* Label */}
//                 <h3 className="font-display font-bold text-lg text-foreground mb-1">
//                   {role.label}
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-4">{role.tagline}</p>

//                 {/* Features */}
//                 <ul className="space-y-2 mb-5">
//                   {role.features.map((f) => (
//                     <li key={f} className="flex items-center gap-2 text-xs">
//                       <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: role.color }} />
//                       <span className="text-muted-foreground">{f}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* CTA */}
//                 <div className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: role.color }}>
//                   Get Started
//                   <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </section>

     
     
//     </div>
//   );
// };

// export default LandingPage;


import React, { useState } from "react";
import { UserRole } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import Hero from "././landingPage/Hero";
import Navbar from "./landingPage/Navbar";
import HowItWorks from "./landingPage/HowItWorks";
import FarmerSection from "./landingPage/FarmerSection";
import Footer from "./landingPage/Footer";

const landingPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  if (selectedRole) {
    return (
      <AuthForm
        role={selectedRole}
        onBack={() => setSelectedRole(null)}
      />
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-background ">
      <Navbar onSelectRole={setSelectedRole} />
      <Hero onSelectRole={setSelectedRole} />

    </div>
    <HowItWorks/>
    <FarmerSection onSelectRole={setSelectedRole}/>
    <Footer onSelectRole={setSelectedRole}/>
    </div>
    
  );
};

export default landingPage;