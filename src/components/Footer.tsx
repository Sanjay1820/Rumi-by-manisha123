import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
  };

  return (
    <footer className="bg-background text-foreground pb-safe-bottom border-t border-primary/10">
      {/* Newsletter Section */}
      <div className="border-b border-primary/10">
        <div className="container mx-auto px-6 md:px-4 py-10 md:py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="font-display text-2xl md:text-2xl lg:text-3xl mb-4">Join Our World</h3>
            <p className="font-body text-muted-foreground mb-6 md:mb-8 text-sm md:text-sm tracking-wide leading-relaxed">
              Subscribe to receive exclusive offers, early access to new collections, and curated style inspiration.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-primary/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary rounded-sm text-sm md:text-base h-11 md:h-11 px-4"
              />
              <Button variant="hero" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base h-11 md:h-11 px-6">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-4 py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="text-center md:text-left pb-6 md:pb-0 border-b md:border-b-0 border-primary/10">
            <div className="mb-5 md:mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-medium tracking-wide">RUMI</h2>
              <p className="font-accent text-sm tracking-[0.3em] text-foreground/90 -mt-1">
                by Manisha
              </p>
            </div>
            <p className="font-body text-sm md:text-sm text-muted-foreground leading-relaxed mb-6 italic">
              "We weave Ishq in Every Thread, love that transforms moments into memories. Where Noor Lights, Ishq Inspires, and Rooh Delights."
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-11 h-11 md:w-10 md:h-10 border border-primary/20 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-foreground"
                  aria-label={`Social link ${index + 1}`}
                >
                  <social.icon className="w-5 h-5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left pb-6 md:pb-0 border-b md:border-b-0 border-primary/10">
            <h4 className="font-display text-lg md:text-lg mb-5 md:mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Shop All", path: "/shop" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="font-body text-sm md:text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-center md:text-left pb-6 md:pb-0 border-b md:border-b-0 border-primary/10">
            <h4 className="font-display text-lg md:text-lg mb-5 md:mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { name: "Refund Policy", path: "/refund-policy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="font-body text-sm md:text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="font-display text-lg md:text-lg mb-5 md:mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+16474102840" className="font-body text-sm md:text-sm text-muted-foreground hover:text-primary transition-colors">
                  +1 (647) 410-2840
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:hello@rumibymanisha.com" className="font-body text-sm md:text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                  hello@rumibymanisha.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10">
        <div className="container mx-auto px-6 md:px-4 py-5 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs md:text-xs text-muted-foreground/50 text-center md:text-left">
              © {new Date().getFullYear()} RUMI by Manisha. All rights reserved.
            </p>
            <p className="font-body text-[10px] md:text-xs text-muted-foreground/40 text-center md:text-right tracking-widest uppercase">
              Exclusively Developed by <span className="text-primary/60 font-medium">Vertex Global Tech</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
