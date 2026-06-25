import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Mail, Shield, Trash2, Edit, X, Check, ChevronRight, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface User {
    id: string | number;
    name: string | null;
    email: string;
    phone?: string | null;
    password?: string;
    role: 'admin' | 'customer';
    joinedDate: string;
    status: 'active' | 'inactive';
}

const UsersManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        status: 'active'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await api.users.getAll();
                if (res.success) {
                    setUsers(res.data as User[]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (mode: 'add' | 'edit', user?: User) => {
        setModalMode(mode);
        setShowPassword(false);
        if (mode === 'edit' && user) {
            setSelectedUser(user);
            setFormData(user);
        } else {
            setSelectedUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'customer',
                status: 'active'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (modalMode === 'add') {
            if (!formData.password) {
                toast.error("Security credential (password) is required for new provisioning.");
                return;
            }
            const newUser: User = {
                id: (users.length + 1).toString(),
                name: formData.name || '',
                email: formData.email || '',
                password: formData.password || '',
                role: (formData.role as 'admin' | 'customer') || 'customer',
                joinedDate: new Date().toISOString().split('T')[0],
                status: (formData.status as 'active' | 'inactive') || 'active',
            };
            setUsers([...users, newUser]);
            toast.success("Identity successfully provisioned with secure hash.");
        } else if (modalMode === 'edit' && selectedUser) {
            const updatedUsers = users.map(u =>
                u.id === selectedUser.id ? { ...u, ...formData } as User : u
            );
            setUsers(updatedUsers);
            toast.success("User updated successfully!");
        }
        setIsModalOpen(false);
    };

    const confirmDelete = (id: string) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (userToDelete) {
            try {
                const res = await api.users.delete(userToDelete);
                if (res.success) {
                    setUsers(users.filter(u => String(u.id) !== String(userToDelete)));
                    toast.success("User identity terminated.");
                } else {
                    toast.error(res.error || "Failed to terminate identity.");
                }
            } catch (error) {
                console.error("Delete user error:", error);
                toast.error("An error occurred during identity termination.");
            } finally {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            }
        }
    };

    const handlePurgeAll = async () => {
        if (!window.confirm("CRITICAL WARNING: This will permanently terminal ALL customer identities in the database. Only administrators will remain. Proceed with purge?")) {
            return;
        }

        try {
            setLoading(true);
            const res = await api.users.delete('all');
            if (res.success) {
                // Keep only admins in local state
                setUsers(users.filter(u => u.role === 'admin'));
                toast.success("Sector clear. All non-admin identities purged.");
            } else {
                toast.error(res.error || "Global purge failed.");
            }
        } catch (error) {
            console.error("Purge all error:", error);
            toast.error("Fatal error during global purge.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#1a1d23] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                            System Logic <ChevronRight className="w-3 h-3" /> Access Management
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tighter">User <span className="text-primary">Registry</span></h1>
                        <p className="text-gray-400 text-sm mt-1">Configure system administrators and customer profiles.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                        <Button
                            variant="outline"
                            onClick={handlePurgeAll}
                            className="h-12 px-6 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                        >
                            <Trash2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                            Purge All Identities
                        </Button>
                        <Button variant="luxury" onClick={() => handleOpenModal('add')} className="h-12 px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all text-black">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Provision New Identity
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20" />
                </div>

                {/* Filter Controls */}
                <div className="bg-[#1a1d23] rounded-3xl border border-white/5 p-6 shadow-xl flex items-center">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Find user by name or email hash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-white rounded-2xl placeholder:text-gray-600 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[#1a1d23] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black/40 border-b border-white/5">
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Identity Profile</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Privilege Level</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Onboarding Date</th>
                                    <th className="text-left p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">System Status</th>
                                    <th className="text-right p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                    <p className="font-display text-xl font-bold text-white">Loading user registry...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <Search className="w-12 h-12 text-primary" />
                                                    <p className="font-display text-xl font-bold text-white italic">No identities located in this sector.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-all group"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-inner border border-white/5">
                                                        <span className="font-bold text-sm tracking-tighter">
                                                            {user.name ? user.name.split(' ').map(n => n[0]).join('') : user.email.substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{user.name || 'N/A'}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'admin' ? (
                                                        <Shield className="w-3 h-3 text-primary" />
                                                    ) : (
                                                        <Mail className="w-3 h-3 text-gray-500" />
                                                    )}
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-white leading-none">{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-xs text-gray-400 font-medium">{user.joinedDate ? user.joinedDate.split(' ')[0] : 'N/A'}</td>
                                            <td className="p-6">
                                                <span className={`inline-flex px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${user.status === 'active'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 rounded-xl" onClick={() => handleOpenModal('edit', user)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl" onClick={() => confirmDelete(String(user.id))}>
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
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#1a1d23] border border-white/10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                                            {modalMode === 'add' ? 'Identity Provisioning' : 'Modify Access Profile'}
                                        </h2>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Authentication Log</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Full Identity Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-12 bg-white/5 border-white/10 focus:border-primary/50 text-white rounded-xl"
                                            placeholder="Enter full name..."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Communication Channel (Email)</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-12 bg-white/5 border-white/10 focus:border-primary/50 text-white rounded-xl"
                                            placeholder="identity@rumiboutique.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Secure Hash (Password)</label>
                                        <div className="relative group/pass">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="h-12 bg-white/5 border-white/10 focus:border-primary/50 text-white rounded-xl pr-12 transition-all"
                                                placeholder={modalMode === 'add' ? "Assign secure access key..." : "Leave blank to maintain current hash..."}
                                                required={modalMode === 'add'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-primary transition-colors hover:bg-white/5 rounded-lg"
                                            >
                                                {showPassword ? (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><X className="w-4 h-4" /></motion.div>
                                                ) : (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Shield className="w-4 h-4" /></motion.div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Privilege Role</label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'customer' })}
                                                className="w-full h-12 bg-white/5 border border-white/10 focus:border-primary/50 text-white rounded-xl px-4 text-sm font-medium outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="customer" className="bg-[#1a1d23]">Customer</option>
                                                <option value="admin" className="bg-[#1a1d23]">Administrator</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Deployment Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                                className="w-full h-12 bg-white/5 border border-white/10 focus:border-primary/50 text-white rounded-xl px-4 text-sm font-medium outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="active" className="bg-[#1a1d23]">Active</option>
                                                <option value="inactive" className="bg-[#1a1d23]">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button type="submit" className="flex-1 h-14 bg-primary text-black font-bold uppercase tracking-widest text-[10px] hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20">
                                            <Check className="w-4 h-4 mr-2" />
                                            {modalMode === 'add' ? 'Authorize Identity' : 'Commit Changes'}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-14 px-6 border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] rounded-2xl">
                                            Abort
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20 pointer-events-none" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#1a1d23] border border-red-500/20 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative z-10 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white mb-2">Terminate Identity?</h2>
                            <p className="text-gray-500 text-sm mb-8">This action will permanently purge this user profiling from the secure registry.</p>

                            <div className="flex flex-col gap-3">
                                <Button onClick={handleDelete} className="h-14 bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 rounded-2xl shadow-xl shadow-red-500/20">
                                    Confirm Purge
                                </Button>
                                <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="h-14 text-gray-500 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] rounded-2xl">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default UsersManagement;
