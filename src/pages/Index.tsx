import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import InstagramFeed from "@/components/InstagramFeed";
import { motion } from "framer-motion";

const Index = () => {

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main>
          <HeroSection />
          <CategorySection />
          <FeaturedProducts />
          <BrandStory />
          <InstagramFeed />
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
