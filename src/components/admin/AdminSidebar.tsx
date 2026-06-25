import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    Star,
    MessageSquare,
    ShoppingCart,
    Users,
    Menu,
    X,
    ChevronRight,
    Layers,
    Image,
    HelpCircle,
} from "lucide-react";

interface MenuItem {
    icon: React.ElementType;
    label: string;
    path: string;
}

const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Layers, label: "Collections", path: "/admin/collections" },
    { icon: Image, label: "Gallery", path: "/admin/gallery" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Star, label: "Reviews", path: "/admin/reviews" },
    { icon: MessageSquare, label: "Inquiries", path: "/admin/inquiries" },
    { icon: HelpCircle, label: "FAQs", path: "/admin/faqs" },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : "-100%") }}
                transition={{ type: "spring", damping: 20 }}
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex flex-col`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <h2 className="font-display text-xl text-foreground">RUMI Admin</h2>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            Admin Panel v1.0
                        </p>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
