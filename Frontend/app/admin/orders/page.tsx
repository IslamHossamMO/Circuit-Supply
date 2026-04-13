"use client";

import { useEffect, useState } from "react";
import { orderApi, GetOrderDTO } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<GetOrderDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const userStr = localStorage.getItem("circuit_user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const res = await orderApi.getAll(user.token);
            setOrders(res.responseObj || []);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        const userStr = localStorage.getItem("circuit_user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        setUpdatingStatus(orderId);
        try {
            await orderApi.updateStatus(orderId, newStatus, user.token);
            await loadOrders(); // Reload orders
        } catch (error) {
            console.error("Failed to update order status", error);
            alert("Failed to update order status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <div className="p-8 sm:ml-64">
            <h1 className="text-3xl font-bold mb-6">Orders</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-circuit-text">
                            <thead className="text-xs text-circuit-text-muted uppercase bg-circuit-bg/50">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-4 text-center">No orders found</td></tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="border-b border-circuit-border hover:bg-circuit-bg/50">
                                            <td className="px-6 py-4 font-mono">#{order.id}</td>
                                            <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    disabled={updatingStatus === order.id}
                                                    className="px-2 py-1 rounded-full text-xs font-medium bg-circuit-green/10 text-circuit-green border border-circuit-green/20 focus:outline-none focus:ring-1 focus:ring-circuit-green"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="EnRoute">EnRoute</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                {updatingStatus === order.id && (
                                                    <span className="ml-2 text-xs text-circuit-text-muted">Updating...</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {order.orderProducts.length} items
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}