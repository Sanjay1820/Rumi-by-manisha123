import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, ShoppingBag, ShieldCheck, KeyRound, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { sendAdminOTPEmail } from "@/lib/emailService";
import { toast } from "sonner";

const AdminLogin = () => {
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAdmin();
    const navigate = useNavigate();

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleLoginStep = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Simple check for demo (admin/admin123)
        if (username === "admin" && password === "admin123") {
            const newOtp = generateOTP();
            setGeneratedOtp(newOtp);

            try {
                await sendAdminOTPEmail(newOtp);
                setStep(2);
                toast.success("Security code sent to rumibymanisha100@gmail.com");
            } catch (err) {
                console.error("OTP Error:", err);
                setError("Failed to send security code. Please check your connection.");
            }
        } else {
            setError("Invalid credentials. Try admin / admin123");
        }
        setIsSubmitting(false);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (otpInput === generatedOtp) {
            login(username, password); // Log in via context
            toast.success("Login Successful!");
            navigate("/admin/dashboard");
        } else {
            setError("Invalid security code. Please try again.");
        }
        setIsSubmitting(false);
    };

    const resendOTP = async () => {
        setIsSubmitting(true);
        const newOtp = generateOTP();
        setGeneratedOtp(newOtp);
        try {
            await sendAdminOTPEmail(newOtp);
            toast.success("New security code sent!");
            setOtpInput("");
            setError("");
        } catch (err) {
            setError("Failed to resend. Please try again later.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c5a059 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            {/* Animated Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#1a1d23]/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 p-8">
                    {/* Logo & Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 mb-6 group"
                        >
                            <ShoppingBag className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                        </motion.div>
                        <h1 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">RUMI <span className="text-primary">Admin</span></h1>
                        <p className="font-body text-sm text-gray-400">
                            {step === 1 ? "Secure access to boutique management" : "Enter the security code sent to you"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLoginStep}
                                className="space-y-6"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-primary" />
                                        <Input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="pl-12 bg-black/40 border-white/10 text-white h-12 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                                            placeholder="Enter username"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-primary" />
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 bg-black/40 border-white/10 text-white h-12 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    variant="luxury"
                                    size="lg"
                                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /> : "Request Access Code"}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOtp}
                                className="space-y-6"
                            >
                                <div className="space-y-1.5 text-center">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                            <ShieldCheck className="w-8 h-8 text-primary" />
                                        </div>
                                    </div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">6-Digit OTP Code</label>
                                    <div className="relative group mt-2">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-primary" />
                                        <Input
                                            type="text"
                                            maxLength={6}
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                            className="pl-12 bg-black/40 border-white/10 text-white h-14 text-center text-2xl tracking-[0.5em] font-bold focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                                            placeholder="000000"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide">Enter the code sent to your Gmail</p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        variant="luxury"
                                        size="lg"
                                        className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Verify & Login <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={resendOTP}
                                        disabled={isSubmitting}
                                        className="w-full text-xs text-primary/60 hover:text-primary transition-colors flex items-center justify-center gap-2 py-2"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                                        Resend security code
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Footer Info */}
                    <div className="mt-10 pt-6 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2">Authenticated Session</p>
                            <div className="text-[10px] text-gray-600">
                                Protected by RUMI Enterprise Security
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
