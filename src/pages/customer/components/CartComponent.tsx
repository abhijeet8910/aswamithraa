import React, { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, MapPin, CreditCard, X } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { useToast } from "@/hooks/use-toast";

/* ─── Razorpay script loader ─── */
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ─── Checkout Address Modal ─── */
const CheckoutModal: React.FC<{
  items: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ items, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { clearCart, getCartTotal } = useCart();
  const { toast } = useToast();

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    phone: user?.phone || "",
  });
  const [placing, setPlacing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"Razorpay" | "COD">("Razorpay");

  const total = getCartTotal();
  const deliveryFee = total > 500 ? 0 : 40;
  const grandTotal = total + deliveryFee;

  // Group items by seller (farmerId)
  const groupBySeller = () => {
    const groups: Record<string, CartItem[]> = {};
    items.forEach((item) => {
      if (!groups[item.farmerId]) groups[item.farmerId] = [];
      groups[item.farmerId].push(item);
    });
    return groups;
  };

  const isAddressValid = address.street && address.city && address.state && address.pincode && address.phone;

  const handlePlaceOrder = async () => {
    if (!isAddressValid) {
      toast({ title: "Missing Address", description: "Please fill in all address fields", variant: "destructive" });
      return;
    }

    setPlacing(true);
    try {
      const sellerGroups = groupBySeller();
      const orderIds: string[] = [];

      // Create one order per seller
      for (const [sellerId, sellerItems] of Object.entries(sellerGroups)) {
        const orderData = {
          seller: sellerId,
          items: sellerItems.map((item) => ({
            product: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.price,
            total: item.price * item.quantity,
          })),
          totalAmount: sellerItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          shippingAddress: address,
          paymentMode: paymentMode,
        };

        const order = await orderService.create(orderData);
        if (order?._id) orderIds.push(order._id);
      }

      // If Razorpay payment, process payment for each order
      if (paymentMode === "Razorpay" && orderIds.length > 0) {
        for (const orderId of orderIds) {
          try {
            const payData = await paymentService.createOrder(orderId);

            // Real Razorpay checkout
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Failed to load Razorpay");

            await new Promise<void>((resolve, reject) => {
              const razorpay = new (window as any).Razorpay({
                key: payData.key_id,
                amount: payData.amount,
                currency: payData.currency,
                name: "ASWAMITHRA",
                description: `Order #${payData.orderNumber}`,
                order_id: payData.razorpayOrderId,
                handler: async (response: any) => {
                  try {
                    await paymentService.verifyPayment({
                      orderId,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature,
                    });
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                },
                prefill: { name: user?.name, email: user?.email, contact: user?.phone },
                theme: { color: "#16a34a" },
                modal: { ondismiss: () => resolve() },
              });
              razorpay.open();
            });
          } catch (err) {
            console.error("Payment error for order:", orderId, err);
          }
        }
      }

      clearCart();
      toast({ title: "Order Placed! 🎉", description: `${orderIds.length} order(s) placed successfully` });
      onSuccess();
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({ title: "Order Failed", description: err.response?.data?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Delivery Address */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-700">Delivery Address</h3>
          </div>
          <input
            placeholder="Street / House No."
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
            />
            <input
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
            />
            <input
              placeholder="Phone"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-700">Payment Method</h3>
          </div>
          <div className="flex gap-2">
            {([["Razorpay", "Pay Online"], ["COD", "Cash on Delivery"]] as const).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setPaymentMode(mode)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition ${paymentMode === mode
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="px-5 py-4 bg-gray-50 border-t space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items ({items.length})</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-green-800 border-t pt-2">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="p-5">
          <button
            onClick={handlePlaceOrder}
            disabled={placing || !isAddressValid}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-50 transition active:scale-[0.98]"
          >
            {placing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
            ) : (
              <>{paymentMode === "Razorpay" ? "Pay & Place Order" : "Place Order (COD)"} — ₹{grandTotal.toLocaleString()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
    CART COMPONENT
   ═══════════════════════════════════ */
interface CartComponentProps {
  onSwitchTab?: (tab: string) => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ onSwitchTab }) => {
  const { items, incrementQty, decrementQty, removeFromCart, clearCart, getCartTotal } = useCart();
  const total = getCartTotal();
  const deliveryFee = total > 500 ? 0 : 40;
  const grandTotal = total + deliveryFee;
  const [showCheckout, setShowCheckout] = useState(false);

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
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
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

      <button
        onClick={() => setShowCheckout(true)}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-200 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        Proceed to Checkout <ArrowRight className="w-4 h-4" />
      </button>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          items={items}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            if (onSwitchTab) onSwitchTab("orders");
          }}
        />
      )}
    </div>
  );
};

export default CartComponent;