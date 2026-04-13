"use client";

import { useEffect, useState } from "react";
import { productApi, GetProductDTO } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ProductModal from "@/components/admin/ProductModal";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<GetProductDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<GetProductDTO | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await productApi.getAll();
            setProducts(res.responseObj || []);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        const userStr = localStorage.getItem("circuit_user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        
        try {
            await productApi.delete(id, user.token);
            loadProducts();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete product");
        }
    };

    const handleEdit = (product: GetProductDTO) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="p-8 sm:ml-64">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <ProductModal
                open={modalOpen}
                onClose={handleModalClose}
                onSaved={loadProducts}
                product={editingProduct}
            />

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-circuit-text">
                            <thead className="text-xs text-circuit-text-muted uppercase bg-circuit-bg/50">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-4 text-center">No products found</td></tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="border-b border-circuit-border hover:bg-circuit-bg/50">
                                            <td className="px-6 py-4 font-mono">{product.id}</td>
                                            <td className="px-6 py-4 font-medium">{product.name}</td>
                                            <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">{product.stock}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
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
