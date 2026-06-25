import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
    HelpCircle, Plus, Trash2, Edit2, Search, X, CheckCircle2,
    AlertTriangle, Package, RefreshCw, Sparkles, CreditCard,
    Star, Eye, EyeOff, GripVertical, Save, Copy, Download, Upload
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    popular: boolean | number;
    display_order: number;
    status: "active" | "draft";
    created_at: string;
    updated_at: string;
}

const FAQManagement = () => {
    const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const res = await api.faqs.getAll();
            if (res.success) {
                setFaqItems(res.data as FAQItem[]);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            toast.error("Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "Orders & Shipping",
        popular: false,
        status: "active" as "active" | "draft",
    });

    const categories = [
        { name: "Orders & Shipping", icon: Package, color: "from-blue-500 to-cyan-500" },
        { name: "Returns & Exchanges", icon: RefreshCw, color: "from-green-500 to-emerald-500" },
        { name: "Products & Care", icon: Sparkles, color: "from-purple-500 to-pink-500" },
        { name: "Account & Pricing", icon: CreditCard, color: "from-orange-500 to-red-500" },
    ];

    // Filter items
    const filteredItems = faqItems.filter((item) => {
        const matchesSearch =
            searchQuery === "" ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || item.category === filterCategory;
        const matchesStatus = filterStatus === "all" || item.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Statistics
    const stats = {
        total: faqItems.length,
        active: faqItems.filter((i) => i.status === "active").length,
        draft: faqItems.filter((i) => i.status === "draft").length,
        popular: faqItems.filter((i) => Boolean(i.popular)).length,
        byCategory: categories.map((cat) => ({
            name: cat.name,
            count: faqItems.filter((i) => i.category === cat.name).length,
        })),
    };

    const handleAddItem = async () => {
        try {
            const res = await api.faqs.create({
                ...formData,
                display_order: faqItems.length + 1
            });
            if (res.success) {
                setFaqItems([...faqItems, res.data]);
                setShowAddModal(false);
                resetForm();
                toast.success("FAQ added successfully!");
                fetchFAQs(); // Refresh to get correct IDs and order
            }
        } catch (error) {
            toast.error("Failed to add FAQ");
        }
    };

    const handleEditItem = async () => {
        if (!editingItem) return;

        try {
            const res = await api.faqs.update(editingItem.id, formData);
            if (res.success) {
                setFaqItems(
                    faqItems.map((item) =>
                        item.id === editingItem.id ? (res.data as FAQItem) : item
                    )
                );
                setEditingItem(null);
                resetForm();
                toast.success("FAQ updated successfully!");
            }
        } catch (error) {
            toast.error("Failed to update FAQ");
        }
    };

    const handleDeleteItem = async (id: number) => {
        try {
            const res = await api.faqs.delete(id);
            if (res.success) {
                setFaqItems(faqItems.filter((item) => item.id !== id));
                toast.success("FAQ deleted successfully!");
            }
        } catch (error) {
            toast.error("Failed to delete FAQ");
        }
    };

    const handleBulkDelete = async () => {
        const ids = Array.from(selectedItems);
        let successCount = 0;

        toast.loading(`Deleting ${ids.length} items...`, { id: 'bulk-delete' });

        for (const id of ids) {
            try {
                const res = await api.faqs.delete(id);
                if (res.success) successCount++;
            } catch (error) { }
        }

        setSelectedItems(new Set());
        fetchFAQs();
        toast.success(`${successCount} FAQs deleted successfully!`, { id: 'bulk-delete' });
    };

    const handleBulkStatusChange = async (status: "active" | "draft") => {
        const ids = Array.from(selectedItems);
        let successCount = 0;

        toast.loading(`Updating ${ids.length} items...`, { id: 'bulk-status' });

        for (const id of ids) {
            try {
                const res = await api.faqs.update(id, { status });
                if (res.success) successCount++;
            } catch (error) { }
        }

        setSelectedItems(new Set());
        fetchFAQs();
        toast.success(`${successCount} FAQs updated to ${status}!`, { id: 'bulk-status' });
    };

    const togglePopular = async (id: number, current: boolean | number) => {
        try {
            const res = await api.faqs.update(id, { popular: !current });
            if (res.success) {
                setFaqItems(
                    faqItems.map((item) => (item.id === id ? (res.data as FAQItem) : item))
                );
                toast.success("Popular status updated!");
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const duplicateItem = async (item: FAQItem) => {
        try {
            const res = await api.faqs.create({
                question: `${item.question} (Copy)`,
                answer: item.answer,
                category: item.category,
                popular: item.popular,
                status: item.status,
                display_order: faqItems.length + 1
            });
            if (res.success) {
                setFaqItems([...faqItems, res.data]);
                toast.success("FAQ duplicated successfully!");
                fetchFAQs();
            }
        } catch (error) {
            toast.error("Failed to duplicate FAQ");
        }
    };

    const resetForm = () => {
        setFormData({
            question: "",
            answer: "",
            category: "Orders & Shipping",
            popular: false,
            status: "active",
        });
    };

    const openEditModal = (item: FAQItem) => {
        setEditingItem(item);
        setFormData({
            question: item.question,
            answer: item.answer,
            category: item.category,
            popular: Boolean(item.popular),
            status: item.status,
        });
    };

    const toggleSelectItem = (id: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const selectAll = () => {
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredItems.map((item) => item.id)));
        }
    };

    const exportFAQs = () => {
        const dataStr = JSON.stringify(faqItems, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `faqs-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        toast.success("FAQs exported successfully!");
    };

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-[1800px] mx-auto pb-12">
                {/* Header */}
                <div className="bg-[#1a1d23] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                                    <HelpCircle className="w-8 h-8 text-primary" />
                                    FAQ Management
                                </h1>
                                <p className="text-gray-400">Manage frequently asked questions and help content</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={exportFAQs}
                                    className="border-white/10 text-white hover:bg-white/5"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                                <Button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-primary text-black hover:bg-primary/90 h-12 px-8 font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add New FAQ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {[
                        { label: "Total FAQs", value: stats.total, color: "primary", icon: HelpCircle },
                        { label: "Active", value: stats.active, color: "green-500", icon: CheckCircle2 },
                        { label: "Draft", value: stats.draft, color: "yellow-500", icon: AlertTriangle },
                        { label: "Popular", value: stats.popular, color: "pink-500", icon: Star },
                        ...stats.byCategory.map((cat) => {
                            const catData = categories.find((c) => c.name === cat.name);
                            return {
                                label: cat.name.split(" ")[0],
                                value: cat.count,
                                color: "blue-500",
                                icon: catData?.icon || HelpCircle,
                            };
                        }),
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 shadow-xl hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                                <span className="text-2xl font-display font-bold text-white">{stat.value}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 shadow-xl">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all [&>option]:bg-[#1a1d23] [&>option]:text-white"
                        >
                            <option value="all" className="bg-[#1a1d23] text-white">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.name} value={cat.name} className="bg-[#1a1d23] text-white">
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all [&>option]:bg-[#1a1d23] [&>option]:text-white"
                        >
                            <option value="all" className="bg-[#1a1d23] text-white">All Status</option>
                            <option value="active" className="bg-[#1a1d23] text-white">Active</option>
                            <option value="draft" className="bg-[#1a1d23] text-white">Draft</option>
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between"
                        >
                            <p className="text-sm text-gray-400">
                                <span className="text-primary font-bold">{selectedItems.size}</span> items selected
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkStatusChange("active")}
                                    className="border-green-500/20 text-green-500 hover:bg-green-500/10"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Set Active
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkStatusChange("draft")}
                                    className="border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                                >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Set Draft
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Selected
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* FAQ List */}
                <div className="bg-[#1a1d23] rounded-2xl border border-white/5 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-white">
                            FAQs ({filteredItems.length})
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectAll}
                            className="text-primary hover:bg-primary/10"
                        >
                            {selectedItems.size === filteredItems.length ? "Deselect All" : "Select All"}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-20"
                                >
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <HelpCircle className="w-10 h-10 text-gray-500" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-white mb-2">No FAQs found</h3>
                                    <p className="text-gray-400 mb-6">Try adjusting your filters or add a new FAQ</p>
                                    <Button
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-primary text-black hover:bg-primary/90"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First FAQ
                                    </Button>
                                </motion.div>
                            ) : (
                                filteredItems.map((item, idx) => {
                                    const categoryData = categories.find((c) => c.name === item.category);
                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all ${selectedItems.has(item.id)
                                                ? "border-primary bg-primary/5"
                                                : "border-white/5 bg-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                className="w-5 h-5 rounded border-white/20 bg-white/5 mt-1"
                                            />

                                            {/* Drag Handle */}
                                            <GripVertical className="w-5 h-5 text-gray-500 cursor-move mt-1" />

                                            {/* Category Icon */}
                                            {categoryData && (
                                                <div
                                                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryData.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                                >
                                                    <categoryData.icon className="w-5 h-5 text-white" />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                                                            {item.question}
                                                        </h3>
                                                        <p className="text-gray-400 text-xs line-clamp-2">{item.answer}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="px-2 py-1 bg-white/5 rounded">{item.category}</span>
                                                    <span
                                                        className={`px-2 py-1 rounded font-bold uppercase ${item.status === "active"
                                                            ? "bg-green-500/20 text-green-500"
                                                            : "bg-yellow-500/20 text-yellow-500"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                    {Boolean(item.popular) && (
                                                        <span className="px-2 py-1 bg-pink-500/20 text-pink-500 rounded font-bold uppercase flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            Popular
                                                        </span>
                                                    )}
                                                    <span>Updated: {item.updated_at}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => togglePopular(item.id, item.popular)}
                                                    className="h-9 px-3 border-white/10 text-white hover:bg-white/5"
                                                    title="Toggle Popular"
                                                >
                                                    <Star
                                                        className={`w-4 h-4 ${Boolean(item.popular) ? "fill-pink-500 text-pink-500" : ""}`}
                                                    />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => duplicateItem(item)}
                                                    className="h-9 px-3 border-white/10 text-white hover:bg-white/5"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(item)}
                                                    className="h-9 px-3 border-white/10 text-white hover:bg-white/5"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="h-9 px-3 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {(showAddModal || editingItem) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingItem(null);
                                resetForm();
                            }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1a1d23] border border-white/10 w-full max-w-3xl rounded-3xl p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold text-white">
                                    {editingItem ? "Edit FAQ" : "Add New FAQ"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingItem(null);
                                        resetForm();
                                    }}
                                    className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Question */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Question *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        placeholder="Enter the question..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>

                                {/* Answer */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Answer *
                                    </label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        placeholder="Enter the answer..."
                                        rows={5}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.answer.length} characters</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Category *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.name}
                                                onClick={() => setFormData({ ...formData, category: cat.name })}
                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.category === cat.name
                                                    ? "border-primary bg-primary/10"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}
                                                >
                                                    <cat.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span
                                                    className={`text-sm font-bold ${formData.category === cat.name ? "text-white" : "text-gray-400"
                                                        }`}
                                                >
                                                    {cat.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Popular */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Star className="w-5 h-5 text-pink-500" />
                                            <div>
                                                <p className="text-sm font-bold text-white">Mark as Popular</p>
                                                <p className="text-xs text-gray-500">Show in featured section</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(formData.popular)}
                                            onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/20 bg-white/5"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            {formData.status === "active" ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-white">Status</p>
                                                <p className="text-xs text-gray-500">
                                                    {formData.status === "active" ? "Visible to users" : "Hidden from users"}
                                                </p>
                                            </div>
                                        </div>
                                        <select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({ ...formData, status: e.target.value as "active" | "draft" })
                                            }
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50 [&>option]:bg-[#1a1d23] [&>option]:text-white"
                                        >
                                            <option value="active" className="bg-[#1a1d23] text-white">Active</option>
                                            <option value="draft" className="bg-[#1a1d23] text-white">Draft</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingItem(null);
                                            resetForm();
                                        }}
                                        className="flex-1 h-12 border-white/10 text-white hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={editingItem ? handleEditItem : handleAddItem}
                                        disabled={!formData.question || !formData.answer}
                                        className="flex-1 h-12 bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wider"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingItem ? "Update FAQ" : "Add FAQ"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default FAQManagement;
