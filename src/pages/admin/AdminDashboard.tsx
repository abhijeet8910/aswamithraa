import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users, Wheat, Building2, CreditCard, TrendingUp, ArrowUpRight,
  CheckCircle, XCircle, Clock, Loader2, FileText, MapPin, Phone, Mail
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DeliveryManagement from "./component/DeliveryManagement";
import Farmers from "./component/Farmers";
import { userService } from "@/services/user.service";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { productService } from "@/services/product.service";

const PIE_COLORS = ["hsl(150,57%,22%)", "hsl(38,90%,55%)", "hsl(210,80%,45%)", "hsl(142,70%,35%)"];

const txnStatus = (status: string) => {
  if (status === "Completed") return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{status}</span>;
  if (status === "Pending") return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{status}</span>;
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{status}</span>;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ farmers: 0, businesses: 0, customers: 0, volume: 0 });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, ordersRes, paymentsRes, productsRes] = await Promise.all([
          userService.getAllUsers({ limit: 200 }).catch(() => ({ users: [] })),
          orderService.getAll({ limit: 100 }).catch(() => ({ orders: [] })),
          paymentService.getAll({ limit: 100 }).catch(() => ({ payments: [] })),
          productService.getAll({ limit: 200 }).catch(() => ({ products: [] })),
        ]);

        const users = usersRes?.users || [];
        const orders = ordersRes?.orders || [];
        const payments = paymentsRes?.payments || [];
        const products = productsRes?.products || [];

        const farmers = users.filter((u: any) => u.role === "farmer").length;
        const businesses = users.filter((u: any) => u.role === "b2b").length;
        const customers = users.filter((u: any) => u.role === "customer").length;
        const volume = orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);

        setStats({ farmers, businesses, customers, volume });
        setPendingUsers(users.filter((u: any) => !u.isVerified).slice(0, 5));
        setAllUsers(users);
        setRecentPayments(payments.slice(0, 5));
        setAllPayments(payments);

        const monthMap: Record<string, number> = {};
        orders.forEach((o: any) => {
          const m = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short" });
          monthMap[m] = (monthMap[m] || 0) + (o.totalAmount || 0);
        });
        setChartData(Object.entries(monthMap).map(([month, volume]) => ({ month, volume })));

        const catMap: Record<string, number> = {};
        products.forEach((p: any) => {
          const cat = p.category?.name || p.category || "Other";
          catMap[cat] = (catMap[cat] || 0) + 1;
        });
        const total = products.length || 1;
        setCategoryData(Object.entries(catMap).map(([name, count]) => ({ name, value: Math.round((count / total) * 100) })));
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await userService.verifyUser(id);
      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to verify:", err);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      await userService.blockUser(id);
      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to block:", err);
    }
  };

  const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString()}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Admin Control Panel</h1>
                <p className="text-gray-300 text-base font-medium">Platform overview and management</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Registered Farmers", value: stats.farmers.toLocaleString(), icon: Wheat, color: "hsl(150,57%,22%)" },
                  { label: "B2B Businesses", value: stats.businesses.toLocaleString(), icon: Building2, color: "hsl(210,80%,45%)" },
                  { label: "Customers", value: stats.customers.toLocaleString(), icon: Users, color: "hsl(142,70%,35%)" },
                  { label: "Total Volume", value: fmt(stats.volume), icon: CreditCard, color: "hsl(38,90%,55%)" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                          <Icon className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-xs font-medium text-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {chartData.length > 0 && (
                  <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-4">Transaction Volume</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Volume"]} />
                        <Bar dataKey="volume" fill="hsl(150,57%,22%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {categoryData.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-4">Products by Category</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                          {categoryData.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categoryData.map((c: any, i: number) => (
                        <div key={c.name} className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-muted-foreground">{c.name}</span>
                          <span className="font-semibold text-foreground ml-auto">{c.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pending Approvals */}
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" /> Pending Approvals
                    <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-bold bg-yellow-100 text-yellow-700">{pendingUsers.length}</span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.length === 0 ? (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500 text-sm">All approvals processed ✅</td></tr>
                      ) : (
                        pendingUsers.map((u: any) => (
                          <tr key={u._id} className="border-t hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium">{u.name}</td>
                            <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${u.role === "farmer" ? "bg-green-100 text-green-700" : u.role === "b2b" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                            </td>
                            <td className="px-5 py-3 text-xs text-gray-500">{fmtDate(u.createdAt)}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleVerify(u._id)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-green-100 text-green-700 hover:bg-green-200">
                                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button onClick={() => handleBlock(u._id)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200">
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

              {/* Recent Payments */}
              {recentPayments.length > 0 && (
                <div className="bg-card rounded-xl border border-border shadow-sm">
                  <div className="p-5 border-b border-border"><h3 className="font-semibold text-foreground">Recent Transactions</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          {["From", "To", "Amount", "Mode", "Date", "Status"].map((h) => (
                            <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentPayments.map((t: any) => (
                          <tr key={t._id} className="border-t hover:bg-gray-50">
                            <td className="px-5 py-3 text-sm">{t.from?.name || "—"}</td>
                            <td className="px-5 py-3 text-sm">{t.to?.name || "—"}</td>
                            <td className="px-5 py-3 text-sm font-semibold">₹{t.amount?.toLocaleString()}</td>
                            <td className="px-5 py-3 text-xs">{t.mode}</td>
                            <td className="px-5 py-3 text-xs">{fmtDate(t.createdAt)}</td>
                            <td className="px-5 py-3">{txnStatus(t.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "farmers" && <Farmers />}

      {activeTab === "businesses" && (
        <BusinessSection users={allUsers.filter((u: any) => u.role === "b2b")} loading={loading} />
      )}

      {activeTab === "customers" && (
        <CustomerSection users={allUsers.filter((u: any) => u.role === "customer")} loading={loading} />
      )}

      {activeTab === "delivery" && <DeliveryManagement />}

      {activeTab === "applications" && <ApplicationsSection />}

      {activeTab === "transactions" && (
        <TransactionSection payments={allPayments} loading={loading} />
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Platform Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Farmers", value: stats.farmers.toLocaleString() },
              { label: "Total Businesses", value: stats.businesses.toLocaleString() },
              { label: "Total Customers", value: stats.customers.toLocaleString() },
              { label: "Revenue", value: fmt(stats.volume) },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Reports</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {["Sales Report", "Farmer Activity", "Monthly Revenue"].map((r) => (
              <div key={r} className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="font-semibold">{r}</h3>
                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Download PDF</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6 max-w-xl">
          <h1 className="font-display text-2xl font-bold">Admin Settings</h1>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <input type="text" placeholder="Platform Name" className="w-full px-4 py-2 border rounded-lg bg-background" />
            <input type="email" placeholder="Support Email" className="w-full px-4 py-2 border rounded-lg bg-background" />
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Settings</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

/* ─── Applications Management Section ─── */
const ApplicationsSection = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await userService.getPendingApplications(filter);
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(id);
    try {
      const note = status === 'rejected' ? rejectNote[id] : undefined;
      await userService.handleApplication(id, status, note);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(`Failed to ${status}:`, err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Seller & Buyer Applications</h1>
          <p className="text-sm text-muted-foreground">Manage farmer and B2B approval requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === s
              ? s === "pending" ? "bg-yellow-100 text-yellow-800"
                : s === "approved" ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {s} {s === "pending" && <span className="ml-1">({applications.length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No {filter} applications found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${app.role === "farmer" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {(app.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${app.role === "farmer" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                      {app.role === "farmer" ? "🌾 Farmer — Apply to Sell" : "🏢 B2B — Bulk Purchase"}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${app.applicationStatus === 'pending' ? "bg-yellow-100 text-yellow-700" :
                  app.applicationStatus === 'approved' ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                  {app.applicationStatus}
                </span>
              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-3.5 h-3.5" /> {app.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5" /> {app.phone}
                </div>
                {app.businessName && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-3.5 h-3.5" /> {app.businessName}
                  </div>
                )}
                {app.farmLocation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wheat className="w-3.5 h-3.5" /> {app.farmLocation}
                  </div>
                )}
                {app.address?.city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5" /> {app.address.street ? `${app.address.street}, ` : ""}{app.address.city}, {app.address.state} - {app.address.pincode}
                  </div>
                )}
                {app.gstin && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-3.5 h-3.5" /> GSTIN: {app.gstin}
                  </div>
                )}
              </div>

              {/* Rejection note */}
              {app.applicationNote && (
                <div className="text-sm bg-red-50 border border-red-100 rounded-lg p-2 text-red-700">
                  Admin note: {app.applicationNote}
                </div>
              )}

              {/* Actions */}
              {filter === "pending" && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <button
                    onClick={() => handleAction(app._id, "approved")}
                    disabled={processing === app._id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {processing === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      placeholder="Rejection reason (optional)"
                      value={rejectNote[app._id] || ""}
                      onChange={(e) => setRejectNote({ ...rejectNote, [app._id]: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-red-200 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAction(app._id, "rejected")}
                      disabled={processing === app._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Sub-sections ─── */
const BusinessSection = ({ users, loading }: { users: any[]; loading: boolean }) => (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Business Accounts</h1>
    {loading ? (
      <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
    ) : users.length === 0 ? (
      <div className="text-center py-20 text-gray-500">No business accounts found</div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((b: any) => (
          <div key={b._id} className="bg-card border border-border rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{b.businessName || b.name}</h3>
              <span className={`px-2.5 py-0.5 text-xs rounded-full ${b.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
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

const CustomerSection = ({ users, loading }: { users: any[]; loading: boolean }) => (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Customers</h1>
    {loading ? (
      <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
    ) : (
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Phone", "Joined", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((c: any) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3">{c.email}</td>
                <td className="px-5 py-3">{c.phone || "—"}</td>
                <td className="px-5 py-3 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${c.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {c.isBlocked ? "Blocked" : "Active"}
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

const TransactionSection = ({ payments, loading }: { payments: any[]; loading: boolean }) => (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">All Transactions</h1>
    {loading ? (
      <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
    ) : (
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
                <td className="px-5 py-3 text-xs">{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${t.status === "Completed" ? "bg-green-100 text-green-700" : t.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
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

export default AdminDashboard;
