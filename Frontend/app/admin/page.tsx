"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { orderApi, productApi, customerApi, GetOrderDTO } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { DollarSign, Package, Users, ShoppingCart } from "lucide-react";

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0
    });
    const [recentOrders, setRecentOrders] = useState<GetOrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;

            try {
                // Fetch all data in parallel
                const [ordersRes, productsRes, customersRes] = await Promise.all([
                    orderApi.getAll(user.token),
                    productApi.getAll(),
                    customerApi.getAll(user.token)
                ]);

                const orders = ordersRes.responseObj;
                const products = productsRes.responseObj;
                const customers = customersRes.responseObj;

                // Calculate stats
                const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
                
                setStats({
                    totalRevenue,
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    totalCustomers: customers.length
                });

                // Get recent 5 orders
                setRecentOrders(orders.slice(0, 5));

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user?.token]);

    if (isLoading) {
        return <div className="text-circuit-green">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6 bg-circuit-card border-circuit-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-circuit-green/10 rounded-full">
                            <DollarSign className="w-6 h-6 text-circuit-green" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-circuit-text-muted">Total Revenue</p>
                            <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-circuit-card border-circuit-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-full">
                            <ShoppingCart className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-circuit-text-muted">Total Orders</p>
                            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-circuit-card border-circuit-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-full">
                            <Package className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-circuit-text-muted">Products</p>
                            <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-circuit-card border-circuit-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-full">
                            <Users className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-circuit-text-muted">Customers</p>
                            <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6 bg-circuit-card border-circuit-border">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-circuit-bg text-circuit-text-muted">
                            <tr>
                                <th className="p-3 font-medium">Order ID</th>
                                <th className="p-3 font-medium">Date</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-circuit-border">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-circuit-bg/50">
                                    <td className="p-3">#{order.id}</td>
                                    <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-circuit-green/10 text-circuit-green">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-circuit-text-muted">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
