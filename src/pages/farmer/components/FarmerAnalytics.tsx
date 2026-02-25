import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";

const FarmerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, completedOrders: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [orders, payments] = await Promise.all([
          orderService.getAll({ limit: 100 }).catch(() => ({ orders: [] })),
          paymentService.getAll({ limit: 100 }).catch(() => ({ payments: [] })),
        ]);

        const orderList = orders?.orders || [];
        const paymentList = payments?.payments || [];

        const totalRevenue = paymentList
          .filter((p: any) => p.status === "Completed")
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        const completed = orderList.filter((o: any) => o.status === "Delivered").length;

        setStats({
          totalOrders: orderList.length,
          totalRevenue,
          avgOrderValue: orderList.length > 0 ? Math.round(totalRevenue / (orderList.length || 1)) : 0,
          completedOrders: completed,
        });

        // Group orders by month for chart
        const monthMap: Record<string, number> = {};
        orderList.forEach((o: any) => {
          const month = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short" });
          monthMap[month] = (monthMap[month] || 0) + o.totalAmount;
        });
        setOrderData(Object.entries(monthMap).map(([month, revenue]) => ({ month, revenue })));
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">
        <h1 className="text-2xl font-bold">Sales Analytics</h1>
        <p className="text-sm opacity-90">Monitor your farm sales and earnings</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold text-green-700">{stats.totalOrders}</h2>
        </div>
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">{stats.completedOrders}</h2>
        </div>
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-700">₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Avg. Order Value</p>
          <h2 className="text-2xl font-bold text-green-700">₹{stats.avgOrderValue.toLocaleString()}</h2>
        </div>
      </div>

      {orderData.length > 0 ? (
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-gray-700">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No order data for charts yet</div>
      )}
    </div>
  );
};

export default FarmerAnalytics;