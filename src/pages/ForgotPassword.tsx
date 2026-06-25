import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call - In production, this would call an edge function
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("rumi_users") || "[]");
    const userExists = users.some((u: { email: string }) => u.email === email);

    if (!userExists) {
      // For security, don't reveal if email exists or not
      // Just show success message regardless
    }

    setIsLoading(false);
    setIsSubmitted(true);
    toast.success("Password reset instructions sent!");
  };

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-background flex items-center">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-10"
            >
              <Link to="/" className="inline-block mb-6 md:mb-8">
                <h1 className="font-display text-2xl md:text-3xl font-medium tracking-wide text-foreground">
                  RUMI
                </h1>
                <p className="font-accent text-sm md:text-base tracking-[0.3em] text-foreground/90">
                  by Manisha
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-6 md:p-8 shadow-elegant"
            >
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6 md:mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl text-foreground mb-2">
                      Forgot Password?
                    </h2>
                    <p className="font-body text-sm md:text-base text-muted-foreground">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent"
                        placeholder="Enter your email address"
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="luxury"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h2 className="font-display text-xl md:text-2xl text-foreground mb-3">
                    Check Your Email
                  </h2>
                  <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
                    We've sent password reset instructions to:
                  </p>
                  <p className="font-body text-primary font-medium mb-6">
                    {email}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mb-8">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary hover:underline"
                    >
                      try again
                    </button>
                  </p>

                  <div className="p-4 bg-muted/50 rounded-lg text-left">
                    <p className="font-body text-xs text-muted-foreground">
                      <strong>Demo Mode:</strong> This is a simulated password reset.
                      For production, enable email services to send real emails.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 font-body text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;
