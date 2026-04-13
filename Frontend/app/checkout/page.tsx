"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/Button";
import { customerApi, orderApi } from "@/lib/api";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const cart = useMemo(() => items.map(item => ({
        ...item.product,
        quantity: item.quantity
    })), [items]);

    const cartTotal = useMemo(() => items.reduce((total, item) => total + item.product.price * item.quantity, 0), [items]);
    
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [savedLocation, setSavedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
    const [useSavedLocation, setUseSavedLocation] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"CashOnDelivery" | "SavedPayment">("CashOnDelivery");
    const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);

    // Load saved location and payment methods from localStorage
    useEffect(() => {
        const locationString = localStorage.getItem("userLocation");
        if (locationString) {
            const location = JSON.parse(locationString);
            setSavedLocation(location);
        }

        const paymentMethodsString = localStorage.getItem("savedPaymentMethods");
        if (paymentMethodsString) {
            try {
                setSavedPaymentMethods(JSON.parse(paymentMethodsString));
            } catch (e) {
                console.error("Failed to parse saved payment methods", e);
            }
        }
    }, []);

    // Fetch user address from backend
    useEffect(() => {
        if (!user) {
            router.push("/login?redirect=/checkout");
            return;
        }

        if (items.length === 0) {
            router.push("/cart");
            return;
        }

        const fetchAddress = async () => {
            if (user.email && user.token) {
                try {
                    const res = await customerApi.getByEmail(user.email, user.token);
                    if (res.responseObj.address) {
                        setAddress(res.responseObj.address);
                    }
                } catch (err) {
                    console.error("Failed to fetch address", err);
                }
            }
        };
        fetchAddress();
    }, [user, items, router]);

    // Update address when "use saved location" toggled
    useEffect(() => {
        if (useSavedLocation && savedLocation) {
            if (savedLocation.address) {
                setAddress(savedLocation.address);
            } else {
                setAddress(`${savedLocation.lat}, ${savedLocation.lng}`);
            }
        }
    }, [useSavedLocation, savedLocation]);

    const handlePlaceOrder = async () => {
        if (!user?.token) return;
        if (!address.trim()) {
            setError("Please enter a shipping address.");
            return;
        }

        if (paymentMethod === "SavedPayment" && savedPaymentMethods.length === 0) {
            setError("No saved payment method available. Please choose Cash on Delivery or add a payment method in your account.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const location = useSavedLocation && savedLocation 
                ? savedLocation 
                : { lat: 0, lng: 0 }; // Default if no location

            const orderData = {
                orderProducts: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                deliveryAddress: address,
                latitude: location.lat,
                longitude: location.lng,
                paymentMethod: paymentMethod
            };

            await orderApi.create(orderData, user.token);
            clearCart();
            router.push("/account"); // Redirect to orders page
        } catch (err: any) {
            console.error("Order placement failed", err);
            setError("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user || cart.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/cart" className="flex items-center text-circuit-text-muted hover:text-circuit-text mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
            </Link>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Shipping & Payment */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                            <Truck className="w-5 h-5 text-circuit-green" />
                            <h2>Shipping Address</h2>
                        </div>

                        <div className="bg-circuit-card border border-circuit-border rounded-lg p-6 space-y-4">
                            {savedLocation && (
                                <div className="flex items-center gap-4">
                                    <input
                                        type="radio"
                                        id="saved-location"
                                        name="addressOption"
                                        checked={useSavedLocation}
                                        onChange={() => setUseSavedLocation(true)}
                                    />
                                    <label htmlFor="saved-location" className="text-sm flex-1">
                                        Use saved location 
                                        {savedLocation.address && ` (${savedLocation.address})`}
                                        {!savedLocation.address && ` (${savedLocation.lat.toFixed(4)}, ${savedLocation.lng.toFixed(4)})`}
                                    </label>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    id="manual-address"
                                    name="addressOption"
                                    checked={!useSavedLocation}
                                    onChange={() => setUseSavedLocation(false)}
                                />
                                <label htmlFor="manual-address" className="text-sm">
                                    Enter address manually
                                </label>
                            </div>

                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-circuit-border bg-circuit-bg p-3 text-sm focus:border-circuit-green focus:outline-none"
                                placeholder="Enter your full delivery address..."
                                disabled={useSavedLocation}
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                            <CreditCard className="w-5 h-5 text-circuit-green" />
                            <h2>Payment Method</h2>
                        </div>
                        <div className="bg-circuit-card border border-circuit-border rounded-lg p-6 space-y-4">
                            <div 
                                className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-colors ${
                                    paymentMethod === "CashOnDelivery" 
                                        ? "border-circuit-green bg-circuit-green/10" 
                                        : "border-circuit-border hover:bg-circuit-bg/50"
                                }`}
                                onClick={() => setPaymentMethod("CashOnDelivery")}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === "CashOnDelivery"}
                                    onChange={() => setPaymentMethod("CashOnDelivery")}
                                    className="w-4 h-4"
                                />
                                <span className="font-medium">Cash on Delivery</span>
                            </div>

                            {savedPaymentMethods.length > 0 && (
                                <div 
                                    className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-colors ${
                                        paymentMethod === "SavedPayment" 
                                            ? "border-circuit-green bg-circuit-green/10" 
                                            : "border-circuit-border hover:bg-circuit-bg/50"
                                    }`}
                                    onClick={() => setPaymentMethod("SavedPayment")}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === "SavedPayment"}
                                        onChange={() => setPaymentMethod("SavedPayment")}
                                        className="w-4 h-4"
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium">Use Saved Payment Method</span>
                                        <p className="text-xs text-circuit-text-muted">
                                            {savedPaymentMethods.length} payment method{savedPaymentMethods.length > 1 ? 's' : ''} available
                                        </p>
                                    </div>
                                </div>
                            )}

                            {savedPaymentMethods.length === 0 && (
                                <div className="text-sm text-circuit-text-muted p-3 border border-circuit-border border-dashed rounded-md text-center">
                                    No saved payment methods. <Link href="/account" className="text-circuit-green hover:underline">Add one in your account</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-6">
                    <div className="bg-circuit-card border border-circuit-border rounded-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-circuit-bg rounded border border-circuit-border overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate">{item.name}</h3>
                                        <p className="text-sm text-circuit-text-muted">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-circuit-border my-4 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-circuit-text-muted">Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-circuit-text-muted">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-circuit-border">
                                <span>Total</span>
                                <span className="text-circuit-green">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <Button 
                            className="w-full h-12 text-lg" 
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
