import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Mic, MicOff, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  priceINR: number;
}

interface SpeechRecognitionResult {
  [index: number]: { transcript: string };
  length: number;
  item(index: number): { transcript: string };
}
interface SpeechRecognitionEvent {
  results: {
    [index: number]: SpeechRecognitionResult;
    length: number;
    [Symbol.iterator](): Iterator<SpeechRecognitionResult>;
  };
}
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: Event) => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<"all" | "low" | "mid" | "high">("all");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const categories = ["All", "Sarees", "Lehengas", "Anarkalis", "Suits"];
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "low", label: "Under $200" },
    { value: "mid", label: "$200 - $500" },
    { value: "high", label: "Above $500" },
  ];

  const popularSearches = [
    "Silk Sarees",
    "Designer Lehenga",
    "Bridal Collection",
    "Anarkali Suits",
    "Kanjivaram",
  ];

  // Check voice support
  useEffect(() => {
    // @ts-expect-error - SpeechRecognition is not fully standard type-wise in all environments
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';


        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result: SpeechRecognitionResult) => result[0].transcript)
            .join('');
          setSearchQuery(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Search logic
  const performSearch = useCallback(() => {
    if (!searchQuery.trim() && selectedCategory === "All" && priceRange === "all") {
      setSearchResults([]);
      return;
    }

    let results = [...allProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.fabric?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    switch (priceRange) {
      case "low":
        results = results.filter((product) => product.price < 200);
        break;
      case "mid":
        results = results.filter((product) => product.price >= 200 && product.price <= 500);
        break;
      case "high":
        results = results.filter((product) => product.price > 500);
        break;
    }

    setSearchResults(results);
  }, [searchQuery, selectedCategory, priceRange]);

  useEffect(() => {
    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [performSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleVoiceSearch = () => {
    if (!voiceSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedCategory !== "All") {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory !== "All") params.set("category", selectedCategory.toLowerCase());
      navigate(`/shop?${params.toString()}`);
      onClose();
      setSearchQuery("");
      setSelectedCategory("All");
      setPriceRange("all");
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchQuery("");
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category !== "All") {
      navigate(`/shop?category=${category.toLowerCase()}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 right-0 bg-background z-50 shadow-elegant max-h-[90vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6 md:py-8">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="font-display text-xl md:text-2xl text-foreground">Search Collection</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search products, collections, fabrics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 md:py-5 text-base md:text-lg border-b-2 border-border focus:border-primary rounded-lg bg-secondary/30 font-body"
                    />
                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={toggleVoiceSearch}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "text-muted-foreground hover:text-primary"
                          }`}
                        aria-label={isListening ? "Stop voice search" : "Start voice search"}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 md:h-14 w-12 md:w-14"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>

                {isListening && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-3 font-body text-sm text-primary"
                  >
                    🎤 Listening... Speak now
                  </motion.p>
                )}
              </form>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-secondary/30 p-4 md:p-6 rounded-lg space-y-4">
                      {/* Categories */}
                      <div>
                        <p className="font-body text-xs md:text-sm text-muted-foreground tracking-wider uppercase mb-3">
                          Categories
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleCategoryClick(cat)}
                              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-body rounded-full transition-all ${selectedCategory === cat
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-foreground hover:border-primary hover:text-primary"
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <p className="font-body text-xs md:text-sm text-muted-foreground tracking-wider uppercase mb-3">
                          Price Range
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {priceRanges.map((range) => (
                            <button
                              key={range.value}
                              onClick={() => setPriceRange(range.value as "all" | "low" | "mid" | "high")}
                              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-body rounded-full transition-all ${priceRange === range.value
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-foreground hover:border-primary hover:text-primary"
                                }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <p className="font-body text-xs md:text-sm text-muted-foreground tracking-wider uppercase mb-4">
                    {searchResults.length} Result{searchResults.length !== 1 ? "s" : ""} Found
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-h-[40vh] overflow-y-auto">
                    {searchResults.slice(0, 10).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleProductClick(product.id)}
                        className="cursor-pointer group"
                      >
                        <div className="aspect-[3/4] overflow-hidden rounded-lg mb-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-body text-xs md:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="font-body text-xs text-muted-foreground">{product.category}</p>
                        <p className="font-body text-xs md:text-sm text-foreground mt-1">${product.price}</p>
                      </motion.div>
                    ))}
                  </div>
                  {searchResults.length > 10 && (
                    <Button
                      onClick={handleSearch}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      View All {searchResults.length} Results
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </motion.div>
              )}

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="font-body text-muted-foreground">
                    No products found for "{searchQuery}"
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Try different keywords or browse categories
                  </p>
                </motion.div>
              )}

              {/* Popular Searches */}
              {!searchQuery && searchResults.length === 0 && (
                <div>
                  <p className="font-body text-xs md:text-sm text-muted-foreground tracking-wider uppercase mb-4">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {popularSearches.map((term, index) => (
                      <motion.button
                        key={term}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleQuickSearch(term)}
                        className="px-4 py-2 border border-border text-foreground hover:border-primary hover:text-primary transition-all font-body text-sm rounded-full"
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>

                  {/* Browse Categories */}
                  <div className="mt-8">
                    <p className="font-body text-xs md:text-sm text-muted-foreground tracking-wider uppercase mb-4">
                      Browse Categories
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                      {categories.filter(c => c !== "All").map((cat, index) => (
                        <motion.button
                          key={cat}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleCategoryClick(cat)}
                          className="p-4 md:p-6 bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary rounded-lg transition-all text-center group"
                        >
                          <span className="font-display text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                            {cat}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
