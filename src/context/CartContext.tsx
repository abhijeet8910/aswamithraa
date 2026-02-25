import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    marketPrice?: number;
    image: string;
    farmer: string;
    farmerId: string;
    quantity: number;
    unit: string;
    stock: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeFromCart: (productId: string) => void;
    incrementQty: (productId: string) => void;
    decrementQty: (productId: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
    getItemQty: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "agri_cart";

const loadCart = (): CartItem[] => {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveCart = (items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(loadCart);

    useEffect(() => {
        saveCart(items);
    }, [items]);

    const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.productId === item.productId);
            if (existing) {
                return prev.map((i) =>
                    i.productId === item.productId
                        ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.stock) }
                        : i
                );
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    };

    const incrementQty = (productId: string) => {
        setItems((prev) =>
            prev.map((i) =>
                i.productId === productId
                    ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                    : i
            )
        );
    };

    const decrementQty = (productId: string) => {
        setItems((prev) =>
            prev
                .map((i) =>
                    i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const getCartTotal = () =>
        items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const getItemCount = () =>
        items.reduce((sum, i) => sum + i.quantity, 0);

    const getItemQty = (productId: string) => {
        const item = items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                incrementQty,
                decrementQty,
                clearCart,
                getCartTotal,
                getItemCount,
                getItemQty,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
