import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "@/data/reviews";

interface ReviewFormProps {
    onSubmit: (review: { name: string; email: string; title: string; rating: number; text: string }) => void;
    initialData?: { name: string; email: string };
}

const ReviewForm = ({ onSubmit, initialData }: ReviewFormProps) => {
    const [newReview, setNewReview] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        title: "",
        text: "",
        rating: 5
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.name || !newReview.text || !newReview.email) return;

        onSubmit({
            name: newReview.name,
            email: newReview.email,
            title: newReview.title,
            rating: newReview.rating,
            text: newReview.text,
        });

        setNewReview({ ...newReview, title: "", text: "", rating: 5 });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto bg-background/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-lg border border-primary/10"
        >
            <div className="text-center mb-6 md:mb-8">
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">Share Your Experience</h3>
                <p className="font-body text-xs md:text-sm text-muted-foreground">We value your feedback. Let us know what you think!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="flex flex-col items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <label className="text-xs md:text-sm font-medium text-foreground uppercase tracking-widest font-accent">Rate Product</label>
                    <div className="flex gap-2 md:gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="focus:outline-none transform hover:scale-110 active:scale-95 transition-transform"
                            >
                                <Star
                                    className={`w-7 h-7 md:w-8 md:h-8 ${star <= newReview.rating ? "fill-primary text-primary drop-shadow-md" : "text-border"}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 ml-1">Your Name</label>
                            <input
                                type="text"
                                required
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-sm md:text-base placeholder:text-muted-foreground/50"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 ml-1">Your Email</label>
                            <input
                                type="email"
                                required
                                value={newReview.email}
                                onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-sm md:text-base placeholder:text-muted-foreground/50"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 ml-1">Review Headline</label>
                        <input
                            type="text"
                            value={newReview.title}
                            maxLength={80}
                            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-sm md:text-base placeholder:text-muted-foreground/50"
                            placeholder="Example: Great quality, fits perfectly!"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Review</label>
                            <span className="text-[10px] text-muted-foreground/60">{newReview.text.length}/500</span>
                        </div>
                        <textarea
                            required
                            value={newReview.text}
                            maxLength={500}
                            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-sm md:text-base placeholder:text-muted-foreground/50 h-32 md:h-36 resize-none"
                            placeholder="Tell us about the quality, fit, and style..."
                        />
                    </div>
                </div>

                <Button type="submit" variant="luxury" size="lg" className="w-full mt-4 text-sm md:text-base">
                    Submit Review
                </Button>
            </form>
        </motion.div>
    );
};

export default ReviewForm;
