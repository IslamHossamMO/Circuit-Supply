"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart-provider";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCart();

    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + tax + shipping;

    if (items.length === 0) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-circuit-text-muted mb-8">Looks like you havent added any components yet.</p>
                <Link href="/product">
                    <Button variant="default">Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-6 py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-4 bg-circuit-card border border-circuit-border rounded-lg">
                            <div className="relative w-24 h-24 bg-circuit-bg rounded-md overflow-hidden flex-shrink-0">
                                <Image src={item.product.image} unoptimized alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{item.product.name}</h3>
                                        <div className="text-sm text-circuit-text-muted">{item.product.category}</div>
                                    </div>
                                    <div className="font-bold text-circuit-blue">${(item.product.price * item.quantity).toFixed(2)}</div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="p-1 hover:text-circuit-green transition-colors"
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                                        <button
                                            className="p-1 hover:text-circuit-green transition-colors"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-400 text-sm flex items-center transition-colors"
                                        onClick={() => removeItem(item.product.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-circuit-card border border-circuit-border rounded-xl p-6 sticky top-24">
                        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-circuit-text-muted">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-circuit-text-muted">
                                <span>Estimted Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-circuit-text-muted">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>

                        <div className="border-t border-circuit-border pt-4">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-medium">Total</span>
                                <span className="text-2xl font-bold text-circuit-green">${total.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout">
                                <Button className="w-full h-12 text-lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </div>
                        <div className="text-xs text-center text-circuit-text-muted mt-4">
                            Free shipping on orders over $100
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
