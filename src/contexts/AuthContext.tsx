import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  pincode?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  password: string;
}

interface StoredUser extends User {
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem("rumi_session");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem("rumi_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("rumi_session");
    }
  }, [user]);

  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem("rumi_users");
    return users ? JSON.parse(users) : [];
  };

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email: emailOrPhone, password });
      if (res.success) {
        setUser(res.data as User);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const res = await api.auth.register(userData);
      if (res.success) {
        setUser(res.data as User);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rumi_session");
    toast.success("Logged out successfully");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const res = await api.users.update(Number(user.id), updates);
      if (res.success) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      isAuthenticated: false,
      login: () => false,
      register: () => false,
      logout: () => { },
      updateProfile: () => { },
    };
  }
  return context;
};
