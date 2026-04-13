"use client";

import { Button } from "@/components/ui/Button";
import { Package, Settings, CreditCard, LogOut, MapPin, Plus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { customerApi, orderApi, GetOrderDTO, PostCustomerDTO } from "@/lib/api";

export default function AccountPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<GetOrderDTO[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    
    // Profile State
    const [profile, setProfile] = useState<PostCustomerDTO>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "" // Not displayed, but needed for DTO structure if we were strictly following it. 
                     // However, update endpoint in backend might ignore it if empty or we should handle it.
                     // I'll make password optional in frontend state handling.
    });
    const [profileId, setProfileId] = useState<number>(0);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");

    // Location State
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<string>("");
    
    // Payment methods state
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPayment, setNewPayment] = useState({ cardNumber: "", expiryDate: "", cardName: "", cvv: "" });

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    // Load Location from LocalStorage
    useEffect(() => {
        const storedLocation = localStorage.getItem("userLocation");
        if (storedLocation) {
            setLocation(JSON.parse(storedLocation));
        }
    }, []);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation is not supported by your browser");
            return;
        }

        setLocationStatus("Locating...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setLocation(newLocation);
                localStorage.setItem("userLocation", JSON.stringify(newLocation));
                setLocationStatus("Location saved locally");
            },
            () => {
                setLocationStatus("Unable to retrieve your location");
            }
        );
    };

    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.token) {
                setLoadingOrders(true);
                try {
                    const res = await orderApi.getMyOrders(user.token);
                    setOrders(res.responseObj || []);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };

        if (user && activeTab === "orders") {
            fetchOrders();
        }
    }, [user, activeTab]);

    // Load payment methods from localStorage
    useEffect(() => {
        if (activeTab === "payment") {
            const saved = localStorage.getItem("savedPaymentMethods");
            if (saved) {
                try {
                    setPaymentMethods(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to load payment methods", e);
                }
            } else {
                setPaymentMethods([]);
            }
        }
    }, [activeTab]);

    // Fetch Profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.token && user.email) {
                setLoadingProfile(true);
                try {
                    const res = await customerApi.getByEmail(user.email, user.token);
                    const data = res.responseObj;
                    setProfileId(data.id);
                    setProfile({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phoneNumber: data.phoneNumber || "",
                        address: data.address || "",
                        password: ""
                    } as PostCustomerDTO);
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                } finally {
                    setLoadingProfile(false);
                }
            }
        };

        if (user && activeTab === "settings") {
            fetchProfile();
        }
    }, [user, activeTab]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token || !profileId) return;

        setLoadingProfile(true);
        setProfileMessage("");

        try {
            await customerApi.update(profileId, profile, user.token);
            setProfileMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            setProfileMessage("Failed to update profile.");
        } finally {
            setLoadingProfile(false);
        }
    };


    if (!user) return null;

    const renderContent = () => {
        switch (activeTab) {
            case "orders":
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold">Order History</h2>
                        {loadingOrders ? (
                            <div className="text-circuit-text-muted">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="text-circuit-text-muted">No orders found.</div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-circuit-card border border-circuit-border rounded-lg overflow-hidden">
                                        <div className="p-4 border-b border-circuit-border bg-circuit-bg/50 flex justify-between items-center">
                                            <div>
                                                <span className="font-mono text-xs text-circuit-text-muted">ORDER #</span>
                                                <span className="font-mono font-bold ml-1">{order.id}</span>
                                            </div>
                                            <div className="inline-flex items-center px-2 py-1 rounded-full bg-circuit-text-muted/10 text-circuit-text-muted text-xs font-medium">
                                                {order.status}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            {order.orderProducts.map((op, idx) => (
                                                <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                                                    <div className="w-16 h-16 bg-circuit-bg rounded border border-circuit-border flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-circuit-text-muted" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{op.productName}</div>
                                                        <div className="text-sm text-circuit-text-muted">Qty: {op.quantity} • ${op.price.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-4 border-t border-circuit-border">
                                                <div className="text-sm text-circuit-text-muted">Placed on {new Date(order.orderDate).toLocaleDateString()}</div>
                                                <div className="font-bold">Total: ${order.totalAmount.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case "addresses":
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold">Location & Addresses</h2>
                        <div className="bg-circuit-card border border-circuit-border rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Current Location</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-4 bg-circuit-bg rounded-md border border-circuit-border">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-circuit-green w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Saved Coordinates</span>
                                            {location ? (
                                                <span className="text-xs text-circuit-text-muted font-mono">
                                                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-circuit-text-muted">No location saved</span>
                                            )}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={handleGetLocation}>
                                        Update Location
                                    </Button>
                                </div>
                                {locationStatus && (
                                    <p className="text-sm text-circuit-text-muted">{locationStatus}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-circuit-card border border-circuit-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Saved Addresses</h3>
                                <Button size="sm" variant="ghost">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New
                                </Button>
                            </div>
                            <div className="p-8 text-center border border-circuit-border border-dashed rounded-lg text-circuit-text-muted">
                                <p>No additional addresses saved.</p>
                            </div>
                        </div>
                    </div>
                );
            case "payment":
                const handleAddPayment = () => {
                    if (!newPayment.cardNumber || !newPayment.expiryDate || !newPayment.cardName) {
                        alert("Please fill in all required fields");
                        return;
                    }

                    const maskedCard = `**** **** **** ${newPayment.cardNumber.slice(-4)}`;
                    const newMethod = {
                        id: Date.now(),
                        cardNumber: maskedCard,
                        last4: newPayment.cardNumber.slice(-4),
                        expiryDate: newPayment.expiryDate,
                        cardName: newPayment.cardName
                    };

                    const updated = [...paymentMethods, newMethod];
                    setPaymentMethods(updated);
                    localStorage.setItem("savedPaymentMethods", JSON.stringify(updated));
                    setNewPayment({ cardNumber: "", expiryDate: "", cardName: "", cvv: "" });
                    setShowAddForm(false);
                };

                const handleDeletePayment = (id: number) => {
                    const updated = paymentMethods.filter((pm: any) => pm.id !== id);
                    setPaymentMethods(updated);
                    localStorage.setItem("savedPaymentMethods", JSON.stringify(updated));
                };

                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold">Payment Methods</h2>
                        <div className="bg-circuit-card border border-circuit-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Saved Cards</h3>
                                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(!showAddForm)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {showAddForm ? "Cancel" : "Add Card"}
                                </Button>
                            </div>

                            {showAddForm && (
                                <div className="mb-6 p-4 border border-circuit-border rounded-lg bg-circuit-bg space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            className="w-full h-10 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm"
                                            placeholder="John Doe"
                                            value={newPayment.cardName}
                                            onChange={(e) => setNewPayment({ ...newPayment, cardName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            className="w-full h-10 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            value={newPayment.cardNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                                                const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                                                setNewPayment({ ...newPayment, cardNumber: formatted });
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                className="w-full h-10 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm"
                                                placeholder="12/25"
                                                maxLength={5}
                                                value={newPayment.expiryDate}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length >= 2) {
                                                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                    }
                                                    setNewPayment({ ...newPayment, expiryDate: value });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">CVV</label>
                                            <input
                                                type="text"
                                                className="w-full h-10 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm"
                                                placeholder="123"
                                                maxLength={4}
                                                value={newPayment.cvv}
                                                onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleAddPayment} className="w-full">
                                        Add Payment Method
                                    </Button>
                                </div>
                            )}

                            {paymentMethods.length === 0 && !showAddForm ? (
                                <div className="p-8 text-center border border-circuit-border border-dashed rounded-lg text-circuit-text-muted">
                                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No payment methods saved.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {paymentMethods.map((pm: any) => (
                                        <div key={pm.id} className="p-4 border border-circuit-border rounded-lg bg-circuit-bg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="w-6 h-6 text-circuit-green" />
                                                <div>
                                                    <p className="font-medium">{pm.cardName}</p>
                                                    <p className="text-sm text-circuit-text-muted">{pm.cardNumber}</p>
                                                    <p className="text-xs text-circuit-text-muted">Expires {pm.expiryDate}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeletePayment(pm.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold">Account Settings</h2>
                        
                        <div className="bg-circuit-card border border-circuit-border rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Profile Information</h3>
                            {loadingProfile ? (
                                <div className="text-circuit-text-muted">Loading profile...</div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <input
                                                type="text"
                                                className="flex h-10 w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <input
                                                type="text"
                                                className="flex h-10 w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            className="flex h-10 w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={profile.email}
                                            disabled
                                        />
                                        <p className="text-xs text-circuit-text-muted">Email cannot be changed.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="flex h-10 w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={profile.phoneNumber}
                                            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Address</label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={profile.address}
                                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" disabled={loadingProfile}>
                                            {loadingProfile ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>

                                    {profileMessage && (
                                        <p className={`text-sm ${profileMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>
                                            {profileMessage}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid md:grid-cols-[240px_1fr] gap-8">
                <aside className="space-y-2">
                    <Button
                        variant={activeTab === "orders" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("orders")}
                    >
                        <Package className="w-4 h-4" />
                        Orders
                    </Button>
                    <Button
                        variant={activeTab === "addresses" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("addresses")}
                    >
                        <MapPin className="w-4 h-4" />
                        Addresses
                    </Button>
                    <Button
                        variant={activeTab === "payment" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("payment")}
                    >
                        <CreditCard className="w-4 h-4" />
                        Payment Methods
                    </Button>
                    <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("settings")}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Button>

                    <div className="pt-4 mt-4 border-t border-circuit-border">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => logout()}
                        >
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </Button>
                    </div>
                </aside>

                <main className="min-h-[500px]">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
