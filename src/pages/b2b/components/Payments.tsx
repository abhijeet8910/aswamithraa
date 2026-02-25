import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { paymentService } from "@/services/payment.service";

type Payment = {
  _id: string;
  order: { orderNumber: string; totalAmount: number };
  from: { name: string };
  to: { name: string };
  amount: number;
  mode: string;
  status: string;
  transactionId?: string;
  createdAt: string;
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

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
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-purple-100 text-sm">Track settlements and transactions</p>
        </div>
        <div className="text-sm bg-white/20 px-4 py-2 rounded-lg">Secure Payment Ledger</div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {["All", "Pending", "Completed", "Failed"].map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${filter === tab ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow" : "bg-white border border-gray-200 hover:bg-gray-50"}`}
          >{tab}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No payments found</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {["From", "To", "Amount", "Mode", "Date", "Status", "Action"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{p.from?.name || "—"}</td>
                  <td className="px-6 py-4">{p.to?.name || "—"}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">₹{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{p.mode}</td>
                  <td className="px-6 py-4">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "Completed" ? "bg-green-100 text-green-700" : p.status === "Failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedPayment(p)} className="px-4 py-1 text-xs font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-[420px] shadow-2xl">
            <h2 className="text-xl font-semibold text-indigo-700 mb-5">Payment Details</h2>
            <div className="space-y-3 text-sm">
              <p><b>From:</b> {selectedPayment.from?.name}</p>
              <p><b>To:</b> {selectedPayment.to?.name}</p>
              <p><b>Amount:</b> ₹{selectedPayment.amount.toLocaleString()}</p>
              <p><b>Mode:</b> {selectedPayment.mode}</p>
              <p><b>Order:</b> {selectedPayment.order?.orderNumber || "—"}</p>
              {selectedPayment.transactionId && <p><b>Txn ID:</b> {selectedPayment.transactionId}</p>}
              <p><b>Date:</b> {formatDate(selectedPayment.createdAt)}</p>
              <p><b>Status:</b> {selectedPayment.status}</p>
            </div>
            <button onClick={() => setSelectedPayment(null)} className="mt-6 w-full px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;