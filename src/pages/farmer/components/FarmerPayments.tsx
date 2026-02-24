import React, { useState } from "react";

type PaymentStatus = "Pending" | "Completed";

type Payment = {
  id: string;
  buyer: string;
  amount: string;
  method: string;
  date: string;
  status: PaymentStatus;
};

const payments: Payment[] = [
  {
    id: "TXN001",
    buyer: "Ramesh Traders",
    amount: "₹4250",
    method: "UPI",
    date: "12 Feb 2026",
    status: "Completed",
  },
  {
    id: "TXN002",
    buyer: "Lakshmi Vegetables",
    amount: "₹12800",
    method: "Bank Transfer",
    date: "11 Feb 2026",
    status: "Pending",
  },
  {
    id: "TXN003",
    buyer: "FreshMart Pvt Ltd",
    amount: "₹7200",
    method: "UPI",
    date: "10 Feb 2026",
    status: "Completed",
  },
  {
    id: "TXN004",
    buyer: "Green Basket",
    amount: "₹5600",
    method: "Bank Transfer",
    date: "9 Feb 2026",
    status: "Pending",
  },
];

const statusBadge = (status: PaymentStatus) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${styles[status]}`}>
      {status}
    </span>
  );
};

const FarmerPayments = () => {
  const [selected, setSelected] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredPayments =
    filter === "All" ? payments : payments.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Payments</h1>

      {/* FILTERS */}

      <div className="flex gap-2">
        {["All", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg border ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-card text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}

      <div className="bg-card border rounded-xl overflow-x-auto">

        <table className="w-full min-w-[750px]">

          <thead className="bg-muted">
            <tr>
              {["Transaction", "Buyer", "Amount", "Method", "Date", "Status", "Action"].map(
                (h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>

            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/40">

                <td className="px-5 py-3">{p.id}</td>
                <td className="px-5 py-3">{p.buyer}</td>
                <td className="px-5 py-3">{p.amount}</td>
                <td className="px-5 py-3">{p.method}</td>
                <td className="px-5 py-3">{p.date}</td>
                <td className="px-5 py-3">{statusBadge(p.status)}</td>

                <td className="px-5 py-3">

                  <button
                    onClick={() => setSelected(p)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h3 className="text-lg font-semibold mb-4">
              Transaction Details
            </h3>

            <div className="space-y-2 text-sm">

              <p><b>ID:</b> {selected.id}</p>
              <p><b>Buyer:</b> {selected.buyer}</p>
              <p><b>Amount:</b> {selected.amount}</p>
              <p><b>Method:</b> {selected.method}</p>
              <p><b>Date:</b> {selected.date}</p>
              <p><b>Status:</b> {selected.status}</p>

            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default FarmerPayments;