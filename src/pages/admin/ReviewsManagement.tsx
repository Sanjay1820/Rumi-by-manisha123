import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Check, X, Trash2, Clock, CheckCircle2, XCircle, BarChart3, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Review {
    id: number;
    product_id: number;
    user_id?: number;
    author_name: string;
    author_email?: string;
    rating: number;
    title?: string;
    comment: string;
    verified_purchase: boolean | number;
    status: 'pending' | 'approved' | 'rejected';
    helpful_count: number;
    created_at: string;
    product_name: string;
    product_image?: string;
}

interface Stats {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    avg_rating: number;
    verified: number;
}

const ReviewsManagement = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState<string>("all");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (activeStatus !== "all") params.status = activeStatus;

            const [reviewsRes, statsRes] = await Promise.all([
                api.reviews.getAll(params),
                api.reviews.getStats()
            ]);

            if (reviewsRes.success) setReviews(reviewsRes.data);
            if (statsRes.success) setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [activeStatus]);

    const handleApprove = async (id: number) => {
        try {
            const res = await api.reviews.approve(id);
            if (res.success) {
                toast.success("Review approved");
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to approve review");
        }
    };

    const handleReject = async (id: number) => {
        try {
            const res = await api.reviews.reject(id);
            if (res.success) {
                toast.success("Review rejected");
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to reject review");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await api.reviews.delete(id);
            if (res.success) {
                toast.success("Review deleted");
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const filteredReviews = reviews.filter(
        (review) =>
            review.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1a1d23] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                            <Star className="w-8 h-8 text-primary" />
                            Customer Reviews
                        </h1>
                        <p className="text-gray-400 mt-2">Manage product reviews and feedback</p>
                    </div>
                    <Button
                        onClick={fetchReviews}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Reviews", value: stats.total, icon: BarChart3, color: "text-blue-400" },
                            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
                            { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-green-400" },
                            { label: "Avg Rating", value: Number(stats.avg_rating).toFixed(1), icon: Star, color: "text-primary" },
                        ].map((s, idx) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#1a1d23] p-6 rounded-2xl border border-white/5 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <s.icon className={`w-5 h-5 ${s.color}`} />
                                    <span className="text-2xl font-bold text-white">{s.value}</span>
                                </div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-6 bg-[#1a1d23] p-6 rounded-2xl border border-white/5">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search by author, product or comment..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#13151a] border-white/10 text-white pl-10 h-12 rounded-xl focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex bg-[#13151a] p-1 rounded-xl border border-white/10">
                        {["all", "pending", "approved", "rejected"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveStatus(status)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeStatus === status
                                    ? "bg-primary text-black"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 bg-[#1a1d23] rounded-3xl border border-white/5">
                            <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading reviews...</p>
                        </div>
                    ) : filteredReviews.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredReviews.map((review, index) => (
                                    <motion.div
                                        key={review.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 hover:border-primary/20 transition-all group overflow-hidden relative"
                                    >
                                        {/* Status Glow */}
                                        <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] -mr-12 -mt-12 transition-all ${review.status === 'approved' ? 'bg-green-500/10' :
                                            review.status === 'rejected' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                                            }`} />

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Top info */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                                                        {review.author_name ? review.author_name[0].toUpperCase() : 'U'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-white font-bold leading-none mb-1 truncate">{review.author_name}</h3>
                                                        <p className="text-xs text-gray-500 lowercase truncate">{review.author_email || 'no email'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex gap-0.5 bg-white/5 p-1.5 rounded-lg border border-white/5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-gray-600"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    {!!review.verified_purchase && (
                                                        <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Info with Thumbnail */}
                                            <div className="mb-4 flex items-center gap-3 p-3 bg-[#13151a] rounded-xl border border-white/5">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                    {review.product_image ? (
                                                        <img src={review.product_image} alt={review.product_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-1">No Image</div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Product</p>
                                                    <p className="text-sm text-primary font-medium truncate">{review.product_name}</p>
                                                </div>
                                            </div>

                                            {/* Title & Comment */}
                                            <div className="flex-1 mb-6">
                                                {review.title && <h4 className="text-white font-bold text-sm mb-2">{review.title}</h4>}
                                                <p className="text-gray-400 text-sm leading-relaxed italic">
                                                    "{review.comment}"
                                                </p>
                                            </div>

                                            {/* Status Badge & Actions */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${review.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                        review.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        }`}>
                                                        {review.status}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {review.status !== 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleApprove(review.id)}
                                                            className="h-8 border-green-500/20 text-green-500 hover:bg-green-500/10"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {review.status !== 'rejected' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleReject(review.id)}
                                                            className="h-8 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(review.id)}
                                                        className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#1a1d23] rounded-3xl border border-white/5 border-dashed">
                            <Star className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
                            <p className="text-gray-500 font-medium">No reviews found in this category</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-[10px] text-gray-600 uppercase tracking-widest font-bold px-4">
                    <p>Total items found: {filteredReviews.length}</p>
                    <p>Powered by RUMI Boutique Admin</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReviewsManagement;
