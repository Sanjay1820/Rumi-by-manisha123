import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import InquiryModal from "@/components/InquiryModal";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useInquiry, WishlistItem } from "@/contexts/InquiryContext";
import { toast } from "sonner";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, currency } = useInquiry();
  const currencySymbol = currency === "INR" ? "₹" : "$";
  const [showInquiry, setShowInquiry] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  const handleInquiry = (item: WishlistItem) => {
    setSelectedItem(item);
    setShowInquiry(true);
  };

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    toast.success("Removed from wishlist");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <section className="pt-32 md:pt-48 pb-12 md:pb-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">My Wishlist</h1>
              <p className="font-body text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {wishlistItems.length > 0 ? (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)" }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-card shadow-card rounded-xl transition-all"
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-24 h-48 sm:h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <p className="font-body text-xs tracking-wider text-muted-foreground uppercase mb-1">
                        {item.category}
                      </p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-display text-lg text-foreground hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="font-body text-foreground font-medium mt-2">
                        {currencySymbol}{(currency === "INR" ? item.priceINR : item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 sm:flex-none">
                        <Button
                          variant="luxury"
                          size="sm"
                          className="w-full"
                          onClick={() => handleInquiry(item)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Inquiry
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="font-display text-2xl text-foreground mb-4">Your wishlist is empty</h2>
                <p className="font-body text-muted-foreground mb-8">
                  Start adding items you love to your wishlist
                </p>
                <Button asChild variant="luxury" size="lg">
                  <Link to="/shop">Browse Collection</Link>
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />

      {selectedItem && (
        <InquiryModal
          isOpen={showInquiry}
          onClose={() => setShowInquiry(false)}
          product={selectedItem}
          currency={currency}
        />
      )}
    </>
  );
};

export default Wishlist;
