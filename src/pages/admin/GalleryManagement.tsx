import { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Plus, Search, Filter,
    Image as ImageIcon,
    Eye, Edit, Trash2, X, Check,
    Instagram, Video, RefreshCcw, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface GalleryItem {
    id: number;
    url: string;
    title: string;
    category: string;
    type: 'image' | 'video' | 'instagram-post' | 'instagram-reel';
    thumbnail?: string;
    instagram_url?: string;
    status: string;
    display_order: number;
    created_at?: string;
}

const GalleryManagement = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
    const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
        url: "",
        title: "",
        category: "General",
        type: "image",
        status: "active",
        display_order: 0
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = async () => {
        try {
            setLoading(true);
            const res = await api.gallery.getAll({ limit: 100 });
            if (res.success && Array.isArray(res.data)) {
                setItems(res.data);
            }
        } catch (error) {
            console.error("Error fetching gallery:", error);
            toast.error("Failed to load gallery items");
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === "all" || item.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [items, searchTerm, typeFilter]);

    const handleOpenModal = (mode: "create" | "edit" | "view", item?: GalleryItem) => {
        setModalMode(mode);
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({
                url: "",
                title: "",
                category: "Instagram",
                type: "image",
                status: "active",
                display_order: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const res = await api.upload(file);
            if (res.success) {
                setCurrentItem(prev => ({ ...prev, url: res.url }));
                toast.success("File uploaded successfully");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (modalMode === "create") {
                const res = await api.gallery.create(currentItem);
                if (res.success) {
                    toast.success("Gallery item added!");
                    fetchGalleryItems();
                    setIsModalOpen(false);
                }
            } else if (modalMode === "edit") {
                const res = await api.gallery.update(currentItem.id!, currentItem);
                if (res.success) {
                    toast.success("Gallery item updated!");
                    fetchGalleryItems();
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error("Error saving gallery item:", error);
            toast.error("Failed to save item");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await api.gallery.delete(id);
            if (res.success) {
                setItems(items.filter(i => i.id !== id));
                toast.success("Item deleted");
            }
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Gallery & Social</h1>
                        <p className="text-muted-foreground">Manage gallery images and Instagram feed content.</p>
                    </div>
                    <Button
                        variant="luxury"
                        className="gap-2 shadow-lg shadow-primary/10"
                        onClick={() => handleOpenModal("create")}
                    >
                        <Plus className="w-4 h-4" /> Add Gallery Item
                    </Button>
                </div>

                <div className="bg-background rounded-2xl border border-border shadow-soft overflow-hidden">
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between bg-secondary/5">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search gallery..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="image">Images</option>
                                <option value="video">Videos</option>
                                <option value="instagram-post">Instagram Posts</option>
                                <option value="instagram-reel">Reels</option>
                            </select>
                            <Button variant="ghost" size="sm" className="rounded-xl gap-2" onClick={fetchGalleryItems}>
                                <RefreshCcw className="w-4 h-4" /> Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Loading gallery items...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p className="font-display text-xl font-bold">No gallery items found</p>
                                <p className="text-muted-foreground text-sm">Start by adding your first Instagram post or gallery image.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="group relative bg-secondary/20 rounded-2xl overflow-hidden border border-border aspect-square"
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3 text-center">
                                            <p className="text-white font-bold text-sm line-clamp-2">{item.title}</p>
                                            <span className="text-[10px] text-white/70 uppercase tracking-widest">{item.type}</span>
                                            <div className="flex gap-2 mt-2">
                                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => handleOpenModal("edit", item)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        {item.type.includes('instagram') && (
                                            <div className="absolute top-3 right-3 p-1.5 bg-background/80 backdrop-blur-sm rounded-lg">
                                                <Instagram className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
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
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h2 className="text-xl font-display font-bold capitalize">{modalMode} Gallery Item</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Title</label>
                                    <input
                                        required
                                        className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                                        value={currentItem.title}
                                        onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                                        <select
                                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 outline-none"
                                            value={currentItem.type}
                                            onChange={e => setCurrentItem({ ...currentItem, type: e.target.value as any })}
                                        >
                                            <option value="image">Standard Image</option>
                                            <option value="video">Video URL</option>
                                            <option value="instagram-post">Instagram Post</option>
                                            <option value="instagram-reel">Instagram Reel</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                                        <input
                                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 outline-none"
                                            value={currentItem.category}
                                            onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Image/Resource URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            required
                                            className="flex-1 bg-secondary/20 border border-border rounded-xl px-4 py-2.5 outline-none"
                                            value={currentItem.url}
                                            onChange={e => setCurrentItem({ ...currentItem, url: e.target.value })}
                                            placeholder="Upload or enter URL"
                                        />
                                        <input type="file" id="gal-file" hidden onChange={handleFileUpload} accept="image/*" />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="rounded-xl gap-2"
                                            disabled={uploading}
                                            onClick={() => document.getElementById('gal-file')?.click()}
                                        >
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                            Upload
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Instagram Link (Optional)</label>
                                    <input
                                        className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 outline-none"
                                        value={currentItem.instagram_url || ""}
                                        onChange={e => setCurrentItem({ ...currentItem, instagram_url: e.target.value })}
                                        placeholder="https://instagram.com/p/..."
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button variant="luxury" type="submit" className="flex-2 rounded-xl px-10">
                                        {modalMode === "create" ? "Add to Gallery" : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default GalleryManagement;
