import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";

const Terms = () => {
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
              <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">LEGAL</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground">Terms & Conditions</h1>
              <p className="font-body text-muted-foreground mt-4">Last updated: January 2024</p>
            </motion.div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="font-body text-muted-foreground space-y-8 leading-relaxed">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">1. Introduction</h2>
                <p>
                  Welcome to Rumi by Manisha. By accessing and using our website and services, you agree
                  to be bound by these Terms and Conditions. Please read them carefully before making a purchase.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">2. Use of Website</h2>
                <p className="mb-4">By using this website, you warrant that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are at least 18 years of age or have parental consent</li>
                  <li>You will use the website for lawful purposes only</li>
                  <li>The information you provide is accurate and complete</li>
                  <li>You will not attempt to compromise the security of the website</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">3. Products & Pricing</h2>
                <p className="mb-4">
                  All products are subject to availability. We reserve the right to limit quantities or
                  discontinue products without notice. Prices are displayed in the currency appropriate
                  to your location (INR for India, CAD for Canada/International).
                </p>
                <p>
                  While we strive for accuracy, colors may appear slightly different due to monitor settings.
                  Product descriptions are for informational purposes and do not constitute a warranty.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">4. Orders & Payment</h2>
                <p className="mb-4">
                  By placing an order, you are making an offer to purchase. We reserve the right to
                  accept or decline any order. Payment must be made at the time of order placement.
                </p>
                <p>
                  We accept major credit cards, PayPal, UPI, Net Banking, and EMI options. All transactions
                  are secured with industry-standard encryption.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">5. Shipping & Delivery</h2>
                <p>
                  Shipping times are estimates and not guaranteed. We are not responsible for delays
                  caused by carriers, customs, or circumstances beyond our control. Risk of loss passes
                  to you upon delivery to the carrier.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">6. Returns & Refunds</h2>
                <p>
                  Our return policy is outlined in our Shipping Policy page. Refunds will be processed
                  within 5-7 business days after we receive and inspect returned items. Custom orders
                  and sale items may have different return conditions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">7. Intellectual Property</h2>
                <p>
                  All content on this website, including images, text, designs, and logos, is the property
                  of Rumi by Manisha and is protected by copyright laws. Unauthorized use is prohibited.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">8. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Rumi by Manisha shall not be liable for any
                  indirect, incidental, special, or consequential damages arising from your use of our
                  website or products.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">9. Governing Law</h2>
                <p>
                  These terms shall be governed by the laws of India. Any disputes shall be subject to
                  the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">10. Contact</h2>
                <p>
                  For questions about these Terms & Conditions, please contact us at
                  legal@rumibymanisha.com or call +1 (647) 410-2840.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </>
  );
};

export default Terms;
