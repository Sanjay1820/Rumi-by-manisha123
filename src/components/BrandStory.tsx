import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BrandStory = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80"
                alt="Our Atelier"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-primary/30 -z-10" />
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary/30 -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">OUR STORY</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight uppercase">
              Ishq in every
              <br />
              <span className="italic">thread</span>
            </h2>
            <div className="space-y-6 text-muted-foreground font-body leading-relaxed text-lg italic">
              <p>
                "What began in the heart of my home in Mississauga has grown into a space where every woman is celebrated. At RUMI, we weave Ishq in Every Thread, love that transforms moments into memories."
              </p>
              <p className="text-base not-italic">
                From personalized styling to perfect alterations, we ensure you truly love the outfit you choose. RUMI – Where Noor Lights, Ishq Inspires, and Rooh Delights.
              </p>
            </div>
            <div className="mt-10">
              <Button asChild variant="luxury" size="lg">
                <Link to="/about">Discover More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
