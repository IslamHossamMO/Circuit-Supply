"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== "Admin") {
                router.push("/login");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-circuit-bg text-circuit-green">
                Loading...
            </div>
        );
    }

    if (!user || user.role !== "Admin") {
        return null;
    }

    return (
        <div className="min-h-screen bg-circuit-bg flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
