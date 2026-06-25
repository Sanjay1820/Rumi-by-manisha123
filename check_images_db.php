<?php
require_once __DIR__ . '/backend/config/config.php';
require_once __DIR__ . '/backend/config/database.php';

try {
    $db = Database::getConn();
    echo "--- LATEST PRODUCTS AND IMAGES ---\n";
    $stmt = $db->query("SELECT p.id, p.name, pi.image_url 
                        FROM products p 
                        LEFT JOIN product_images pi ON p.id = pi.product_id 
                        ORDER BY p.id DESC LIMIT 5");
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        echo "ID: " . $row['id'] . " | Name: " . $row['name'] . " | Image: " . ($row['image_url'] ?: "NONE") . "\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
