<?php
require_once __DIR__ . '/backend/config/config.php';
require_once __DIR__ . '/backend/config/database.php';

try {
    $db = Database::getConn();
    echo "Fixing broken image URLs...\n";
    
    // Replace chic-boutique-hub-main with Rumi-Final-main in product_images
    $stmt = $db->prepare("UPDATE product_images SET image_url = REPLACE(image_url, 'chic-boutique-hub-main', 'Rumi-Final-main')");
    $stmt->execute();
    echo "Updated " . $stmt->rowCount() . " rows in product_images.\n";
    
    // Also check products table in case any direct URLs are there (though schema didn't show it)
    $stmt = $db->prepare("UPDATE products SET description = REPLACE(description, 'chic-boutique-hub-main', 'Rumi-Final-main')");
    $stmt->execute();
    echo "Updated " . $stmt->rowCount() . " rows in products (description).\n";

    // Also check gallery table if it exists
    try {
        $stmt = $db->prepare("UPDATE gallery SET url = REPLACE(url, 'chic-boutique-hub-main', 'Rumi-Final-main')");
        $stmt->execute();
        echo "Updated " . $stmt->rowCount() . " rows in gallery table.\n";
    } catch (Exception $e) {
        // Gallery might not exist or be different
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
