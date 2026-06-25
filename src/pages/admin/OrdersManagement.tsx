import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download, X, ShoppingBag, User, Calendar, CheckCircle2, ChevronRight, Printer, RefreshCw, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
}

interface Order {
    id: string; // strict ID for UI (order_number)
    db_id: number; // database ID for fetching details
    customer: string;
    date: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: number; // count
    email: string;
    address: string;
    order_items?: OrderItem[]; // for detailed view
}

const OrdersManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Apply backend sorting/filtering if needed, but for now client-side is fine 
            // as we want to maintain the specific UI behavior
            const response = await api.orders.getAll({ limit: 100 });

            if (response.success && Array.isArray(response.data)) {
                // Map backend data to frontend Order interface
                const mappedOrders: Order[] = response.data.map((o: any) => ({
                    id: o.order_number,
                    db_id: o.id,
                    customer: o.customer_name,
                    email: o.customer_email,
                    address: `${o.shipping_address}, ${o.city}`,
                    date: o.formatted_date || o.created_at.split(' ')[0],
                    total: parseFloat(o.total_amount),
                    status: o.status,
                    items: parseInt(o.items_count || '0')
                }));
                setOrders(mappedOrders);
            } else {
                throw new Error(response.error || 'Failed to fetch orders');
            }
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders');
            toast.error('Failed to load orders from database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrderDetails = async (order: Order) => {
        try {
            setDetailsLoading(true);
            const response = await api.orders.getById(String(order.db_id)); // Use DB ID
            if (response.success && response.data) {
                const fullOrder = response.data;
                // Merge detail items into the selected order
                setSelectedOrder({
                    ...order,
                    order_items: fullOrder.items?.map((item: any) => ({
                        id: item.id,
                        product_name: item.product_name,
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price),
                        total: parseFloat(item.total)
                    })) || []
                });
            }
        } catch (err) {
            toast.error("Could not load order details");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

        try {
            const res = await api.orders.delete(id);
            if (res && res.success) {
                toast.success("Order deleted successfully");
                setOrders(prev => prev.filter(o => o.db_id !== id));
                if (selectedOrder && selectedOrder.db_id === id) {
                    setSelectedOrder(null);
                }
            } else {
                toast.error("Failed to delete order");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting order");
        }
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        // Fetch full details including items
        fetchOrderDetails(order);
    };

    // Client-side filtering for search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        const headers = ["Order ID", "Customer", "Date", "Items", "Total", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredOrders.map(o => `${o.id},${o.customer},${o.date},${o.items},${o.total},${o.status}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.body.appendChild(document.createElement("a"));
        link.href = url;
        link.download = `Orders_Report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Export started!");
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                        <p className="text-gray-400 font-mono text-sm animate-pulse">Establishing secure link to ledger...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Connection Failure</h3>
                            <p className="text-gray-400 text-sm">{error}</p>
                        </div>
                        <Button onClick={fetchOrders} variant="luxury" className="px-8">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Connection
                        </Button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#1a1d23] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                            System Logic <ChevronRight className="w-3 h-3" /> Orders Fulfillment
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tighter">Transaction <span className="text-primary">Ledger</span></h1>
                        <p className="text-gray-400 text-sm mt-1">Full sequence tracking for customer acquisitions.</p>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <Button variant="luxury" onClick={handleExport} className="h-12 px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <Download className="w-4 h-4 mr-2" />
                            Export Data (.CSV)
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20" />
                </div>

                {/* Filter Controls */}
                <div className="bg-[#1a1d23] rounded-3xl border border-white/5 p-6 shadow-xl flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative w-full lg:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Identify order or target customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-white rounded-2xl placeholder:text-gray-600 transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as Order['status'] | 'all')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === status
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[#1a1d23] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black/40 border-b border-white/5">
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Manifest ID</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Acquisition Target</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Timestamp</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Unit Count</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Transaction Value</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Status</th>
                                    <th className="text-right p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <Search className="w-12 h-12 text-primary" />
                                                    <p className="font-display text-xl font-bold text-white italic">Zero results found in this sector.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredOrders.map((order, index) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-all group"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-6 bg-primary/20 group-hover:bg-primary transition-all rounded-full" />
                                                    <span className="text-sm font-mono font-bold text-primary group-hover:scale-105 transition-transform inline-block">
                                                        {order.id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-white group-hover:text-primary transition-colors leading-tight">
                                                        {order.customer}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-medium">{order.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-gray-400 font-medium">{order.date}</td>
                                            <td className="p-6 text-sm text-gray-400 font-medium">{order.items} <span className="text-[10px] uppercase opacity-50 ml-1">Items</span></td>
                                            <td className="p-6">
                                                <span className="text-lg font-display font-bold text-white tracking-widest border-b border-white/10 pb-0.5">
                                                    ₹{order.total.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-flex items-center px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest border group-hover:scale-105 transition-all ${getStatusColor(order.status)}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 bg-white/5 border border-white/10 text-primary-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-sm"
                                                        onClick={() => handleViewOrder(order)}
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-5 h-5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all shadow-sm group/del"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(order.db_id);
                                                        }}
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, scaleY: 0.8 }}
                            animate={{ scale: 1, opacity: 1, scaleY: 1 }}
                            exit={{ scale: 0.95, opacity: 0, scaleY: 0.8 }}
                            className="bg-[#1a1d23] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>

                            <div className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-1">
                                            Operational Log <ChevronRight className="w-3 h-3" /> Details
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-white tracking-tighter uppercase italic">Order Manifest</h2>
                                        <p className="text-sm font-mono text-primary font-bold opacity-80">{selectedOrder.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <User className="w-5 h-5 text-primary mt-1" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Target Account</p>
                                                <p className="text-base text-white font-bold">{selectedOrder.customer}</p>
                                                <p className="text-xs text-gray-400 font-medium">{selectedOrder.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Deployment Date</p>
                                                <p className="text-base text-white font-bold">{selectedOrder.date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Fulfillment Status</p>
                                                <span className={`inline-flex px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest mt-2 border ${getStatusColor(selectedOrder.status)}`}>
                                                    {selectedOrder.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <ShoppingBag className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Cargo Count</p>
                                                <p className="text-base text-white font-bold">{selectedOrder.items} Critical Units</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items List (New Feature) */}
                                {detailsLoading ? (
                                    <div className="p-4 text-center text-gray-500">Loading manifest details...</div>
                                ) : (
                                    selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 space-y-2">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 px-2">Manifest Items</p>
                                            {selectedOrder.order_items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{item.product_name}</p>
                                                        <p className="text-[10px] text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-primary">₹{item.total.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}

                                <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase tracking-widest">Gross Subtotal</span>
                                        <span className="text-white font-bold">₹{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase tracking-widest">Logistics / Shipping</span>
                                        <span className="text-green-500 font-bold uppercase">Optimized / Free</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Total Net Valuation</span>
                                        <span className="text-3xl font-display font-bold text-primary tracking-tighter">₹{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button className="flex-1 h-16 bg-primary text-black font-bold uppercase tracking-widest text-xs hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20 group" onClick={() => {
                                        toast.success("Initializing print sequence...");
                                        setTimeout(() => window.print(), 1000);
                                    }}>
                                        <Printer className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                                        Authorize Invoice Print
                                    </Button>
                                    <Button variant="outline" className="h-16 px-10 border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] rounded-2xl" onClick={() => setSelectedOrder(null)}>
                                        Exit
                                    </Button>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 opacity-30" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default OrdersManagement;


