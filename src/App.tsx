import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { InquiryProvider } from "@/contexts/InquiryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RefundPolicy from "./pages/RefundPolicy";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsManagement from "./pages/admin/ProductsManagement";
import ProductForm from "./pages/admin/ProductForm";
import ReviewsManagement from "./pages/admin/ReviewsManagement";
import InquiriesManagement from "./pages/admin/InquiriesManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import CollectionsManagement from "./pages/admin/CollectionsManagement";
import FAQManagement from "./pages/admin/FAQManagement";
import BackToTop from "./components/BackToTop";
import FloatingContactButton from "./components/FloatingContactButton";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <InquiryProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/wishlist" element={<Wishlist />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<ProductsManagement />} />
                  <Route path="/admin/products/new" element={<ProductForm />} />
                  <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                  <Route path="/admin/reviews" element={<ReviewsManagement />} />
                  <Route path="/admin/inquiries" element={<InquiriesManagement />} />
                  <Route path="/admin/orders" element={<OrdersManagement />} />
                  <Route path="/admin/users" element={<UsersManagement />} />
                  <Route path="/admin/gallery" element={<GalleryManagement />} />
                  <Route path="/admin/collections" element={<CollectionsManagement />} />
                  <Route path="/admin/faqs" element={<FAQManagement />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <BackToTop />
                <FloatingContactButton />
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </InquiryProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
