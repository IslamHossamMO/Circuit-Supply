"use client";

import { useEffect, useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { getProductsForFrontend, categoryApi } from "@/lib/api";
import type { Product } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // --- Local State ---
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const ITEMS_PER_PAGE = 15;

    // --- Read params ---
    const categoryFilter = searchParams.get("category") || searchParams.get("filter") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");

    // Fetch products + categories once
    useEffect(() => {
        async function load() {
            setLoading(true);

            const [products, categoryData] = await Promise.all([
                getProductsForFrontend(),
                categoryApi.getAll(),
            ]);

            setAllProducts(products);
            setCategories(categoryData.map((c) => c.name));
            setLoading(false);
        }

        load();
    }, []);

    // --- Filtering Logic (client-side reactive) ---
    let filteredProducts = [...allProducts];

    // Search
    if (searchQuery.trim()) {
        const term = searchQuery.trim().toLowerCase();
        const asNumber = Number(term);

        filteredProducts = filteredProducts.filter((p) => {
            if (!isNaN(asNumber) && p.id === asNumber) return true;

            return (
                p.name.toLowerCase().includes(term) ||
                p.category?.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            );
        });
    }

    // Category
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(
            (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
    }

    // Price filters
    if (minPrice) {
        filteredProducts = filteredProducts.filter(
            (p) => p.price >= parseFloat(minPrice)
        );
    }

    if (maxPrice) {
        filteredProducts = filteredProducts.filter(
            (p) => p.price <= parseFloat(maxPrice)
        );
    }

    // --- Pagination ---
    const totalProducts = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) {
        return (
            <div className="container px-4 py-32 text-center text-circuit-text-muted">
                Loading products...
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                <FilterSidebar
                    categoryFilter={categoryFilter}
                    categories={categories}
                />

                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Electronics Products</h1>
                        <div className="text-sm text-circuit-text-muted">
                            Showing {totalProducts} results
                        </div>
                    </div>

                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            <Pagination page={currentPage} totalPages={totalPages} />
                        </>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-circuit-border rounded-lg text-circuit-text-muted">
                            No products found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
