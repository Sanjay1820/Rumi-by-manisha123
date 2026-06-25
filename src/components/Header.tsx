import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, User, LogOut } from "lucide-react";
import SearchModal from "./SearchModal";
import { useInquiry } from "@/contexts/InquiryContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const { wishlistItems } = useInquiry();
  const { user, isAuthenticated, logout } = useAuth();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-soft py-2"
          : "bg-transparent py-4 md:py-8"
          }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          {/* Row 1: Mobile Menu, Logo, and Icons */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Button (md:hidden) / Empty space for balancing on desktop */}
            <div className="flex-1 md:hidden">
              <button
                className={`p-2.5 transition-colors ${isScrolled || (!isHomePage && window.scrollY <= 50) ? "text-foreground" : isHomePage ? "text-white" : "text-foreground"
                  } hover:text-primary transition-colors`}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>

            {/* Hidden on mobile, Flex-1 on desktop to balance icons */}
            <div className="hidden md:block flex-1" />

            {/* Center: Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center"
              >
                <h1 className={`font-display font-medium tracking-wide transition-all duration-500 ${isScrolled
                  ? "text-2xl md:text-3xl"
                  : "text-3xl md:text-5xl"
                  } ${isScrolled || !isHomePage ? "text-foreground" : "text-white"}`}>
                  RUMI
                </h1>
                <p className={`font-accent tracking-[0.3em] transition-all duration-500 ${isScrolled
                  ? "text-[11px]"
                  : "text-[13px]"
                  } ${isScrolled || !isHomePage ? "text-foreground/80" : "text-white/90"} -mt-1`}>
                  By Manisha
                </p>
              </motion.div>
            </Link>

            {/* Right: Icons */}
            <div className="flex-1 flex items-center justify-end space-x-1 sm:space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 transition-colors duration-300 ${isScrolled || !isHomePage ? "text-foreground" : "text-white"
                  } hover:text-primary`}
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </motion.button>

              <Link
                to="/wishlist"
                className={`p-2.5 transition-colors duration-300 relative ${isScrolled || !isHomePage ? "text-foreground" : "text-white"
                  } hover:text-primary`}
                aria-label="Wishlist"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Heart className="w-6 h-6" />
                </motion.div>
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 p-2.5 transition-colors duration-300 ${isScrolled || !isHomePage ? "text-foreground" : "text-white"
                    } hover:text-primary`}
                  aria-label="Profile"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${isScrolled || !isHomePage ? "bg-primary/10 border-primary/20" : "bg-white/10 border-white/20"
                      }`}
                  >
                    <span className={`font-body text-sm font-medium ${isScrolled || !isHomePage ? "text-primary" : "text-white"}`}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`p-2.5 transition-colors duration-300 ${isScrolled || !isHomePage ? "text-foreground" : "text-white"
                    } hover:text-primary`}
                  aria-label="Account"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <User className="w-6 h-6" />
                  </motion.div>
                </Link>
              )}
            </div>
          </div>

          {/* Row 2: Desktop Navigation (Center aligned) */}
          <nav className={`hidden md:flex items-center justify-center space-x-12 overflow-hidden transition-all duration-500 ${isScrolled ? "max-h-16 opacity-100 mt-2 py-1" : "max-h-24 opacity-100 mt-8"
            }`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-body font-medium tracking-[0.2em] uppercase transition-all duration-500 ${isScrolled ? "text-[11px]" : "text-[14px]"} ${location.pathname === link.path
                  ? "text-primary"
                  : isScrolled || !isHomePage ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
                  }`}
              >
                <motion.span whileHover={{ y: -2 }} className="inline-block">
                  {link.name}
                </motion.span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background z-50 shadow-elegant"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h1 className="font-display text-2xl font-medium tracking-wide text-foreground">
                      RUMI
                    </h1>
                    <p className="font-accent text-[10px] tracking-[0.3em] text-muted-foreground">
                      by Manisha
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-foreground hover:text-primary transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <nav className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block font-body text-lg tracking-[0.1em] uppercase transition-colors duration-300 ${location.pathname === link.path
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                          }`}
                      >
                        <motion.span whileHover={{ x: 8 }} className="inline-block">
                          {link.name}
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
