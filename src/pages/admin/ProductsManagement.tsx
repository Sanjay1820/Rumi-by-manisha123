import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    collection_id: number;
    collection_name?: string;
    price: number;
    price_inr?: number;
    compare_price?: number;
    sku?: string;
    stock_quantity: number;
    fabric?: string;
    primary_image?: string;
    status: string;
    featured?: number;
    new_arrival?: number;
    best_seller?: number;
}

const ProductsManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch products from database
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.products.getAll({ limit: 100 });
            if (response.success && response.data) {
                setProducts(response.data);
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.message || 'Failed to load products');
            toast.error('Failed to load products from database');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(
        (product) =>
            (product.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (product.collection_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (product.sku?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await api.products.delete(id);
                if (response.success) {
                    setProducts(products.filter((p) => p.id !== id));
                    toast.success('Product deleted successfully');
                } else {
                    throw new Error('Failed to delete product');
                }
            } catch (err: any) {
                console.error('Error deleting product:', err);
                toast.error('Failed to delete product');
            }
        }
    };

    // Loading state
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">Loading products from database...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4 max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Products</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Button onClick={fetchProducts} variant="luxury">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
                        <p className="text-muted-foreground mt-1">Manage your product catalog ({products.length} total)</p>
                    </div>
                    <Link to="/admin/products/new">
                        <Button variant="luxury" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Products Table */}
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm text-foreground">Product</th>
                                    <th className="text-left p-4 font-medium text-sm text-foreground">Collection</th>
                                    <th className="text-left p-4 font-medium text-sm text-foreground">Price</th>
                                    <th className="text-left p-4 font-medium text-sm text-foreground">SKU</th>
                                    <th className="text-left p-4 font-medium text-sm text-foreground">Stock</th>
                                    <th className="text-right p-4 font-medium text-sm text-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.primary_image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop'}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{product.fabric || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                {product.collection_name || 'No Collection'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-foreground space-y-1">
                                            <div className="font-medium">${Number(product.price).toFixed(2)}</div>
                                            <div className="text-xs text-muted-foreground">₹{(Number(product.price_inr) || Number(product.price) * 83).toLocaleString()}</div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">{product.sku || 'N/A'}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${product.stock_quantity === 0
                                                    ? "bg-red-500/10 text-red-600"
                                                    : product.stock_quantity < 10
                                                        ? "bg-yellow-500/10 text-yellow-600"
                                                        : "bg-green-500/10 text-green-600"
                                                    }`}>
                                                    {product.stock_quantity === 0
                                                        ? "Out of Stock"
                                                        : product.stock_quantity < 10
                                                            ? `Low: ${product.stock_quantity}`
                                                            : `${product.stock_quantity} units`}
                                                </span>
                                                {product.status !== 'active' && (
                                                    <span className="text-[10px] text-muted-foreground capitalize">{product.status}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/product/${product.id}`} target="_blank">
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link to={`/admin/products/edit/${product.id}`}>
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No products found</p>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing {filteredProducts.length} of {products.length} products</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductsManagement;
