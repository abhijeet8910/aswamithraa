import React, { useState } from "react";

interface Payment {
  id: string;
  product: string;
  farmer: string;
  buyer: string;
  amount: string;
  status: "Pending" | "Completed";
  date: string;
  method: string;
}

const paymentsData: Payment[] = [
  {
    id: "PAY-101",
    product: "Tomatoes",
    farmer: "Ramesh Kumar",
    buyer: "FreshMart",
    amount: "₹4500",
    status: "Pending",
    date: "12 Feb 2026",
    method: "UPI",
  },
  {
    id: "PAY-102",
    product: "Potatoes",
    farmer: "Suresh Patel",
    buyer: "City Grocery",
    amount: "₹6200",
    status: "Completed",
    date: "10 Feb 2026",
    method: "Bank Transfer",
  },
  {
    id: "PAY-103",
    product: "Onions",
    farmer: "Mahesh Yadav",
    buyer: "Green Basket",
    amount: "₹3900",
    status: "Pending",
    date: "9 Feb 2026",
    method: "UPI",
  },
];

const Payments = () => {
  const [filter, setFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filtered =
    filter === "All"
      ? paymentsData
      : paymentsData.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Track settlements and transactions
        </p>
      </div>

      {/* FILTER TABS */}

      <div className="flex gap-3">
        {["All", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm border ${
              filter === tab ? "bg-primary text-white" : "bg-card"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-muted">
            <tr>
              <th className="px-5 py-3 text-left text-xs">ID</th>
              <th className="px-5 py-3 text-left text-xs">Product</th>
              <th className="px-5 py-3 text-left text-xs">Farmer</th>
              <th className="px-5 py-3 text-left text-xs">Buyer</th>
              <th className="px-5 py-3 text-left text-xs">Amount</th>
              <th className="px-5 py-3 text-left text-xs">Status</th>
              <th className="px-5 py-3 text-left text-xs">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="px-5 py-3">{p.id}</td>
                <td className="px-5 py-3">{p.product}</td>
                <td className="px-5 py-3">{p.farmer}</td>
                <td className="px-5 py-3">{p.buyer}</td>
                <td className="px-5 py-3 font-semibold">{p.amount}</td>

                <td className="px-5 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-5 py-3">
                  <button
                    onClick={() => setSelectedPayment(p)}
                    className="px-3 py-1 text-sm bg-primary text-white rounded-md"
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

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

            <div className="space-y-2 text-sm">
              <p><b>ID:</b> {selectedPayment.id}</p>
              <p><b>Product:</b> {selectedPayment.product}</p>
              <p><b>Farmer:</b> {selectedPayment.farmer}</p>
              <p><b>Buyer:</b> {selectedPayment.buyer}</p>
              <p><b>Amount:</b> {selectedPayment.amount}</p>
              <p><b>Status:</b> {selectedPayment.status}</p>
              <p><b>Method:</b> {selectedPayment.method}</p>
              <p><b>Date:</b> {selectedPayment.date}</p>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="mt-5 px-4 py-2 bg-primary text-white rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;