"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { customerApi, GetCustomerDTO } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { Search, Mail, User } from "lucide-react";

export default function AdminCustomersPage() {
    const { user } = useAuth();
    const [searchType, setSearchType] = useState<"name" | "email">("name");
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState<GetCustomerDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token || !searchQuery.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        setCustomers([]);

        try {
            if (searchType === "name") {
                const res = await customerApi.getByName(searchQuery, user.token);
                setCustomers(res.responseObj);
            } else {
                const res = await customerApi.getByEmail(searchQuery, user.token);
                // API returns single object for email, wrap in array
                setCustomers([res.responseObj]);
            }
        } catch (error) {
            console.error("Failed to search customers:", error);
            // Don't alert on 404/not found, just show empty state
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>

            {/* Search Form */}
            <div className="bg-circuit-card border border-circuit-border rounded-lg p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as "name" | "email")}
                            className="w-full h-10 rounded-md border border-circuit-border bg-circuit-bg px-3 text-sm focus:border-circuit-green focus:outline-none"
                        >
                            <option value="name">Search by Name</option>
                            <option value="email">Search by Email</option>
                        </select>
                    </div>
                    <div className="flex-1 relative">
                        {searchType === "name" ? (
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-circuit-text-muted" />
                        ) : (
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-circuit-text-muted" />
                        )}
                        <input
                            type={searchType === "email" ? "email" : "text"}
                            placeholder={searchType === "name" ? "Enter customer name..." : "Enter customer email..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 h-10 rounded-md border border-circuit-border bg-circuit-bg text-sm focus:border-circuit-green focus:outline-none"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                    </Button>
                </form>
            </div>

            {/* Results */}
            {hasSearched && (
                <div className="bg-circuit-card border border-circuit-border rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-circuit-border">
                        <h2 className="font-semibold">Search Results</h2>
                    </div>
                    
                    {customers.length > 0 ? (
                        <div className="divide-y divide-circuit-border">
                            {customers.map((customer, index) => (
                                <div key={index} className="p-4 hover:bg-circuit-bg/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{customer.firstName} {customer.lastName}</h3>
                                        <div className="text-circuit-text-muted flex items-center gap-4 text-sm mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {customer.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {customer.phoneNumber}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Could add actions here later like View Orders */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-circuit-text-muted">
                            No customers found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
