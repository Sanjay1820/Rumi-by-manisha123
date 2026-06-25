import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";

const RefundPolicy = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-24 md:pt-32 lg:pt-48 pb-12 md:pb-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-accent text-xs md:text-sm tracking-[0.3em] text-primary mb-3 md:mb-4">LEGAL</p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground uppercase break-words">Refund Policy</h1>
              <p className="font-body text-sm md:text-base text-muted-foreground mt-3 md:mt-4">Last updated: 26th September 2025</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
            <div className="font-body text-sm md:text-base text-muted-foreground space-y-6 md:space-y-8 leading-relaxed">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary/5 border border-primary/20 p-4 md:p-6 rounded-xl text-foreground text-center mx-auto"
              >
                <p className="font-bold text-base md:text-lg">Important — ALL SALES ARE FINAL.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p>
                  Rumi By Manisha does not accept returns, exchanges, or standard refunds. By placing an order with
                  Rumi By Manisha, you acknowledge and agree that your purchase is final unless one of the narrow
                  exceptions below applies.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-xl sm:text-2xl text-foreground mb-3 md:mb-4">1. NO RETURNS, NO EXCHANGES, NO CANCELLATIONS</h2>
                <ul className="list-disc pl-5 md:pl-6 space-y-3 md:space-y-4">
                  <li>
                    <strong className="text-foreground">All sales are final.</strong> We do not offer returns,
                    exchanges, or order cancellations for change of mind, sizing issues, or buyer’s remorse.
                  </li>
                  <li>
                    Items marked "final sale" or "clearance" are also final and non-returnable.
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-xl sm:text-2xl text-foreground mb-3 md:mb-4">2. DAMAGED OR DEFECTIVE ITEMS (EXCEPTION)</h2>
                <p className="mb-3 md:mb-4">
                  We will only consider replacement or refund for items that are <strong className="text-foreground">damaged or defective on arrival</strong>.
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-3 md:space-y-4">
                  <li>
                    To request review for a damaged/defective item, contact us within 1 day of delivery at
                    <a href="mailto:hello@rumibymanisha.com" className="text-primary hover:underline ml-1 break-all">hello@rumibymanisha.com</a> with:
                    <ul className="list-circle pl-5 md:pl-6 mt-2 space-y-1 text-sm">
                      <li>Your order number</li>
                      <li>Clear photos showing the damage/defect (include at least one photo of the item as received and one of the packaging)</li>
                      <li>A short description of the issue</li>
                    </ul>
                  </li>
                  <li>Do not discard the original packaging until the claim is resolved.</li>
                  <li>
                    Do not return items without explicit authorization. If return shipping is required, we will
                    provide instructions and, where appropriate, a prepaid return label.
                  </li>
                  <li>
                    After we receive your claim and supporting photos, we will investigate and respond within
                    a reasonable time. If we determine the item is damaged/defective, we will — at our discretion — offer a replacement (if available).
                  </li>
                  <li>
                    If we determine the item is not damaged/defective or the claim is outside the permitted
                    window, we reserve the right to deny the claim.
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-xl sm:text-2xl text-foreground mb-3 md:mb-4">3. CANCELLATIONS</h2>
                <p>
                  Because all sales are final, cancellations are not permitted once an order is placed.
                  If you believe your order was placed in error, contact
                  <a href="mailto:hello@rumibymanisha.com" className="text-foreground font-bold hover:underline mx-1 break-all">hello@rumibymanisha.com</a>
                  immediately — we may be able to help if the order has not yet been processed, but this is not guaranteed.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-xl sm:text-2xl text-foreground mb-3 md:mb-4">4. SHIPPING COSTS</h2>
                <p>
                  Shipping costs for standard orders are non-refundable unless the return is authorized
                  due to our error or an approved damaged/defective claim.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-xl sm:text-2xl text-foreground mb-3 md:mb-4">5. HOW TO CONTACT US</h2>
                <p className="font-bold text-foreground mb-1">Rumi By Manisha</p>
                <p>Email: <a href="mailto:hello@rumibymanisha.com" className="text-primary hover:underline break-all">hello@rumibymanisha.com</a></p>
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

export default RefundPolicy;
