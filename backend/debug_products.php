<?php
require_once 'config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, name FROM products LIMIT 20");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h1>Products in DB</h1>";
    echo "<pre>";
    print_r($products);
    echo "</pre>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
