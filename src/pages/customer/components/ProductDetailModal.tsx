import React from "react";
import { X, Truck, Leaf, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
    product: any;
    onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
    const { addToCart, getItemQty, incrementQty, decrementQty } = useCart();
    const qty = getItemQty(product._id);
    const mktPrice = product.marketPrice || Math.round(product.price * 1.3);
    const discount = Math.round(((mktPrice - product.price) / mktPrice) * 100);

    const handleAdd = () => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            marketPrice: product.marketPrice,
            image: product.images?.[0] || "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80&auto=format&fit=crop",
            farmer: product.farmer?.name || "Local Farmer",
            farmerId: product.farmer?._id || "",
            unit: product.unit || "kg",
            stock: product.stock || 100,
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-b from-green-50 to-white">
                    <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80&auto=format&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    {product.organic && (
                        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
                            <Leaf className="w-3 h-3" /> Organic
                        </div>
                    )}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 ml-20 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                            {discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Name & Price */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {product.farmer?.name || "Local Farmer"} • {product.farmer?.farmLocation || ""}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-green-700">₹{product.price}</span>
                        <span className="text-base line-through text-gray-400">₹{mktPrice}</span>
                        <span className="text-xs text-gray-500">per {product.unit || "kg"}</span>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                    )}

                    {/* Info chips */}
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            <Truck className="w-3.5 h-3.5" /> {product.delivery || "5-7 days"}
                        </div>
                        {product.rating > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                                <Star className="w-3.5 h-3.5 fill-yellow-500" /> {product.rating.toFixed(1)}
                                {product.reviewCount > 0 && <span className="text-gray-500">({product.reviewCount})</span>}
                            </div>
                        )}
                        <div className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 text-xs font-medium">
                            Stock: {product.stock} {product.unit || "kg"}
                        </div>
                        {product.minOrder > 1 && (
                            <div className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                                Min order: {product.minOrder} {product.unit || "kg"}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {product.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {product.tags.map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Add to Cart */}
                    <div className="pt-2">
                        {qty === 0 ? (
                            <button
                                onClick={handleAdd}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-200 transition-all active:scale-[0.98]"
                            >
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </button>
                        ) : (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                                <span className="text-sm font-medium text-green-800">In Cart</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => decrementQty(product._id)}
                                        className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700 hover:bg-green-100 transition"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-lg font-bold text-green-800 w-6 text-center">{qty}</span>
                                    <button
                                        onClick={() => incrementQty(product._id)}
                                        className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
