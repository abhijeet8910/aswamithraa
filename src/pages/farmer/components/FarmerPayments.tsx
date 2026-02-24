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
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

const FarmerPayments = () => {
  const [selected, setSelected] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredPayments =
    filter === "All" ? payments : payments.filter((p) => p.status === filter);

  const total = payments.length;
  const completed = payments.filter((p) => p.status === "Completed").length;
  const pending = payments.filter((p) => p.status === "Pending").length;

  return (
    <div className="space-y-8">

      {/* SECTION HEADER */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">

        <h1 className="text-2xl font-bold">
          Farmer Payments
        </h1>

        <p className="text-sm opacity-90">
          Track all incoming transactions and payment status
        </p>

      </div>


      {/* SUMMARY CARDS */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="text-2xl font-bold text-green-700">{total}</h2>
        </div>

        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">{completed}</h2>
        </div>

        <div className="bg-white border border-green-100 p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{pending}</h2>
        </div>

      </div>


      {/* FILTER TABS */}

      <div className="flex gap-3">

        {["All", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg border transition ${
              filter === tab
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-green-50"
            }`}
          >
            {tab}
          </button>
        ))}

      </div>


      {/* TABLE */}

      {/* <div className="bg-white border border-green-100 rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-green-50">

            <tr>
              {["Transaction", "Buyer", "Amount", "Method", "Date", "Status", "Action"].map(
                (h) => (
                  <th key={h} className="text-left px-5 py-3 font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>

          </thead>

          <tbody>

            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-t hover:bg-green-50/40">

                <td className="px-5 py-3 font-medium">{p.id}</td>
                <td className="px-5 py-3">{p.buyer}</td>
                <td className="px-5 py-3 font-semibold">{p.amount}</td>
                <td className="px-5 py-3">{p.method}</td>
                <td className="px-5 py-3">{p.date}</td>
                <td className="px-5 py-3">{statusBadge(p.status)}</td>

                <td className="px-5 py-3">

                  <button
                    onClick={() => setSelected(p)}
                    className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

 */}

{/* // TABLE WRAPPER FIX */}
<div className="bg-white border border-green-100 rounded-xl shadow-sm overflow-x-auto w-full">

  <table className="w-full min-w-[900px] text-sm">

    <thead className="bg-green-50">
      <tr>
        {["Transaction", "Buyer", "Amount", "Method", "Date", "Status", "Action"].map(
          (h) => (
            <th key={h} className="text-left px-5 py-3 font-semibold whitespace-nowrap">
              {h}
            </th>
          )
        )}
      </tr>
    </thead>

    <tbody>
      {filteredPayments.map((p) => (
        <tr key={p.id} className="border-t hover:bg-green-50/40">

          <td className="px-5 py-3 font-medium whitespace-nowrap">{p.id}</td>
          <td className="px-5 py-3 whitespace-nowrap">{p.buyer}</td>
          <td className="px-5 py-3 font-semibold whitespace-nowrap">{p.amount}</td>
          <td className="px-5 py-3 whitespace-nowrap">{p.method}</td>
          <td className="px-5 py-3 whitespace-nowrap">{p.date}</td>
          <td className="px-5 py-3 whitespace-nowrap">{statusBadge(p.status)}</td>

          <td className="px-5 py-3">
            <div className="flex flex-nowrap gap-2">
              <button
                onClick={() => setSelected(p)}
                className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md whitespace-nowrap"
              >
                View
              </button>
            </div>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>

      {/* MODAL */}

      {selected && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">

            <h3 className="text-lg font-bold text-green-700 mb-4">
              Transaction Details
            </h3>

            <div className="space-y-3 text-sm">

              <p><b>ID:</b> {selected.id}</p>
              <p><b>Buyer:</b> {selected.buyer}</p>
              <p><b>Amount:</b> {selected.amount}</p>
              <p><b>Method:</b> {selected.method}</p>
              <p><b>Date:</b> {selected.date}</p>
              <p><b>Status:</b> {selected.status}</p>

            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
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