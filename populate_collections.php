<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/backend/config/config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    echo "<h1>Populating Sample Collections</h1>";

    // 1. Insert Collections
    $collections = [
        [
            'name' => 'Bridal Collection',
            'slug' => 'bridal-collection',
            'description' => 'Exquisite bridal wear for your special day. Featuring heavy silk sarees and ornate lehengas.',
            'image_url' => 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800',
            'display_order' => 1,
            'status' => 'active'
        ],
        [
            'name' => 'Festive Favorites',
            'slug' => 'festive-favorites',
            'description' => 'Stunning outfits for all your celebrations. Vibrant colors and modern designs.',
            'image_url' => 'https://images.unsplash.com/photo-1621285853634-713b8dd6b5ee?q=80&w=800',
            'display_order' => 2,
            'status' => 'active'
        ],
        [
            'name' => 'Summer Collection',
            'slug' => 'summer-collection',
            'description' => 'Light, breathable fabrics in pastel shades. Perfect for the Indian summer.',
            'image_url' => 'https://images.unsplash.com/photo-1549474843-ed8348303de8?q=80&w=800',
            'display_order' => 3,
            'status' => 'active'
        ],
        [
            'name' => 'Best Sellers',
            'slug' => 'best-sellers',
            'description' => 'Our most loved pieces, chosen by you. Handpicked top-rated products.',
            'image_url' => 'https://images.unsplash.com/photo-1610030469668-93530c1761cf?q=80&w=800',
            'display_order' => 4,
            'status' => 'active'
        ]
    ];

    foreach ($collections as $col) {
        $check = $pdo->prepare("SELECT id FROM collections WHERE slug = ?");
        $check->execute([$col['slug']]);
        if (!$check->fetch()) {
            $sql = "INSERT INTO collections (name, slug, description, image_url, display_order, status) 
                    VALUES (:name, :slug, :description, :image_url, :display_order, :status)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($col);
            echo "✅ Created collection: {$col['name']}<br>";
        } else {
            echo "ℹ️ Collection already exists: {$col['name']}<br>";
        }
    }

    // 2. Link some products to collections
    $products = $pdo->query("SELECT id FROM products LIMIT 5")->fetchAll(PDO::FETCH_COLUMN);
    $collectionIds = $pdo->query("SELECT id FROM collections")->fetchAll(PDO::FETCH_COLUMN);

    if (!empty($products) && !empty($collectionIds)) {
        echo "<h3>Linking products to collections...</h3>";
        foreach ($collectionIds as $colId) {
            foreach ($products as $prodId) {
                $sql = "INSERT IGNORE INTO collection_products (collection_id, product_id, display_order) VALUES (?, ?, 0)";
                $pdo->prepare($sql)->execute([$colId, $prodId]);
            }
            echo "✅ Linked some products to collection ID: $colId<br>";
        }
    }

    echo "<h2>🎉 Population Complete!</h2>";

} catch (PDOException $e) {
    echo "<h2>❌ Population Failed</h2>";
    echo "Error: " . $e->getMessage();
}
?>
