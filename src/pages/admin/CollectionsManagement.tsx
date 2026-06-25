import { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Plus, Search, Filter,
    Layers, Package, Eye, Edit, Trash2, X, Check,
    Image as ImageIcon,
    Clock, RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Collection {
    id: number;
    name: string;
    slug?: string;
    description: string;
    status: string;
    image: string;
    image_url?: string;
    products: number;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
}

const CollectionsManagement = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
    const [currentCollection, setCurrentCollection] = useState<Collection>({
        id: 0,
        name: "",
        description: "",
        status: "active",
        image: "",
        products: 0
    });

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const res = await api.collections.getAll();
            if (res.success && Array.isArray(res.data)) {
                // Map the API response to match our interface
                const mappedCollections = (res.data as any[]).map((col: any) => ({
                    ...col,
                    image: col.image_url || col.image || "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop",
                    products: parseInt(col.products) || 0
                }));
                setCollections(mappedCollections);
            }
        } catch (error) {
            console.error("Error fetching collections:", error);
            toast.error("Failed to load collections");
        } finally {
            setLoading(false);
        }
    };

    // Fetch collections from API
    useEffect(() => {
        fetchCollections();
    }, []);

    const filteredCollections = useMemo(() => {
        return collections.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [collections, searchTerm, statusFilter]);

    const handleOpenModal = (mode: "create" | "edit" | "view", collection?: Collection) => {
        setModalMode(mode);
        if (collection) {
            // Ensure image is set correctly from either image or image_url
            setCurrentCollection({
                ...collection,
                image: collection.image_url || collection.image || ""
            });
        } else {
            setCurrentCollection({
                id: 0,
                name: "",
                description: "",
                status: "active",
                image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop",
                products: 0
            });
        }
        setIsModalOpen(true);
    };

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const res = await api.upload(file);
            console.log("Upload response:", res);
            if (res.success) {
                setCurrentCollection(prev => ({ ...prev, image: res.url }));
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveCollection = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const dataToSend = {
                name: currentCollection.name,
                description: currentCollection.description,
                status: currentCollection.status,
                image_url: currentCollection.image,
                display_order: currentCollection.display_order || 0
            };

            if (modalMode === "create") {
                const res = await api.collections.create(dataToSend);
                if (res.success) {
                    toast.success("Collection launched successfully!");
                    fetchCollections(); // Refresh list
                }
            } else if (modalMode === "edit") {
                const res = await api.collections.update(currentCollection.id, dataToSend);
                if (res.success) {
                    toast.success("Collection updated successfully!");
                    fetchCollections(); // Refresh list
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving collection:", error);
            toast.error("Failed to save collection. Check server connectivity.");
        }
    };

    const deleteCollection = async (id: number) => {
        try {
            const res = await api.collections.delete(id);
            if (res.success) {
                setCollections(collections.filter(c => c.id !== id));
                toast.success("Collection removed successfully");
            }
        } catch (error) {
            console.error("Error deleting collection:", error);
            toast.error("Failed to delete collection");
        }
    };

    const toggleStatusFilter = () => {
        const statuses = ["all", "active", "scheduled", "archived"];
        const currentIndex = statuses.indexOf(statusFilter);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setStatusFilter(statuses[nextIndex]);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Our Collections</h1>
                        <p className="text-muted-foreground">Manage and curate your boutique's high-level fashion collections.</p>
                    </div>
                    <Button
                        variant="luxury"
                        className="gap-2 shadow-lg shadow-primary/10"
                        onClick={() => handleOpenModal("create")}
                    >
                        <Plus className="w-4 h-4" /> Create New Collection
                    </Button>
                </div>

                <div className="bg-background rounded-2xl border border-border shadow-soft overflow-hidden">
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between bg-secondary/5">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search collections..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={`gap-2 rounded-xl transition-all ${statusFilter !== 'all' ? 'border-primary text-primary bg-primary/5' : ''}`}
                                onClick={toggleStatusFilter}
                            >
                                <Filter className="w-4 h-4" />
                                Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl gap-2" onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                toast.info("Filters reset");
                            }}>
                                <RefreshCcw className="w-4 h-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary/10">
                                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Collection Details</th>
                                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Product Statistics</th>
                                    <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Live Status</th>
                                    <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence initial={false} mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                    <p className="font-display text-xl font-bold text-foreground">Loading collections...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredCollections.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                                <Layers className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="font-display text-xl font-bold">No collections found</p>
                                                <p className="text-sm">Try adjusting your search or filters.</p>
                                            </td>
                                        </tr>
                                    ) : filteredCollections.map((collection, index) => (
                                        <motion.tr
                                            key={collection.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-b border-border last:border-0 hover:bg-secondary/5 transition-colors group"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-none">
                                                        <img src={collection.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-border shadow-sm group-hover:scale-105 transition-transform" />
                                                        <div className="absolute inset-0 bg-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground text-base tracking-tight">{collection.name}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{collection.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-primary/5 rounded-lg">
                                                        <Package className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="font-semibold text-foreground">{collection.products} Item{collection.products !== 1 ? 's' : ''}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${collection.status === 'active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                                    collection.status === 'scheduled' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' :
                                                        collection.status === 'archived' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                                                            'bg-gray-500/10 text-gray-600 border border-gray-500/20'
                                                    }`}>
                                                    {collection.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
                                                        onClick={() => handleOpenModal("view", collection)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                                                        onClick={() => handleOpenModal("edit", collection)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 hover:bg-red-500/10 hover:text-red-600 transition-all text-muted-foreground"
                                                        onClick={() => deleteCollection(collection.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/5 rounded-2xl border border-primary/10 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Layers className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-display font-bold text-foreground text-lg">Curation Tips</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Group products by seasonal trends or artisanal techniques to create immersive shopping paths for your clients.
                            </p>
                        </div>
                        <ul className="space-y-2 text-[10px] font-bold uppercase text-primary/80 tracking-widest">
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full" /> High-Resolution Imagery
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full" /> Consistent Color Palettes
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-background rounded-2xl border border-border p-6 md:col-span-2 shadow-soft relative overflow-hidden"
                    >
                        <div className="relative z-10 flex justify-between">
                            <div>
                                <h3 className="font-display font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    Upcoming Series
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    The "Heritage" collection is currently scheduled for release. You can prepopulate it with items before it goes live.
                                </p>
                                <Button
                                    variant="luxury"
                                    size="sm"
                                    className="mt-4 h-9 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 border-none"
                                    onClick={() => toast.info("Landing page preview is under construction.")}
                                >
                                    Preview Landing Page
                                </Button>
                            </div>
                            <div className="hidden sm:flex gap-4">
                                {[3, 5].map(id => (
                                    <div key={id} className="w-24 group cursor-pointer">
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-soft group-hover:shadow-lg transition-all">
                                            <img src={`https://images.unsplash.com/photo-${id === 3 ? '1609709295948-17d77cb2a69b' : '1583391733956-6c78276477e2'}?w=200&h=300&fit=crop`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-background rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Layers className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-foreground capitalize">
                                        {modalMode} Collection
                                    </h2>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-10 w-10">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSaveCollection} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Collection Name</label>
                                        <input
                                            disabled={modalMode === "view"}
                                            required
                                            type="text"
                                            placeholder="e.g., Banarasi Excellence"
                                            className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold disabled:opacity-50"
                                            value={currentCollection.name}
                                            onChange={(e) => setCurrentCollection({ ...currentCollection, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Explanatory Description</label>
                                        <textarea
                                            disabled={modalMode === "view"}
                                            required
                                            rows={3}
                                            placeholder="Share the story behind this collection..."
                                            className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none disabled:opacity-50"
                                            value={currentCollection.description}
                                            onChange={(e) => setCurrentCollection({ ...currentCollection, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                                            <select
                                                disabled={modalMode === "view"}
                                                className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none disabled:opacity-50"
                                                value={currentCollection.status}
                                                onChange={(e) => setCurrentCollection({ ...currentCollection, status: e.target.value })}
                                            >
                                                <option value="active">Active Now</option>
                                                <option value="scheduled">Scheduled</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cover Asset</label>
                                            <div className="flex items-center gap-4">
                                                <div className="relative group w-20 h-20 flex-none bg-secondary/20 rounded-2xl border border-dashed border-border overflow-hidden flex items-center justify-center">
                                                    {currentCollection.image ? (
                                                        <img src={currentCollection.image} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        disabled={modalMode === "view" || uploading}
                                                        type="file"
                                                        id="collection-image-modal"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                    />
                                                    <Button
                                                        disabled={modalMode === "view" || uploading}
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full rounded-2xl h-12 gap-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                                                        onClick={() => document.getElementById('collection-image-modal')?.click()}
                                                    >
                                                        {uploading ? (
                                                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                        ) : (
                                                            <ImageIcon className="w-4 h-4 text-primary" />
                                                        )}
                                                        {uploading ? 'Processing...' : (currentCollection.image ? 'Change Asset' : 'Select File')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl h-14 font-bold text-muted-foreground">
                                        {modalMode === "view" ? "Close" : "Discard"}
                                    </Button>
                                    {modalMode !== "view" && (
                                        <Button variant="luxury" type="submit" className="flex-[2] rounded-2xl h-14 font-bold shadow-xl shadow-primary/20 gap-2">
                                            <Check className="w-5 h-5" />
                                            {modalMode === "create" ? "Launch Collection" : "Save Changes"}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default CollectionsManagement;
