"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    Settings,
    LogOut,
    ShoppingBag
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/Button";

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/customers", label: "Customers", icon: Users },
    ];

    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div className="h-full px-3 py-4 overflow-y-auto bg-circuit-card border-r border-circuit-border">
                <Link href="/admin" className="flex items-center pl-2.5 mb-8">
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-circuit-text">
                        Admin Panel
                    </span>
                </Link>
                <ul className="space-y-2 font-medium">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        
                        return (
                            <li key={link.href}>
                                <Link 
                                    href={link.href}
                                    className={`flex items-center p-2 rounded-lg group ${
                                        isActive 
                                            ? "bg-circuit-green/10 text-circuit-green" 
                                            : "text-circuit-text hover:bg-circuit-bg"
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 transition duration-75 ${
                                        isActive ? "text-circuit-green" : "text-circuit-text-muted group-hover:text-circuit-text"
                                    }`} />
                                    <span className="ml-3">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="absolute bottom-4 left-0 w-full px-3">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => logout()}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        LogOut
                    </Button>
                </div>
            </div>
        </aside>
    );
}
