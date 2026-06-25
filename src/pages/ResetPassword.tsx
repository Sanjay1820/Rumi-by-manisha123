import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // In demo mode, we accept any token
    // In production, you would validate the token against your database
    if (!token && !email) {
      // For demo purposes, still allow access
      setIsValidToken(true);
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In demo mode, update password in localStorage if email is provided
    if (email) {
      const users = JSON.parse(localStorage.getItem("rumi_users") || "[]");
      const updatedUsers = users.map((u: { email: string;[key: string]: unknown }) =>
        u.email === email ? { ...u, password } : u
      );
      localStorage.setItem("rumi_users", JSON.stringify(updatedUsers));
    }

    setIsLoading(false);
    setIsSuccess(true);
    toast.success("Password reset successfully!");
  };

  if (!isValidToken) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-background flex items-center">
          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-6 md:p-8 shadow-elegant text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="font-display text-xl md:text-2xl text-foreground mb-3">
                  Invalid or Expired Link
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link to="/forgot-password">
                  <Button variant="luxury" className="w-full">
                    Request New Link
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              {!isSuccess ? (
                <>
                  <div className="text-center mb-6 md:mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl text-foreground mb-2">
                      Reset Your Password
                    </h2>
                    <p className="font-body text-sm md:text-base text-muted-foreground">
                      Enter your new password below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-transparent pr-10"
                          placeholder="Enter new password (min 6 chars)"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-transparent pr-10"
                          placeholder="Confirm new password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Password strength indicator */}
                    <div className="space-y-2">
                      <p className="font-body text-xs text-muted-foreground">Password requirements:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${password.length >= 6 ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                          6+ characters
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${password === confirmPassword && password.length > 0 ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                          Passwords match
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="luxury"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
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
                    Password Reset Complete!
                  </h2>
                  <p className="font-body text-sm md:text-base text-muted-foreground mb-8">
                    Your password has been successfully reset. You can now log in with your new password.
                  </p>
                  <Button
                    variant="luxury"
                    className="w-full"
                    size="lg"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResetPassword;
