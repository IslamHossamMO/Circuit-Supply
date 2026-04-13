"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterSidebarProps {
    categoryFilter?: string;
    categories: string[];
}

export function FilterSidebar({ categoryFilter, categories }: FilterSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") || "");

    // Helper to update the params while preserving others (and resetting to page 1)
    function updateParams(paramsObj: Record<string, string | undefined>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(paramsObj).forEach(([k, v]) => {
            if (v === undefined || v === "") params.delete(k);
            else params.set(k, v);
        });
        params.set("page", "1"); // Always reset pagination when changing filters
        router.push(`/product?${params.toString()}`);
    }

    const handlePriceApply = () => {
        updateParams({ minPrice, maxPrice });
    };

    return (
        <aside className="w-full md:w-64 space-y-8 h-fit md:sticky md:top-24">
            {/* Mobile Toggle */}
            <div className="md:hidden">
                <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
            </div>

            {/* Content Container - hidden on mobile unless open, always visible on desktop */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:block space-y-8 animate-in slide-in-from-top-2 md:animate-none`}>
                <div className="hidden md:flex items-center space-x-2 pb-4 border-b border-circuit-border">
                    <SlidersHorizontal className="w-5 h-5 text-circuit-green" />
                    <span className="font-bold text-lg">Filters</span>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="mb-4 font-semibold text-circuit-text">Categories</h3>
                    <div className="space-y-2">
                        <Button 
                            variant="link" 
                            className={`p-0 h-auto block text-sm ${!categoryFilter ? 'text-circuit-green font-bold' : 'text-circuit-text-muted hover:text-circuit-green'}`}
                            onClick={() => updateParams({ category: undefined })}
                        >
                            All Products
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant="link"
                                onClick={() => updateParams({ category: cat })}
                                className={`p-0 h-auto block text-sm ${categoryFilter === cat ? 'text-circuit-green font-bold' : 'text-circuit-text-muted hover:text-circuit-green'}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="mb-4 font-semibold text-circuit-text">Price Range</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-full">
                                <span className="absolute left-2 top-1.5 text-xs text-circuit-text-muted">$</span>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full rounded bg-circuit-card border border-circuit-border pl-5 pr-2 py-1 text-sm outline-none focus:border-circuit-green" 
                                />
                            </div>
                            <span className="text-circuit-text-muted">-</span>
                            <div className="relative w-full">
                                <span className="absolute left-2 top-1.5 text-xs text-circuit-text-muted">$</span>
                                <input 
                                    type="number" 
                                    placeholder="1000" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full rounded bg-circuit-card border border-circuit-border pl-5 pr-2 py-1 text-sm outline-none focus:border-circuit-green" 
                                />
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={handlePriceApply}>Apply</Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
