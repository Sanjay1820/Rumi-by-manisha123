# 🔌 Frontend-Backend Integration Guide

## Current Status

**Frontend:** Currently using **static/hardcoded data**  
**Backend:** Complete with **6 APIs** and **database ready**  
**Connection:** **NOT YET CONNECTED** ⚠️

---

## ✅ What Was Created

### **1. API Configuration** (`src/lib/api.ts`)
- Complete API client
- All 6 APIs configured
- Helper functions for all endpoints

### **2. React Hooks** (`src/hooks/useApi.ts`)
- Custom hooks for data fetching
- Loading and error states
- Easy to use in components

---

## 🔌 How to Connect Frontend to Backend

### **Step 1: Ensure Backend is Running**

1. **XAMPP is running** (Apache + MySQL)
2. **Database imported** (`schema.sql` + `default_data.sql`)
3. **Backend folder** in `C:\xampp\htdocs\rumi-backend\`
4. **Test API:** `http://localhost/rumi-backend/api/faqs.php`

---

### **Step 2: Update FAQ Page to Use Backend**

**Current:** `src/pages/FAQ.tsx` uses hardcoded data  
**Update to:** Use API data

**Replace the hardcoded FAQs section with:**

```typescript
import { useFAQs, usePopularFAQs } from '@/hooks/useApi';

// Inside component:
const { data: faqsData, loading, error } = useFAQs(true); // grouped
const { data: popularData } = usePopularFAQs(3);

if (loading) {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="text-white">Loading FAQs...</div>
  </div>;
}

if (error) {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="text-red-500">Error loading FAQs: {error}</div>
  </div>;
}

// Use faqsData instead of hardcoded faqs
```

---

### **Step 3: Update Shop Page to Use Backend**

**Current:** `src/pages/Shop.tsx` uses `src/data/products.ts`  
**Update to:** Use API data

```typescript
import { useProducts, useCategories } from '@/hooks/useApi';

// Inside component:
const { data: productsData, loading } = useProducts({ 
  page: 1, 
  limit: 20 
});

const { data: categoriesData } = useCategories();

// Use productsData.data and productsData.pagination
```

---

### **Step 4: Update Home Page**

**Update:** `src/pages/Index.tsx`

```typescript
import { useFeaturedProducts, useNewArrivals, useBestSellers } from '@/hooks/useApi';

// Inside component:
const { data: featured } = useFeaturedProducts(8);
const { data: newArrivals } = useNewArrivals(8);
const { data: bestSellers } = useBestSellers(8);
```

---

### **Step 5: Update Gallery Page**

**Update:** `src/pages/Gallery.tsx`

```typescript
import { useGallery } from '@/hooks/useApi';

// Inside component:
const { data: galleryData, loading } = useGallery({ grouped: true });
```

---

## 📝 Example: Complete FAQ Page Integration

```typescript
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFAQs, usePopularFAQs } from '@/hooks/useApi';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch data from backend
  const { data: faqsData, loading, error } = useFAQs(true);
  const { data: popularData } = usePopularFAQs(3);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-white text-xl">Loading FAQs...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  // Transform grouped data
  const faqsByCategory = faqsData || {};
  const popularFAQs = popularData || [];
  const categories = ["All", ...Object.keys(faqsByCategory)];

  // Filter FAQs
  const filteredFAQs = useMemo(() => {
    let result = faqsByCategory;

    if (selectedCategory !== "All") {
      result = { [selectedCategory]: faqsByCategory[selectedCategory] || [] };
    }

    if (searchQuery) {
      const filtered: any = {};
      Object.entries(result).forEach(([category, faqs]: [string, any]) => {
        const matchedFAQs = faqs.filter((faq: any) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchedFAQs.length > 0) {
          filtered[category] = matchedFAQs;
        }
      });
      result = filtered;
    }

    return result;
  }, [faqsByCategory, selectedCategory, searchQuery]);

  // Rest of your component JSX...
  return (
    <div className="min-h-screen bg-[#0a0b0d]">
      <Header />
      {/* Your existing JSX */}
      <Footer />
    </div>
  );
};

export default FAQ;
```

---

## 🎯 Integration Checklist

### **Pages to Update:**
- [ ] FAQ page (`src/pages/FAQ.tsx`)
- [ ] Shop page (`src/pages/Shop.tsx`)
- [ ] Home page (`src/pages/Index.tsx`)
- [ ] Gallery page (`src/pages/Gallery.tsx`)
- [ ] Product Detail page (`src/pages/ProductDetail.tsx`)

### **Admin Pages (Already using APIs):**
- [x] FAQ Management
- [x] Gallery Management
- [x] Product Management
- [x] Review Management
- [x] Inquiry Management

---

## ⚙️ Configuration

### **Update API Base URL if needed:**

Edit `src/lib/api.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost/rumi-backend/api', // Change if different
  // ...
};
```

---

## 🧪 Testing

### **1. Test Backend APIs:**
```
http://localhost/rumi-backend/api/faqs.php?grouped=1
http://localhost/rumi-backend/api/products.php?featured=1
http://localhost/rumi-backend/api/gallery.php?grouped=1
```

### **2. Test Frontend:**
```bash
npm run dev
```

Open browser console and check for API calls.

---

## 🐛 Troubleshooting

### **CORS Errors:**
- Check `.htaccess` in backend folder
- Ensure CORS headers are set

### **404 Errors:**
- Verify backend folder location
- Check Apache is running
- Test API URLs directly

### **No Data Showing:**
- Check browser console for errors
- Verify database has data
- Test API endpoints directly

---

## 📊 Current vs Future

### **Current (Static Data):**
```typescript
const faqs = [
  { id: 1, question: "...", answer: "..." },
  // Hardcoded data
];
```

### **Future (Dynamic Data):**
```typescript
const { data: faqs, loading, error } = useFAQs(true);
// Data from database via API
```

---

## ✅ Benefits of Integration

1. ✅ **Dynamic Content** - Update via admin dashboard
2. ✅ **Real-time Changes** - No code deployment needed
3. ✅ **Scalable** - Add unlimited products/FAQs
4. ✅ **Centralized** - Single source of truth
5. ✅ **Professional** - Production-ready architecture

---

## 🚀 Next Steps

1. **Test backend APIs** - Ensure all working
2. **Update FAQ page** - Use `useFAQs` hook
3. **Update Shop page** - Use `useProducts` hook
4. **Update Gallery** - Use `useGallery` hook
5. **Test frontend** - Verify data loads correctly

---

## 📝 Summary

**Status:** ✅ Integration layer created  
**Files Created:**
- `src/lib/api.ts` - API client
- `src/hooks/useApi.ts` - React hooks
- `FRONTEND_BACKEND_INTEGRATION.md` - This guide

**Next:** Update pages to use hooks instead of static data

**Result:** Frontend will show **live data from database**! 🎉

---

**Created:** January 23, 2026  
**Status:** Ready for Integration  
**Difficulty:** Easy (just replace data sources)
