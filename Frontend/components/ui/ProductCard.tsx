"use client"

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/api";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "./Button";
import { useCart } from "@/components/cart-provider";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to detail page
        addItem(product);
    };

    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-xl border border-circuit-border bg-circuit-card transition-all duration-300 hover:border-circuit-green/50 hover:shadow-lg hover:shadow-circuit-green/5 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-circuit-bg">
    {product.image ? (
        <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
        />
    ) : (
        <div className="flex items-center justify-center w-full h-full text-circuit-text-muted bg-circuit-bg">
            No Image
        </div>
    )}

    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-circuit-card/80 backdrop-blur border border-circuit-border hover:bg-circuit-green hover:text-white"
            onClick={handleAddToCart}
        >
            <Plus className="h-4 w-4" />
        </Button>
    </div>
</div>


                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 text-xs font-mono text-circuit-green uppercase tracking-wider">
                        {product.category}
                    </div>
                    <h3 className="mb-2 text-lg font-bold leading-tight text-circuit-text group-hover:text-circuit-green transition-colors">
                        {product.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-xl font-bold text-circuit-blue">
                            ${product.price.toFixed(2)}
                        </span>
                        <div className="text-xs text-circuit-text-muted bg-circuit-bg px-2 py-1 rounded border border-circuit-border">
                            In Stock
                        </div>
                    </div>
                </div>
            </div>
        </Link >
    );
}
