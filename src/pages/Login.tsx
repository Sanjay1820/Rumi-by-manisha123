import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginData.email, loginData.password);
    if (success) {
      toast.success("Login successful!");
      navigate("/profile");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const success = await register({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      address: registerData.address,
      city: registerData.city,
      pincode: registerData.pincode,
      password: registerData.password,
    });

    if (success) {
      toast.success("Account created successfully!");
      navigate("/profile");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header / Banner */}
        <section className="pt-32 md:pt-48 pb-12 md:pb-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-accent text-sm tracking-[0.3em] text-primary mb-4 uppercase">Account</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground uppercase">Login & Register</h1>
              <p className="font-body text-muted-foreground mt-4">Access your personal wardrobe and order history</p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-md mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-6 md:p-8 shadow-elegant"
            >
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
                  <TabsTrigger value="login" className="font-body text-sm md:text-base">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="font-body text-sm md:text-base">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Email or Phone
                      </label>
                      <Input
                        type="text"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="bg-transparent"
                        placeholder="Enter email or phone number"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="bg-transparent pr-10"
                          placeholder="Enter password"
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <input type="checkbox" className="rounded border-border" />
                        Remember me
                      </label>
                      <Link
                        to="/forgot-password"
                        className="font-body text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button type="submit" variant="luxury" className="w-full" size="lg">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        required
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="bg-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="bg-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        required
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="bg-transparent"
                        placeholder="+1 (647) 410-2840"
                      />
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        Indian numbers will see prices in ₹ (INR)
                      </p>
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Street Address
                      </label>
                      <Input
                        type="text"
                        required
                        value={registerData.address}
                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        className="bg-transparent"
                        placeholder="House No, Street, Landmark"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block font-body text-sm text-muted-foreground mb-2">
                          City
                        </label>
                        <Input
                          type="text"
                          required
                          value={registerData.city}
                          onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                          className="bg-transparent"
                          placeholder="Your City"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-muted-foreground mb-2">
                          PIN Code
                        </label>
                        <Input
                          type="text"
                          required
                          value={registerData.pincode}
                          onChange={(e) => setRegisterData({ ...registerData, pincode: e.target.value })}
                          className="bg-transparent"
                          placeholder="6 digits"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          required
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="bg-transparent pr-10"
                          placeholder="Create a password (min 6 chars)"
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
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="bg-transparent pr-10"
                          placeholder="Confirm your password"
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
                    <Button type="submit" variant="luxury" className="w-full" size="lg">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </>
  );
};

export default Login;
