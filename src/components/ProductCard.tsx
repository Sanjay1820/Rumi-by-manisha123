import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useInquiry } from "@/contexts/InquiryContext";
import InquiryModal from "./InquiryModal";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  priceINR: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addToWishlist, isInWishlist, currency } = useInquiry();
  const [showInquiry, setShowInquiry] = useState(false);
  const displayPrice = currency === "INR" ? (product.priceINR || product.price * 83) : product.price;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.priceINR,
      image: product.image,
      category: product.category,
    });
    toast.success("Added to wishlist");
  };

  const handleInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInquiry(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group"
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden bg-secondary aspect-[3/4] mb-4">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

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

            <motion.button
              className={`absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 ${isInWishlist(product.id) ? "bg-primary text-primary-foreground" : "opacity-0 group-hover:opacity-100"
                }`}
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </motion.button>

            <motion.div
              className="absolute bottom-4 left-4 right-4"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                className="w-full py-3 bg-background/95 backdrop-blur-sm text-foreground text-xs tracking-[0.15em] uppercase font-body opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                onClick={handleInquiry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-4 h-4 inline-block mr-2" />
                Quick Inquiry
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            className="text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
              {product.category}
            </p>
            <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating Display */}
            {product.rating && (
              <div className="flex items-center justify-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating!)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                        }`}
                    />
                  ))}
                </div>
                <span className="font-body text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              {product.originalPrice && (
                <span className="font-body text-sm text-muted-foreground line-through">
                  {currencySymbol}{currency === "INR" ? (product.originalPrice * 60).toLocaleString() : product.originalPrice}
                </span>
              )}
              <span className="font-body text-sm text-foreground font-medium">
                {currencySymbol}{displayPrice.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      <InquiryModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          priceINR: product.priceINR,
          image: product.image,
          category: product.category,
        }}
        currency={currency}
      />
    </>
  );
};

export default ProductCard;
