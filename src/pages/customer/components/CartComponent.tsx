import React from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartComponent = () => {
  const { items, incrementQty, decrementQty, removeFromCart, clearCart, getCartTotal } = useCart();
  const total = getCartTotal();
  const deliveryFee = total > 500 ? 0 : 40;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-4">Browse our fresh produce and add something delicious!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-800">
          Shopping Cart <span className="text-sm font-normal text-gray-500">({items.length} items)</span>
        </h2>
        <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 font-medium">
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-white border border-green-100 rounded-xl p-4 flex gap-4 items-center hover:shadow-md transition"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-green-800 text-sm truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Farmer: {item.farmer}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-green-700">₹{item.price}/{item.unit}</span>
                {item.marketPrice && (
                  <span className="text-xs line-through text-gray-400">₹{item.marketPrice}</span>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrementQty(item.productId)}
                className="w-7 h-7 rounded-full border border-green-200 flex items-center justify-center text-green-700 hover:bg-green-50 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-bold text-green-800 w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => incrementQty(item.productId)}
                className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Total + Remove */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-green-700">₹{item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-gray-400 hover:text-red-500 transition mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border border-green-200 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Order Summary</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Fee</span>
          <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>
        {deliveryFee > 0 && (
          <p className="text-xs text-gray-400">Free delivery on orders above ₹500</p>
        )}
        <div className="border-t pt-3 flex justify-between font-bold text-green-800 text-lg">
          <span>Total</span>
          <span>₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-200 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
        Proceed to Checkout <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartComponent;