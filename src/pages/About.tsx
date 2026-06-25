import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {

  const values = [
    {
      title: "Ishq",
      subtitle: "Love in Every Thread",
      description: "At RUMI, everything begins with love. Love for our craft, love for our culture, and love for every client who trusts us with their special moments. Every piece is chosen, styled, and tailored with genuine care and intention."
    },
    {
      title: "Adl",
      subtitle: "Fairness Without Exception",
      description: "We believe true elegance is rooted in equality. No budget is too small, no purchase too grand. Every guest is treated with the same warmth, respect, and attention."
    },
    {
      title: "Sidq",
      subtitle: "Honesty at Heart",
      description: "Transparency is our promise. From pricing to customization, we believe in clear communication and sincere guidance. What you see is what you receive, with no hidden details."
    },
    {
      title: "Noor",
      subtitle: "Light in Every Experience",
      description: "We want you to leave not just well dressed, but glowing. Noor represents the confidence and radiance you carry when you feel truly seen, understood, and celebrated."
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 md:pt-48 pb-12 md:pb-24 bg-secondary/30 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">ABOUT US</p>
                <h1 className="font-display text-4xl md:text-5xl lg:text-5xl text-foreground mb-6 leading-tight uppercase">
                  Ishq in every <br />
                  <span className="italic">thread</span>
                </h1>
                <p className="font-body text-foreground text-lg mb-6 font-medium italic">
                  Some days stay in your heart forever, the day you choose the perfect outfit and the day you wear it with pride as compliments pour in.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-8">
                  At RUMI, we weave Ishq in Every Thread, love that transforms moments into memories. We add Noor to make you shine from within and Rooh to touch the soul of every celebration. Every experience is crafted to be personal, luxurious, and unforgettable, for brides, guests, and everyone who wishes to celebrate life beautifully.
                </p>
                <Button asChild variant="luxury" size="lg">
                  <Link to="/shop">Explore Collections</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80"
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-48 h-48 border border-primary/30" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">OUR STORY</p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 uppercase">
                  Where it all <span className="italic">began</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6 font-body text-muted-foreground leading-relaxed text-lg">
                  <p>
                    RUMI began in 2025, not in a grand storefront, but in the heart of my home in Mississauga,
                    with a vision to create something more than just a shopping destination. I wanted to build
                    a space where every woman feels seen, understood, and celebrated.
                  </p>
                  <p>
                    While shopping for traditional wear myself, I often left feeling disappointed. There was
                    little guidance, no thoughtful advice on what truly suited me, and rarely any opportunity
                    for customization. The experience felt rushed and impersonal, when it should have felt special.
                  </p>
                </div>
                <div className="space-y-6 font-body text-muted-foreground leading-relaxed text-lg">
                  <p className="text-foreground font-medium italic">
                    That is when I decided to create something different.
                  </p>
                  <p>
                    At RUMI, we ensure you truly love the outfit you choose. Each piece is carefully altered
                    to your perfect fit, and we offer personalized styling guidance to help you feel confident
                    and radiant.
                  </p>
                  <p>
                    Because for us, it is never just about an outfit. It is about honoring our South Asian roots,
                    embracing individuality, and turning every occasion into a beautiful memory.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">OUR VALUES</p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">What We Stand For</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-background p-8 text-center shadow-card hover:shadow-elegant transition-all duration-300 border border-primary/5 hover:border-primary/20 group"
                >
                  <h3 className="font-display text-2xl text-primary mb-1 group-hover:scale-110 transition-transform">{value.title}</h3>
                  <p className="font-accent text-[10px] tracking-widest text-muted-foreground mb-4 uppercase">{value.subtitle}</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-12"
            >
              <div className="space-y-4">
                <p className="font-accent text-sm tracking-[0.3em] text-primary uppercase">OUR FOUNDER</p>
                <h1 className="font-display text-4xl md:text-6xl text-foreground">Meet Manisha</h1>
              </div>

              <div className="space-y-10">
                <div className="max-w-3xl mx-auto">
                  <h3 className="font-display text-2xl md:text-3xl text-foreground mb-1 font-medium">Manisha Kaushik</h3>
                  <p className="font-accent text-primary text-xs md:text-sm tracking-[0.2em] uppercase">Founder & Creative Director</p>
                </div>

                <div className="space-y-8 max-w-2xl mx-auto">
                  <p className="font-body text-muted-foreground leading-relaxed text-lg md:text-xl italic px-4">
                    Manisha believes that every piece of clothing should be more than just an outfit—it should be an experience of love. What started in the heart of her home in Mississauga has grown into a mission to bring soulful, high-quality ethnic wear to women who value individuality and tradition.
                  </p>
                  <div className="pt-10 border-t border-primary/20">
                    <p className="font-body text-foreground leading-relaxed text-xl md:text-2xl font-light italic">
                      "At RUMI By Manisha, we don't just sell clothes. We ensure you feel confident and radiant, honoring our roots while embracing who you are today."
                    </p>
                  </div>
                </div>
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

export default About;
