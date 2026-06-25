import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const staticCollections = [
  {
    id: 1,
    name: "Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    count: 48,
    slug: "sarees"
  },
  {
    id: 2,
    name: "Lehengas",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80",
    count: 32,
    slug: "lehengas"
  },
  {
    id: 3,
    name: "Anarkalis",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    count: 24,
    slug: "anarkalis"
  },
  {
    id: 4,
    name: "Indo-Western",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    count: 36,
    slug: "indo-western"
  },
];

const CategorySection = () => {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Fetch real collections created in Admin
        const res = await api.collections.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((col: any) => ({
            id: col.id,
            name: col.name,
            // Handle various image field names or fallback
            image: col.image || col.image_url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
            count: col.products || col.product_count || 0,
            slug: col.slug
          }));

          setCollections(mapped);
        } else {
          // If empty, we might want to show nothing or fallback. 
          // For now, fallback to static if absolutely nothing exists, 
          // but if user created 1 collection, we should probably just show that 1.
          // If the user says "uploaded all... but not show", maybe api returned empty? 
          // But we will start with null and only fallback if API fails or returns explicitly empty.
          if (res.success && res.data?.length === 0) {
            // Determine if we should show 'No collections' or static. 
            // Usually static is for demo.
            setCollections(staticCollections);
          } else {
            setCollections(staticCollections);
          }
        }
      } catch (error) {
        console.error("Failed to load collections", error);
        setCollections(staticCollections);
      }
    };

    fetchCollections();
  }, []);

  const displayCollections = collections.length > 0 ? collections : staticCollections;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">EXPLORE</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">Our Collections</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/shop?collection=${collection.slug || collection.name.toLowerCase()}`}
                className="group block relative overflow-hidden aspect-[3/4]"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-background mb-1">{collection.name}</h3>
                  <p className="font-body text-sm text-background/70">{collection.count} Products</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
