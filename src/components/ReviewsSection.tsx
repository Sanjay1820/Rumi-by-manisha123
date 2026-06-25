import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review, reviewsByProductId } from "@/data/reviews";

interface ReviewsSectionProps {
  productReviews?: Review[];
}

const ReviewsSection = ({ productReviews }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState(productReviews || reviewsByProductId["default"]);

  // Sync reviews when product changes
  useEffect(() => {
    setReviews(productReviews || reviewsByProductId["default"]);
  }, [productReviews]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoplay);
  }, [emblaApi, isPaused]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="py-12 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4">TESTIMONIALS</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Customer Reviews</h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto mb-12">
          {/* Navigation Buttons (Desktop) */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div
            className="overflow-hidden p-4"
            ref={emblaRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex -ml-4 md:-ml-8 cursor-grab active:cursor-grabbing">
              {reviews.map((review, index) => (
                <div
                  key={reviews[index].id}
                  className="flex-[0_0_100%] lg:flex-[0_0_50%] min-w-0 pl-4 md:pl-8"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-background/50 backdrop-blur-sm p-8 md:p-12 shadow-elegant hover:shadow-2xl transition-all duration-500 rounded-2xl border border-primary/10 flex flex-col items-center text-center justify-between group"
                  >
                    <div className="flex flex-col items-center">
                      <Quote className="w-10 h-10 text-primary/20 mb-6 group-hover:text-primary/40 transition-colors" />

                      {/* Stars */}
                      <div className="flex gap-1.5 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`}
                          />
                        ))}
                      </div>

                      {/* Title */}
                      {(review.title) && (
                        <h4 className="font-display text-lg md:text-xl text-primary font-bold mb-3 tracking-tight">
                          {review.title}
                        </h4>
                      )}

                      <p className="font-display text-lg md:text-xl text-foreground leading-relaxed mb-8 italic tracking-wide">
                        "{review.comment || review.text}"
                      </p>
                    </div>

                    <div className="pt-6 border-t border-primary/10 w-full flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-display text-lg text-foreground tracking-wider">{review.author_name || review.name}</p>
                        {!!review.verified_purchase && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                            Verified Buyer
                          </div>
                        )}
                      </div>
                      {(review.location || review.product_name) && (
                        <p className="font-body text-sm text-muted-foreground">{review.location || review.product_name}</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex
                  ? "bg-primary w-8"
                  : "bg-primary/20 hover:bg-primary/40"
                  }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Navigation Buttons (Below carousel) */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
