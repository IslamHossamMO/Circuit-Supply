export const API_BASE_URL = "https://circuitsupply.runasp.net";

// Allow self-signed certificates in development for server-side fetches
if (process.env.NODE_ENV === "development" && typeof window === "undefined") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/* -------------------------------------------------
    IMAGE URL NORMALIZATION
------------------------------------------------- */
function getImageUrl(path: string | null | undefined): string {
    if (!path) return "";

    if (path.startsWith("http")) {
        return path.replace("https://circuitsupply.runasp.net", API_BASE_URL);
    }

    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
}

/* -------------------------------------------------
    SPECS NORMALIZATION
------------------------------------------------- */
export function normalizeSpecs(raw: any): { label: string; value: string }[] {
    if (!raw) return [];

    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string" && raw.trim()) {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.error("Failed to parse specs:", err);
            return [];
        }
    }

    return [];
}

/* -------------------------------------------------
    GENERIC API RESPONSE
------------------------------------------------- */
export interface ApiResponse<T> {
    message: string;
    status: number;
    responseObj: T;
}

/* -------------------------------------------------
    AUTH DTOs
------------------------------------------------- */
export interface PostCustomerDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
}

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface AdminLoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    email: string;
    id: number;
}

/* -------------------------------------------------
    CATEGORY DTOs
------------------------------------------------- */
export interface CategoryDTO {
    id: number;
    name: string;
}

export interface CreateCategoryDTO {
    name: string;
}

/* -------------------------------------------------
    CUSTOMER DTOs
------------------------------------------------- */
export interface GetCustomerDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
}

/* -------------------------------------------------
    ORDER DTOs
------------------------------------------------- */
export interface GetOrderProductDTO {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface GetOrderDTO {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    orderProducts: GetOrderProductDTO[];
}

export interface OrderProductDTO {
    productId: number;
    quantity: number;
}

export interface CreateOrderDTO {
    customerId?: number;
    orderProducts: OrderProductDTO[];
    deliveryAddress: string;
    latitude: number;
    longitude: number;
    paymentMethod: string;
}

/* -------------------------------------------------
    PRODUCT DTOs (FROM BACKEND)
------------------------------------------------- */
export interface GetProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
    specs: any;
}

/* -------------------------------------------------
    PRODUCT DTO (FOR CREATE/EDIT)
------------------------------------------------- */
export interface ProductFormDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    imageFile?: File;
    specifications?: { label: string; value: string }[];
}

/* -------------------------------------------------
    FRONTEND PRODUCT INTERFACE (FINAL SHAPE)
------------------------------------------------- */
export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
    stock?: number;
    specs: { label: string; value: string }[];
}

/* -------------------------------------------------
    HEADER BUILDER
------------------------------------------------- */
const getHeaders = (token?: string, isFormData: boolean = false): HeadersInit => {
    const headers: HeadersInit = {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
};

/* -------------------------------------------------
    AUTH API
------------------------------------------------- */
export const authApi = {
    signup: async (data: PostCustomerDTO): Promise<ApiResponse<LoginResponseDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Auth/signup`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw { status: res.status, message: json?.message || "Signup failed" };

        return json;
    },

    login: async (data: LoginRequestDTO): Promise<ApiResponse<LoginResponseDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw { status: res.status, message: json?.message || "Login failed" };

        return json;
    },

    adminLogin: async (data: AdminLoginDTO): Promise<ApiResponse<LoginResponseDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Auth/admin/login`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw { status: res.status, message: json?.message || "Admin login failed" };

        return json;
    },
};

/* -------------------------------------------------
    CATEGORY API
------------------------------------------------- */
export const categoryApi = {
    getAll: async (): Promise<CategoryDTO[]> => {
        const res = await fetch(`${API_BASE_URL}/api/Category`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch categories`);
        return res.json();
    },

    getById: async (id: number): Promise<CategoryDTO> => {
        const res = await fetch(`${API_BASE_URL}/api/Category/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch category`);
        return res.json();
    },
};

/* -------------------------------------------------
    PRODUCT API
------------------------------------------------- */
export const productApi = {
    getAll: async (): Promise<ApiResponse<GetProductDTO[]>> => {
        const res = await fetch(`${API_BASE_URL}/api/Product`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch products`);
        return res.json();
    },

    getById: async (id: number): Promise<ApiResponse<GetProductDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Product/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product`);
        return res.json();
    },

    create: async (data: FormData, token: string): Promise<ApiResponse<GetProductDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Product`, {
            method: "POST",
            headers: getHeaders(token, true),
            body: data,
        });
        if (!res.ok) throw new Error("Failed to create product");
        return res.json();
    },

    update: async (id: number, data: FormData, token: string): Promise<ApiResponse<GetProductDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Product/${id}`, {
            method: "PUT",
            headers: getHeaders(token, true),
            body: data,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to update product");
        }

        return res.json();
    },

    delete: async (id: number, token: string): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/api/Product/${id}`, {
            method: "DELETE",
            headers: getHeaders(token),
        });

        if (!res.ok) throw new Error("Failed to delete product");
    },

    getTrending: async (count: number = 4): Promise<ApiResponse<GetProductDTO[]>> => {
        const res = await fetch(`${API_BASE_URL}/api/Product/trending?count=${count}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch trending products");
        return res.json();
    },

    search: async (query: string): Promise<ApiResponse<GetProductDTO[]>> => {
        const res = await fetch(
            `${API_BASE_URL}/api/Product/search?q=${encodeURIComponent(query)}`,
            { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to search products");
        return res.json();
    },
};

/* -------------------------------------------------
    CUSTOMER API
------------------------------------------------- */
export const customerApi = {
    getAll: async (token: string): Promise<ApiResponse<GetCustomerDTO[]>> => {
        const res = await fetch(`${API_BASE_URL}/api/Customer`, {
            headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
    },

    getById: async (id: number, token: string): Promise<ApiResponse<GetCustomerDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Customer/${id}`, {
            headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to fetch customer");
        return res.json();
    },

    getByName: async (name: string, token: string): Promise<ApiResponse<GetCustomerDTO[]>> => {
        const res = await fetch(`${API_BASE_URL}/api/Customer/name/${name}`, {
            headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to search customers by name");
        return res.json();
    },

    getByEmail: async (email: string, token: string): Promise<ApiResponse<GetCustomerDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Customer/email/${email}`, {
            headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to search customer by email");
        return res.json();
    },

    update: async (
        id: number,
        data: PostCustomerDTO,
        token: string
    ): Promise<ApiResponse<null>> => {
        const res = await fetch(`${API_BASE_URL}/api/Customer/${id}`, {
            method: "PUT",
            headers: getHeaders(token),
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update customer");
        return res.json();
    },
};

/* -------------------------------------------------
    ORDER API
------------------------------------------------- */
export const orderApi = {
    create: async (data: CreateOrderDTO, token: string): Promise<ApiResponse<GetOrderDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Order`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create order");
        return res.json();
    },

    getMyOrders: async (token: string): Promise<ApiResponse<GetOrderDTO[]>> => {
        const res = await fetch(`${API_BASE_URL}/api/Order/my`, {
            headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
    },

    getAll: async (token: string): Promise<ApiResponse<GetOrderDTO[]>> => {
        const res = await fetch(`${API_BASE_URL}/api/Order/all`, {
            headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to fetch all orders");
        return res.json();
    },

    updateStatus: async (
        id: number,
        status: string,
        token: string
    ): Promise<ApiResponse<GetOrderDTO>> => {
        const res = await fetch(`${API_BASE_URL}/api/Order/${id}/status`, {
            method: "PUT",
            headers: getHeaders(token),
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("Failed to update order status");
        return res.json();
    },
};

/* -------------------------------------------------
    FRONTEND HELPERS
------------------------------------------------- */
export async function getProductsForFrontend(): Promise<Product[]> {
    try {
        const [productsRes, categories] = await Promise.all([
            productApi.getAll(),
            categoryApi.getAll(),
        ]);

        const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

        return (productsRes.responseObj || []).map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: categoryMap.get(p.categoryId) || "Unknown",
            image: getImageUrl(p.imageUrl),
            description: p.description,
            stock: p.stock,
            specs: normalizeSpecs(p.specs),
        }));
    } catch (error) {
        console.error("Error in getProductsForFrontend:", error);
        return [];
    }
}

export async function getProductByIdForFrontend(
    id: number
): Promise<Product | undefined> {
    try {
        const [productRes, categories] = await Promise.all([
            productApi.getById(id),
            categoryApi.getAll(),
        ]);

        const p = productRes.responseObj;
        if (!p) return undefined;

        const category = categories.find((c) => c.id === p.categoryId);

        return {
            id: p.id,
            name: p.name,
            price: p.price,
            category: category?.name || "Unknown",
            image: getImageUrl(p.imageUrl),
            description: p.description,
            stock: p.stock,
            specs: normalizeSpecs(p.specs),
        };
    } catch (error) {
        console.error("getProductByIdForFrontend failed:", error);
        return undefined;
    }
}
