import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, Loader2, ChevronDown, HelpCircle, Sparkles, Package, RefreshCw, CreditCard, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import { sendContactInquiryEmail } from "@/lib/emailService";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  subject: z.string().trim().min(2, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });

  const [faqData, setFaqData] = useState<any[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [openFaqItems, setOpenFaqItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await api.faqs.getGrouped();
        if (res.success) {
          const groupedData = Object.entries(res.data).map(([category, questions]) => {
            return {
              category,
              questions: (questions as any[]).map(q => ({
                q: q.question,
                a: q.answer
              }))
            };
          });
          setFaqData(groupedData);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setFaqsLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFaq = (key: string) => {
    setOpenFaqItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);
    let apiSuccess = false;

    try {
      // 1. Send via API (if connected to real backend)
      const res = await api.inquiries.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        inquiry_type: formData.inquiryType.toLowerCase().replace(/\s+/g, '_'),
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime
      });
      apiSuccess = res.success;
    } catch (error) {
      console.error("Contact form API error:", error);
      // We don't return here because we want to try sending the email as backup
    }

    // 2. Send via EmailJS (Backup / Notification)
    try {
      await sendContactInquiryEmail(formData);

      // If API failed but EmailJS worked, we still count it as a success for the user experience
      if (!apiSuccess) {
        toast.success("Your message has been received! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "",
          subject: "",
          message: "",
          preferredDate: "",
          preferredTime: "",
        });
      }
    } catch (emailError) {
      console.error("EmailJS sending failed:", emailError);
      if (!apiSuccess) {
        toast.error("An unexpected error occurred. Please try again later or contact us directly.");
      }
    }

    if (apiSuccess) {
      toast.success("Your inquiry has been submitted successfully! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
        preferredDate: "",
        preferredTime: "",
      });
    }

    setIsSubmitting(false);

  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us Anytime",
      details: ["+1 (647) 410-2840"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["hello@rumibymanisha.com"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Sunday: 11AM - 9PM"],
    },
  ];

  const inquiryTypes = [
    "General Inquiry",
    "Product Question",
    "Bridal Consultation",
    "Custom Design Request",
    "Order Status",
    "Alteration Services",
    "Bulk/Wholesale Order",
    "Partnership Inquiry",
  ];

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM",
  ];

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const showDateTimeFields = formData.inquiryType === "Bridal Consultation" ||
    formData.inquiryType === "Custom Design Request";

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
              <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">GET IN TOUCH</p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 tracking-tight">Contact Us</h1>
              <p className="font-body text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
                We'd love to hear from you. Reach out for personalized styling advice, custom orders,
                bridal consultations, or any inquiries about our exclusive ethnic wear collections.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 order-2 lg:order-1"
              >
                <h2 className="font-display text-xl md:text-2xl text-foreground mb-6 md:mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`bg-transparent ${errors.name ? "border-destructive" : ""}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-transparent ${errors.email ? "border-destructive" : ""}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`bg-transparent ${errors.phone ? "border-destructive" : ""}`}
                        placeholder="+1 (647) 410-2840"
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Inquiry Type *
                      </label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(v) => handleSelectChange("inquiryType", v)}
                      >
                        <SelectTrigger className={`bg-transparent ${errors.inquiryType ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.inquiryType && (
                        <p className="text-xs text-destructive mt-1">{errors.inquiryType}</p>
                      )}
                    </div>
                  </div>

                  {/* Show date/time fields for consultation requests */}
                  {showDateTimeFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                    >
                      <div>
                        <label className="block font-body text-sm text-muted-foreground mb-2">
                          Preferred Date (optional)
                        </label>
                        <Input
                          name="preferredDate"
                          type="date"
                          min={getMinDate()}
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-muted-foreground mb-2">
                          Preferred Time (optional)
                        </label>
                        <Select
                          value={formData.preferredTime}
                          onValueChange={(v) => handleSelectChange("preferredTime", v)}
                        >
                          <SelectTrigger className="bg-transparent">
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block font-body text-sm text-muted-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`bg-transparent ${errors.subject ? "border-destructive" : ""}`}
                      placeholder="Brief subject of your inquiry"
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-muted-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`bg-transparent min-h-[120px] md:min-h-[150px] ${errors.message ? "border-destructive" : ""}`}
                      placeholder="Tell us about your requirements, occasion, preferences, budget range, etc."
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="luxury"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <h2 className="font-display text-xl md:text-2xl text-foreground mb-6 md:mb-8">Contact Information</h2>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-8">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex flex-col md:flex-row gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm md:text-lg text-foreground mb-1 md:mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="font-body text-xs md:text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4 uppercase">Answers</p>
              <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                Find quick answers to common questions about our services, process, and collections.
              </p>
            </motion.div>

            {faqsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-12">
                {faqData.map((category, catIdx) => (
                  <div key={category.category} className="space-y-4">
                    <h3 className="font-display text-xl md:text-2xl text-foreground border-b border-primary/20 pb-4 mb-6">
                      {category.category}
                    </h3>
                    <div className="grid gap-4">
                      {category.questions.map((item: any, qIdx: number) => {
                        const key = `${catIdx}-${qIdx}`;
                        const isOpen = openFaqItems[key];
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                          >
                            <button
                              onClick={() => toggleFaq(key)}
                              className="w-full flex items-center justify-between p-5 text-left"
                            >
                              <span className="font-body font-bold text-foreground pr-4">{item.q}</span>
                              <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5">
                                    <div className="p-4 bg-secondary/30 rounded-lg border-l-4 border-primary">
                                      <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                                        {item.a}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </>
  );
};

export default Contact;
