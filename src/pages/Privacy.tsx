import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";

const Privacy = () => {
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
              <h1 className="font-display text-4xl md:text-5xl text-foreground uppercase">Privacy Policy</h1>
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
                  At Rumi by Manisha, we are committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your information when you visit
                  our website or make a purchase.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">2. Information We Collect</h2>
                <p className="mb-4">We collect information that you provide directly to us:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Personal Information:</strong> Name, email, phone number, shipping address</li>
                  <li><strong className="text-foreground">Payment Information:</strong> Credit card details (processed securely by payment providers)</li>
                  <li><strong className="text-foreground">Account Information:</strong> Username, password, order history</li>
                  <li><strong className="text-foreground">Communication:</strong> Emails, customer support inquiries, reviews</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">3. Automatic Information</h2>
                <p className="mb-4">We automatically collect certain information when you visit our website:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and device information</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">4. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Detect and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">5. Information Sharing</h2>
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Service Providers:</strong> Payment processors, shipping carriers, email services</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p className="mt-4">We do not sell your personal information to third parties.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">6. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information. All payment
                  transactions are encrypted using SSL technology. However, no method of transmission over
                  the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">7. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">8. Cookies</h2>
                <p>
                  We use cookies and similar technologies to enhance your browsing experience, analyze
                  site traffic, and personalize content. You can control cookie settings through your
                  browser preferences.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">9. Children's Privacy</h2>
                <p>
                  Our website is not intended for children under 13. We do not knowingly collect personal
                  information from children. If you believe a child has provided us with their information,
                  please contact us immediately.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl text-foreground mb-4">10. Contact Us</h2>
                <p>
                  For questions about this Privacy Policy or your personal data, contact us at:
                </p>
                <p className="mt-4">
                  <strong className="text-foreground">Email:</strong> privacy@rumibymanisha.com<br />
                  <strong className="text-foreground">Phone:</strong> +1 (647) 410-2840
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

export default Privacy;
