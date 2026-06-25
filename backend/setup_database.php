<?php
/**
 * Database Setup Script
 * Creates the database and tables if they don't exist
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config/config.php';

echo "<h1>🚀 Database Setup & Repair</h1>";
echo "<hr>";

try {
    // 1. Connect to MySQL Server (without selecting DB)
    echo "Connecting to MySQL server... ";
    $dsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "<span style='color:green'>Success!</span><br>";

    // 2. Create Database if not exists
    echo "Checking database '<strong>" . DB_NAME . "</strong>'... ";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<span style='color:green'>Database created/verified!</span><br>";
    
    // 3. Select Database
    $pdo->exec("USE `" . DB_NAME . "`");
    
    // 4. Create Tables
    echo "<h3>Creating Tables...</h3>";
    
    // Categories Table
    $sql = "CREATE TABLE IF NOT EXISTS `categories` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `slug` varchar(255) NOT NULL,
        `description` text DEFAULT NULL,
        `image_url` varchar(255) DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        UNIQUE KEY `slug` (`slug`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql);
    echo "✅ Table 'categories' checked.<br>";
    
    // Products Table
    $sql = "CREATE TABLE IF NOT EXISTS `products` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `category_id` int(11) DEFAULT NULL,
        `name` varchar(255) NOT NULL,
        `slug` varchar(255) NOT NULL,
        `description` text DEFAULT NULL,
        `price` decimal(10,2) NOT NULL,
        `compare_price` decimal(10,2) DEFAULT NULL,
        `sku` varchar(50) DEFAULT NULL,
        `stock_quantity` int(11) NOT NULL DEFAULT 0,
        `primary_image` varchar(255) DEFAULT NULL,
        `featured` tinyint(1) NOT NULL DEFAULT 0,
        `new_arrival` tinyint(1) NOT NULL DEFAULT 0,
        `status` enum('active','draft','archived') NOT NULL DEFAULT 'active',
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        UNIQUE KEY `slug` (`slug`),
        KEY `category_id` (`category_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql);
    echo "✅ Table 'products' checked.<br>";

    // Orders Table
    $sql = "CREATE TABLE IF NOT EXISTS `orders` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `order_number` varchar(50) NOT NULL,
        `customer_name` varchar(255) NOT NULL,
        `customer_email` varchar(255) NOT NULL,
        `customer_phone` varchar(50) DEFAULT NULL,
        `shipping_address` text NOT NULL,
        `city` varchar(100) DEFAULT NULL,
        `state` varchar(100) DEFAULT NULL,
        `zip_code` varchar(20) DEFAULT NULL,
        `total_amount` decimal(10,2) NOT NULL,
        `status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
        `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        UNIQUE KEY `order_number` (`order_number`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql);
    echo "✅ Table 'orders' checked.<br>";

    // Order Items Table
    $sql = "CREATE TABLE IF NOT EXISTS `order_items` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `order_id` int(11) NOT NULL,
        `product_id` int(11) DEFAULT NULL,
        `product_name` varchar(255) NOT NULL,
        `quantity` int(11) NOT NULL,
        `price` decimal(10,2) NOT NULL,
        `total` decimal(10,2) NOT NULL,
        PRIMARY KEY (`id`),
        KEY `order_id` (`order_id`),
        KEY `product_id` (`product_id`),
        CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql);
    echo "✅ Table 'order_items' checked.<br>";

    
    // Insert Default Data if empty
    $count = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($count == 0) {
        echo "📥 Inserting default categories...<br>";
        $pdo->exec("INSERT INTO categories (name, slug) VALUES 
            ('Sarees', 'sarees'),
            ('Lehengas', 'lehengas'),
            ('Suit Sets', 'suit-sets'),
            ('Kurtas', 'kurtas')");
    }
    
    $count = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    if ($count == 0) {
        echo "📥 Inserting sample products...<br>";
        $pdo->exec("INSERT INTO products (name, slug, price, stock_quantity, category_id, featured, status) VALUES 
            ('Banarasi Silk Saree', 'banarasi-silk-saree', 15000.00, 10, 1, 1, 'active'),
            ('Red Bridal Lehenga', 'red-bridal-lehenga', 45000.00, 5, 2, 1, 'active'),
            ('Cotton Kurta Set', 'cotton-kurta-set', 2500.00, 25, 4, 0, 'active')");
    }

    $count = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    if ($count == 0) {
        echo "📥 Inserting sample orders...<br>";
        
        // Order 1
        $pdo->exec("INSERT INTO orders (order_number, total, status, payment_status, created_at) VALUES 
            ('#ORD-001', 12500.00, 'delivered', 'paid', '2024-03-15 10:00:00')");
        $orderId = $pdo->lastInsertId();
        $pdo->exec("INSERT INTO order_items (order_id, product_name, quantity, price, total) VALUES ($orderId, 'Banarasi Silk Saree', 1, 12500.00, 12500.00)");
        
        // Order 2
        $pdo->exec("INSERT INTO orders (order_number, total, status, payment_status, created_at) VALUES 
            ('#ORD-002', 8900.00, 'processing', 'paid', '2024-03-16 11:30:00')");
        $orderId = $pdo->lastInsertId();
        $pdo->exec("INSERT INTO order_items (order_id, product_name, quantity, price, total) VALUES ($orderId, 'Designer Lehenga', 1, 8900.00, 8900.00)");

        // Order 3
        $pdo->exec("INSERT INTO orders (order_number, total, status, payment_status, created_at) VALUES 
            ('#ORD-003', 4500.00, 'pending', 'pending', '2024-03-17 14:15:00')");
        $orderId = $pdo->lastInsertId();
        $pdo->exec("INSERT INTO order_items (order_id, product_name, quantity, price, total) VALUES ($orderId, 'Cotton Kurta', 2, 2250.00, 4500.00)");
    }

    echo "<hr>";
    echo "<h2>🎉 Database Setup Complete!</h2>";
    echo "<p>Your database is ready. Go back to the Admin Panel and refresh.</p>";

} catch (PDOException $e) {
    echo "<h2>❌ Setup Failed</h2>";
    echo "Error: " . $e->getMessage() . "<br>";
    echo "<p>Please check your config.php settings.</p>";
}
?>
