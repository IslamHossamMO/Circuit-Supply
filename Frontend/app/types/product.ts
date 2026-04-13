// /types/product.ts
export interface Product {
    id: number | string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string | null;
    stock?: number;

    // FIXED TYPE
    specs?: { label: string; value: string }[];
}
