import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import { Truck, Clock, Globe, Package, RefreshCw, Shield } from "lucide-react";

const ShippingPolicy = () => {
  const shippingOptions = [
    {
      icon: Truck,
      title: "Standard Shipping",
      india: "₹99 (Free above ₹2,999)",
      canada: "$15 CAD (Free above $150)",
      time: "5-7 business days (India) | 10-14 days (International)",
    },
    {
      icon: Clock,
      title: "Express Shipping",
      india: "₹299",
      canada: "$35 CAD",
      time: "2-3 business days (India) | 5-7 days (International)",
    },
    {
      icon: Globe,
      title: "International Express",
      india: "N/A",
      canada: "$55 CAD",
      time: "3-5 business days worldwide",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 md:pt-48 pb-12 md:pb-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">INFORMATION</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground">Shipping Policy</h1>
            </motion.div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Shipping Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl text-foreground mb-8">Shipping Options</h2>
              <div className="grid gap-6">
                {shippingOptions.map((option) => (
                  <div
                    key={option.title}
                    className="border border-border p-6 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <option.icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-foreground mb-2">{option.title}</h3>
                      <div className="grid md:grid-cols-3 gap-2 text-sm font-body text-muted-foreground">
                        <p><span className="text-foreground">India:</span> {option.india}</p>
                        <p><span className="text-foreground">Canada/USA:</span> {option.canada}</p>
                        <p><span className="text-foreground">Delivery:</span> {option.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl text-foreground mb-6">Delivery Information</h2>
              <div className="prose prose-neutral max-w-none">
                <div className="font-body text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">Processing Time:</strong> All orders are processed within 1-2 business days.
                    Custom orders may take 5-7 additional business days for preparation.
                  </p>
                  <p>
                    <strong className="text-foreground">Tracking:</strong> Once your order ships, you'll receive a tracking number
                    via email. You can track your package through our website or the carrier's site.
                  </p>
                  <p>
                    <strong className="text-foreground">Customs & Duties:</strong> International orders may be subject to customs
                    duties and taxes. These charges are the responsibility of the recipient and are not included in our prices.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Returns & Exchanges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl text-foreground mb-6">Returns & Exchanges</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-border p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-lg text-foreground mb-2">14-Day Returns</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Return unworn items within 14 days for a full refund
                  </p>
                </div>
                <div className="border border-border p-6 text-center">
                  <Package className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-lg text-foreground mb-2">Easy Exchanges</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Exchange for a different size or style at no extra cost
                  </p>
                </div>
                <div className="border border-border p-6 text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-lg text-foreground mb-2">Quality Guarantee</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Defective items replaced free within 30 days
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Return Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl text-foreground mb-6">Return Conditions</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>To be eligible for a return, items must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be unworn and in original condition</li>
                  <li>Have all original tags attached</li>
                  <li>Be returned in the original packaging</li>
                  <li>Not be customized or personalized items</li>
                  <li>Not be intimate apparel or blouses (for hygiene reasons)</li>
                </ul>
                <p className="mt-6">
                  <strong className="text-foreground">Refund Processing:</strong> Once we receive and inspect your return,
                  refunds will be processed within 5-7 business days. The amount will be credited to your original payment method.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </>
  );
};

export default ShippingPolicy;
