<?php
require_once __DIR__ . '/backend/config/config.php';
require_once __DIR__ . '/backend/config/database.php';

try {
    $db = Database::getConn();
    echo "--- ALL PRODUCTS AND THEIR IMAGES ---\n";
    $sql = "SELECT p.id, p.name, 
            (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as subquery_image,
            (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count
            FROM products p";
    $stmt = $db->query($sql);
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        echo "ID: {$row['id']} | Name: {$row['name']} | Subq Img: " . ($row['subquery_image'] ?: "NULL") . " | Count: {$row['image_count']}\n";
    }
    
    echo "\n--- DIRECTORY CHECK ---\n";
    $dir = __DIR__ . '/uploads/gallery/';
    if (is_dir($dir)) {
        echo "Upload directory exists.\n";
        $files = array_diff(scandir($dir), array('..', '.'));
        echo "Files in uploads/gallery/ (" . count($files) . "):\n";
        foreach ($files as $file) {
            echo "- $file\n";
        }
    } else {
        echo "Upload directory NOT found at $dir\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
