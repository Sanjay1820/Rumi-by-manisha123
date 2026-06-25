import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  priceINR: number;
  image: string;
  category: string;
}

export interface InquiryHistoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productCategory: string;
  productPrice: number;
  productPriceINR: number;
  size?: string;
  color?: string;
  quantity?: number;
  message: string;
  status: "pending" | "contacted" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface InquiryContextType {
  wishlistItems: WishlistItem[];
  inquiryHistory: InquiryHistoryItem[];
  currency: "CAD" | "INR";
  setCurrency: (currency: "CAD" | "INR") => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  addInquiry: (inquiry: Omit<InquiryHistoryItem, "id" | "status" | "createdAt" | "updatedAt">) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem("rumi_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [inquiryHistory, setInquiryHistory] = useState<InquiryHistoryItem[]>(() => {
    const saved = localStorage.getItem("rumi_inquiries");
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrencyState] = useState<"CAD" | "INR">(() => {
    const saved = localStorage.getItem("rumi_currency");
    return (saved as "CAD" | "INR") || "CAD";
  });

  const setCurrency = (newCurrency: "CAD" | "INR") => {
    setCurrencyState(newCurrency);
    localStorage.setItem("rumi_currency", newCurrency);
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlistItems.find((i) => i.id === item.id)) {
      const newItems = [...wishlistItems, item];
      setWishlistItems(newItems);
      localStorage.setItem("rumi_wishlist", JSON.stringify(newItems));
    }
  };

  const removeFromWishlist = (id: string) => {
    const newItems = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(newItems);
    localStorage.setItem("rumi_wishlist", JSON.stringify(newItems));
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const addInquiry = (inquiry: Omit<InquiryHistoryItem, "id" | "status" | "createdAt" | "updatedAt">) => {
    const newInquiry: InquiryHistoryItem = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newHistory = [newInquiry, ...inquiryHistory];
    setInquiryHistory(newHistory);
    localStorage.setItem("rumi_inquiries", JSON.stringify(newHistory));
  };

  return (
    <InquiryContext.Provider
      value={{
        wishlistItems,
        inquiryHistory,
        currency,
        setCurrency,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addInquiry,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    return {
      wishlistItems: [],
      inquiryHistory: [],
      currency: "CAD" as const,
      setCurrency: () => {},
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      isInWishlist: () => false,
      addInquiry: () => {},
    };
  }
  return context;
};
