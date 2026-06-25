import { createContext, useContext, useState, ReactNode } from "react";

interface AdminUser {
    username: string;
    email: string;
}

interface AdminContextType {
    isAuthenticated: boolean;
    user: AdminUser | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("adminAuth") === "true";
    });
    const [user, setUser] = useState<AdminUser | null>(() => {
        const savedUser = localStorage.getItem("adminUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (username: string, password: string): boolean => {
        // Mock authentication - replace with real API call
        if (username === "admin" && password === "admin123") {
            const adminUser = {
                username: "admin",
                email: "admin@rumiboutique.com",
            };
            setUser(adminUser);
            setIsAuthenticated(true);
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem("adminUser", JSON.stringify(adminUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};
