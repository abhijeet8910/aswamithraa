import React, { useState, useEffect } from "react";
import {
  Loader2, Package, X, ChevronRight, CreditCard,
  CheckCircle, Clock, AlertCircle, Truck, ShoppingBag, MapPin, IndianRupee
} from "lucide-react";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

/* ─── Types ─── */
type OrderItem = {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  seller: { name: string; _id: string };
  items: OrderItem[];
  totalAmount: number;
  commissionAmount?: number;
  netAmount?: number;
  status: string;
  paymentStatus: string;
  paymentMode: string;
  razorpayPaymentId?: string;
  shippingAddress: { street: string; city: string; state: string; pincode: string; phone: string };
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
};

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

/* ─── Status config ─── */
const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  Accepted: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: CheckCircle },
  Shipped: { color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Truck },
  Delivered: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle },
  Cancelled: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle },
};

const paymentStatusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-100" },
  Completed: { color: "text-green-700", bg: "bg-green-100" },
  Failed: { color: "text-red-700", bg: "bg-red-100" },
  Refunded: { color: "text-purple-700", bg: "bg-purple-100" },
};

/* ─── Timeline Steps ─── */
const timelineSteps = ["Pending", "Accepted", "Shipped", "Delivered"];

const getStepIndex = (status: string) => {
  if (status === "Cancelled") return -1;
  return timelineSteps.indexOf(status);
};

/* ═══════════════════════════════════
    ORDER DETAIL MODAL
   ═══════════════════════════════════ */
const OrderDetailModal: React.FC<{
  order: Order;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}> = ({ order, onClose, onPaymentSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);
  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "Cancelled";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  /* ─── Pay Now handler ─── */
  const handlePayNow = async () => {
    setPaying(true);
    try {
      const data = await paymentService.createOrder(order._id);

      // --- REAL: Open Razorpay checkout ---
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast({ title: "Error", description: "Failed to load payment gateway", variant: "destructive" }); return; }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "ASWAMITHRA",
        description: `Order #${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const result = await paymentService.verifyPayment({
              orderId: order._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast({ title: "Payment Successful! ✅", description: `Order #${order.orderNumber} paid` });
            onPaymentSuccess({ ...order, paymentStatus: "Completed", paymentMode: "Razorpay", razorpayPaymentId: result.paymentId });
          } catch (err: any) {
            toast({ title: "Verification Failed", description: err.response?.data?.message || "Could not verify payment", variant: "destructive" });
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: "#16a34a" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast({ title: "Payment Error", description: err.response?.data?.message || "Failed to initiate payment", variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order #{order.orderNumber}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Order Timeline */}
        <div className="px-5 py-4 bg-gray-50/50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Order Status</h3>
          {isCancelled ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">Order Cancelled</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-2 ring-green-300 ring-offset-2" : ""}`}>
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium ${isCompleted ? "text-green-700" : "text-gray-400"}`}>{step}</span>
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-4 ${idx < currentStep ? "bg-green-400" : "bg-gray-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                  <p className="text-xs text-gray-400">{item.quantity} {item.unit} × ₹{item.unitPrice}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">₹{item.total.toLocaleString()}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-lg font-bold text-green-700">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Status</p>
              <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${paymentStatusConfig[order.paymentStatus]?.bg || "bg-gray-100"} ${paymentStatusConfig[order.paymentStatus]?.color || "text-gray-600"}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Mode</p>
              <p className="text-sm font-medium text-gray-700">{order.paymentMode || "—"}</p>
            </div>
            {order.razorpayPaymentId && (
              <div className="col-span-2">
                <p className="text-[10px] text-gray-400 uppercase">Transaction ID</p>
                <p className="text-xs font-mono text-gray-600">{order.razorpayPaymentId}</p>
              </div>
            )}
          </div>

          {/* Pay Now button — only show for unpaid orders */}
          {order.paymentStatus !== "Completed" && order.status !== "Cancelled" && (
            <button
              onClick={handlePayNow}
              disabled={paying}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-lg shadow-green-200 disabled:opacity-50 transition"
            >
              {paying ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><CreditCard className="w-4 h-4" /> Pay Now — ₹{order.totalAmount.toLocaleString()}</>}
            </button>
          )}
        </div>

        {/* Shipping */}
        <div className="px-5 py-4 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Address</h3>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p>
              {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
              <br />
              <span className="text-xs text-gray-400">Phone: {order.shippingAddress?.phone}</span>
            </p>
          </div>
        </div>

        {/* Seller */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-green-600" />
          <p className="text-sm text-gray-600">Seller: <span className="font-medium text-gray-800">{order.seller?.name || "—"}</span></p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
    ORDERS COMPONENT
   ═══════════════════════════════════ */
const OrdersComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data?.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const handlePaymentSuccess = (updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
  };

  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-green-800">My Orders</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{orders.length}</span>
        </div>
        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {["all", "Pending", "Accepted", "Shipped", "Delivered", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition ${filter === f
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500 text-lg font-medium">No orders {filter !== "all" ? `(${filter})` : ""}</p>
          <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.Pending;
            const StatusIcon = sc.icon;
            return (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">
                        {order.items.map((i) => i.productName).join(", ")}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      #{order.orderNumber} • Seller: {order.seller?.name || "—"} • {formatDate(order.createdAt)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.items.map((i) => `${i.quantity} ${i.unit}`).join(", ")} • {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="text-lg font-bold text-green-700">₹{order.totalAmount?.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bg} ${sc.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-0.5" />
                        {order.status}
                      </span>
                      {order.paymentStatus === "Completed" ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Paid</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Unpaid</span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition mt-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default OrdersComponent;