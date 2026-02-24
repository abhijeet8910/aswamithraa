import React from "react";

type CartItem = {
  id: string;
  name: string;
  farmer: string;
  price: number;
  quantity: number;
  unit: string;
};

const cartItems: CartItem[] = [
  {
    id: "1",
    name: "Tomatoes",
    farmer: "Ramesh Kumar",
    price: 35,
    quantity: 5,
    unit: "kg",
  },
  {
    id: "2",
    name: "Potatoes",
    farmer: "Suresh Kumar",
    price: 28,
    quantity: 3,
    unit: "kg",
  },
];

const CartComponent = () => {

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      <h2 className="text-xl font-bold text-green-800">
        Shopping Cart
      </h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-green-100 rounded-xl p-4 flex justify-between items-center"
        >
          <div>

            <p className="font-semibold text-green-800">
              {item.name}
            </p>

            <p className="text-sm text-gray-500">
              Farmer: {item.farmer}
            </p>

            <p className="text-xs text-gray-400">
              {item.quantity} {item.unit}
            </p>

          </div>

          <p className="font-bold text-green-700">
            ₹{item.price * item.quantity}
          </p>

        </div>
      ))}

      <div className="bg-white border border-green-200 rounded-xl p-4 flex justify-between items-center">

        <span className="font-semibold text-green-800">
          Total
        </span>

        <span className="font-bold text-green-700">
          ₹{total}
        </span>

      </div>

      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
        Proceed to Checkout
      </button>

    </div>
  );
};

export default CartComponent;