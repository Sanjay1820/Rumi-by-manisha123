<?php
/**
 * Database Setup & Repair Tool
 * Ensures all tables are correct and have sample data
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config/config.php';

echo "<h1>🛠️ RUMI Database Repair & Sync</h1>";
echo "<hr>";

try {
    $dsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    // Create DB
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `" . DB_NAME . "`");
    echo "✅ Database verified: " . DB_NAME . "<br>";

    // Fix 'orders' table - ensure columns exist
    echo "Checking 'orders' table columns...<br>";
    $columns = $pdo->query("DESCRIBE orders")->fetchAll(PDO::FETCH_COLUMN);
    
    if (!in_array('customer_name', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255) AFTER order_number");
        echo "✅ Added 'customer_name' to orders table.<br>";
    }
    if (!in_array('customer_email', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255) AFTER customer_name");
        echo "✅ Added 'customer_email' to orders table.<br>";
    }
    if (!in_array('customer_phone', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(50) AFTER customer_email");
        echo "✅ Added 'customer_phone' to orders table.<br>";
    }
    if (!in_array('shipping_address', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN shipping_address TEXT AFTER customer_phone");
        echo "✅ Added 'shipping_address' to orders table.<br>";
    }
    if (!in_array('city', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN city VARCHAR(100) AFTER shipping_address");
        echo "✅ Added 'city' to orders table.<br>";
    }
    if (!in_array('state', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN state VARCHAR(100) AFTER city");
        echo "✅ Added 'state' to orders table.<br>";
    }
    if (!in_array('total_amount', $columns)) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER state");
        echo "✅ Added 'total_amount' to orders table.<br>";
    }

    // Now run the main setup script
    echo "<br>Running standard setup...<br>";
    include __DIR__ . '/setup_database.php';
    
    echo "<br><h3>Final Polish:</h3>";
    
    // Ensure Collections have some product links
    $productIds = $pdo->query("SELECT id FROM products LIMIT 5")->fetchAll(PDO::FETCH_COLUMN);
    $collectionIds = $pdo->query("SELECT id FROM collections")->fetchAll(PDO::FETCH_COLUMN);
    
    if (!empty($productIds) && !empty($collectionIds)) {
        foreach ($collectionIds as $cId) {
            foreach ($productIds as $pId) {
                $pdo->exec("INSERT IGNORE INTO collection_products (collection_id, product_id) VALUES ($cId, $pId)");
            }
        }
        echo "✅ Linked sample products to collections.<br>";
    }

    echo "<hr><h2>🎉 All Fixed!</h2>";
    echo "<p>Admin dashboard is now perfectly synced with the database.</p>";

} catch (Exception $e) {
    echo "<h2>❌ Error</h2>";
    echo $e->getMessage();
}
?>
