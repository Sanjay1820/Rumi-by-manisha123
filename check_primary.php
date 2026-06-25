<?php
require_once __DIR__ . '/backend/config/config.php';
require_once __DIR__ . '/backend/config/database.php';

try {
    $db = Database::getConn();
    echo "--- PRODUCT_IMAGES IS_PRIMARY STATUS ---\n";
    $stmt = $db->query("SELECT product_id, image_url, is_primary FROM product_images");
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        echo "Product ID: " . $row['product_id'] . " | URL: " . $row['image_url'] . " | Primary: " . $row['is_primary'] . "\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
