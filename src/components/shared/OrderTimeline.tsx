/**
 * OrderTimeline — Visual order status tracking stepper
 * Shows the order's journey through its lifecycle with
 * a vertical timeline and status indicators.
 */
import React from "react";
import { Package, CheckCircle, Truck, XCircle, Clock, CreditCard } from "lucide-react";

interface OrderTimelineProps {
    status: string;
    paymentStatus?: string;
    createdAt?: string;
    deliveryDate?: string;
}

const steps = [
    { key: "Pending", label: "Order Placed", icon: Package, desc: "Your order has been placed" },
    { key: "Accepted", label: "Accepted", icon: CheckCircle, desc: "Seller accepted the order" },
    { key: "Shipped", label: "Shipped", icon: Truck, desc: "On the way to you" },
    { key: "Delivered", label: "Delivered", icon: CheckCircle, desc: "Successfully delivered" },
];

const statusIndex: Record<string, number> = {
    Pending: 0,
    Accepted: 1,
    Processing: 1,
    Shipped: 2,
    "Out for Delivery": 2,
    Delivered: 3,
    Cancelled: -1,
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, paymentStatus, createdAt, deliveryDate }) => {
    const currentIdx = statusIndex[status] ?? 0;
    const isCancelled = status === "Cancelled";

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Order Tracking</h3>
                {paymentStatus && (
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${paymentStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                        <CreditCard className="w-3 h-3" />
                        {paymentStatus}
                    </span>
                )}
            </div>

            {/* Cancelled State */}
            {isCancelled ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                        <p className="text-xs text-red-500">This order has been cancelled.</p>
                    </div>
                </div>
            ) : (
                /* Timeline */
                <div className="relative pl-8">
                    {steps.map((step, idx) => {
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const isLast = idx === steps.length - 1;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.key} className="relative pb-6 last:pb-0">
                                {/* Connector line */}
                                {!isLast && (
                                    <div className={`absolute left-[-20px] top-8 w-0.5 h-[calc(100%-8px)] ${idx < currentIdx ? "bg-green-400" : "bg-gray-200"
                                        }`} />
                                )}

                                {/* Step circle */}
                                <div className={`absolute left-[-28px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white ${isDone ? "bg-green-500" : "bg-gray-200"
                                    }`}>
                                    {isDone ? (
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    ) : (
                                        <Clock className="w-3 h-3 text-gray-400" />
                                    )}
                                </div>

                                {/* Step content */}
                                <div className={`${isCurrent ? "" : "opacity-60"}`}>
                                    <p className={`text-sm font-semibold ${isDone ? "text-green-700" : "text-gray-500"}`}>
                                        {step.label}
                                        {isCurrent && (
                                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                                Current
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                                    {idx === 0 && createdAt && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {new Date(createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                        </p>
                                    )}
                                    {idx === steps.length - 1 && deliveryDate && isDone && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {new Date(deliveryDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderTimeline;
