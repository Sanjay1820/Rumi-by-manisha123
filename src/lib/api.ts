// API Configuration
// Base URL for backend APIs

export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/rumi-By-Manisha-main/backend/api',
    ENDPOINTS: {
        FAQS: '/faqs.php',
        PRODUCTS: '/products.php',
        CATEGORIES: '/categories.php',
        GALLERY: '/gallery.php',
        REVIEWS: '/reviews.php',
        INQUIRIES: '/inquiries.php',
        AUTH: '/auth.php',
        USERS: '/users.php',
        COLLECTIONS: '/collections.php',
        ORDERS: '/orders.php',
    },
    TIMEOUT: 10000, // 10 seconds
};

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Helper function to build full API URL
export const getApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
    }

    return url.toString();
};

// Generic API fetch function
export const apiFetch = async <T>(
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string | number>
): Promise<ApiResponse<T>> => {
    const url = getApiUrl(endpoint, params);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Could not parse error JSON, keep default message
            }
            throw new Error(errorMessage);
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            throw new Error('Server returned invalid response. Please check backend logs.');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// API Methods
export const api = {
    // FAQ APIs
    faqs: {
        getAll: (params?: { page?: number; limit?: number; status?: string }) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, undefined, params),

        getGrouped: () =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, undefined, { grouped: '1' }),

        getPopular: (limit: number = 5) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, undefined, { popular: '1', limit }),

        getByCategory: (category: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, undefined, { category }),

        search: (query: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, undefined, { search: query }),

        create: (data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, { method: 'POST', body: JSON.stringify(data) }),

        update: (id: number, data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.FAQS, { method: 'DELETE' }, { id }),
    },

    // Product APIs
    products: {
        getAll: (params?: { page?: number; limit?: number; category?: number; status?: string }) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, params),

        getById: (id: number) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { id }),

        getBySlug: (slug: string) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { slug }),

        getFeatured: (limit: number = 8) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { featured: '1', limit }),

        getNewArrivals: (limit: number = 8) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { new: '1', limit }),

        getBestSellers: (limit: number = 8) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { bestseller: '1', limit }),

        search: (query: string) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { search: query }),

        getStats: () =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { stats: '1' }),

        getRelated: (productId: number, categoryId: number, limit: number = 4) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, undefined, { related: productId, category: categoryId, limit }),

        create: (data: any) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, { method: 'POST', body: JSON.stringify(data) }),

        update: (id: number, data: any) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.PRODUCTS, { method: 'DELETE' }, { id }),
    },

    // Category APIs
    categories: {
        getAll: (status: string = 'active') =>
            apiFetch(API_CONFIG.ENDPOINTS.CATEGORIES, undefined, { status }),

        getTree: () =>
            apiFetch(API_CONFIG.ENDPOINTS.CATEGORIES, undefined, { tree: '1' }),

        getBySlug: (slug: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.CATEGORIES, undefined, { slug }),

        create: (data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.CATEGORIES, { method: 'POST', body: JSON.stringify(data) }),

        update: (id: number, data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.CATEGORIES, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.CATEGORIES, { method: 'DELETE' }, { id }),
    },

    // Gallery APIs
    gallery: {
        getAll: (params?: { page?: number; limit?: number; status?: string }) =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, undefined, params),

        getByCategory: (category: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, undefined, { category }),

        getByType: (type: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, undefined, { type }),

        getGrouped: () =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, undefined, { grouped: '1' }),

        create: (data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, { method: 'POST', body: JSON.stringify(data) }),

        update: (id: number, data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.GALLERY, { method: 'DELETE' }, { id }),
    },

    // Review APIs
    reviews: {
        getByProduct: (productId: number) =>
            apiFetch<any[]>(API_CONFIG.ENDPOINTS.REVIEWS, undefined, { product: productId }),

        getPending: () =>
            apiFetch<any[]>(API_CONFIG.ENDPOINTS.REVIEWS, undefined, { pending: '1' }),

        getAll: (params?: { page?: number; limit?: number; status?: string }) =>
            apiFetch<any[]>(API_CONFIG.ENDPOINTS.REVIEWS, undefined, params),

        getStats: () =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.REVIEWS, undefined, { stats: '1' }),

        approve: (id: number) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.REVIEWS, { method: 'PUT' }, { approve: id }),

        reject: (id: number) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.REVIEWS, { method: 'PUT' }, { reject: id }),

        create: (data: any) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.REVIEWS, { method: 'POST', body: JSON.stringify(data) }),

        delete: (id: number) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.REVIEWS, { method: 'DELETE' }, { id }),
    },

    // Inquiry APIs
    inquiries: {
        getAll: (params?: { page?: number; limit?: number }) =>
            apiFetch(API_CONFIG.ENDPOINTS.INQUIRIES, undefined, params),

        getByStatus: (status: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.INQUIRIES, undefined, { status }),

        search: (query: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.INQUIRIES, undefined, { search: query }),

        create: (data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.INQUIRIES, { method: 'POST', body: JSON.stringify(data) }),

        update: (id: number, data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.INQUIRIES, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.INQUIRIES, { method: 'DELETE' }, { id }),
    },

    // Auth APIs
    auth: {
        register: (data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.AUTH, { method: 'POST', body: JSON.stringify(data) }, { action: 'register' }),

        login: (data: { email: string; password: string }) =>
            apiFetch(API_CONFIG.ENDPOINTS.AUTH, { method: 'POST', body: JSON.stringify(data) }, { action: 'login' }),
    },

    // Users APIs
    users: {
        getAll: () =>
            apiFetch(API_CONFIG.ENDPOINTS.USERS),

        getById: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.USERS, undefined, { id }),

        update: (id: number, data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.USERS, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: string | number) =>
            apiFetch(API_CONFIG.ENDPOINTS.USERS, { method: 'DELETE' }, { id }),
    },

    // Collections APIs
    collections: {
        getAll: (params?: { page?: number; limit?: number; status?: string }) =>
            apiFetch(API_CONFIG.ENDPOINTS.COLLECTIONS, undefined, params),

        getById: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.COLLECTIONS, undefined, { id }),

        getBySlug: (slug: string) =>
            apiFetch(API_CONFIG.ENDPOINTS.COLLECTIONS, undefined, { slug }),

        create: (data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.COLLECTIONS, { method: 'POST', body: JSON.stringify(data) }),

        update: (id: number, data: any) =>
            apiFetch(API_CONFIG.ENDPOINTS.COLLECTIONS, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch(API_CONFIG.ENDPOINTS.COLLECTIONS, { method: 'DELETE' }, { id }),
    },

    // Orders APIs
    orders: {
        getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.ORDERS, undefined, params),

        getStats: () =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.ORDERS, undefined, { stats: '1' }),

        getById: (id: string) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.ORDERS, undefined, { id }),

        update: (id: number, data: any) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.ORDERS, { method: 'PUT', body: JSON.stringify(data) }, { id }),

        delete: (id: number) =>
            apiFetch<any>(API_CONFIG.ENDPOINTS.ORDERS, { method: 'DELETE' }, { id }),
    },

    // File Upload API
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(getApiUrl('/upload.php'), {
            method: 'POST',
            body: formData,
        }).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        });
    },
};

export default api;
