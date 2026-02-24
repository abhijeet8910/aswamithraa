import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users, Wheat, Building2, CreditCard, TrendingUp, ArrowUpRight,
  CheckCircle, XCircle, Clock, AlertCircle, Download, Eye, Shield
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import DeliveryManagement from "./component/DeliveryManagement";
import Farmers from "./component/Farmers";

const transactionTrend = [
  { month: "Aug", volume: 1240000, count: 342 },
  { month: "Sep", volume: 1580000, count: 428 },
  { month: "Oct", volume: 1420000, count: 389 },
  { month: "Nov", volume: 1890000, count: 512 },
  { month: "Dec", volume: 2240000, count: 618 },
  { month: "Jan", volume: 2080000, count: 574 },
];

const categoryPie = [
  { name: "Grains", value: 38 },
  { name: "Vegetables", value: 32 },
  { name: "Spices", value: 18 },
  { name: "Fruits", value: 12 },
];
// ---------------- FARMERS ----------------
export const farmersData = [
  { id: "F-1001", name: "Ramu Reddy", location: "Telangana", products: 12, joined: "Oct 2025", status: "Approved", earnings: "₹2,45,000" },
  { id: "F-1002", name: "Lakshmi Bai", location: "Maharashtra", products: 8, joined: "Nov 2025", status: "Pending", earnings: "₹1,12,000" },
  { id: "F-1003", name: "Govind Rao", location: "Karnataka", products: 15, joined: "Sep 2025", status: "Suspended", earnings: "₹3,01,000" },
];

// ---------------- BUSINESSES ----------------
const businessData = [
  { id: "B-201", name: "FreshMart Pvt Ltd", gst: "36AABCS1234F1Z5", orders: 142, volume: "₹18.4L", status: "Verified" },
  { id: "B-202", name: "AgroBulk Traders", gst: "27AACCA4567D1Z2", orders: 89, volume: "₹9.2L", status: "Pending" },
  { id: "B-203", name: "GreenSource Foods", gst: "29AAACG2233L1Z4", orders: 201, volume: "₹22.1L", status: "Verified" },
];

// ---------------- CUSTOMERS ----------------
const customersData = [
  { id: "C-301", name: "Anita Sharma", email: "anita@gmail.com", orders: 14, spent: "₹28,400", status: "Active" },
  { id: "C-302", name: "Rahul Verma", email: "rahul@gmail.com", orders: 6, spent: "₹7,200", status: "Active" },
  { id: "C-303", name: "Priya Nair", email: "priya@gmail.com", orders: 0, spent: "₹0", status: "Blocked" },
];

// ---------------- DELIVERY ----------------
const deliveryData = [
  { id: "DLV-501", order: "ORD-1001", partner: "BlueDart", status: "In Transit", eta: "2 Days" },
  { id: "DLV-502", order: "ORD-1002", partner: "Delhivery", status: "Delivered", eta: "Completed" },
  { id: "DLV-503", order: "ORD-1003", partner: "DTDC", status: "Delayed", eta: "1 Day Delay" },
];

// ---------------- TRANSACTIONS ----------------
const allTransactions = [
  { id: "TXN-9001", user: "FreshMart", amount: "₹1,36,000", date: "Jan 20", status: "Success" },
  { id: "TXN-9002", user: "Lakshmi Bai", amount: "₹18,500", date: "Jan 21", status: "Pending" },
  { id: "TXN-9003", user: "Anita Sharma", amount: "₹980", date: "Jan 22", status: "Failed" },
];

const PIE_COLORS = ["hsl(150,57%,22%)", "hsl(38,90%,55%)", "hsl(210,80%,45%)", "hsl(142,70%,35%)"];

const pendingApprovals = [
  { id: "F-2841", name: "Ramesh Patel", type: "Farmer", location: "Rajkot, Gujarat", date: "Jan 23", docs: "Complete" },
  { id: "B-0192", name: "Agro Fresh Pvt Ltd", type: "Business", location: "Mumbai, Maharashtra", date: "Jan 22", docs: "Pending" },
  { id: "F-2839", name: "Sunita Devi", type: "Farmer", location: "Patna, Bihar", date: "Jan 21", docs: "Complete" },
  { id: "B-0191", name: "GreenSource Foods", type: "Business", location: "Pune, Maharashtra", date: "Jan 20", docs: "Complete" },
];

const recentTransactions = [
  { id: "TXN-8821", from: "Ramesh Patel", to: "Agro Fresh Pvt Ltd", amount: "₹85,400", mode: "Bank Transfer", status: "Completed", date: "Jan 23" },
  { id: "TXN-8820", from: "Sunita Devi", to: "Priya Sharma", amount: "₹1,250", mode: "UPI", status: "Completed", date: "Jan 23" },
  { id: "TXN-8819", from: "Govind Rao", to: "B2B Corp Ltd", amount: "₹42,000", mode: "Bank Transfer", status: "Processing", date: "Jan 22" },
  { id: "TXN-8818", from: "Lakshmi Bai", to: "Anita Kumar", amount: "₹980", mode: "UPI", status: "Failed", date: "Jan 22" },
];

const txnStatus = (status: string) => {
  if (status === "Completed") return <span className="badge-success">{status}</span>;
  if (status === "Processing") return <span className="badge-warning">{status}</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>{status}</span>;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [approvals, setApprovals] = useState(pendingApprovals);

  const handleApprove = (id: string) => setApprovals((prev) => prev.filter((a) => a.id !== id));
  const handleReject = (id: string) => setApprovals((prev) => prev.filter((a) => a.id !== id));

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Admin Control Panel</h1>
              <p className="text-muted-foreground text-sm">Platform overview and management</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Registered Farmers", value: "12,548", icon: Wheat, delta: "+142 this month", color: "hsl(var(--primary))" },
              { label: "B2B Businesses", value: "862", icon: Building2, delta: "+18 this month", color: "hsl(210 80% 45%)" },
              { label: "Active Customers", value: "2,14,680", icon: Users, delta: "+3,200 this month", color: "hsl(var(--success))" },
              { label: "Total Volume (MTD)", value: "₹2.08Cr", icon: CreditCard, delta: "+16% vs last month", color: "hsl(var(--secondary))" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "hsl(var(--success))" }} />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs font-medium text-foreground mb-0.5">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.delta}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Transaction Volume Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-foreground">Transaction Volume</h3>
                  <p className="text-xs text-muted-foreground">Monthly platform transaction flow (₹)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={transactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(2)}L`, "Volume"]} />
                  <Bar dataKey="volume" fill="hsl(150,57%,22%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold text-foreground mb-4">Trade by Category</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {categoryPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryPie.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="font-semibold text-foreground ml-auto">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
                Pending Approvals
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "hsl(var(--warning) / 0.15)", color: "hsl(var(--warning))" }}>
                  {approvals.length}
                </span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["ID", "Name", "Type", "Location", "Date", "Documents", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground text-sm">
                        All approvals processed ✅
                      </td>
                    </tr>
                  ) : (
                    approvals.map((a) => (
                      <tr key={a.id} className="data-table-row">
                        <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{a.id}</td>
                        <td className="px-5 py-3.5 text-sm font-medium text-foreground">{a.name}</td>
                        <td className="px-5 py-3.5">
                          <span className={a.type === "Farmer" ? "badge-success" : "badge-info"}>{a.type}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.location}</td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.date}</td>
                        <td className="px-5 py-3.5">
                          <span className={a.docs === "Complete" ? "badge-success" : "badge-warning"}>{a.docs}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(a.id)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(a.id)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["Txn ID", "From", "To", "Amount", "Mode", "Date", "Status"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={t.id} className="data-table-row">
                      <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{t.id}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{t.from}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{t.to}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{t.amount}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.mode}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.date}</td>
                      <td className="px-5 py-3.5">{txnStatus(t.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* famers section */}
      {activeTab === "farmers" && (
  <Farmers/>
)}

{/* business section */}
{activeTab === "businesses" && (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Business Accounts</h1>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businessData.map((b) => (
        <div key={b.id} className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{b.name}</h3>
            <span className={b.status === "Verified" ? "badge-success" : "badge-warning"}>
              {b.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">GST: {b.gst}</p>
          <p className="text-sm">Orders: <span className="font-semibold">{b.orders}</span></p>
          <p className="text-sm">Volume: <span className="font-semibold">{b.volume}</span></p>
        </div>
      ))}
    </div>
  </div>
)}
  {/* customers section */}
  {activeTab === "customers" && (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Customers</h1>

    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-muted">
          <tr>
            {["ID", "Name", "Email", "Orders", "Spent", "Status"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customersData.map((c) => (
            <tr key={c.id} className="data-table-row">
              <td className="px-5 py-3 text-xs font-mono">{c.id}</td>
              <td className="px-5 py-3 font-medium">{c.name}</td>
              <td className="px-5 py-3">{c.email}</td>
              <td className="px-5 py-3">{c.orders}</td>
              <td className="px-5 py-3 font-semibold">{c.spent}</td>
              <td className="px-5 py-3">
                <span className={c.status === "Active" ? "badge-success" : "badge-destructive"}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* delivery section */}
{activeTab === "delivery" && (
  <DeliveryManagement/>
)}

{/* transcation section */}
{activeTab === "transactions" && (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">All Transactions</h1>

    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            {["Txn ID", "User", "Amount", "Date", "Status"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allTransactions.map((t) => (
            <tr key={t.id} className="data-table-row">
              <td className="px-5 py-3 font-mono text-xs">{t.id}</td>
              <td className="px-5 py-3">{t.user}</td>
              <td className="px-5 py-3 font-semibold">{t.amount}</td>
              <td className="px-5 py-3">{t.date}</td>
              <td className="px-5 py-3">
                <span className={
                  t.status === "Success"
                    ? "badge-success"
                    : t.status === "Pending"
                    ? "badge-warning"
                    : "badge-destructive"
                }>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
{/* analytics section */}
{activeTab === "analytics" && (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Platform Analytics</h1>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Farmers", value: "1,248" },
        { label: "Total Businesses", value: "326" },
        { label: "Orders", value: "5,820" },
        { label: "Revenue", value: "₹1.8Cr" },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="text-xl font-bold">{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
)}
{/* reports */}
{activeTab === "reports" && (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Reports</h1>

    <div className="grid md:grid-cols-3 gap-6">
      {["Sales Report", "Farmer Activity", "Monthly Revenue"].map((r) => (
        <div key={r} className="bg-card border border-border rounded-xl p-6 text-center">
          <h3 className="font-semibold">{r}</h3>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm">
            Download PDF
          </button>
        </div>
      ))}
    </div>
  </div>
)}
{/* settings */}
{activeTab === "settings" && (
  <div className="space-y-6 max-w-xl">
    <h1 className="font-display text-2xl font-bold">Admin Settings</h1>

    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <input
        type="text"
        placeholder="Platform Name"
        className="w-full px-4 py-2 border rounded-lg bg-background"
      />
      <input
        type="email"
        placeholder="Support Email"
        className="w-full px-4 py-2 border rounded-lg bg-background"
      />
      <button className="px-6 py-2 bg-primary text-white rounded-lg">
        Save Settings
      </button>
    </div>
  </div>
)}
    </DashboardLayout>
  );
};

export default AdminDashboard;
