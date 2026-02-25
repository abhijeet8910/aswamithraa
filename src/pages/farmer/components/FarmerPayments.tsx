import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { paymentService } from "@/services/payment.service";

type Payment = {
  _id: string;
  order: { _id: string; orderNumber: string; totalAmount: number };
  from: { _id: string; name: string; email: string };
  to: { _id: string; name: string };
  amount: number;
  mode: string;
  status: string;
  transactionId?: string;
  createdAt: string;
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
};

const FarmerPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Payment | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await paymentService.getAll();
        setPayments(data?.payments || []);
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === "All" ? payments : payments.filter((p) => p.status === filter);
  const completed = payments.filter((p) => p.status === "Completed").length;
  const pending = payments.filter((p) => p.status === "Pending").length;
  const totalAmount = payments.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">
        <h1 className="text-2xl font-bold">Farmer Payments</h1>
        <p className="text-sm opacity-90">Track all incoming transactions and payment status</p>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="text-2xl font-bold text-green-700">{payments.length}</h2>
        </div>
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">{completed}</h2>
        </div>
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{pending}</h2>
        </div>
        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Received</p>
          <h2 className="text-2xl font-bold text-green-700">₹{totalAmount.toLocaleString()}</h2>
        </div>
      </div>

      <div className="flex gap-3">
        {["All", "Pending", "Completed", "Failed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg border transition ${filter === tab ? "bg-green-600 text-white" : "bg-white hover:bg-green-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No payments found</div>
      ) : (
        <div className="bg-white border border-green-100 rounded-xl shadow-sm overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-green-50">
              <tr>
                {["From", "Amount", "Mode", "Order", "Date", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t hover:bg-green-50/40">
                  <td className="px-5 py-3 font-medium whitespace-nowrap">{p.from?.name || "—"}</td>
                  <td className="px-5 py-3 font-semibold whitespace-nowrap">₹{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{p.mode}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{p.order?.orderNumber || "—"}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{statusBadge(p.status)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelected(p)}
                      className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md whitespace-nowrap"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-green-700 mb-4">Transaction Details</h3>
            <div className="space-y-3 text-sm">
              <p><b>From:</b> {selected.from?.name} ({selected.from?.email})</p>
              <p><b>Amount:</b> ₹{selected.amount.toLocaleString()}</p>
              <p><b>Mode:</b> {selected.mode}</p>
              <p><b>Order:</b> {selected.order?.orderNumber}</p>
              {selected.transactionId && <p><b>Transaction ID:</b> {selected.transactionId}</p>}
              <p><b>Date:</b> {formatDate(selected.createdAt)}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerPayments;