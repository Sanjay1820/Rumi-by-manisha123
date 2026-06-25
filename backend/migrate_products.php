<?php
require_once 'config/database.php';

$products = [
    [
        "id" => 1,
        "name" => "Silk Banarasi Saree",
        "slug" => "silk-banarasi-saree",
        "price" => 299,
        "category_id" => 1,
        "description" => "Exquisite handwoven Banarasi silk saree featuring intricate zari work and traditional motifs. Perfect for weddings and festive occasions.",
        "fabric" => "Pure Banarasi Silk with Zari",
        "sku" => "RBM-SAR-001",
        "stock_quantity" => 25,
        "images" => [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
        ]
    ],
    [
        "id" => 2,
        "name" => "Embroidered Lehenga",
        "slug" => "embroidered-lehenga",
        "price" => 549,
        "category_id" => 2,
        "description" => "Stunning bridal lehenga with intricate thread embroidery and mirror work. Features a heavily embellished choli and matching dupatta.",
        "fabric" => "Georgette with Net Dupatta",
        "sku" => "RBM-LEH-002",
        "stock_quantity" => 18,
        "images" => [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
            "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
        ]
    ],
    [
        "id" => 3,
        "name" => "Designer Anarkali",
        "slug" => "designer-anarkali",
        "price" => 199,
        "category_id" => 3,
        "description" => "Elegant floor-length Anarkali suit with delicate embroidery. Features a flared silhouette with a matching churidar and dupatta.",
        "fabric" => "Art Silk with Chiffon Dupatta",
        "sku" => "RBM-ANK-003",
        "stock_quantity" => 35,
        "images" => [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
            "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80"
        ]
    ],
    [
        "id" => 4,
        "name" => "Chanderi Suit Set",
        "slug" => "chanderi-suit-set",
        "price" => 179,
        "category_id" => 4,
        "description" => "Graceful Chanderi cotton suit set with hand block prints. Lightweight and perfect for summer occasions.",
        "fabric" => "Pure Chanderi Cotton",
        "sku" => "RBM-SUT-004",
        "stock_quantity" => 42,
        "images" => [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
        ]
    ],
    [
        "id" => 5,
        "name" => "Kanjivaram Silk Saree",
        "slug" => "kanjivaram-silk-saree",
        "price" => 449,
        "category_id" => 1,
        "description" => "Premium Kanjivaram silk saree from Tamil Nadu with traditional temple border and rich pallu.",
        "fabric" => "Pure Kanjivaram Silk",
        "sku" => "RBM-SAR-005",
        "stock_quantity" => 8,
        "images" => [
            "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"
        ]
    ],
    [
        "id" => 6,
        "name" => "Bridal Lehenga Set",
        "slug" => "bridal-lehenga-set",
        "price" => 899,
        "category_id" => 2,
        "description" => "Luxurious bridal lehenga featuring Kundan and Zardozi work. This showstopper piece is designed for the modern bride.",
        "fabric" => "Velvet with Silk Blend",
        "sku" => "RBM-LEH-006",
        "stock_quantity" => 3,
        "images" => [
            "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
        ]
    ],
    [
        "id" => 7,
        "name" => "Georgette Anarkali",
        "slug" => "georgette-anarkali",
        "price" => 159,
        "category_id" => 3,
        "description" => "Flowing georgette Anarkali with subtle embroidery. Lightweight and comfortable for all-day wear.",
        "fabric" => "Premium Georgette",
        "sku" => "RBM-ANK-007",
        "stock_quantity" => 50,
        "images" => [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
        ]
    ],
    [
        "id" => 8,
        "name" => "Cotton Suit Set",
        "slug" => "cotton-suit-set",
        "price" => 129,
        "category_id" => 4,
        "description" => "Comfortable pure cotton suit set with elegant prints. Breathable fabric perfect for everyday wear.",
        "fabric" => "100% Pure Cotton",
        "sku" => "RBM-SUT-008",
        "stock_quantity" => 65,
        "images" => [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80"
        ]
    ]
];

try {
    $db = Database::getInstance()->getConnection();
    $db->beginTransaction();

    foreach ($products as $p) {
        $stmt = $db->prepare("INSERT INTO products (id, name, slug, description, category_id, price, fabric, sku, stock_quantity, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')");
        $stmt->execute([$p['id'], $p['name'], $p['slug'], $p['description'], $p['category_id'], $p['price'], $p['fabric'], $p['sku'], $p['stock_quantity']]);
        
        foreach ($p['images'] as $idx => $url) {
            $stmtImg = $db->prepare("INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)");
            $stmtImg->execute([$p['id'], $url, $idx === 0 ? 1 : 0, $idx]);
        }
    }

    $db->commit();
    echo "<h1>Migration Successful</h1>";
} catch (Exception $e) {
    if ($db) $db->rollback();
    echo "Error: " . $e->getMessage();
}
