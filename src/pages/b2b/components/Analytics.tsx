import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSpend: 0, totalOrders: 0, avgOrder: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [orders, payments] = await Promise.all([
          orderService.getAll({ limit: 100 }).catch(() => ({ orders: [] })),
          paymentService.getAll({ limit: 100 }).catch(() => ({ payments: [] })),
        ]);

        const orderList = orders?.orders || [];
        const paymentList = payments?.payments || [];
        const totalSpend = paymentList.filter((p: any) => p.status === "Completed").reduce((s: number, p: any) => s + p.amount, 0);

        setStats({
          totalSpend,
          totalOrders: orderList.length,
          avgOrder: orderList.length > 0 ? Math.round(totalSpend / orderList.length) : 0,
        });

        const map: Record<string, number> = {};
        paymentList.forEach((p: any) => {
          const m = new Date(p.createdAt).toLocaleDateString("en-US", { month: "short" });
          map[m] = (map[m] || 0) + p.amount;
        });
        setChartData(Object.entries(map).map(([month, spend]) => ({ month, spend })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Procurement Analytics</h1>
        <p className="text-gray-500 text-sm">Monthly spending insights</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Total Spend</p>
          <h2 className="text-2xl font-bold">₹{stats.totalSpend.toLocaleString()}</h2>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Total Orders</p>
          <h2 className="text-2xl font-bold">{stats.totalOrders}</h2>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Avg. Order Value</p>
          <h2 className="text-2xl font-bold">₹{stats.avgOrder.toLocaleString()}</h2>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Spend"]} />
              <Line type="monotone" dataKey="spend" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No spending data for charts yet</div>
      )}
    </div>
  );
};

export default Analytics;