// Custom React Hooks for API Data Fetching
// Use these hooks in your components to fetch data from backend

import { useState, useEffect } from 'react';
import api from '@/lib/api';

// Generic hook for API data fetching
export function useApiData<T>(
    fetchFunction: () => Promise<any>,
    dependencies: any[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchFunction();

                if (isMounted && response.success) {
                    setData(response.data);
                } else if (!response.success) {
                    setError(response.error || 'Failed to fetch data');
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, dependencies);

    return { data, loading, error };
}

// Hook for FAQs
export function useFAQs(grouped: boolean = false) {
    return useApiData(
        () => grouped ? api.faqs.getGrouped() : api.faqs.getAll(),
        [grouped]
    );
}

// Hook for popular FAQs
export function usePopularFAQs(limit: number = 5) {
    return useApiData(
        () => api.faqs.getPopular(limit),
        [limit]
    );
}

// Hook for products
export function useProducts(params?: {
    page?: number;
    limit?: number;
    category?: number;
}) {
    return useApiData(
        () => api.products.getAll(params),
        [params?.page, params?.limit, params?.category]
    );
}

// Hook for featured products
export function useFeaturedProducts(limit: number = 8) {
    return useApiData(
        () => api.products.getFeatured(limit),
        [limit]
    );
}

// Hook for new arrivals
export function useNewArrivals(limit: number = 8) {
    return useApiData(
        () => api.products.getNewArrivals(limit),
        [limit]
    );
}

// Hook for best sellers
export function useBestSellers(limit: number = 8) {
    return useApiData(
        () => api.products.getBestSellers(limit),
        [limit]
    );
}

// Hook for single product
export function useProduct(id?: number, slug?: string) {
    return useApiData(
        () => id ? api.products.getById(id) : api.products.getBySlug(slug!),
        [id, slug]
    );
}

// Hook for categories
export function useCategories() {
    return useApiData(
        () => api.categories.getAll(),
        []
    );
}

// Hook for category tree
export function useCategoryTree() {
    return useApiData(
        () => api.categories.getTree(),
        []
    );
}

// Hook for gallery
export function useGallery(params?: {
    category?: string;
    type?: string;
    grouped?: boolean;
}) {
    return useApiData(
        () => {
            if (params?.grouped) return api.gallery.getGrouped();
            if (params?.category) return api.gallery.getByCategory(params.category);
            if (params?.type) return api.gallery.getByType(params.type);
            return api.gallery.getAll();
        },
        [params?.category, params?.type, params?.grouped]
    );
}

// Hook for product reviews
export function useProductReviews(productId: number) {
    return useApiData(
        () => api.reviews.getByProduct(productId),
        [productId]
    );
}

// Hook for inquiries
export function useInquiries(status?: string) {
    return useApiData(
        () => status ? api.inquiries.getByStatus(status) : api.inquiries.getAll(),
        [status]
    );
}

// Example usage in components:
/*

// In FAQ page:
import { useFAQs, usePopularFAQs } from '@/hooks/useApi';

function FAQPage() {
  const { data: faqs, loading, error } = useFAQs(true); // grouped
  const { data: popularFAQs } = usePopularFAQs(3);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render FAQs */}</div>;
}

// In Shop page:
import { useProducts, useCategories } from '@/hooks/useApi';

function ShopPage() {
    const { data: products, loading } = useProducts({ page: 1, limit: 20 });
    const { data: categories } = useCategories();

    return <div>{/* Render products */ } </div>;
}

// In Home page:
import { useFeaturedProducts, useNewArrivals } from '@/hooks/useApi';

function HomePage() {
    const { data: featured } = useFeaturedProducts(8);
    const { data: newArrivals } = useNewArrivals(8);

    return <div>{/* Render products */ } </div>;
}

*/
