export interface Product {
  id: string;
  name: string;
  price: number;
  priceINR: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
  fabric: string;
  careInstructions: string[];
  sku: string;
  inStock: boolean;
  quantity: number; // Available stock quantity
  rating: number;
  reviews: number;
  new_arrival?: string | number;
}

export const allProducts: Product[] = [
  {
    id: "1",
    name: "Silk Banarasi Saree",
    price: 299,
    priceINR: 17940,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    ],
    category: "Sarees",
    description: "Exquisite handwoven Banarasi silk saree featuring intricate zari work and traditional motifs. Perfect for weddings and festive occasions. This masterpiece showcases the rich heritage of Banaras weaving traditions passed down through generations.",
    details: [
      "Handwoven pure Banarasi silk",
      "Traditional zari work with gold threads",
      "6.3 meters length with blouse piece",
      "Comes with matching petticoat",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Royal Blue", hex: "#1E3A8A" },
      { name: "Maroon", hex: "#7F1D1D" },
      { name: "Emerald Green", hex: "#047857" },
    ],
    isNew: true,
    fabric: "Pure Banarasi Silk with Zari",
    careInstructions: [
      "Dry clean only",
      "Store in muslin cloth",
      "Avoid direct sunlight",
      "Iron on low heat with cloth barrier",
    ],
    sku: "RBM-SAR-001",
    inStock: true,
    quantity: 25,
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "2",
    name: "Embroidered Lehenga",
    price: 549,
    priceINR: 32940,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    ],
    category: "Lehengas",
    description: "Stunning bridal lehenga with intricate thread embroidery and mirror work. Features a heavily embellished choli and matching dupatta. Perfect for engagement ceremonies, sangeet nights, and wedding receptions.",
    details: [
      "Heavy embroidery with mirror work",
      "Semi-stitched lehenga with adjustable waist",
      "Fully stitched blouse included",
      "Net dupatta with embroidered border",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Bridal Red", hex: "#DC2626" },
      { name: "Pink", hex: "#EC4899" },
      { name: "Gold", hex: "#D97706" },
    ],
    fabric: "Georgette with Net Dupatta",
    careInstructions: [
      "Professional dry clean recommended",
      "Store flat or hang properly",
      "Handle embroidery with care",
    ],
    sku: "RBM-LEH-002",
    inStock: true,
    quantity: 18,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: "3",
    name: "Designer Anarkali",
    price: 199,
    priceINR: 11940,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80",
    ],
    category: "Anarkalis",
    description: "Elegant floor-length Anarkali suit with delicate embroidery. Features a flared silhouette with a matching churidar and dupatta. Ideal for festivals, family gatherings, and traditional ceremonies.",
    details: [
      "Floor-length flared Anarkali",
      "Delicate thread and sequin work",
      "Matching churidar included",
      "Chiffon dupatta with lace border",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Maroon", hex: "#7F1D1D" },
      { name: "Navy Blue", hex: "#1E3A8A" },
      { name: "Teal", hex: "#0D9488" },
    ],
    isSale: true,
    originalPrice: 249,
    fabric: "Art Silk with Chiffon Dupatta",
    careInstructions: [
      "Dry clean preferred",
      "Iron on medium heat",
      "Store in breathable cover",
    ],
    sku: "RBM-ANK-003",
    inStock: true,
    quantity: 35,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "Chanderi Suit Set",
    price: 179,
    priceINR: 10740,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    ],
    category: "Suits",
    description: "Graceful Chanderi cotton suit set with hand block prints. Lightweight and perfect for summer occasions. Features traditional Indian prints that celebrate the art of hand block printing from Rajasthan.",
    details: [
      "Pure Chanderi cotton fabric",
      "Hand block printed design",
      "Unstitched material with dupatta",
      "2.5m kurta, 2.5m bottom, 2.25m dupatta",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Mustard", hex: "#CA8A04" },
      { name: "Sage Green", hex: "#84CC16" },
      { name: "Dusty Pink", hex: "#F472B6" },
    ],
    isNew: true,
    fabric: "Pure Chanderi Cotton",
    careInstructions: [
      "Hand wash in cold water",
      "Dry in shade",
      "Iron on medium heat",
    ],
    sku: "RBM-SUT-004",
    inStock: true,
    quantity: 42,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "5",
    name: "Kanjivaram Silk Saree",
    price: 449,
    priceINR: 26940,
    image: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    ],
    category: "Sarees",
    description: "Premium Kanjivaram silk saree from Tamil Nadu with traditional temple border and rich pallu. Each saree is handwoven by master weavers and takes weeks to complete. A timeless piece for your collection.",
    details: [
      "Authentic Kanjivaram silk",
      "Traditional temple border design",
      "Contrast pallu with zari work",
      "Certificate of authenticity included",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Temple Red", hex: "#B91C1C" },
      { name: "Purple", hex: "#7C3AED" },
      { name: "Forest Green", hex: "#166534" },
    ],
    fabric: "Pure Kanjivaram Silk",
    careInstructions: [
      "Dry clean only",
      "Store in muslin with naphthalene",
      "Air out periodically",
      "Keep away from moisture",
    ],
    sku: "RBM-SAR-005",
    inStock: true,
    quantity: 8,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "6",
    name: "Bridal Lehenga Set",
    price: 899,
    priceINR: 53940,
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    ],
    category: "Lehengas",
    description: "Luxurious bridal lehenga featuring Kundan and Zardozi work. This showstopper piece is designed for the modern bride who wants to embrace tradition with contemporary elegance. Complete with matching accessories.",
    details: [
      "Premium velvet and silk blend",
      "Kundan and Zardozi embroidery",
      "Can-can layered for volume",
      "Matching jewelry set included",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Bridal Red", hex: "#DC2626" },
      { name: "Royal Maroon", hex: "#881337" },
    ],
    isNew: true,
    fabric: "Velvet with Silk Blend",
    careInstructions: [
      "Store in provided box",
      "Professional cleaning only",
      "Handle embellishments carefully",
    ],
    sku: "RBM-LEH-006",
    inStock: true,
    quantity: 3,
    rating: 5.0,
    reviews: 67,
  },
  {
    id: "7",
    name: "Georgette Anarkali",
    price: 159,
    priceINR: 9540,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    ],
    category: "Anarkalis",
    description: "Flowing georgette Anarkali with subtle embroidery. Lightweight and comfortable for all-day wear. Perfect for casual gatherings, office festivities, and daily ethnic wear needs.",
    details: [
      "Premium quality georgette",
      "Subtle thread embroidery",
      "Comfortable fit for all-day wear",
      "Easy care and maintenance",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Powder Blue", hex: "#93C5FD" },
      { name: "Peach", hex: "#FDBA74" },
      { name: "Lavender", hex: "#C4B5FD" },
    ],
    fabric: "Premium Georgette",
    careInstructions: [
      "Hand wash or gentle machine wash",
      "Dry in shade",
      "Iron on low heat",
    ],
    sku: "RBM-ANK-007",
    inStock: true,
    quantity: 50,
    rating: 4.5,
    reviews: 234,
  },
  {
    id: "8",
    name: "Cotton Suit Set",
    price: 129,
    priceINR: 7740,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80",
    ],
    category: "Suits",
    description: "Comfortable pure cotton suit set with elegant prints. Breathable fabric perfect for everyday wear. Ideal for office, casual outings, and daily traditional wear. Available in vibrant seasonal colors.",
    details: [
      "100% pure cotton fabric",
      "Digital printed design",
      "Pre-shrunk fabric",
      "Color-fast guarantee",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "White & Blue", hex: "#1E40AF" },
      { name: "Coral", hex: "#F87171" },
      { name: "Mint Green", hex: "#34D399" },
    ],
    isSale: true,
    originalPrice: 169,
    fabric: "100% Pure Cotton",
    careInstructions: [
      "Machine wash cold",
      "Tumble dry low",
      "Iron as needed",
    ],
    sku: "RBM-SUT-008",
    inStock: true,
    quantity: 65,
    rating: 4.4,
    reviews: 312,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find((product) => product.id === id);
};

export const getRelatedProducts = (id: string, category: string): Product[] => {
  return allProducts
    .filter((product) => product.id !== id && product.category === category)
    .slice(0, 4);
};
