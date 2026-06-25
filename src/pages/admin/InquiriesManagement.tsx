import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    Phone,
    Mail,
    MessageCircle,
    ExternalLink,
    ChevronRight,
    User,
    Calendar,
    Package,
    Trash2,
    MapPin
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string;
    product_name: string;
    message: string;
    city: string;
    address: string;
    status: "new" | "in_progress" | "resolved";
    created_at: string;
    inquiry_type?: string;
    preferred_date?: string;
    preferred_time?: string;
}

const InquiriesManagement = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const res = await api.inquiries.getAll();
            if (res.success) {
                setInquiries(res.data as Inquiry[]);
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error);
            toast.error("Failed to load inquiries.");
        } finally {
            setLoading(false);
        }
    };

    const filteredInquiries = inquiries.filter((inquiry) => {
        const matchesSearch =
            inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inquiry.product_name || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id: number, status: Inquiry["status"]) => {
        try {
            const res = await api.inquiries.update(id, { status });
            if (res.success) {
                setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
                toast.success(`Inquiry marked as ${status.replace("_", " ")}.`);
            }
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleDeleteInquiry = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            const res = await api.inquiries.delete(id);
            if (res.success) {
                setInquiries(inquiries.filter((inq) => inq.id !== id));
                toast.success("Inquiry deleted successfully.");
            }
        } catch (error) {
            toast.error("Failed to delete inquiry.");
        }
    };

    const getStatusStyles = (status: Inquiry["status"]) => {
        const styles = {
            new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            in_progress: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        };
        return styles[status] || styles.new;
    };

    const getStatusIcon = (status: Inquiry["status"]) => {
        switch (status) {
            case "new":
                return <Clock className="w-3.5 h-3.5" />;
            case "in_progress":
                return <MessageSquare className="w-3.5 h-3.5" />;
            case "resolved":
                return <CheckCircle className="w-3.5 h-3.5" />;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-[#1a1d23] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                                <span>System Logic</span>
                                <ChevronRight className="w-3 h-3" />
                                <span>Intelligence Manifest</span>
                            </div>
                            <h1 className="text-4xl font-display font-bold text-white tracking-tighter">Inquiry Registry</h1>
                            <p className="text-gray-500 text-xs font-medium max-w-md italic">Managing high-priority client acquisitions and product inquiries.</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50 group-hover:opacity-70 transition-opacity" />
                </div>

                {/* Filters Section */}
                <div className="bg-[#1a1d23]/80 backdrop-blur-md rounded-2xl border border-white/5 p-4 sticky top-24 z-20 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, or product identity..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50 text-sm transition-all"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {['all', 'new', 'in_progress', 'resolved'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`h-12 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filterStatus === status
                                        ? 'bg-primary text-black border-primary'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {status === 'all' ? 'All Signals' : status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Inquiries Grid */}
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredInquiries.map((inquiry, index) => (
                            <motion.div
                                key={inquiry.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#1a1d23] rounded-[2rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all group"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Left: Identity & Meta */}
                                        <div className="lg:w-1/3 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center text-primary relative overflow-hidden">
                                                    <User className="w-7 h-7 relative z-10" />
                                                    <div className="absolute inset-0 bg-primary/10 blur-xl scale-125" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-display font-bold text-white tracking-tight">{inquiry.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(inquiry.status)} flex items-center gap-1.5`}>
                                                            {getStatusIcon(inquiry.status)}
                                                            {inquiry.status.replace("_", " ")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center gap-3 text-gray-500 group/link cursor-default">
                                                    <Mail className="w-4 h-4 text-primary/40 group-hover/link:text-primary transition-colors" />
                                                    <span className="text-xs font-medium group-hover/link:text-white transition-colors">{inquiry.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-500 group/link cursor-default">
                                                    <Phone className="w-4 h-4 text-primary/40 group-hover/link:text-primary transition-colors" />
                                                    <span className="text-xs font-medium group-hover/link:text-white transition-colors">{inquiry.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-500">
                                                    <Calendar className="w-4 h-4 text-primary/40" />
                                                    <span className="text-xs font-medium italic">Logged {new Date(inquiry.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {(inquiry.city || inquiry.address) && (
                                                    <div className="flex items-start gap-3 text-gray-500">
                                                        <MapPin className="w-4 h-4 text-primary/40 shrink-0 mt-0.5" />
                                                        <span className="text-xs font-medium">
                                                            {inquiry.city}{inquiry.city && inquiry.address ? ', ' : ''}{inquiry.address}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Center: Message Body */}
                                        <div className="lg:w-5/12 space-y-6 border-l border-white/5 pl-8 lg:border-l lg:border-r lg:px-8 border-r-0">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                                    <Package className="w-3 h-3" />
                                                    <span>{inquiry.product_name ? 'Target Product' : 'Inquiry Category'}</span>
                                                </div>
                                                <p className="text-sm font-bold text-white shadow-sm">
                                                    {inquiry.product_name || inquiry.inquiry_type?.replace('_', ' ') || 'General'}
                                                </p>
                                                {inquiry.preferred_date && (
                                                    <div className="mt-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                                        <div className="text-[9px] font-black uppercase tracking-tighter text-primary mb-1">Requested Consultation</div>
                                                        <div className="flex items-center gap-2 text-xs text-white">
                                                            <Calendar className="w-3 h-3 text-primary" />
                                                            <span>{new Date(inquiry.preferred_date).toLocaleDateString()}</span>
                                                            <Clock className="w-3 h-3 text-primary ml-1" />
                                                            <span>{inquiry.preferred_time}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 relative group/msg">
                                                <div className="flex items-start gap-3">
                                                    <MessageSquare className="w-4 h-4 text-primary/40 mt-1 shrink-0" />
                                                    <p className="text-sm text-gray-400 leading-relaxed italic">
                                                        "{inquiry.message}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="lg:w-1/4 flex flex-col justify-center gap-4">
                                            {inquiry.status !== "resolved" && (
                                                <div className="space-y-4">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-center text-gray-500 mb-2">Omnichannel Resolution</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <a href={`tel:${inquiry.phone}`} className="flex flex-col items-center justify-center p-3 bg-white/5 text-primary rounded-xl border border-white/10 hover:bg-primary hover:text-black transition-all group/call">
                                                            <Phone className="w-5 h-5 mb-1" />
                                                            <span className="text-[8px] font-black uppercase">Call</span>
                                                        </a>
                                                        <a href={`mailto:${inquiry.email}?subject=Inquiry regarding ${inquiry.product_name}`} className="flex flex-col items-center justify-center p-3 bg-white/5 text-gray-400 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all group/email">
                                                            <Mail className="w-5 h-5 mb-1" />
                                                            <span className="text-[8px] font-black uppercase">Email</span>
                                                        </a>
                                                        <a href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=Hello ${inquiry.name}, regarding your inquiry about ${inquiry.product_name}...`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all group/wa">
                                                            <MessageCircle className="w-5 h-5 mb-1" />
                                                            <span className="text-[8px] font-black uppercase">Chat</span>
                                                        </a>
                                                    </div>
                                                    <div className="h-px bg-white/5 w-full my-4" />
                                                    <Button
                                                        onClick={() => updateStatus(inquiry.id, 'resolved')}
                                                        className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary/90 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group/resolve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Execute Resolution
                                                    </Button>
                                                </div>
                                            )}
                                            {inquiry.status === "resolved" && (
                                                <div className="text-center space-y-2 py-4">
                                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-2">
                                                        <CheckCircle className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Case Finalized</p>
                                                    <button onClick={() => updateStatus(inquiry.id, 'new')} className="text-[9px] text-gray-500 hover:text-primary transition-colors underline underline-offset-4">Re-open Channel</button>
                                                </div>
                                            )}
                                            <div className="mt-4 flex justify-center">
                                                <button
                                                    onClick={() => handleDeleteInquiry(inquiry.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Delete Inquiry"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredInquiries.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-[#1a1d23] rounded-[2rem] border border-dashed border-white/10"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-display font-medium text-white mb-2">No matched signals found</h3>
                            <p className="text-gray-500 text-sm">Adjust your filters to scan for different acquisition data.</p>
                        </motion.div>
                    )}
                </div>

                {/* Registry Statistics */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                    <p className="text-xs font-medium text-gray-500">
                        Scanning <span className="text-white">{filteredInquiries.length}</span> active signals from a pool of <span className="text-white">{inquiries.length}</span> total entries.
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { label: 'Unprocessed', count: inquiries.filter(i => i.status === 'new').length, color: 'text-blue-400' },
                            { label: 'Ongoing', count: inquiries.filter(i => i.status === 'in_progress').length, color: 'text-amber-500' },
                            { label: 'Finalized', count: inquiries.filter(i => i.status === 'resolved').length, color: 'text-emerald-500' }
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text', 'bg')}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}:</span>
                                <span className={`text-[10px] font-black ${stat.color}`}>{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default InquiriesManagement;
