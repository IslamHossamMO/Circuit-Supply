"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { productApi, categoryApi, GetProductDTO, ProductFormDTO, CategoryDTO } from "@/lib/api";
import { X } from "lucide-react";

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    product?: GetProductDTO | null;
}

export default function ProductModal({ open, onClose, onSaved, product }: ProductModalProps) {
    const [form, setForm] = useState<ProductFormDTO>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: 0,
        specifications: [],
    });
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            loadCategories();
            if (product) {
                const specs = product.specs && Array.isArray(product.specs) 
                    ? product.specs.map((s: any) => ({ label: s.label || s.Label || "", value: s.value || s.Value || "" }))
                    : [];
                setForm({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    categoryId: product.categoryId,
                    specifications: specs,
                });
            } else {
                setForm({
                    name: "",
                    description: "",
                    price: 0,
                    stock: 0,
                    categoryId: 0,
                    specifications: [],
                });
            }
            setImageFile(null);
            setError("");
        }
    }, [product, open]);

    const loadCategories = async () => {
        try {
            const cats = await categoryApi.getAll();
            setCategories(cats);
            if (cats.length > 0 && !product) {
                setForm(prev => ({ ...prev, categoryId: cats[0].id }));
            }
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const userStr = localStorage.getItem("circuit_user");
        if (!userStr) {
            setError("You must be logged in");
            setLoading(false);
            return;
        }
        const user = JSON.parse(userStr);
        const token = user.token;

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", form.price.toString());
            formData.append("stock", form.stock.toString());
            formData.append("categoryId", form.categoryId.toString());
            if (imageFile) {
                formData.append("imageFile", imageFile);
            }
            // Always include specifications, even if empty array
            if (form.specifications) {
                formData.append("specifications", JSON.stringify(form.specifications));
            } else {
                formData.append("specifications", JSON.stringify([]));
            }

            if (product) {
                // Update existing product - ensure ID is included
                formData.append("Id", product.id.toString());
                try {
                    await productApi.update(product.id, formData, token);
                } catch (err: any) {
                    console.error("Update error details:", err);
                    setError(err.message || "Failed to update product. Please check all fields are filled correctly.");
                    setLoading(false);
                    return;
                }
            } else {
                // Create new product
                await productApi.create(formData, token);
            }

            onSaved();
            onClose();
        } catch (err: any) {
            console.error("Failed to save product", err);
            setError(err.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-circuit-card border border-circuit-border rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-circuit-border">
                    <h2 className="text-2xl font-bold text-circuit-text">
                        {product ? "Edit Product" : "Add Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-circuit-text-muted hover:text-circuit-text transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-circuit-text">Product Name</label>
                        <input
                            type="text"
                            className="w-full h-10 rounded-md border border-circuit-border bg-circuit-bg px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none"
                            placeholder="Enter product name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-circuit-text">Description</label>
                        <textarea
                            className="w-full min-h-[100px] rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm text-circuit-text focus:border-circuit-green focus:outline-none"
                            placeholder="Enter product description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-circuit-text">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="w-full h-10 rounded-md border border-circuit-border bg-circuit-bg px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none"
                                placeholder="0.00"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-circuit-text">Stock</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full h-10 rounded-md border border-circuit-border bg-circuit-bg px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none"
                                placeholder="0"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-circuit-text">Category</label>
                        <select
                            className="w-full h-10 rounded-md border border-circuit-border bg-circuit-bg px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none"
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                            required
                        >
                            <option value={0}>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-circuit-text">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full h-10 rounded-md border border-circuit-border bg-circuit-bg px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-circuit-green/10 file:text-circuit-green hover:file:bg-circuit-green/20"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                        {product?.imageUrl && !imageFile && (
                            <p className="text-xs text-circuit-text-muted mt-1">Current image: {product.imageUrl}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-circuit-text">Specifications</label>
                        <div className="space-y-2 border border-circuit-border rounded-md p-3 bg-circuit-bg">
                            {form.specifications?.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Label"
                                        className="flex-1 h-8 rounded-md border border-circuit-border bg-circuit-card px-2 text-sm text-circuit-text"
                                        value={spec.label}
                                        onChange={(e) => {
                                            const newSpecs = [...(form.specifications || [])];
                                            newSpecs[index].label = e.target.value;
                                            setForm({ ...form, specifications: newSpecs });
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="flex-1 h-8 rounded-md border border-circuit-border bg-circuit-card px-2 text-sm text-circuit-text"
                                        value={spec.value}
                                        onChange={(e) => {
                                            const newSpecs = [...(form.specifications || [])];
                                            newSpecs[index].value = e.target.value;
                                            setForm({ ...form, specifications: newSpecs });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSpecs = form.specifications?.filter((_, i) => i !== index) || [];
                                            setForm({ ...form, specifications: newSpecs });
                                        }}
                                        className="px-2 text-red-500 hover:bg-red-500/10 rounded"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({
                                        ...form,
                                        specifications: [...(form.specifications || []), { label: "", value: "" }]
                                    });
                                }}
                                className="text-sm text-circuit-green hover:underline"
                            >
                                + Add Specification
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-circuit-border">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
