import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  id: number;
  image: string;
}

const banners: Banner[] = [
  { id: 1, image: "/banners/banner1.jpeg" },
  { id: 2, image: "/banners/banner2.jpeg" },
  { id: 3, image: "/banners/banner3.jpeg" },
  { id: 4, image: "/banners/banner4.jpeg" },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[85vh] lg:h-screen overflow-hidden bg-black">
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
              className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
              style={{ backgroundImage: `url(${banners[currentIndex].image})` }}
            >
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
