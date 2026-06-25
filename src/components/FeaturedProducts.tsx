import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const fallbackProducts = [
  {
    id: "1",
    name: "Silk Banarasi Saree",
    price: 299,
    priceINR: 17940,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    category: "Sarees",
    isNew: true,
  },
  {
    id: "2",
    name: "Embroidered Lehenga",
    price: 549,
    priceINR: 32940,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80",
    category: "Lehengas",
  },
  {
    id: "3",
    name: "Designer Anarkali",
    price: 199,
    priceINR: 11940,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    category: "Anarkalis",
    isSale: true,
    originalPrice: 249,
  },
  {
    id: "4",
    name: "Chanderi Suit Set",
    price: 179,
    priceINR: 10740,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    category: "Suits",
    isNew: true,
  },
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Try to fetch new arrivals from database
      const response = await api.products.getNewArrivals(8);

      if (response.success && response.data && response.data.length > 0) {
        // Map database products to component format
        const mappedProducts = response.data.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          priceINR: p.price_inr || p.price * 83,
          image: p.primary_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
          category: p.category_name || "Products",
          isNew: p.new_arrival === 1,
          isSale: p.compare_price && p.compare_price > p.price,
          originalPrice: p.compare_price,
          slug: p.slug,
        }));
        setProducts(mappedProducts.slice(0, 4)); // Show top 4 products as requested
      } else {
        // Fallback to static data if no featured products in database
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      // Fallback to static data on error
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">CURATED FOR YOU</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">New Arrivals</h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/shop">View All Products</Link>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
