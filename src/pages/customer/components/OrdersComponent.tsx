import React from "react";

type Order = {
  id: string;
  product: string;
  farmer: string;
  quantity: string;
  price: number;
  status: "Delivered" | "Pending" | "Cancelled";
  date: string;
  address: string;
};

const orders: Order[] = [
  {
    id: "ORD001",
    product: "Fresh Tomatoes",
    farmer: "Ramesh Kumar",
    quantity: "5 kg",
    price: 175,
    status: "Delivered",
    date: "20 Jan 2026",
    address: "Hyderabad, Telangana",
  },
  {
    id: "ORD002",
    product: "Basmati Rice",
    farmer: "Suresh Reddy",
    quantity: "10 kg",
    price: 680,
    status: "Pending",
    date: "22 Jan 2026",
    address: "Hyderabad, Telangana",
  },
  {
    id: "ORD003",
    product: "Organic Turmeric",
    farmer: "Lakshmi Devi",
    quantity: "3 kg",
    price: 285,
    status: "Cancelled",
    date: "18 Jan 2026",
    address: "Hyderabad, Telangana",
  },
];

const OrdersComponent = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      <h2 className="text-xl font-bold text-green-800">
        My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">

            <div>
              <p className="font-semibold text-green-800">
                {order.product}
              </p>

              <p className="text-sm text-gray-500">
                Farmer: {order.farmer}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {order.quantity} • {order.date}
              </p>

              <p className="text-xs text-gray-400">
                Delivery: {order.address}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-green-700">
                ₹{order.price}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {order.status}
              </span>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersComponent;