import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Mail, Phone, MapPin, MessageSquare, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useInquiry } from "@/contexts/InquiryContext";
import { toast } from "sonner";
import { z } from "zod";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { sendProductInquiryEmail } from "@/lib/emailService";
const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  address: z.string().optional(),
  city: z.string().optional(),
});

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  priceINR: number;
  image: string;
  category: string;
  size?: string;
  color?: string;
  quantity?: number;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductInfo;
  currency?: "CAD" | "INR";
}

const InquiryModal = ({ isOpen, onClose, product, currency = "CAD" }: InquiryModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const { addInquiry } = useInquiry();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
    address: user?.address || "",
    city: user?.city || "",
  });

  const displayPrice = currency === "INR" ? product.priceINR : product.price;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      inquirySchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);
    let apiSuccess = false;

    try {
      // 1. Send via API
      const res = await api.inquiries.create({
        ...formData,
        product_id: product.id,
        product_name: product.name,
        inquiry_type: 'product'
      });
      apiSuccess = res.success;

      if (res.success) {
        // Save inquiry to history (local storage)
        addInquiry({
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          productCategory: product.category,
          productPrice: product.price,
          productPriceINR: product.priceINR,
          size: product.size,
          color: product.color,
          quantity: product.quantity,
          message: formData.message,
        });
      }
    } catch (error) {
      console.error("Database API inquiry failed:", error);
      // We don't return here because we want to try sending the email as backup
    }

    // 2. Send via EmailJS (Backup / Notification)
    try {
      await sendProductInquiryEmail(formData, product, currencySymbol, displayPrice);

      // If API failed but EmailJS worked, we still count it as a success for the user experience
      if (!apiSuccess) {
        setIsSuccess(true);
        toast.success("Inquiry received! We'll contact you soon.");
      }
    } catch (emailError) {
      console.error("EmailJS sending failed:", emailError);
      if (!apiSuccess) {
        toast.error("Failed to send inquiry. Please try again or contact us directly.");
      }
    }

    if (apiSuccess) {
      setIsSuccess(true);
      toast.success("Inquiry sent successfully! We'll contact you soon.");
    }

    setIsSubmitting(false);


    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        message: "",
        address: user?.address || "",
        city: user?.city || "",
      });
    }, 2000);
  };

  return (
    createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm pointer-events-auto"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full md:w-full md:max-w-2xl max-h-[80vh] md:max-h-[85vh] overflow-y-auto bg-background rounded-t-2xl md:rounded-2xl shadow-2xl z-50 pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-background border-b border-border p-4 md:p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-display text-xl md:text-2xl text-foreground">Product Inquiry</h2>
                  <p className="font-body text-sm text-muted-foreground">Fill in your details to inquire about this product</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success State */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 md:p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h3 className="font-display text-2xl text-foreground mb-2">Inquiry Sent!</h3>
                  <p className="font-body text-muted-foreground">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <div className="p-4 md:p-6">
                  {/* Product Summary */}
                  <div className="flex gap-4 p-4 bg-secondary/50 rounded-xl mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-24 md:w-24 md:h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-accent text-xs tracking-wider text-primary uppercase mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-display text-base md:text-lg text-foreground truncate mb-1">
                        {product.name}
                      </h3>
                      <p className="font-display text-lg text-primary">
                        {currencySymbol}{displayPrice.toLocaleString()}
                      </p>
                      {product.size && product.color && (
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          Size: {product.size} • Color: {product.color}
                          {product.quantity && product.quantity > 1 && ` • Qty: ${product.quantity}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Login Prompt for Non-Authenticated Users */}
                  {!isAuthenticated && (
                    <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="font-body text-sm text-foreground mb-2">
                        <strong>Already have an account?</strong>
                      </p>
                      <p className="font-body text-xs text-muted-foreground mb-3">
                        Log in for faster inquiry with auto-filled details.
                      </p>
                      <Link to="/login">
                        <Button variant="outline" size="sm" className="text-xs">
                          Sign In / Register
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Logged In Badge */}
                  {isAuthenticated && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-primary">
                      <Check className="w-4 h-4" />
                      <span className="font-body">Logged in as {user?.name}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                            disabled={isAuthenticated}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-xs text-destructive mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                            disabled={isAuthenticated}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (647) 410-2840"
                            className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">
                          City
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Your city"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="font-body text-sm text-foreground mb-1.5 block">
                        Address (optional)
                      </label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Your delivery address"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="font-body text-sm text-foreground mb-1.5 block">
                        Message / Questions *
                      </label>
                      <div className="relative">
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your requirements, preferred delivery date, customization needs, etc."
                          rows={4}
                          className={errors.message ? "border-destructive" : ""}
                        />
                      </div>
                      {errors.message && (
                        <p className="text-xs text-destructive mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="luxury"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )
  );
};

export default InquiryModal;
