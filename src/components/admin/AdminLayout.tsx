import { useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import AdminSidebar from "./AdminSidebar";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { isAuthenticated, user, logout } = useAdmin();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-secondary/10">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                {/* Top Header */}
                <header className="h-16 bg-background border-b border-border sticky top-0 z-30">
                    <div className="h-full px-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex-1 lg:flex-none" />

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{user?.username}</span>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
