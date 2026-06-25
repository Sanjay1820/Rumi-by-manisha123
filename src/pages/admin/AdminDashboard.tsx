import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import SalesChart from "@/components/admin/SalesChart";
import CategoryChart from "@/components/admin/CategoryChart";
import { reviewsByProductId } from "@/data/reviews";
import {
    Package, Star, MessageSquare, TrendingUp, Clock,
    ShoppingCart, Users, ArrowUpRight, PlusCircle,
    UserPlus, LayoutDashboard, AlertTriangle, Search,
    Filter, Download, Layers, FileText, History, CheckCircle2, X,
    Warehouse, Construction, Activity, Terminal, ShieldCheck, Database, Image, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const AdminDashboard = () => {
    interface RestockLog {
        id: string;
        items: string;
        itemList: string;
        time: string;
        status: string;
    }

    const navigate = useNavigate();
    const [restockLogs, setRestockLogs] = useState<RestockLog[]>([]);
    const [searchCode, setSearchCode] = useState("");

    // Product state from database
    const [products, setProducts] = useState<any[]>([]);
    const [productStats, setProductStats] = useState<any>(null);
    const [orderStats, setOrderStats] = useState<any>(null);
    const [reviewStats, setReviewStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    // Modal State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [activeModal, setActiveModal] = useState<{ type: string, data: Record<string, any> } | null>(null);

    // Manage inventory state locally for demonstration
    const [criticalInventory, setCriticalInventory] = useState<any[]>([]);

    const [collections, setCollections] = useState<any[]>([]);

    // Fetch data from database
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoadingStats(true);
            setLoadingProducts(true);

            // Fetch all products for inventory check
            const productsResponse = await api.products.getAll({ limit: 100 });
            if (productsResponse.success && productsResponse.data) {
                setProducts(productsResponse.data);
                const lowStock = productsResponse.data.filter((p: any) =>
                    p.stock_quantity <= 5 && p.stock_quantity >= 0
                ).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    stock: p.stock_quantity,
                    status: p.stock_quantity === 0 ? "Out of Stock" : "Low Stock"
                }));
                setCriticalInventory(lowStock);
            }


            // Fetch Statistics in parallel
            const [prodStatsRes, ordStatsRes, revStatsRes, recentOrdersRes, collectionsRes] = await Promise.all([
                api.products.getStats(),
                api.orders.getStats(),
                api.reviews.getStats().catch(() => ({ success: false, data: null })),
                api.orders.getAll({ limit: 5 }),
                api.collections.getAll()
            ]);

            if (prodStatsRes.success) setProductStats(prodStatsRes.data);
            if (ordStatsRes.success) setOrderStats(ordStatsRes.data);
            if (revStatsRes.success && (revStatsRes as any).data) setReviewStats((revStatsRes as any).data);
            if (recentOrdersRes.success) setRecentOrders(recentOrdersRes.data);
            if (collectionsRes.success) setCollections(collectionsRes.data as any[]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load real-time statistics');
        } finally {
            setLoadingStats(false);
            setLoadingProducts(false);
        }
    };

    // Calculate statistics
    const totalReviews = reviewStats?.total || 0;
    const avgRating = parseFloat(reviewStats?.avg_rating || "0").toFixed(1);

    // Formatting helper
    const formatCurrency = (amount: number | string | null | undefined, isUSD: boolean = false) => {
        if (!amount) return "₹0";
        let val = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isUSD) {
            val = val * 83; // Standard conversion for dashboard
        }

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const sparklineData = [{ value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }, { value: 550 }, { value: 700 }];
    const topProducts = products
        .slice(0, 3)
        .map((p, i) => ({
            name: p.name,
            sales: Math.floor(Math.random() * 50) + 10, // Mock sales for demo
            price: formatCurrency(p.price_inr || p.price * 83),
            image: p.primary_image || (i === 0 ? "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop" : i === 1 ? "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=100&h=100&fit=crop" : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop")
        }));

    // File Download Utility
    const triggerFileDownload = (filename: string, content: string, type: string) => {
        const blob = new Blob([content], { type: type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleGenerateReport = (type: string) => {
        const isCSV = type === "CSV";
        const filename = `${type}_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.${isCSV ? 'csv' : 'pdf'}`;

        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: `Preparing ${type} report...`,
            success: () => {
                setActiveModal({
                    type: "REPORT_SUCCESS",
                    data: {
                        name: filename,
                        size: isCSV ? "45 KB" : "2.4 MB",
                        format: isCSV ? "CSV Spreadsheet" : "PDF/v1.4",
                        generated: new Date().toLocaleString(),
                        content: isCSV ? "ID,Customer,Total,Status\n#ORD-001,Priya Sharma,₹12500,delivered\n#ORD-002,Anjali Gupta,₹8900,processing" : "Mock PDF Content Buffer",
                        mime: isCSV ? "text/csv" : "application/pdf"
                    }
                });
                return `${type} report generated!`;
            },
            error: 'Failed to generate report.',
        });
    };

    const handleRestock = () => {
        const id = `#RST-${Math.floor(1000 + Math.random() * 9000)}`;
        const newLog = {
            id: id,
            items: `${criticalInventory.length} Products`,
            itemList: criticalInventory.map(p => p.name).join(", "),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "Processing"
        };

        setRestockLogs(prev => [newLog, ...prev]);
        setActiveModal({ type: "RESTOCK_CONFIRMED", data: newLog });

        setTimeout(() => {
            setRestockLogs(prev => prev.map(log => log.id === id ? { ...log, status: "Completed" } : log));
            setCriticalInventory([]);
            toast.success(`Stock levels updated for ${id}`);
        }, 5000);
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        const found = restockLogs.find(l => l.id.toLowerCase() === searchCode.toLowerCase());
        if (found) {
            setActiveModal({ type: "VERIFICATION_RESULT", data: found });
            toast.success("Code Found!");
        } else {
            toast.error("Restock Code not found.");
        }
    };

    return (
        <AdminLayout>
            {/* Global Interaction Modal */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1a1d23] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            {/* Render different modal content based on type */}
                            {activeModal.type === "REPORT_SUCCESS" && (
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-2">Report Ready</h3>
                                        <p className="text-sm text-gray-400">Your information has been securely processed and is ready for export.</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 text-left border border-white/5 space-y-3">
                                        <div className="flex justify-between items-center"><span className="text-[10px] text-gray-500">FILENAME</span><span className="text-xs text-white font-mono truncate max-w-[180px]">{activeModal.data.name}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[10px] text-gray-500">SIZE</span><span className="text-xs text-white uppercase">{activeModal.data.size}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[10px] text-gray-500">FORMAT</span><span className="text-xs text-primary font-bold">{activeModal.data.format}</span></div>
                                    </div>
                                    <Button className="w-full h-12 bg-primary text-black font-bold uppercase tracking-widest hover:bg-primary/90" onClick={() => {
                                        triggerFileDownload(activeModal.data.name, activeModal.data.content, activeModal.data.mime);
                                        toast.success("Download started!");
                                        setActiveModal(null);
                                    }}>
                                        <Download className="w-4 h-4 mr-2" /> Download Document
                                    </Button>
                                </div>
                            )}

                            {activeModal.type === "RESTOCK_CONFIRMED" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Purchase Order</h3>
                                            <p className="text-xs text-primary font-mono">{activeModal.data.id}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Order Details</p>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 mb-1 italic">Line Items</p>
                                                <p className="text-sm text-white font-medium">{activeModal.data.itemList}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 mb-1">UNITS</p>
                                                    <p className="text-lg font-bold text-white">{activeModal.data.items.split(' ')[0]}</p>
                                                </div>
                                                <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 mb-1">STATUS</p>
                                                    <p className="text-sm font-bold text-blue-400 uppercase">{activeModal.data.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-center">
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-relaxed">System expects warehouse arrival<br />within 5 business seconds.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 border-white/10 text-gray-400 hover:bg-white/5 font-bold uppercase py-6" onClick={() => setActiveModal(null)}>Close</Button>
                                        <Button className="flex-1 bg-white/5 border border-white/10 text-white font-bold uppercase py-6" onClick={() => {
                                            triggerFileDownload(`PO_${activeModal.data.id.replace('#', '')}.txt`, `Purchase Order: ${activeModal.data.id}\nItems: ${activeModal.data.itemList}\nUnits: ${activeModal.data.items}`, "text/plain");
                                            toast.success("Receipt saved!");
                                        }}>
                                            <FileText className="w-4 h-4 mr-2" /> Save TXT
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeModal.type === "MAP_VIEW" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                            <Warehouse className="w-5 h-5 text-blue-500" /> Warehouse Map
                                        </h3>
                                        <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-500 font-bold rounded-full">LIVE FEED</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 aspect-square">
                                        {Array.from({ length: 16 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.02 }}
                                                className={`rounded-lg border border-white/5 transition-all cursor-crosshair hover:border-primary/50 relative group/cell ${[0, 1, 5, 10, 14, 15].includes(i) ? 'bg-primary/20 border-primary/30' :
                                                    [3, 7, 8, 12].includes(i) ? 'bg-red-500/20 border-red-500/30' : 'bg-white/5'
                                                    }`}
                                            >
                                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white/20 group-hover/cell:text-white/60">Z-{i + 1}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[8px] text-gray-500 uppercase font-bold">In-Stock</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[8px] text-gray-500 uppercase font-bold">Empty Shelves</span></div>
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12" onClick={() => setActiveModal(null)}>Exit Navigation</Button>
                                </div>
                            )}

                            {activeModal.type === "OPTIMIZE_REPORT" && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-4 mb-2">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
                                            <Activity className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-white">System Sanitized</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                            <Terminal className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-white">1.4GB</p>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Cache Purged</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                            <Database className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-white">2.1ms</p>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Query Speed</p>
                                        </div>
                                    </div>
                                    <Button className="w-full h-12 bg-white/10 text-white border border-white/10 font-bold uppercase hover:bg-white/20" onClick={() => {
                                        triggerFileDownload("Optimization_Log.txt", "RUMI System Audit Log\nResult: Clean\nSpeed improvement: 14%\nPurged: 1.4GB Cache", "text/plain");
                                        toast.success("Log shared to system.");
                                        setActiveModal(null);
                                    }}>
                                        Save Audit Log
                                    </Button>
                                </div>
                            )}

                            {activeModal.type === "VALUATION_BREAKDOWN" && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-primary" /> Portfolio Valuation
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Premium Silks", value: "₹4,25,000", share: 50 },
                                            { label: "Design Bridal Wear", value: "₹2,80,000", share: 33 },
                                            { label: "Accessories & Footwear", value: "₹1,40,200", share: 17 }
                                        ].map((item, i) => (
                                            <div key={i} className="group">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-white font-medium">{item.label}</span>
                                                    <span className="text-primary font-bold">{item.value}</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full relative overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.share}%` }} className="h-full bg-primary/80" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full h-12 bg-primary text-black font-bold uppercase" onClick={() => {
                                        triggerFileDownload("Portfolio_Valuation.csv", "Category,Value,Share\nPremium Silks,₹425000,50%\nBridal Wear,₹280000,33%\nAccessories,₹140200,17%", "text/csv");
                                        toast.success("Valuation exported!");
                                        setActiveModal(null);
                                    }}>
                                        Export Ledger (.CSV)
                                    </Button>
                                </div>
                            )}

                            {activeModal.type === "VERIFICATION_RESULT" && (
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                                        <Layers className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">Code Verified</h3>
                                        <p className="text-xs text-primary font-mono mt-1 font-bold">{activeModal.data.id}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                                        <div className="flex justify-between text-xs"><span className="text-gray-500">Timestamp</span><span className="text-white">{activeModal.data.time}</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-gray-500">Manifest</span><span className="text-white">{activeModal.data.items}</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-gray-500">Inventory Status</span><span className={`font-bold ${activeModal.data.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>{activeModal.data.status}</span></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest" onClick={() => { setActiveModal(null); setSearchCode(""); }}>Done</Button>
                                        <Button variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5" onClick={() => triggerFileDownload(`Log_${activeModal.data.id}.txt`, `Log Detail: ${activeModal.data.id}\nItems: ${activeModal.data.itemList}`, "text/plain")}><Download className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            )}

                            {activeModal.type === "ORDER_QUICK_VIEW" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                            <ShoppingCart className="w-5 h-5 text-primary" /> Order Detail
                                        </h3>
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${activeModal.data.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>{activeModal.data.status}</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Customer</p>
                                                <p className="text-sm text-white font-bold">{activeModal.data.customer}</p>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Amount</p>
                                                <p className="text-sm text-white font-bold">{activeModal.data.total}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Transaction Date</p>
                                            <p className="text-sm text-white">{activeModal.data.date} | 17:15 PM</p>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-3">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Payment Status: Verified Safe</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button className="flex-1 h-12 bg-primary text-black font-bold uppercase" onClick={() => navigate('/admin/orders')}>Full Invoice</Button>
                                        <Button variant="outline" className="h-12 border-white/10 text-white" onClick={() => triggerFileDownload(`Receipt_${activeModal.data.id}.txt`, `Receipt: ${activeModal.data.id}\nCustomer: ${activeModal.data.customer}\nTotal: ${activeModal.data.total}`, "text/plain")}><Download className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="space-y-8 max-w-[1600px] mx-auto pb-12 text-white">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a1d23] p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">System <span className="text-primary">Overview</span></h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} | All systems functional
                        </p>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-10 px-6 transition-all" onClick={() => handleGenerateReport("CSV")}>
                            <FileText className="w-4 h-4 mr-2" /> Generate CSV
                        </Button>
                        <Button variant="luxury" size="sm" className="h-10 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => handleGenerateReport("Detailed")}>
                            <Download className="w-4 h-4 mr-2" /> Download Report
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48 opacity-30" />
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Monthly Revenue" value={loadingStats ? "..." : formatCurrency(orderStats?.monthly_revenue)} icon={TrendingUp} trend={{ value: 12.5, isPositive: true }} color="primary" chartData={sparklineData} />
                    <StatsCard title="Total Revenue" value={loadingStats ? "..." : formatCurrency(orderStats?.total_revenue)} icon={Database} trend={{ value: 8.2, isPositive: true }} color="blue" chartData={sparklineData} />
                    <StatsCard title="Total Products" value={loadingProducts ? "..." : (productStats?.total || products.length).toString()} icon={Package} trend={{ value: 5.4, isPositive: true }} color="green" chartData={sparklineData} />
                    <StatsCard title="Avg Store Rating" value={loadingStats ? "..." : avgRating} icon={Star} trend={{ value: 0.2, isPositive: true }} color="orange" chartData={sparklineData} />
                </div>


                {/* --- CONSOLIDATED GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <SalesChart />
                        <CategoryChart />

                        {/* Recent Orders Section */}
                        <div className="bg-[#1a1d23] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                        <History className="w-6 h-6 text-primary" /> Recent Orders
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1">Latest transactions from your store</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-9 text-[10px] uppercase font-bold text-primary hover:bg-primary/10 border border-primary/20" onClick={() => navigate('/admin/orders')}>
                                    Full Ledger <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                                            <th className="p-6 font-bold">Order ID</th>
                                            <th className="p-6 font-bold">Customer</th>
                                            <th className="p-6 font-bold">Date</th>
                                            <th className="p-6 font-bold">Amount</th>
                                            <th className="p-6 font-bold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-20 text-center text-gray-500 italic text-sm">
                                                    No recent orders found.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group/row"
                                                    onClick={() => setActiveModal({
                                                        type: "ORDER_QUICK_VIEW",
                                                        data: {
                                                            id: `#${order.id}`,
                                                            customer: order.customer_name || 'Guest Customer',
                                                            date: new Date(order.created_at).toLocaleDateString(),
                                                            total: formatCurrency(order.total_amount),
                                                            status: order.status
                                                        }
                                                    })}
                                                >
                                                    <td className="p-6 text-xs font-mono text-primary font-bold group-hover/row:translate-x-1 transition-transform inline-block">#{order.id}</td>
                                                    <td className="p-6 text-xs font-semibold text-white">{order.customer_name || 'Guest'}</td>
                                                    <td className="p-6 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                                    <td className="p-6 text-xs font-bold text-white">{formatCurrency(order.total_amount)}</td>
                                                    <td className="p-6 text-right">
                                                        <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                                'bg-orange-500/10 text-orange-500'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-[#1a1d23] rounded-3xl border border-white/5 p-10 shadow-2xl relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-primary" /> Stock Distribution
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1">Real-time inventory health across categories</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">92% Optimal</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-9 text-[10px] uppercase font-bold text-primary hover:bg-primary/10 border border-primary/20" onClick={() => setActiveModal({ type: "VALUATION_BREAKDOWN", data: {} })}>View Detailed Audit</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {(collections.length > 0 ? collections.slice(0, 3) : [
                                    { name: "Silk Sarees", products: 145 },
                                    { name: "Designer Lehengas", products: 82 },
                                    { name: "Acc. & Footwear", products: 225 }
                                ]).map((item, i) => (
                                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group/item relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover/item:border-primary/30 transition-colors">
                                                {i === 0 ? <Package className="w-5 h-5 text-primary" /> : i === 1 ? <Star className="w-5 h-5 text-primary" /> : <ShoppingCart className="w-5 h-5 text-primary" />}
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${parseInt(item.products) > 10 ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {parseInt(item.products) > 10 ? 'OPTIMAL' : 'WATCH'} HEALTH
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{item.name.includes(' ') ? 'Selected Series' : 'Boutique Collection'}</p>
                                            <h4 className="text-lg font-bold text-white mb-4">{item.name}</h4>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-3xl font-display font-bold text-white tracking-tighter">{item.products}<span className="text-[10px] text-gray-500 ml-2 font-medium font-sans uppercase">Qty</span></p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                <span>Capacity</span>
                                                <span>{Math.min(100, (parseInt(item.products) / 200) * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (parseInt(item.products) / 200) * 100)}%` }}
                                                    className={`h-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-green-500'} shadow-[0_0_10px_rgba(197,160,89,0.3)]`}
                                                />
                                            </div>
                                        </div>

                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20" />
                        </div>


                        <div className="bg-[#1a1d23] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-display font-bold text-white tracking-tight">Top Performing Products</h2>
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 gap-1 transition-all" onClick={() => navigate('/admin/products')}>Full Report <ArrowUpRight className="w-4 h-4" /></Button>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer" onClick={() => triggerFileDownload(`${product.name.replace(/ /g, '_')}_Snapshot.txt`, `Product: ${product.name}\nSales: ${product.sales}\nPrice: ${product.price}`, "text/plain")}>
                                        <img src={product.image} className="w-full h-32 rounded-lg object-cover mb-4" alt="" />
                                        <div className="flex justify-between items-start mb-2"><p className="text-xs font-semibold text-white truncate pr-2">{product.name}</p><span className="text-[10px] font-bold text-primary">#{index + 1}</span></div>
                                        <div className="flex justify-between items-end"><div><p className="text-[10px] text-gray-500">{product.price}</p><p className="text-sm font-bold text-white">{product.sales} Sales</p></div><p className="text-[9px] text-green-500 font-bold uppercase">↑ 12%</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-1">
                        {/* Critical Inventory */}
                        <div className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden transition-all">
                            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 font-display"><AlertTriangle className="w-4 h-4 text-red-500" /> Critical Inventory</h3>{criticalInventory.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{criticalInventory.length} ALERTS</span>}</div>
                            <div className="space-y-3 min-h-[100px]">
                                <AnimatePresence mode="popLayout">{criticalInventory.length === 0 ? (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-6 text-center"><div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-2"><CheckCircle2 className="w-6 h-6 text-green-500" /></div><p className="text-xs font-bold text-green-500 uppercase tracking-widest">Inventory Healthy</p></motion.div>) : criticalInventory.map((item) => (<motion.div key={item.id} exit={{ opacity: 0, x: 20 }} className="flex items-center justify-between text-xs p-2.5 bg-red-500/5 border border-red-500/10 rounded-xl"><span className="text-white font-medium">{item.name}</span><span className="text-red-500 font-bold">{item.stock === 0 ? "OUT" : `${item.stock} left`}</span></motion.div>))}</AnimatePresence>
                            </div>
                            <Button variant="ghost" className={`w-full mt-4 h-9 text-[10px] uppercase font-bold transition-all ${criticalInventory.length === 0 ? 'text-gray-500 hover:bg-transparent' : 'text-red-500 hover:bg-red-500/20'}`} onClick={handleRestock} disabled={criticalInventory.length === 0}>{criticalInventory.length === 0 ? "Fully Stocked" : "Restock Immediate"}</Button>
                        </div>

                        {/* Quick Management */}
                        <div className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
                            <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-primary" /> Quick Management</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/admin/products/new" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group/item"><Package className="w-6 h-6 text-primary mb-2 transition-transform group-hover/item:-translate-y-1" /><span className="text-xs font-semibold text-white">Add Product</span></Link>
                                <Link to="/admin/users" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group/item"><UserPlus className="w-6 h-6 text-primary mb-2 transition-transform group-hover/item:-translate-y-1" /><span className="text-xs font-semibold text-white">Add User</span></Link>

                                <Link to="/admin/inquiries" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group/item"><MessageSquare className="w-6 h-6 text-primary mb-2 transition-transform group-hover/item:-translate-y-1" /><span className="text-xs font-semibold text-white">Inquiries</span></Link>
                                <Link to="/admin/collections" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group/item"><Layers className="w-6 h-6 text-primary mb-2 transition-transform group-hover/item:-translate-y-1" /><span className="text-xs font-semibold text-white">Collections</span></Link>
                                <Link to="/admin/faqs" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group/item"><HelpCircle className="w-6 h-6 text-primary mb-2 transition-transform group-hover/item:-translate-y-1" /><span className="text-xs font-semibold text-white">FAQs</span></Link>
                                <button
                                    onClick={() => {
                                        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                                            loading: 'Optimizing system assets...',
                                            success: () => {
                                                setActiveModal({ type: "OPTIMIZE_REPORT", data: {} });
                                                return 'System optimization complete!';
                                            },
                                            error: 'Optimization failed.'
                                        });
                                    }}
                                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-center group/item lg:col-span-2"
                                >
                                    <Terminal className="w-6 h-6 text-primary mb-2 animate-pulse" />
                                    <span className="text-xs font-semibold text-white">System Optimization</span>
                                </button>
                            </div>
                        </div>

                        {/* Restock Tracking */}
                        <div className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden transition-all">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4 font-display"><History className="w-4 h-4 text-primary" /> Restock Tracking</h3>
                            <form onSubmit={handleVerifyCode} className="relative mb-4">
                                <input type="text" placeholder="Enter Code (e.g. #RST-6618)" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-[10px] focus:outline-none focus:border-primary/50 transition-all font-mono" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} /><button type="submit" className="absolute right-2 top-2 p-1.5 hover:bg-primary/20 rounded-lg transition-colors"><Search className="w-3.5 h-3.5 text-primary" /></button>
                            </form>
                            <div className="space-y-3 min-h-[120px]">
                                <AnimatePresence mode="popLayout">{restockLogs.length === 0 ? (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500 text-center py-6 italic">No recent restock activity</motion.p>) : restockLogs.slice(0, 3).map((log) => (<motion.div key={log.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer" onClick={() => setActiveModal({ type: "VERIFICATION_RESULT", data: log })}><div><p className="text-[10px] font-bold text-primary font-mono">{log.id}</p><p className="text-[9px] text-gray-400 uppercase tracking-tighter">{log.items}</p></div><div className="text-right"><p className="text-[9px] text-white font-semibold">{log.time}</p><span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${log.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{log.status}</span></div></motion.div>))}</AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
