import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Grid, List, X, Search, Mic, MicOff, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { allProducts, Product } from "@/data/products";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCollections, setDynamicCollections] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // Type definitions for SpeechRecognition
  interface SpeechRecognitionEvent {
    results: {
      [index: number]: {
        [index: number]: { transcript: string };
      };
    };
  }

  // Initial setup
  useEffect(() => {
    // @ts-expect-error - SpeechRecognition fallback
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
    }
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await api.collections.getAll();
      if (res.success && Array.isArray(res.data)) {
        setDynamicCollections([{ id: 'all', name: 'All', slug: 'all' }, ...res.data]);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const collectionSlug = searchParams.get("collection");
      let res;
      let isCollection = false;

      if (collectionSlug && collectionSlug !== 'all') {
        res = await api.collections.getBySlug(collectionSlug);
        isCollection = true;
      } else {
        res = await api.products.getAll({ limit: 200 });
      }

      if (res.success && res.data) {
        const rawProducts = isCollection && res.data.collection_products
          ? res.data.collection_products
          : (Array.isArray(res.data) ? res.data : []);

        const mappedProducts = rawProducts.map((p: any) => ({
          ...p,
          id: String(p.id),
          image: p.primary_image || (p.images && p.images[0] ? p.images[0].image_url : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80"),
          priceINR: Number(p.price_inr) || Number(p.price) * 83,
          category: p.category_name || "Style",
          isNew: Number(p.new_arrival) === 1,
        }));

        setProducts(mappedProducts);
      } else {
        setProducts(allProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Filter and sort products
  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "newest": filtered.sort((a, b) => Number(b.id) - Number(a.id)); break;
      case "rating": filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }

    setFilteredProducts(filtered);
  }, [priceRange, sortBy, searchQuery, products]);

  useEffect(() => {
    const timer = setTimeout(filterProducts, 100);
    return () => clearTimeout(timer);
  }, [filterProducts]);

  const toggleVoiceSearch = () => {
    // @ts-expect-error - SpeechRecognition fallback
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setSearchQuery(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 20000]);
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchParams.get("collection") !== null,
    priceRange[0] > 0 || priceRange[1] < 20000,
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  const currentCollection = searchParams.get("collection") || "all";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="pt-32 md:pt-48 pb-12 md:pb-24 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-accent text-xs md:text-sm tracking-[0.3em] text-primary mb-4"
            >
              {currentCollection !== 'all' ? "COLLECTION" : "EXPLORE"}
            </motion.p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tight capitalize">
              {currentCollection !== 'all' ? currentCollection.replace(/-/g, ' ') : "Our Shop"}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
              <p className="font-body text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredProducts.length}</span> Products
              </p>

              <div className="hidden lg:flex relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10 pr-10 bg-secondary/20 border-none rounded-xl"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {voiceSupported && (
                  <button onClick={toggleVoiceSearch} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isListening ? "bg-primary text-white animate-pulse" : "text-muted-foreground"}`}>
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="mb-8">
                <h4 className="font-display text-sm mb-4">Collections</h4>
                <div className="space-y-1">
                  {dynamicCollections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setSearchParams(col.slug === 'all' ? {} : { collection: col.slug })}
                      className={`block w-full text-left py-2 px-3 text-sm rounded-md transition-all ${currentCollection === col.slug ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-display text-sm mb-4">Price Range</h4>
                <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={20000} step={100} className="mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <Button variant="outline" className="w-full" onClick={clearFilters}>Clear Filters</Button>
              )}
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl mb-2">No products found</h3>
                  <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background p-6 overflow-y-auto lg:hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-display">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></Button>
            </div>

            <div className="mb-8">
              <h4 className="font-display mb-4">Search</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10 pr-10 bg-secondary/20 border-none rounded-xl h-12"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {voiceSupported && (
                  <button onClick={toggleVoiceSearch} className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full ${isListening ? "bg-primary text-white animate-pulse" : "text-muted-foreground"}`}>
                    <Mic className="w-5 h-5 mx-0" />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-display mb-4">Collections</h4>
              <div className="grid grid-cols-2 gap-2">
                {dynamicCollections.map((col) => (
                  <Button
                    key={col.id}
                    variant={currentCollection === col.slug ? "luxury" : "outline"}
                    className="justify-start h-auto py-2"
                    onClick={() => setSearchParams(col.slug === 'all' ? {} : { collection: col.slug })}
                  >
                    {col.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-display mb-4">Price Range</h4>
              <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={20000} step={100} className="mb-4" />
              <div className="flex justify-between font-body">
                <span className="bg-secondary px-2 py-1 rounded">${priceRange[0]}</span>
                <span className="bg-secondary px-2 py-1 rounded">${priceRange[1]}</span>
              </div>
            </div>

            <Button className="w-full h-12" variant="luxury" onClick={() => setShowFilters(false)}>Show {filteredProducts.length} Results</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </>
  );
};

export default Shop;
