import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import ProductCard from "@/components/ProductCard";
import ReviewsSection from "@/components/ReviewsSection";
import InquiryModal from "@/components/InquiryModal";
import { Button } from "@/components/ui/button";
import { useInquiry } from "@/contexts/InquiryContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getProductById, allProducts } from "@/data/products"; // kept for fallback types/utils if needed
import { Review } from "@/data/reviews";
import ReviewForm from "@/components/ReviewForm";
import {
  Heart,
  Minus,
  Plus,
  MessageCircle,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToWishlist, isInWishlist, currency, addInquiry } = useInquiry();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState({ name: "Default", hex: "#000000" });
  const [quantity, setQuantity] = useState(1);
  const [showInquiry, setShowInquiry] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.products.getById(Number(id));
        if (res.success && res.data) {
          const dbProduct = res.data;

          // Map DB product to UI format
          const mappedProduct = {
            ...dbProduct,
            id: String(dbProduct.id),
            image: dbProduct.images?.[0]?.image_url || dbProduct.primary_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
            images: dbProduct.images && dbProduct.images.length > 0
              ? dbProduct.images.map((img: any) => img.image_url)
              : [dbProduct.primary_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80"],
            category: dbProduct.category_name || "Sarees",
            price: Number(dbProduct.price),
            priceINR: Number(dbProduct.price) * 60, // Fallback conversion
            details: dbProduct.description ? [dbProduct.description] : [],
            sizes: dbProduct.sizes ? (typeof dbProduct.sizes === 'string' ? dbProduct.sizes.split(',') : dbProduct.sizes) : ["M", "L", "XL"],
            colors: dbProduct.colors ? (typeof dbProduct.colors === 'string' ? JSON.parse(dbProduct.colors) : dbProduct.colors) : [{ name: "Default", hex: "#000000" }],
            careInstructions: dbProduct.care_instructions ? [dbProduct.care_instructions] : ["Hand wash only"],
            inStock: Number(dbProduct.stock_quantity) > 0,
            quantity: Number(dbProduct.stock_quantity),
            rating: Number(dbProduct.rating) || 5.0,
            reviews: Number(dbProduct.reviews_count) || 0,
          };

          setProduct(mappedProduct);
          setSelectedSize(mappedProduct.sizes[0]);
          setSelectedColor(mappedProduct.colors[0]);

          // Fetch Related Products (using real category ID)
          if (dbProduct.category_id) {
            try {
              const relatedRes = await api.products.getRelated(dbProduct.id, dbProduct.category_id);
              if (relatedRes.success && relatedRes.data) {
                const mappedRelated = relatedRes.data.map((p: any) => ({
                  id: String(p.id),
                  name: p.name,
                  price: p.price,
                  priceINR: p.price * 60,
                  image: p.primary_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
                  category: p.category_name || "Style",
                  slug: p.slug
                }));
                setRelatedProducts(mappedRelated);
              }
            } catch (relErr) {
              console.error("Failed to load related products", relErr);
            }
          }

        } else {
          // Fallback to static data if not in DB
          const staticProduct = getProductById(id);
          if (staticProduct) {
            setProduct(staticProduct);
            setSelectedSize(staticProduct.sizes[0]);
            setSelectedColor(staticProduct.colors[0]);
          }
        }

        // Fetch reviews
        const reviewsRes = await api.reviews.getByProduct(Number(id));
        if (reviewsRes.success) {
          setReviews(reviewsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        // Fallback to static
        const staticProduct = getProductById(id);
        if (staticProduct) {
          setProduct(staticProduct);
          setSelectedSize(staticProduct.sizes[0]);
          setSelectedColor(staticProduct.colors[0]);
        }
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };

    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddReview = async (newReviewData: any) => {
    if (!id || !product) return;
    try {
      const res = await api.reviews.create({
        product_id: Number(id),
        // user_id is removed because frontend UUIDs are incompatible with backend int IDs
        author_name: newReviewData.name,
        author_email: newReviewData.email,
        title: newReviewData.title,
        rating: newReviewData.rating,
        comment: newReviewData.text,
        verified_purchase: user ? 1 : 0,
        status: 'pending'
      });

      if (res.success) {
        toast.success("Review submitted! It will be visible after admin approval.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 text-center">
          <h2 className="text-2xl font-display mb-4">Product Not Found</h2>
          <Button asChild variant="luxury"><Link to="/shop">Return to Shop</Link></Button>
        </div>
        <Footer />
      </>
    );
  }

  const displayPrice = currency === "INR" ? product.priceINR : product.price;
  const currencySymbol = currency === "INR" ? "₹" : "$";
  const originalDisplayPrice = product.originalPrice
    ? currency === "INR"
      ? product.originalPrice * 60
      : product.originalPrice
    : null;

  const handleInquiry = () => {
    setShowInquiry(true);
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.priceINR,
      image: product.image,
      category: product.category,
    });
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="pt-24 md:pt-32"></div>
        {/* Breadcrumb */}
        <nav className="py-3 md:py-4 bg-secondary/30">
          <div className="container mx-auto px-6 md:px-4">
            <ol className="flex items-center gap-2 font-body text-xs md:text-sm text-muted-foreground overflow-x-auto">
              <li><Link to="/" className="hover:text-primary transition-colors whitespace-nowrap">Home</Link></li>
              <li>/</li>
              <li><Link to="/shop" className="hover:text-primary transition-colors whitespace-nowrap">Shop</Link></li>
              <li>/</li>
              <li><Link to={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-primary transition-colors whitespace-nowrap">{product.category}</Link></li>
              <li>/</li>
              <li className="text-foreground truncate">{product.name}</li>
            </ol>
          </div>
        </nav>

        {/* Product Section */}
        <section className="py-12 lg:py-20 w-full overflow-hidden">
          <div className="container mx-auto px-6 md:px-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full">
              {/* Product Images */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="px-3 py-1 bg-foreground text-background text-[10px] tracking-[0.2em] uppercase font-body"
                      >
                        New
                      </motion.span>
                    )}
                    {product.isSale && (
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="px-3 py-1 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-body"
                      >
                        Sale
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images.map((img: string, idx: number) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-primary shadow-lg" : "border-transparent hover:border-muted-foreground/50"
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Review Form - Desktop Only */}
                <div className="mt-12 hidden lg:block">
                  <ReviewForm
                    onSubmit={handleAddReview}
                    initialData={user ? { name: user.name, email: user.email } : undefined}
                  />
                </div>

              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="font-accent text-sm tracking-[0.3em] text-primary mb-2">
                  {product.category.toUpperCase()}
                </p>
                <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                          ? "text-primary fill-primary"
                          : "text-muted-foreground"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="font-body text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  {originalDisplayPrice && (
                    <span className="font-body text-xl text-muted-foreground line-through">
                      {currencySymbol}{originalDisplayPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="font-display text-3xl text-foreground">
                    {currencySymbol}{displayPrice.toLocaleString()}
                  </span>
                  {product.isSale && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-body">
                      Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="font-body text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Stock Availability */}
                <div className="mb-8 p-4 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${product.quantity === 0
                        ? "bg-red-500"
                        : product.quantity < 10
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-green-500"
                        }`} />
                      <div>
                        <p className="font-body text-sm font-medium text-foreground">
                          {product.quantity === 0
                            ? "Out of Stock"
                            : product.quantity < 10
                              ? `Only ${product.quantity} left in stock!`
                              : "In Stock"}
                        </p>
                        {product.quantity > 0 && product.quantity < 10 && (
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            Order soon before it's gone
                          </p>
                        )}
                        {product.quantity >= 10 && (
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            {product.quantity} units available
                          </p>
                        )}
                      </div>
                    </div>
                    {product.quantity > 0 && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <p className="font-body text-sm text-foreground mb-3">
                    Color: <span className="text-muted-foreground">{selectedColor.name}</span>
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color: any) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor.name === color.name
                          ? "border-foreground scale-110 shadow-lg"
                          : "border-transparent"
                          }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.name}
                      >
                        {selectedColor.name === color.name && (
                          <Check className={`w-4 h-4 ${color.hex === "#FFFFFF" || color.hex.toLowerCase() === "#fff" ? "text-foreground" : "text-white"}`} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-8">
                  <p className="font-body text-sm text-foreground mb-3">Size</p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size: string) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-sm font-body transition-all ${selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground hover:shadow-md"
                          }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <p className="font-body text-sm text-foreground mb-3">Quantity</p>
                  <div className="flex items-center border border-border w-fit">
                    <motion.button
                      whileHover={{ backgroundColor: "hsl(var(--secondary))" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 transition-colors"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="px-6 font-body">{quantity}</span>
                    <motion.button
                      whileHover={{ backgroundColor: "hsl(var(--secondary))" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="p-3 transition-colors"
                      aria-label="Increase quantity"
                      disabled={quantity >= product.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  {quantity >= product.quantity && product.quantity > 0 && (
                    <p className="font-body text-xs text-yellow-600 mt-2">
                      Maximum available quantity selected
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <motion.div className="flex-1" whileHover={{ scale: product.quantity > 0 ? 1.02 : 1 }} whileTap={{ scale: product.quantity > 0 ? 0.98 : 1 }}>
                    <Button
                      variant="luxury"
                      size="lg"
                      className="w-full"
                      onClick={handleInquiry}
                      disabled={product.quantity === 0}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {product.quantity === 0 ? "Out of Stock" : "Send Inquiry"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleAddToWishlist}
                      className={isInWishlist(product.id) ? "text-primary border-primary" : ""}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? "fill-primary" : ""
                          }`}
                      />
                      {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
                    </Button>
                  </motion.div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
                  {[
                    { icon: Truck, text: "Free Shipping" },
                    { icon: Shield, text: "Secure Payment" },
                    { icon: RotateCcw, text: "Easy Returns" },
                  ].map((badge, idx) => (
                    <motion.div
                      key={idx}
                      className="text-center"
                      whileHover={{ y: -4 }}
                    >
                      <badge.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="font-body text-xs text-muted-foreground">{badge.text}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Product Details */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-display text-lg text-foreground mb-4">Product Details</h3>
                  <ul className="space-y-2 mb-6">
                    {product.details.map((detail: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <p className="font-body text-sm text-muted-foreground">
                    <strong className="text-foreground">Fabric:</strong> {product.fabric}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    <strong className="text-foreground">SKU:</strong> {product.sku}
                  </p>
                </div>

                {/* Care Instructions */}
                <div className="pt-6 mt-6 border-t border-border">
                  <h3 className="font-display text-lg text-foreground mb-4">Care Instructions</h3>
                  <ul className="space-y-2">
                    {product.careInstructions.map((instruction: string, idx: number) => (
                      <li key={idx} className="font-body text-sm text-muted-foreground">
                        • {instruction}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reviews Section - Desktop and Mobile */}
                <div className="mt-8 pt-6 border-t border-border">
                  <ReviewsSection productReviews={reviews} />
                </div>

                {/* Review Form - Mobile Only (appears after reviews) */}
                <div className="mt-8 lg:hidden">
                  <ReviewForm
                    onSubmit={handleAddReview}
                    initialData={user ? { name: user.name, email: user.email } : undefined}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section >

        {/* Related Products */}
        {
          relatedProducts.length > 0 && (
            <section className="py-12 md:py-16 lg:py-20 bg-secondary/30">
              <div className="container mx-auto px-6 md:px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8 md:mb-10 lg:mb-12"
                >
                  <p className="font-accent text-xs md:text-sm tracking-[0.3em] text-primary mb-3 md:mb-4">
                    YOU MAY ALSO LIKE
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground">
                    Related Products
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {relatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </div>
            </section>
          )
        }
      </main >
      <Footer />
      <BackToTop />
      <FloatingContactButton />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        product={product ? {
          id: product.id,
          name: product.name,
          price: product.price,
          priceINR: product.priceINR,
          image: product.image,
          category: product.category,
          size: selectedSize,
          color: selectedColor.name,
          quantity,
        } : { id: '0', name: '', price: 0, priceINR: 0, image: '', category: '', size: '', color: '', quantity: 0 }}
        currency={currency}
      />
    </>
  );
};

export default ProductDetail;
