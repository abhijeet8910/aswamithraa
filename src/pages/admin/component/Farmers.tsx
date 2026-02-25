import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, ShieldOff } from "lucide-react";
import { userService } from "@/services/user.service";

type FarmerUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  farmLocation?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
};

const Farmers = () => {
  const [farmers, setFarmers] = useState<FarmerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers({ role: "farmer" });
      setFarmers(data?.users || []);
    } catch (err) {
      console.error("Failed to load farmers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleVerify = async (id: string) => {
    setActionId(id);
    try {
      await userService.verifyUser(id);
      await fetchFarmers();
    } catch (err: any) {
      alert(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to verify farmer");
    } finally {
      setActionId(null);
    }
  };

  const handleBlock = async (id: string) => {
    setActionId(id);
    try {
      await userService.blockUser(id);
      await fetchFarmers();
    } catch (err: any) {
      alert(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to toggle block");
    } finally {
      setActionId(null);
    }
  };

  const verified = farmers.filter((f) => f.isVerified).length;
  const blocked = farmers.filter((f) => f.isBlocked).length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Farmers Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xl font-bold">{farmers.length}</div>
          <div className="text-xs text-muted-foreground">Total Farmers</div>
        </div>
        <div className="stat-card">
          <div className="text-xl font-bold">{verified}</div>
          <div className="text-xs text-muted-foreground">Verified</div>
        </div>
        <div className="stat-card">
          <div className="text-xl font-bold">{farmers.length - verified}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="stat-card">
          <div className="text-xl font-bold">{blocked}</div>
          <div className="text-xs text-muted-foreground">Blocked</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : farmers.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No farmers registered yet.</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-muted">
              <tr>
                {["Name", "Email", "Phone", "Location", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {farmers.map((f) => (
                <tr key={f._id} className="data-table-row">
                  <td className="px-5 py-3 font-medium">{f.name}</td>
                  <td className="px-5 py-3 text-sm">{f.email}</td>
                  <td className="px-5 py-3 text-sm">{f.phone}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{f.farmLocation || "—"}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {new Date(f.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    {f.isBlocked ? (
                      <span className="badge-destructive">Blocked</span>
                    ) : f.isVerified ? (
                      <span className="badge-success">Verified</span>
                    ) : (
                      <span className="badge-warning">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {!f.isVerified && (
                        <button
                          onClick={() => handleVerify(f._id)}
                          disabled={actionId === f._id}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                          style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {actionId === f._id ? "..." : "Verify"}
                        </button>
                      )}
                      <button
                        onClick={() => handleBlock(f._id)}
                        disabled={actionId === f._id}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                        style={{
                          background: f.isBlocked ? "hsl(var(--success) / 0.1)" : "hsl(var(--destructive) / 0.1)",
                          color: f.isBlocked ? "hsl(var(--success))" : "hsl(var(--destructive))",
                        }}
                      >
                        <ShieldOff className="w-3.5 h-3.5" />
                        {actionId === f._id ? "..." : f.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Farmers;
